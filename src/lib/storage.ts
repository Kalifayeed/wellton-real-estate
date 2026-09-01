import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const ROOT = process.cwd();
const PUBLIC_UPLOAD_DIR = path.join(ROOT, 'public', 'uploads');
const PRIVATE_UPLOAD_DIR = path.join(ROOT, 'storage');

export const PUBLIC_ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

export const DOCUMENT_ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  // Common office docs
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10mb
const MAX_DOC_BYTES = 20 * 1024 * 1024; // 20mb

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  };
  return map[mime] ?? 'bin';
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

// Save a public media file (property images). Returns the public URL path.
export async function savePublicImage(file: File): Promise<{ url: string; sizeBytes: number }> {
  if (!PUBLIC_ALLOWED_MIME.has(file.type)) {
    throw new Error('Unsupported image type');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image too large');
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromMime(file.type);
  const name = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const dir = path.join(PUBLIC_UPLOAD_DIR, 'properties');
  await ensureDir(dir);
  await fs.writeFile(path.join(dir, name), buffer);
  return { url: `/uploads/properties/${name}`, sizeBytes: file.size };
}

// Save a private (non-public) document for a rental application.
export async function savePrivateDocument(
  file: File,
  idPrefix: string
): Promise<{ storedPath: string; sizeBytes: number; mimeType: string }> {
  if (!DOCUMENT_ALLOWED_MIME.has(file.type)) {
    throw new Error('Unsupported document type');
  }
  if (file.size > MAX_DOC_BYTES) {
    throw new Error('Document too large');
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromMime(file.type);
  const name = `${idPrefix}-${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const dir = path.join(PRIVATE_UPLOAD_DIR, 'documents');
  await ensureDir(dir);
  await fs.writeFile(path.join(dir, name), buffer);
  return { storedPath: `documents/${name}`, sizeBytes: file.size, mimeType: file.type };
}

// Read a private document from disk by its stored path.
export async function readPrivateDocument(storedPath: string): Promise<Buffer> {
  const safe = path.basename(storedPath); // prevent traversal
  const full = path.join(PRIVATE_UPLOAD_DIR, 'documents', safe);
  return fs.readFile(full);
}

export function publicUploadDir(): string {
  return PUBLIC_UPLOAD_DIR;
}
