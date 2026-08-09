import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, AlertCircle, Loader2, Volume2 } from 'lucide-react';

interface VoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  className = '',
  variant = 'dark',
  size = 'md',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const shouldListenRef = useRef(false);
  const hasReceivedSpeechRef = useRef(false);

  // Keep callback reference fresh
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Clean up audio & recognition resources on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
    setMicVolume(0);
  };

  const startMicVolumeMonitor = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!shouldListenRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.warn('Volume meter init error:', e);
    }
  };

  const processRecordedAudio = async (audioBlob: Blob) => {
    if (audioBlob.size < 1000) return; // ignore tiny empty clips
    try {
      setIsTranscribing(true);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        if (!base64Audio) {
          setIsTranscribing(false);
          return;
        }

        try {
          const res = await fetch('/api/zynads/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: audioBlob.type || 'audio/webm',
            }),
          });
          const data = await res.json();
          if (data.success && data.transcript) {
            onTranscriptRef.current(data.transcript);
            setInterimText('');
            setErrorMessage(null);
          }
        } catch (fetchErr) {
          console.warn('Server audio transcription error:', fetchErr);
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err) {
      console.error('Audio blob processing error:', err);
      setIsTranscribing(false);
    }
  };

  const toggleListening = async () => {
    setErrorMessage(null);

    // If currently listening, stop!
    if (isListening) {
      shouldListenRef.current = false;
      setIsListening(false);
      
      // Stop media recorder & send recorded audio for final server verification if needed
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {}
      }

      cleanupAudio();
      return;
    }

    // Otherwise, START listening!
    shouldListenRef.current = true;
    hasReceivedSpeechRef.current = false;
    audioChunksRef.current = [];

    // Step 1: Request Microphone Access via MediaDevices getUserMedia
    let stream: MediaStream | null = null;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone audio API not supported in this browser environment.');
      }
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
    } catch (err: any) {
      console.error('Microphone getUserMedia error:', err);
      shouldListenRef.current = false;
      setIsListening(false);
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone blocked by browser. Please grant mic permission or open in new tab.'
          : 'No working microphone detected. Check your mic hardware settings.'
      );
      return;
    }

    // Start Audio Volume Monitor
    startMicVolumeMonitor(stream);
    setIsListening(true);

    // Step 2: Initialize MediaRecorder (Fallback Engine)
    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (!hasReceivedSpeechRef.current && completeBlob.size > 2000) {
          processRecordedAudio(completeBlob);
        }
      };

      mediaRecorder.start(500); // collect 500ms chunks
    } catch (recErr) {
      console.warn('MediaRecorder init error:', recErr);
    }

    // Step 3: Initialize Web Speech API (Real-Time Live Dictation Engine)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim()) {
            hasReceivedSpeechRef.current = true;
            onTranscriptRef.current(finalTranscript.trim());
            setInterimText('');
            setErrorMessage(null);
          } else if (currentInterim.trim()) {
            hasReceivedSpeechRef.current = true;
            setInterimText(currentInterim.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition event error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setErrorMessage('WebSpeech API limited. Audio recorder active as fallback.');
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.log('Speech error noticed:', event.error);
          }
        };

        recognition.onend = () => {
          if (shouldListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (speechErr) {
        console.warn('Web Speech API start error:', speechErr);
      }
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-2.5 py-1.5 text-xs',
    lg: 'px-3 py-2 text-sm',
  }[size];

  const variantClasses = {
    dark: isListening
      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg ring-2 ring-rose-400'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600',
    light: isListening
      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg ring-2 ring-rose-400'
      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
  }[variant];

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        type="button"
        onClick={toggleListening}
        disabled={isTranscribing}
        title={
          isListening
            ? 'Click to stop voice typing'
            : 'Click to speak & type into box (Microphone Active)'
        }
        className={`rounded-xl font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
      >
        {isTranscribing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="font-bold text-[11px]">Transcribing Voice...</span>
          </>
        ) : isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="font-bold text-[11px]">Listening... (Speak Now)</span>

            {/* Live Mic Volume Soundwave Visualizer */}
            <div className="flex items-center gap-0.5 ml-1 h-3.5 px-1 bg-black/20 rounded-md">
              <span
                className="w-1 bg-amber-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(20, Math.min(100, micVolume * 1.2))}%` }}
              />
              <span
                className="w-1 bg-amber-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(30, Math.min(100, micVolume * 1.5))}%` }}
              />
              <span
                className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(25, Math.min(100, micVolume * 1.3))}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Mic className={`w-3.5 h-3.5 ${variant === 'dark' ? 'text-amber-400' : 'text-indigo-600'}`} />
            <span className="font-bold text-[11px]">Voice Typing</span>
          </>
        )}
      </button>

      {/* Live Speech Interim Preview Floating Tooltip */}
      {isListening && interimText && (
        <div className="absolute left-0 top-full mt-1.5 z-40 bg-slate-900/95 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs shadow-xl backdrop-blur-md max-w-xs font-mono animate-fadeIn flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
          <span className="truncate">"{interimText}"</span>
        </div>
      )}

      {/* Diagnostic / Permission Error Notice */}
      {errorMessage && (
        <div className="absolute left-0 top-full mt-1.5 z-40 bg-rose-950/95 text-rose-200 border border-rose-500/50 px-3 py-1.5 rounded-lg text-[11px] shadow-xl max-w-xs font-sans animate-fadeIn flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
