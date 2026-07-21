import dbConnect from '@/lib/db';
import { generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await dbConnect();
    const User = require('../../../../models/User');
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    if (!user.isActive) return Response.json({ success: false, message: 'Account is deactivated' }, { status: 401 });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });

    return Response.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
