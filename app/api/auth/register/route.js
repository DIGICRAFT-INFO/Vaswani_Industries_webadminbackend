import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await dbConnect();
    const User = require('../../../../models/User');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'superadmin') return forbidden();

    const { name, email, password, role } = await request.json();
    const existingUser = await User.findOne({ email });
    if (existingUser) return Response.json({ success: false, message: 'User already exists' }, { status: 400 });

    const newUser = await User.create({ name, email, password, role: role || 'admin', isActive: true });
    return Response.json({
      success: true,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
