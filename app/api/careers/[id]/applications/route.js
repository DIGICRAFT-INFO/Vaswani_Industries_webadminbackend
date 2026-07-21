import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { Career } = require('../../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { id } = await params;
    const job = await Career.findById(id).select('title applications');
    return Response.json({ success: true, data: job });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
