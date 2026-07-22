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
      if (!['image', 'additionalImages', 'attachmentPdf'].includes(key)) {
        updateData[key] = value;
      }
    }

    if (updateData.tags) {
      try { updateData.tags = JSON.parse(updateData.tags); } catch { updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean); }
    }

    // customCategory
    if (updateData.category !== 'Other') updateData.customCategory = '';

    // Featured image
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      if (item.image && item.image.includes('/uploads/images/')) {
        const oldFilename = item.image.split('/uploads/images/')[1];
        if (oldFilename) deleteFile(`/uploads/images/${oldFilename}`);
      }
      const saved = await saveUploadedFile(imageFile, 'images');
      updateData.image = saved.url;
    }

    // Additional images — add new ones
    const addImgFiles = formData.getAll('additionalImages');
    const newAdditional = [];
    for (const file of addImgFiles) {
      if (file && file.size > 0) {
        const saved = await saveUploadedFile(file, 'images');
        newAdditional.push(saved.url);
      }
    }

    // Remove additional images if requested (supports multiple)
    const removeImgs = formData.getAll('removeAdditionalImage');
    let currentAddl = [...(item.additionalImages || [])];
    if (removeImgs.length > 0) {
      removeImgs.forEach(removeUrl => {
        // Match both full URL and relative path
        currentAddl = currentAddl.filter(u => {
          const rel = u.includes('/uploads/') ? u.substring(u.indexOf('/uploads/')) : u;
          const removeRel = removeUrl.includes('/uploads/') ? removeUrl.substring(removeUrl.indexOf('/uploads/')) : removeUrl;
          return rel !== removeRel && u !== removeUrl;
        });
        deleteFile(removeUrl);
      });
      updateData.additionalImages = [...currentAddl, ...newAdditional];
    } else if (newAdditional.length > 0) {
      updateData.additionalImages = [...currentAddl, ...newAdditional];
    }

    // PDF attachment
    const pdfFile = formData.get('attachmentPdf');
    if (pdfFile && pdfFile.size > 0) {
      if (item.attachmentPdf) deleteFile(item.attachmentPdf);
      const saved = await saveUploadedFile(pdfFile, 'documents', 'news');
      updateData.attachmentPdf = saved.url;
      updateData.attachmentPdfName = pdfFile.name;
    }

    // Remove PDF if requested
    if (formData.get('removePdf') === 'true') {
      if (item.attachmentPdf) deleteFile(item.attachmentPdf);
      updateData.attachmentPdf = '';
      updateData.attachmentPdfName = '';
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
