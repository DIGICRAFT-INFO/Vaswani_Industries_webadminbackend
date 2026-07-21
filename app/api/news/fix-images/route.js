import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await dbConnect();
    const { News } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    // Fix all news images that have localhost URLs
    const news = await News.find({ image: { $regex: 'localhost' } });
    let fixed = 0;

    for (const item of news) {
      if (item.image && item.image.includes('/uploads/')) {
        item.image = item.image.substring(item.image.indexOf('/uploads/'));
        await item.save();
        fixed++;
      }
    }

    return Response.json({ success: true, message: `Fixed ${fixed} news image URLs`, total: news.length });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
