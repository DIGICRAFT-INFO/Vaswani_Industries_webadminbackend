import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const User = require('../../../../models/User');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'superadmin') return forbidden();

    const users = await User.find().select('-password').sort('-createdAt');
    // Ensure permissions field is always present
    const usersWithPerms = users.map(u => ({
      ...u.toObject(),
      permissions: u.role === 'superadmin' ? require('../../../../models/User').ALL_PERMISSIONS : (u.permissions || ['overview']),
    }));
    return Response.json({ success: true, users: usersWithPerms });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
