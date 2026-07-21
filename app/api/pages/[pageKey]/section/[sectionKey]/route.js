import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { getOrSeedPage } from '@/lib/page-defaults';
import { saveUploadedFile, deleteFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { pageKey, sectionKey } = await params;
    const page = await getOrSeedPage(pageKey);
    if (!page) return Response.json({ success: false, message: 'Page not found.' }, { status: 404 });
    const section = page.sections.find(s => s.sectionKey === sectionKey);
    if (!section) return Response.json({ success: false, message: 'Section not found.' }, { status: 404 });
    return Response.json({ success: true, section });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const PageContent = require('../../../../../../models/PageContent');
    const Notification = require('../../../../../../models/Notification');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { pageKey, sectionKey } = await params;
    let page = await PageContent.findOne({ pageKey });
    if (!page) return Response.json({ success: false, message: 'Page not found.' }, { status: 404 });

    const idx = page.sections.findIndex(s => s.sectionKey === sectionKey);
    if (idx === -1) return Response.json({ success: false, message: 'Section not found.' }, { status: 404 });

    const formData = await request.formData();
    const section = page.sections[idx];

    const miniTitle = formData.get('miniTitle');
    const title = formData.get('title');
    const subtitle = formData.get('subtitle');
    const paragraph = formData.get('paragraph');
    const paragraph2 = formData.get('paragraph2');
    const isActive = formData.get('isActive');
    const extra = formData.get('extra');
    const buttons = formData.get('buttons');
    const deleteImages = formData.get('deleteImages');
    const imageOrder = formData.get('imageOrder');

    if (miniTitle !== null) section.miniTitle = miniTitle;
    if (title !== null) section.title = title;
    if (subtitle !== null) section.subtitle = subtitle;
    if (paragraph !== null) section.paragraph = paragraph;
    if (paragraph2 !== null) section.paragraph2 = paragraph2;
    if (isActive !== null) section.isActive = isActive === 'true' || isActive === true;
    if (extra !== null) {
      try { section.extra = typeof extra === 'string' ? JSON.parse(extra) : extra; } catch (e) {}
    }
    if (buttons !== null) {
      try { section.buttons = typeof buttons === 'string' ? JSON.parse(buttons) : buttons; } catch (e) {}
    }

    // Image uploads
    const imageFiles = formData.getAll('images');
    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const newImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file.size > 0) {
          const saved = await saveUploadedFile(file, 'images');
          newImages.push({
            url: saved.url,
            alt: file.name.replace(/\.[^.]+$/, ''),
            order: (section.images?.length || 0) + i,
          });
        }
      }
      section.images = [...(section.images || []), ...newImages];
    }

    // Image deletions
    if (deleteImages) {
      let toDelete = [];
      try { toDelete = JSON.parse(deleteImages); } catch (e) {}
      toDelete.forEach(url => {
        if (url.includes('/uploads/images/')) {
          const fname = url.split('/uploads/images/')[1];
          if (fname) deleteFile(`/uploads/images/${fname}`);
        }
      });
      section.images = section.images.filter(img => !toDelete.includes(img.url));
    }

    // Image reorder
    if (imageOrder) {
      try {
        const order = JSON.parse(imageOrder);
        section.images = order.map((url, i) => {
          const img = section.images.find(x => x.url === url);
          return img ? { ...img.toObject(), order: i } : null;
        }).filter(Boolean);
      } catch (e) {}
    }

    page.lastEditedBy = user._id;
    page.markModified('sections');
    await page.save();

    try {
      await Notification.create({
        type: 'page_updated',
        title: 'Page content updated',
        message: `${page.pageLabel} → ${section.sectionLabel || sectionKey} updated by ${user.name}`,
        link: `/dashboard/pages/${pageKey}`,
        icon: 'edit',
      });
    } catch (e) {}

    return Response.json({ success: true, section: page.sections[idx], message: 'Section updated successfully.' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const PageContent = require('../../../../../../models/PageContent');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { pageKey, sectionKey } = await params;
    const page = await PageContent.findOne({ pageKey });
    if (!page) return Response.json({ success: false, message: 'Page not found.' }, { status: 404 });

    page.sections = page.sections.filter(s => s.sectionKey !== sectionKey);
    await page.save();

    return Response.json({ success: true, message: 'Section deleted.' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
