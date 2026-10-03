/**
 * ZynAds File Upload & Video Generator Backend Preparation Service
 */

export interface PreparedUploadAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  size: string;
  mimeType: string;
  status: 'ready_for_video_generator';
  processedAt: string;
  dimensions?: { width: number; height: number };
  duration?: string;
  tag?: string;
}

/**
 * Reads a local file, sends it to the ZynAds backend upload processing endpoint,
 * and prepares it for the video generator engine.
 */
export async function uploadMediaFileService(
  file: File,
  tagSymbol?: string
): Promise<PreparedUploadAsset> {
  const fileType: 'image' | 'video' | 'audio' = file.type.startsWith('video/')
    ? 'video'
    : file.type.startsWith('audio/')
    ? 'audio'
    : 'image';

  const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  // Read file locally to base64 DataURL
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  try {
    const response = await fetch('/api/zynads/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || (fileType === 'video' ? 'video/mp4' : fileType === 'audio' ? 'audio/mpeg' : 'image/jpeg'),
        size: sizeFormatted,
        sizeBytes: file.size,
        mediaType: fileType,
        base64Data: base64Data.length < 15000000 ? base64Data : undefined, // Include inline data if manageable size
        tagSymbol
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.asset) {
        return {
          ...data.asset,
          url: base64Data // Ensure responsive instant preview on client canvas
        };
      }
    }
  } catch (err) {
    console.warn('Backend upload service endpoint call failed, using client fallback preparation:', err);
  }

  // Graceful fallback preparation if server is offline or response failed
  const fallbackAssetId = `zyn_asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: fallbackAssetId,
    name: file.name,
    type: fileType,
    url: base64Data,
    size: sizeFormatted,
    mimeType: file.type || 'application/octet-stream',
    status: 'ready_for_video_generator',
    processedAt: new Date().toISOString(),
    tag: tagSymbol
  };
}
