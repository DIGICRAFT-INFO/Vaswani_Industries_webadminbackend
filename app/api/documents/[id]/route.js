import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { deleteFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const Document = require('../../../../models/Document');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const { title, category, year, quarter, description, isActive } = await request.json();

    const doc = await Document.findById(id);
    if (!doc) return Response.json({ success: false, message: 'Not found' }, { status: 404 });

    if (title !== undefined) doc.title = title;
    if (category !== undefined) doc.category = category;
    if (year !== undefined) doc.year = year;
    if (quarter !== undefined) doc.quarter = quarter;
    if (description !== undefined) doc.description = description;
    if (isActive !== undefined) doc.isActive = isActive;

    await doc.save();
    return Response.json({ success: true, document: doc });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const Document = require('../../../../models/Document');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const doc = await Document.findById(id);
    if (!doc) return Response.json({ success: false, message: 'Not found' }, { status: 404 });

    deleteFile(doc.filePath);
    await Document.findByIdAndDelete(id);

    return Response.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
