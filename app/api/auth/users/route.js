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
    return Response.json({ success: true, users });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
