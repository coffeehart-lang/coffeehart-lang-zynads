export async function onRequestPost(context: {
  request: Request;
  env: { GEMINI_API_KEY?: string };
}) {
  try {
    const key = context.env.GEMINI_API_KEY;
    if (!key) {
      return new Response(
        JSON.stringify({
          error: "Missing GEMINI_API_KEY",
          message: "A GEMINI_API_KEY environment variable is required on your Cloudflare Pages dashboard (under Settings -> Environment Variables) to run custom AI analysis.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the incoming body safely
    let body: any;
    try {
      body = await context.request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          message: "The request body must be a valid JSON payload.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { transactions, customPrompt } = body;
    if (!transactions || !Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          message: "Request must include an array of transactions in the body.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Build the expert prompt matching your server-side logic
    let prompt = `You are an elite, highly experienced Fractional CFO and business advisor.
Analyze the following financial transactions for Zyncast, a small business, and write a professional, highly strategic response.

Current Transactions Data:
${JSON.stringify(transactions, null, 2)}
`;

    if (customPrompt) {
      prompt += `
The business owner has asked the following specific CFO query:
"${customPrompt}"

Please address this query directly, providing computed figures, logical estimates, and clear actionable steps based on the transactions data. Use markdown formatting for headings and lists. Keep the tone expert, supportive, objective, and extremely precise.`;
    } else {
      prompt += `
Structure your response with:
1. **Executive Summary**: A concise, polished paragraph outlining the financial health, key strengths, and overall trajectory.
2. **Key Strategic Recommendations**: 3 clear bullet points focusing on cost reduction, growth scaling, tax planning, or capital allocation. Include specific figures or percentages based on the data.
3. **Cash Runway & Capital Health**: A quick sentence about their runway and safety margin.

Keep the tone expert, supportive, objective, and extremely precise. Use markdown for headings and bullet points. Do not mention system-internal terms or file names.`;
    }

    // Call the Gemini API via direct REST fetch (zero external packages required)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;
    const apiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!apiResponse.ok) {
      const errorData: any = await apiResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: "Gemini API call failed",
          message: errorData.error?.message || `Google Gemini API returned status code ${apiResponse.status}`,
        }),
        {
          status: apiResponse.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resData: any = await apiResponse.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return new Response(
        JSON.stringify({
          error: "Empty response",
          message: "The Gemini API did not return any text output.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ text: responseText }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: err.message || "An unexpected error occurred in the Cloudflare Page Function.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
