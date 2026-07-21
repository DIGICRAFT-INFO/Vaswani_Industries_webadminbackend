import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(request) {
  try {
    await dbConnect();
    const User = require('../../../../models/User');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();

    const { name, email, avatar } = await request.json();

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return Response.json({ success: false, message: 'Email already in use' }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      user._id,
      { name, email, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    return Response.json({ success: true, user: updated });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
