import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();
    const { BoardMember } = require('../../../../models/index');
    const members = await BoardMember.find({ isActive: true }).sort('order');
    const grouped = {};
    members.forEach(m => {
      (m.committees || []).forEach(c => {
        if (!grouped[c.name]) grouped[c.name] = [];
        grouped[c.name].push({ ...m.toObject(), committeeRole: c.role });
      });
    });
    return Response.json({ success: true, data: grouped });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
