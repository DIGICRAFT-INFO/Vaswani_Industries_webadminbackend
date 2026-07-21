import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { Contact } = require('../../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const contact = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!contact) return Response.json({ success: false, message: 'Message not found.' }, { status: 404 });

    return Response.json({ success: true, contact });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
