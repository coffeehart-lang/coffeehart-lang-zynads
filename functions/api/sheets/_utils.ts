const DEFAULT_CREDENTIALS = {
  client_email: "zyncast@zyncast-app.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5+9UkCdU0QQ7A\nXcfRY3bVSeN/xl8fSGh912tfYJhQx51i505hsSr6bgKNr5wWz/dWNu//eyCVGbSP\ndqpPUym0Nx2K4ICmA69Edy2N+cMmbxLw1diJIIkIOxE3PPYgiq5AGavlMjhpJS1L\nfcM28Mc3vCcd/nfQDK5c5O+4G5Pq5ODokgxGA8dnp1+mgb8ZWZBaKOhBt2OqTkOc\n7ndosw3bZ3Q2EmFWW8rxyOQKuM3FWo3TQNEqb/UXEiZrlQaoDZefJatW9bse5Vs3\n1oeOuzTT15cVv86u/4ciHnxTB9+mrIU8w+VcmEEzeIjZfA30H50W1T/hG5eROvQN\nsBcFxzjvAgMBAAECggEAIVckZ+/9UP9CqjiFnCNFB8pVpq/EmKKN3NVT0cbKt1x5\neeP2WKv+hONYwNaU2EAS2llB395OQnxXsoo20L6bUMu6l41Ucq5hapgkyflWwxqR\nXiwvw7FZ72hLV0gt5TqHL0WK260LkMnR22EhsEUsqXCo4IcgKmNDlLKTyMDk3Ow5\nJE3bAqZgUuzFIDxS5wExuZ59/4OMCTtXYlAmjsLZQ/tGpcIRyxA/oM/o5/UsfRxb\nleSLuPdc9WTHukKFo7bAMkvEvUqK1yzS8J9Tr/5q2FVEYIL3ui7APbfh9A6J7Hi7\nuUz/tb2E6p52BU6gp/EQI5SsLVnW6OEHGqaJ7FbjoQKBgQD1GRs6urxdsnF6Ee6b\nY3hofyfOnEcxXjGZundajC33QbznNoc8AoaV1qW0zLIwnMpMGlEf0WTFq2jgrbbs\ckN09gipkpQRo8W+o4Jv8xS7ePZeyw543vnhRLrDZZx7930cI/2KCQDLujMs5yq6\niV8aU8N4LuKi3y9xrBovvAQDTwKBgQDCQZms+vSLyrGFduij+GFq6E1oAMUnl6OK\nkarKY1vI485LY0LE51x5xqKK3H3ytfOMr3zKn71R/Bzozm728BXx3yoJXBEJPksG\nlsjyAJnk0WHf3J+zrkJHwSAMu68XZbHoHCtSD4D1D+hxiNyWLhsJIIJXd1hyl+uL\nMP2fUYCIYQKBgAMyk6ddfk2eoVpdV4aRcqWyWvuYEFm1h+Igi6QTxhm+ss81Z+hB\nhC36Qeks7nox4XXCtiI7IhxuEw0zVvqYtwaUmyJTNjlQsKi/C1mYi0Gy30v3TDYJ\neqsUsXcRIUyAuxId6hXd7jO6Nyaz0VvjpOj8BMXRnsVPMhhCjYjn5AmDAoGAZ3Lx\n+PnIQ63U7gOODsxWbM17c3h9hgEuObwrXQ6esZQHp4Qb6apgSAWtSA/2DswxAGnw\nJiP9eWyupJhS5bSjqyQySbu64tZGtCKWrrH9Qqry2XmvnsudRoMlo0JME0S4AqkF\ntPTGszseiV/eQSgag7jJUPUgqB4ZdQ3I8xA/R+ECgYBf6dCrrwCfNGwhp15dSxFb\nlbWcLHPft5Ss6WaNmyIQKqhPAjXAHJOaCnJLOXow4fsxaWh/V0wHZW5WQL7ZseTW\nz1m7QmFCQKwzvMkZxsCmUsnQp7IJ9mbPgH+oWDzT3M1RQrJKsyMFwuaFXSm8toBr\nYMLL93KsdGSpSGw+FX384w==\n-----END PRIVATE KEY-----\n"
};

export function getCredentials(env: { GOOGLE_SERVICE_ACCOUNT_KEY?: string }) {
  if (env && env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY from Cloudflare env", e);
    }
  }
  return DEFAULT_CREDENTIALS;
}

function pemToBinary(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const binaryKey = pemToBinary(pem);
  return await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );
}

function base64url(arr: ArrayBuffer | Uint8Array): string {
  const binary = String.fromCharCode(...new Uint8Array(arr));
  const base64 = btoa(binary);
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64urlEncodeString(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return base64url(bytes);
}

export async function createSignedJWT(clientEmail: string, privateKeyPem: string, scope: string): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600; // 1 hour expiration

  const payload = {
    iss: clientEmail,
    scope: scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: exp,
    iat: iat
  };

  const encodedHeader = base64urlEncodeString(JSON.stringify(header));
  const encodedPayload = base64urlEncodeString(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;

  const privateKey = await importPrivateKey(privateKeyPem);
  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(message)
  );

  const encodedSignature = base64url(signatureBuffer);
  return `${message}.${encodedSignature}`;
}

export async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const jwt = await createSignedJWT(clientEmail, privateKeyPem, "https://www.googleapis.com/auth/spreadsheets");
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to obtain Google access token: ${response.statusText} - ${errText}`);
  }

  const data: any = await response.json();
  return data.access_token;
}

// Parse Sheet Rows into Transaction items
export function parseSheetRows(rows: any[][]): any[] {
  if (!rows || rows.length === 0) return [];
  
  // Find column indices based on header row (case insensitive)
  const header = rows[0].map(h => String(h).trim().toLowerCase());
  
  const idIndex = header.indexOf("id");
  const dateIndex = header.indexOf("date");
  const descIndex = header.indexOf("description") !== -1 ? header.indexOf("description") : header.indexOf("desc");
  const catIndex = header.indexOf("category") !== -1 ? header.indexOf("category") : header.indexOf("cat");
  const typeIndex = header.indexOf("type");
  const amountIndex = header.indexOf("amount") !== -1 ? header.indexOf("amount") : header.indexOf("val");

  // Fallbacks if headers aren't standard or missing
  const getVal = (row: any[], index: number, defaultIdx: number) => {
    const idx = index !== -1 ? index : defaultIdx;
    return row[idx] !== undefined ? String(row[idx]).trim() : "";
  };

  const parsed: any[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const id = getVal(row, idIndex, 0) || `t-sheet-${i}-${Date.now()}`;
    const date = getVal(row, dateIndex, 1) || new Date().toISOString().split("T")[0];
    const description = getVal(row, descIndex, 2) || "Unnamed Transaction";
    const category = getVal(row, catIndex, 3) || "Other";
    const typeStr = getVal(row, typeIndex, 4).toLowerCase();
    const type = typeStr === "income" || typeStr === "deposit" || typeStr === "inflow" ? "income" : "expense";
    
    const amtStr = getVal(row, amountIndex, 5).replace(/[^0-9.-]/g, "");
    const amount = parseFloat(amtStr) || 0;

    parsed.push({
      id,
      date,
      description,
      category,
      type,
      amount
    });
  }

  return parsed;
}

// Initialize Sheet with default headers and data if empty
export async function initializeSheet(accessToken: string, spreadsheetId: string, range: string) {
  const headers = ["ID", "Date", "Description", "Category", "Type", "Amount"];
  const initialRows = [
    headers,
    ["t-1", "2026-07-01", "Client Payment - Acme Corp", "Service Revenue", "income", "8500"],
    ["t-2", "2026-07-03", "Office Rent - Monthly", "Rent & Utilities", "expense", "2200"],
    ["t-3", "2026-07-05", "SaaS Subscriptions", "Software & Tools", "expense", "150"],
    ["t-4", "2026-07-08", "Consulting Retainer", "Consulting", "income", "3200"],
  ];

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const response = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: initialRows
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to initialize spreadsheet: ${response.statusText} - ${errText}`);
  }
}
