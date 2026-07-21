import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const UPLOAD_BASE = path.join(process.cwd(), 'public', 'uploads');

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
  const dir = subFolder ? path.join(UPLOAD_BASE, type, subFolder) : path.join(UPLOAD_BASE, type);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, buffer);
  const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
  const relativePath = subFolder ? `/uploads/${type}/${subFolder}/${filename}` : `/uploads/${type}/${filename}`;
  return { filename, filepath, relativePath, url: `${baseUrl}${relativePath}`, size: buffer.length };
}

export function deleteFile(filePath) {
  try {
    const abs = filePath.startsWith('/') 
      ? path.join(process.cwd(), 'public', filePath)
      : path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    console.error('File deletion failed:', e.message);
  }
}
