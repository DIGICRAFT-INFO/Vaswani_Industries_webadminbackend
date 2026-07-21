import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();
    const { Settings } = require('../../../models/index');
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({ siteName: 'Vaswani Industries Limited', maintenanceMode: false });
    }
    return Response.json({ success: true, settings });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { Settings } = require('../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const updateData = await request.json();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(updateData);
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { $set: updateData },
        { new: true, runValidators: true, upsert: true }
      );
    }

    return Response.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
