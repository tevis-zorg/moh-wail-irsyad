import "server-only";

import { google } from "googleapis";

const DRIVE_READ_ONLY_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

let driveClient: ReturnType<typeof google.drive> | undefined;

export function getDriveClient() {
  if (driveClient) {
    return driveClient;
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google Drive credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY.",
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [DRIVE_READ_ONLY_SCOPE],
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}
