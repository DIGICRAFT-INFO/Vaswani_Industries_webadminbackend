import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const Notification = require('../../../../models/Notification');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const n = await Notification.findByIdAndDelete(id);
    if (!n) return Response.json({ success: false, message: 'Notification not found.' }, { status: 404 });
    return Response.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
