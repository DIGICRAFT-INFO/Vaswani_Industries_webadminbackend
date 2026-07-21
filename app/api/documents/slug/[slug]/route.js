import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const Document = require('../../../../../models/Document');
    const { slug } = await params;

    const doc = await Document.findOne({ slug, isActive: true });
    if (!doc) return Response.json({ success: false, message: 'Document not found' }, { status: 404 });

    doc.downloadCount = (doc.downloadCount || 0) + 1;
    await doc.save();

    return Response.json({ success: true, document: doc });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
