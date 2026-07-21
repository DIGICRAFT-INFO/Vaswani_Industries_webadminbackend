import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { DEFAULT_PAGES, getOrSeedPage } from '@/lib/page-defaults';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const PageContent = require('../../../models/PageContent');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    await Promise.all(Object.keys(DEFAULT_PAGES).map(k => getOrSeedPage(k)));
    const pages = await PageContent.find().sort('pageKey').populate('lastEditedBy', 'name');
    return Response.json({ success: true, pages });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
