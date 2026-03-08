/**
 * Google Drive API utilities for fetching files from shared links.
 * Uses a Google API key for publicly shared files/folders.
 */

const DRIVE_API = "https://www.googleapis.com/drive/v3";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
}

/**
 * Extract file or folder ID from a Google Drive URL.
 * Supports formats:
 * - https://drive.google.com/file/d/{ID}/...
 * - https://drive.google.com/drive/folders/{ID}...
 * - https://docs.google.com/document/d/{ID}/...
 * - https://docs.google.com/spreadsheets/d/{ID}/...
 * - https://drive.google.com/open?id={ID}
 */
export function extractDriveId(url: string): {
  id: string;
  type: "file" | "folder";
} | null {
  try {
    const u = new URL(url);

    // Folder URL
    const folderMatch = u.pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) return { id: folderMatch[1], type: "folder" };

    // File URL (/file/d/ID or /document/d/ID or /spreadsheets/d/ID)
    const fileMatch = u.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return { id: fileMatch[1], type: "file" };

    // ?id= parameter
    const idParam = u.searchParams.get("id");
    if (idParam) return { id: idParam, type: "file" };

    return null;
  } catch {
    return null;
  }
}

/**
 * List files in a Google Drive folder.
 */
export async function listFolderFiles(
  folderId: string,
  apiKey: string
): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    key: apiKey,
    fields: "files(id,name,mimeType,size)",
    pageSize: "100",
  });

  const res = await fetch(`${DRIVE_API}/files?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive API list failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Get metadata for a single file.
 */
export async function getFileMetadata(
  fileId: string,
  apiKey: string
): Promise<DriveFile> {
  const params = new URLSearchParams({
    key: apiKey,
    fields: "id,name,mimeType,size",
  });

  const res = await fetch(`${DRIVE_API}/files/${fileId}?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive API metadata failed (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Download file content from Google Drive.
 * For Google Docs/Sheets/Slides, exports as plain text.
 * For binary files (PDF, DOCX, etc.), downloads raw bytes.
 */
export async function downloadFileContent(
  fileId: string,
  mimeType: string,
  apiKey: string
): Promise<{ buffer: Buffer; exportedMimeType: string }> {
  // Google Workspace documents need to be exported
  const googleDocTypes: Record<string, string> = {
    "application/vnd.google-apps.document": "text/plain",
    "application/vnd.google-apps.spreadsheet": "text/csv",
    "application/vnd.google-apps.presentation": "text/plain",
  };

  if (googleDocTypes[mimeType]) {
    // Export Google Docs as text
    const exportMime = googleDocTypes[mimeType];
    const params = new URLSearchParams({
      key: apiKey,
      mimeType: exportMime,
    });

    const res = await fetch(
      `${DRIVE_API}/files/${fileId}/export?${params}`
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Drive export failed (${res.status}): ${text}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      exportedMimeType: exportMime,
    };
  }

  // Regular files — download directly
  const params = new URLSearchParams({
    key: apiKey,
    alt: "media",
  });

  const res = await fetch(`${DRIVE_API}/files/${fileId}?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive download failed (${res.status}): ${text}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    exportedMimeType: mimeType,
  };
}

/**
 * Supported file types for ingestion.
 */
const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Google Workspace types (will be exported)
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.spreadsheet",
  "application/vnd.google-apps.presentation",
]);

export function isSupportedFileType(mimeType: string): boolean {
  return SUPPORTED_MIME_TYPES.has(mimeType);
}
