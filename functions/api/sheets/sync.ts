import { getCredentials, getAccessToken } from "./_utils";

export async function onRequestPost(context: {
  request: Request;
  env: { GOOGLE_SERVICE_ACCOUNT_KEY?: string };
}) {
  try {
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

    const { spreadsheetId, range = "Sheet1!A1:F200", transactions } = body;

    if (!spreadsheetId) {
      return new Response(
        JSON.stringify({ error: "Missing spreadsheetId in body" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!transactions || !Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({ error: "Missing transactions array in body" }),
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

    // 1. Clear existing values to avoid leaving older orphaned rows
    const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
    try {
      await fetch(clearUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (clearErr) {
      console.warn("Failed to clear sheet before write:", clearErr);
    }

    // 2. Convert transactions back into rows
    const headers = ["ID", "Date", "Description", "Category", "Type", "Amount"];
    const rows = [
      headers,
      ...transactions.map((t: any) => [
        t.id,
        t.date,
        t.description,
        t.category,
        t.type,
        String(t.amount),
      ]),
    ];

    // 3. Write new rows
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({
          error: "sheets_sync_failed",
          message: `Google Sheets API update failed: ${response.status} - ${errText}`,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, count: transactions.length }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "sheets_sync_failed",
        message: err.message || "An error occurred while syncing data back to Google Sheets.",
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
