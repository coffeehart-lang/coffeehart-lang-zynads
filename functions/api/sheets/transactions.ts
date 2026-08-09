import { getCredentials, getAccessToken, parseSheetRows, initializeSheet } from "./_utils";

export async function onRequestGet(context: {
  request: Request;
  env: { GOOGLE_SERVICE_ACCOUNT_KEY?: string };
}) {
  try {
    const url = new URL(context.request.url);
    const spreadsheetId = url.searchParams.get("spreadsheetId");
    const range = url.searchParams.get("range") || "Sheet1!A1:F100";

    if (!spreadsheetId) {
      return new Response(
        JSON.stringify({ error: "Missing spreadsheetId query parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const creds = getCredentials(context.env);
    const token = await getAccessToken(creds.client_email, creds.private_key);

    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
    const response = await fetch(sheetsUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return new Response(
          JSON.stringify({
            error: "permission_denied",
            message: `Permission Denied: Please share your Google Sheet with "${creds.client_email}" as an 'Editor' so the Zyncast CFO service can read it.`,
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      const errText = await response.text();
      return new Response(
        JSON.stringify({
          error: "sheets_fetch_failed",
          message: `Google Sheets API returned error: ${response.status} - ${errText}`,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data: any = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      // Sheet is empty, initialize with template headers and data
      try {
        await initializeSheet(token, spreadsheetId, range);
        
        // Fetch fresh
        const freshResponse = await fetch(sheetsUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const freshData: any = await freshResponse.json();
        const parsed = parseSheetRows(freshData.values || []);
        return new Response(
          JSON.stringify({ transactions: parsed, initialized: true }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (initErr: any) {
        return new Response(
          JSON.stringify({
            error: "initialization_failed",
            message: `Spreadsheet was empty but we failed to initialize it: ${initErr.message || initErr}`,
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

    const parsedTransactions = parseSheetRows(rows);
    return new Response(
      JSON.stringify({ transactions: parsedTransactions }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "sheets_fetch_failed",
        message: err.message || "An error occurred while fetching data from Google Sheets.",
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
