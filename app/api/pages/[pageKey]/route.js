import dbConnect from '@/lib/db';
import { getOrSeedPage } from '@/lib/page-defaults';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { pageKey } = await params;
    const page = await getOrSeedPage(pageKey);
    if (!page) return Response.json({ success: false, message: 'Page not found.' }, { status: 404 });
    return Response.json({ success: true, page });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
