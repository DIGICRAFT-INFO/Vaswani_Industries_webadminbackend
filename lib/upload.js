import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

/**
 * Resolve the base directory for uploads.
 *
 * Priority order:
 *  1. UPLOAD_DIR env var  — explicit override (recommended for production)
 *  2. <cwd>/public/uploads — works for both dev (`next dev`) and standalone
 *     production when cwd is set to the project/app root via PM2 `cwd` option.
 *
 * In standalone mode (output: 'standalone') Next.js copies `public/` into
 * `.next/standalone/public/` at build time, but dynamically uploaded files
 * need to go into the SAME directory that the built-in static file server
 * reads from.  The standalone server serves files from `<cwd>/public/` when
 * the process is started from the standalone folder.
 *
 * Set UPLOAD_DIR=<absolute-path-to-public/uploads> in your production env
 * or via the PM2 ecosystem file to make this fully explicit.
 */
function getUploadBase() {
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  return path.join(process.cwd(), 'public', 'uploads');
}

export function ensureUploadDirs() {
  const base = getUploadBase();
  ['documents', 'images'].forEach(dir => {
    const p = path.join(base, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });
}

export async function saveUploadedFile(file, type = 'images', subFolder = '') {
  ensureUploadDirs();
  const base = getUploadBase();
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '';
  const filename = `${randomUUID()}${ext}`;
  const dir = subFolder
    ? path.join(base, type, subFolder)
    : path.join(base, type);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, buffer);

  // Always store a relative /uploads/... path — no host prefix.
  // This way the URL works on any domain (dev, staging, production)
  // without needing URL normalization on the frontend.
  const relativePath = subFolder
    ? `/uploads/${type}/${subFolder}/${filename}`
    : `/uploads/${type}/${filename}`;

  return { filename, filepath, relativePath, url: relativePath, size: buffer.length };
}

export function deleteFile(filePath) {
  try {
    // Normalize: strip any leading host so we always get /uploads/...
    let rel = filePath;
    if (rel && rel.startsWith('http')) {
      try {
        const u = new URL(rel);
        rel = u.pathname;
      } catch {}
    }
    const base = getUploadBase();
    // rel is like /uploads/images/uuid.jpg — strip the /uploads prefix
    // because base already ends with /uploads
    const stripped = rel.startsWith('/uploads/') ? rel.slice('/uploads'.length) : rel;
    const abs = path.join(base, stripped);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    console.error('File deletion failed:', e.message);
  }
}
