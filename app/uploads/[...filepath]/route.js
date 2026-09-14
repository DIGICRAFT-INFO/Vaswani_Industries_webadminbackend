/**
 * /uploads/[...filepath] — universal static file server for uploads
 *
 * Next.js standalone serves public/ from process.cwd(). On Hostinger the
 * cwd may differ between deploys, so uploaded files can end up in several
 * locations. This route tries all known paths and streams the file back
 * with the correct Content-Type — guaranteeing images always load.
 *
 * Handles: /uploads/images/uuid.png  →  GET /uploads/images/uuid.png
 */

import fs   from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.pdf':  'application/pdf',
  '.ico':  'image/x-icon',
};

function getCandidateDirs() {
  const cwd = process.cwd();
  return [
    // 1. Standard: project-root/public/uploads  (next start / Hostinger panel)
    path.join(cwd, 'public', 'uploads'),
    // 2. Standalone build folder (when cwd = .next/standalone)
    path.join(cwd, '.next', 'standalone', 'public', 'uploads'),
    // 3. Absolute Hostinger project root (belt-and-suspenders)
    '/home/u374384555/domains/new.vaswaniindustries.com/public/uploads',
    // 4. Absolute Hostinger standalone folder
    '/home/u374384555/domains/new.vaswaniindustries.com/.next/standalone/public/uploads',
  ];
}

export async function GET(request, { params }) {
  const { filepath } = await params;
  // filepath is an array of path segments, e.g. ['images', 'uuid.png']
  const relPath = filepath.join('/');

  // Security: block path traversal
  if (relPath.includes('..')) {
    return new Response('Forbidden', { status: 403 });
  }

  const ext = path.extname(relPath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  for (const base of getCandidateDirs()) {
    const abs = path.join(base, relPath);
    if (fs.existsSync(abs)) {
      const stat = fs.statSync(abs);
      const buffer = fs.readFileSync(abs);
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type':   contentType,
          'Content-Length': String(stat.size),
          'Cache-Control':  'public, max-age=31536000, immutable',
          'Last-Modified':  stat.mtime.toUTCString(),
        },
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}
