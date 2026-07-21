import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const ContactCard = require('../../../../models/ContactCard');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const body = await request.json();
    const card = await ContactCard.findByIdAndUpdate(id, body, { new: true });
    if (!card) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
    return Response.json({ success: true, card });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const ContactCard = require('../../../../models/ContactCard');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    await ContactCard.findByIdAndDelete(id);
    return Response.json({ success: true, message: 'Deleted' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
