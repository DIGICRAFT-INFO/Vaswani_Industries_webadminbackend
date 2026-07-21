import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULTS = [
  { title: 'HEAD OFFICE', icon: 'MapPin', lines: ['Vaswani Industries Limited, Sondra,', 'Phase - II, Bahesar Road, Siltara, Raipur, CG'], order: 1 },
  { title: 'CALL US', icon: 'Phone', lines: ['HR: 07713540221', 'ADMIN: 07713540202'], order: 2 },
  { title: 'EMAIL US', icon: 'Mail', lines: ['hrd@vaswaniindustries.com', 'saurabh@vaswaniindustries.com'], order: 3 },
];

async function seedIfEmpty() {
  const ContactCard = require('../../../models/ContactCard');
  const count = await ContactCard.countDocuments();
  if (count === 0) {
    await ContactCard.insertMany(DEFAULTS);
  }
}

export async function GET() {
  try {
    await dbConnect();
    const ContactCard = require('../../../models/ContactCard');
    await seedIfEmpty();
    const cards = await ContactCard.find({ isActive: true }).sort('order');
    return Response.json({ success: true, cards });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const ContactCard = require('../../../models/ContactCard');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const body = await request.json();
    const card = await ContactCard.create(body);
    return Response.json({ success: true, card }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
