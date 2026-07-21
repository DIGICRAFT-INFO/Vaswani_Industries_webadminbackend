import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const { BoardMember } = require('../../../models/index');
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('admin') === 'true' ? {} : { isActive: true };
    const members = await BoardMember.find(query).sort('order name');
    return Response.json({ success: true, members });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { BoardMember } = require('../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image') data[key] = value;
    }

    if (data.committees) {
      try { data.committees = JSON.parse(data.committees); } catch { data.committees = []; }
    }

    const member = new BoardMember(data);

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const saved = await saveUploadedFile(imageFile, 'images');
      member.image = saved.url;
    }

    await member.save();
    return Response.json({ success: true, member }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
