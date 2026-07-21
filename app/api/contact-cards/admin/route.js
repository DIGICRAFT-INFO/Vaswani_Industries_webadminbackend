import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULTS = [
  { title: 'HEAD OFFICE', icon: 'MapPin', lines: ['Vaswani Industries Limited, Sondra,', 'Phase - II, Bahesar Road, Siltara, Raipur, CG'], order: 1 },
  { title: 'CALL US', icon: 'Phone', lines: ['HR: 07713540221', 'ADMIN: 07713540202'], order: 2 },
  { title: 'EMAIL US', icon: 'Mail', lines: ['hrd@vaswaniindustries.com', 'saurabh@vaswaniindustries.com'], order: 3 },
];

export async function GET(request) {
  try {
    await dbConnect();
    const ContactCard = require('../../../../models/ContactCard');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const count = await ContactCard.countDocuments();
    if (count === 0) await ContactCard.insertMany(DEFAULTS);

    const cards = await ContactCard.find().sort('order');
    return Response.json({ success: true, cards });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
