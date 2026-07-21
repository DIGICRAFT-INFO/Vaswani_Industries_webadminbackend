import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(request) {
  try {
    await dbConnect();
    const User = require('../../../../models/User');
    const authUser = await getAuthUser(request);
    if (!authUser) return unauthorized();

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return Response.json({ success: false, message: 'Both passwords required' }, { status: 400 });
    }

    const user = await User.findById(authUser._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return Response.json({ success: false, message: 'Current password incorrect' }, { status: 400 });

    user.password = newPassword;
    await user.save();

    return Response.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
