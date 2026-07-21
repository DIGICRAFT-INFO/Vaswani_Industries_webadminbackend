import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();
    const User = require('../../../../models/User');

    const existing = await User.findOne({ email: 'admin@vaswaniindustries.com' });
    if (existing) return Response.json({ success: false, message: 'Admin already exists' });

    await User.create({
      name: 'Super Admin',
      email: 'admin@vaswaniindustries.com',
      password: 'Admin@2026',
      role: 'superadmin',
      isActive: true,
    });

    return Response.json({ success: true, message: 'Superadmin created successfully' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
