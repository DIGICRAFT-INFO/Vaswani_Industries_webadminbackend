import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const User = require('../../../../../models/User');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    if (id === user._id.toString()) {
      return Response.json({ success: false, message: 'Cannot delete yourself' }, { status: 400 });
    }

    await User.findByIdAndDelete(id);
    return Response.json({ success: true, message: 'User deleted' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
