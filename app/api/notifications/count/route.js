import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const Notification = require('../../../../models/Notification');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const count = await Notification.countDocuments({ isRead: false });
    return Response.json({ success: true, count });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
