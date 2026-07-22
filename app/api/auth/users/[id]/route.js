import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// PATCH — update permissions / isActive / name
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const User = require('../../../../../models/User');
    const requester = await getAuthUser(request);
    if (!requester) return unauthorized();
    if (requester.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const body = await request.json();
    const { permissions, isActive, name } = body;

    const target = await User.findById(id);
    if (!target) return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    if (target.role === 'superadmin') return Response.json({ success: false, message: 'Cannot modify superadmin' }, { status: 400 });

    const update = {};
    if (Array.isArray(permissions)) update.permissions = permissions;
    if (typeof isActive === 'boolean') update.isActive = isActive;
    if (name) update.name = name;

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    return Response.json({ success: true, user: updated });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE — remove user entirely
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

    const target = await User.findById(id);
    if (!target) return Response.json({ success: false, message: 'User not found' }, { status: 404 });

    await User.findByIdAndDelete(id);
    return Response.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
