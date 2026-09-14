import path from 'path';
import fs   from 'fs';
import { randomUUID } from 'crypto';

/**
 * Returns all candidate base directories for uploads.
 * We write to ALL of them so the file is available regardless of
 * which cwd the Node process happens to use on Hostinger.
 */
function getUploadBases() {
  const cwd = process.cwd();
  const bases = new Set([
    // 1. cwd-relative (works for both `next start` and standalone)
    path.join(cwd, 'public', 'uploads'),
    // 2. Standalone sub-folder (when cwd = .next/standalone)
    path.join(cwd, '.next', 'standalone', 'public', 'uploads'),
    // 3. Absolute project-root (Hostinger panel — belt-and-suspenders)
    '/home/u374384555/domains/new.vaswaniindustries.com/public/uploads',
    // 4. Absolute standalone path
    '/home/u374384555/domains/new.vaswaniindustries.com/.next/standalone/public/uploads',
  ]);
  // UPLOAD_DIR override (explicit env var)
  if (process.env.UPLOAD_DIR) bases.add(process.env.UPLOAD_DIR);
  return [...bases];
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function ensureUploadDirs() {
  for (const base of getUploadBases()) {
    ['images', 'documents', path.join('documents', 'news')].forEach(sub => {
      try { ensureDir(path.join(base, sub)); } catch {}
    });
  }
}

export async function saveUploadedFile(file, type = 'images', subFolder = '') {
  ensureUploadDirs();
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext      = path.extname(file.name) || '';
  const filename = `${randomUUID()}${ext}`;
  const relPath  = subFolder
    ? `/uploads/${type}/${subFolder}/${filename}`
    : `/uploads/${type}/${filename}`;

  // Write to every candidate directory — whichever the server reads from will work
  for (const base of getUploadBases()) {
    const dir = subFolder
      ? path.join(base, type, subFolder)
      : path.join(base, type);
    try {
      ensureDir(dir);
      fs.writeFileSync(path.join(dir, filename), buffer);
    } catch (e) {
      // Non-fatal — log and continue to next candidate
      console.warn(`[upload] could not write to ${dir}: ${e.message}`);
    }
  }

  return {
    filename,
    relativePath: relPath,
    // Always return a relative URL — works on any domain
    url: relPath,
    size: buffer.length,
  };
}

export function deleteFile(filePath) {
  // Normalize to a relative path like /uploads/images/uuid.ext
  let rel = filePath;
  if (rel && rel.startsWith('http')) {
    try { rel = new URL(rel).pathname; } catch {}
  }

  for (const base of getUploadBases()) {
    try {
      // rel is /uploads/images/... — strip the /uploads prefix since base ends with /uploads
      const stripped = rel.startsWith('/uploads/')
        ? rel.slice('/uploads'.length)
        : rel;
      const abs = path.join(base, stripped);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch (e) {
      console.warn(`[upload] could not delete from ${base}: ${e.message}`);
    }
  }
}
