import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile, deleteFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { BoardMember } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const member = await BoardMember.findById(id);
    if (!member) return Response.json({ success: false, message: 'Member not found.' }, { status: 404 });

    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image') data[key] = value;
    }

    if (data.committees) {
      try { data.committees = JSON.parse(data.committees); } catch { data.committees = []; }
    }

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      if (member.image && member.image.includes('/uploads/images/')) {
        const oldFilename = member.image.split('/uploads/images/')[1];
        if (oldFilename) deleteFile(`/uploads/images/${oldFilename}`);
      }
      const saved = await saveUploadedFile(imageFile, 'images');
      data.image = saved.url;
    }

    const updatedMember = await BoardMember.findByIdAndUpdate(id, data, { new: true });
    return Response.json({ success: true, member: updatedMember });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { BoardMember } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const member = await BoardMember.findById(id);
    if (!member) return Response.json({ success: false, message: 'Not found.' }, { status: 404 });

    if (member.image && member.image.includes('/uploads/images/')) {
      const filename = member.image.split('/uploads/images/')[1];
      if (filename) deleteFile(`/uploads/images/${filename}`);
    }

    await BoardMember.findByIdAndDelete(id);
    return Response.json({ success: true, message: 'Deleted successfully.' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
