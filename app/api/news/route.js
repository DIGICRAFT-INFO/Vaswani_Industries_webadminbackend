import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const { News } = require('../../../models/index');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const query = {};
    if (category && category !== 'All') query.category = category;

    const news = await News.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json({ success: true, news });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { News } = require('../../../models/index');
    const Notification = require('../../../models/Notification');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const formData = await request.formData();
    const data = {
      title: formData.get('title'),
      excerpt: formData.get('excerpt') || '',
      content: formData.get('content') || '',
      category: formData.get('category') || 'Industrial',
      author: formData.get('author') || 'Vaswani Industries',
      isPublished: formData.get('isPublished') !== 'false',
      uploadedBy: user._id,
    };

    const tags = formData.get('tags');
    if (tags) {
      data.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    }

    const newItem = new News(data);

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const saved = await saveUploadedFile(imageFile, 'images');
      newItem.image = saved.url;
    }

    await newItem.save();

    try {
      await Notification.create({
        type: 'new_document',
        icon: 'newspaper',
        title: `News published: ${newItem.title}`,
        message: newItem.excerpt || newItem.title,
        link: `/admin/news`,
        meta: { newsId: newItem._id },
      });
    } catch (e) {}

    return Response.json({ success: true, news: newItem }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
