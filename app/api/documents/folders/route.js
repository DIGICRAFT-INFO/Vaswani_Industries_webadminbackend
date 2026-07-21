import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const Document = require('../../../../models/Document');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const docs = await Document.find().sort({ createdAt: -1 }).lean();
    const folders = {};

    docs.forEach(doc => {
      if (!folders[doc.category]) folders[doc.category] = [];
      folders[doc.category].push({
        _id: doc._id,
        filename: doc.fileName,
        title: doc.title,
        url: doc.fileUrl,
        size: doc.fileSize,
        year: doc.year,
        quarter: doc.quarter,
        createdAt: doc.createdAt,
      });
    });

    return Response.json({ success: true, folders });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
