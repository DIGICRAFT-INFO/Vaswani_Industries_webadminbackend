import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile, deleteFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { News } = require('../../../../models/index');
    const { idOrSlug } = await params;

    let item = null;
    try { item = await News.findById(idOrSlug); } catch {}
    if (!item) item = await News.findOne({ slug: idOrSlug });
    if (!item) return Response.json({ success: false, message: 'Article not found' }, { status: 404 });

    item.views = (item.views || 0) + 1;
    await item.save();

    return Response.json({ success: true, news: item });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { News } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { idOrSlug } = await params;
    const item = await News.findById(idOrSlug);
    if (!item) return Response.json({ success: false, message: 'Not found' }, { status: 404 });

    const formData = await request.formData();
    const updateData = {};

    for (const [key, value] of formData.entries()) {
      if (key !== 'image') updateData[key] = value;
    }

    if (updateData.tags) {
      updateData.tags = typeof updateData.tags === 'string'
        ? updateData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : updateData.tags;
    }

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      // Delete old image
      if (item.image && item.image.includes('/uploads/images/')) {
        const oldFilename = item.image.split('/uploads/images/')[1];
        if (oldFilename) deleteFile(`/uploads/images/${oldFilename}`);
      }
      const saved = await saveUploadedFile(imageFile, 'images');
      updateData.image = saved.url;
    }

    const updatedItem = await News.findByIdAndUpdate(idOrSlug, updateData, { new: true });
    return Response.json({ success: true, news: updatedItem });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { News } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { idOrSlug } = await params;
    const item = await News.findById(idOrSlug);
    if (!item) return Response.json({ success: false, message: 'Article not found' }, { status: 404 });

    if (item.image && item.image.includes('/uploads/images/')) {
      const filename = item.image.split('/uploads/images/')[1];
      if (filename) deleteFile(`/uploads/images/${filename}`);
    }

    await News.findByIdAndDelete(idOrSlug);
    return Response.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
