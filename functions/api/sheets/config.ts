import { getCredentials } from "./_utils";

export async function onRequestGet(context: {
  request: Request;
  env: { GOOGLE_SERVICE_ACCOUNT_KEY?: string };
}) {
  try {
    const creds = getCredentials(context.env);
    return new Response(
      JSON.stringify({
        configured: true,
        serviceEmail: creds.client_email,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        configured: false,
        serviceEmail: "zyncast@zyncast-app.iam.gserviceaccount.com",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
