import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Use a persistent directory outside the Next.js build output.
// On Hostinger (and most Node hosts) process.cwd() points to the app root.
// We store uploads one level up so redeploys never wipe them.
const UPLOAD_BASE = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), '..', 'uploads');

export function ensureUploadDirs() {
  ['documents', 'images'].forEach(dir => {
    const p = path.join(UPLOAD_BASE, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });
}

export async function saveUploadedFile(file, type = 'images', subFolder = '') {
  ensureUploadDirs();
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const filename = `${randomUUID()}${ext}`;
  const dir = subFolder
    ? path.join(UPLOAD_BASE, type, subFolder)
    : path.join(UPLOAD_BASE, type);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, buffer);
  // relativePath is used by the /api/files/[...path] serve route
  const relativePath = subFolder
    ? `/uploads/${type}/${subFolder}/${filename}`
    : `/uploads/${type}/${filename}`;
  return { filename, filepath, relativePath, url: relativePath, size: buffer.length };
}

export function deleteFile(filePath) {
  try {
    // filePath is the relative path like /uploads/documents/xxx.pdf
    const rel = filePath.startsWith('/uploads/')
      ? filePath.slice('/uploads/'.length)
      : filePath;
    const abs = path.join(UPLOAD_BASE, rel);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    console.error('File deletion failed:', e.message);
  }
}
