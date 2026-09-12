import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UPLOAD_BASE = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), '..', 'uploads');

const MIME_TYPES = {
  '.pdf':  'application/pdf',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
};

export async function GET(request, { params }) {
  try {
    const { filePath } = await params;
    // filePath is an array of path segments e.g. ['documents', 'others', 'uuid.pdf']
    const relPath = Array.isArray(filePath) ? filePath.join('/') : filePath;

    // Security: prevent directory traversal
    const absPath = path.resolve(path.join(UPLOAD_BASE, relPath));
    if (!absPath.startsWith(path.resolve(UPLOAD_BASE))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!fs.existsSync(absPath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = path.extname(absPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(absPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': ext === '.pdf'
          ? `inline; filename="${path.basename(absPath)}"`
          : 'inline',
      },
    });
  } catch (err) {
    console.error('File serve error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
