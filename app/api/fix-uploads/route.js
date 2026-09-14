/**
 * GET /api/fix-uploads
 *
 * One-time migration route: copies uploaded files from
 * .next/standalone/public/uploads/ → public/uploads/
 * (and vice-versa) so images are served correctly regardless of
 * which directory the Node.js process cwd resolves to on Hostinger.
 *
 * Protected by ADMIN_SECRET query param.
 * Usage: https://new.vaswaniindustries.com/api/fix-uploads?secret=vaswani2026fix
 */

import fs   from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SECRET = process.env.FIX_UPLOADS_SECRET || 'vaswani2026fix';

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return { copied: 0, skipped: 0, errors: [] };
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  let copied = 0, skipped = 0;
  const errors = [];
  for (const entry of entries) {
    const srcPath  = path.join(src,  entry.name);
    const destPath = path.join(dest, entry.name);
    try {
      if (entry.isDirectory()) {
        const r = copyDirRecursive(srcPath, destPath);
        copied  += r.copied;
        skipped += r.skipped;
        errors.push(...r.errors);
      } else {
        if (fs.existsSync(destPath)) { skipped++; continue; }
        fs.copyFileSync(srcPath, destPath);
        copied++;
      }
    } catch (e) {
      errors.push(`${entry.name}: ${e.message}`);
    }
  }
  return { copied, skipped, errors };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('secret') !== SECRET) {
    return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const cwd = process.cwd();
  const report = { cwd, moves: [] };

  // All possible locations uploads might be written to
  const locations = [
    path.join(cwd, 'public', 'uploads'),
    path.join(cwd, '.next', 'standalone', 'public', 'uploads'),
    '/home/u374384555/domains/new.vaswaniindustries.com/public/uploads',
    '/home/u374384555/domains/new.vaswaniindustries.com/.next/standalone/public/uploads',
  ];

  // The canonical destination — project root public/uploads
  // (Next.js standalone serves public/ from cwd)
  const canonical = path.join(cwd, 'public', 'uploads');
  fs.mkdirSync(path.join(canonical, 'images'),            { recursive: true });
  fs.mkdirSync(path.join(canonical, 'documents', 'news'), { recursive: true });

  for (const loc of locations) {
    if (loc === canonical) continue;
    if (!fs.existsSync(loc)) { report.moves.push({ from: loc, status: 'not found' }); continue; }
    const r = copyDirRecursive(loc, canonical);
    report.moves.push({ from: loc, to: canonical, ...r });
  }

  // List what's now in canonical
  const images = fs.existsSync(path.join(canonical, 'images'))
    ? fs.readdirSync(path.join(canonical, 'images')).length
    : 0;

  return Response.json({
    success: true,
    canonical,
    imagesInCanonical: images,
    report,
  });
}
