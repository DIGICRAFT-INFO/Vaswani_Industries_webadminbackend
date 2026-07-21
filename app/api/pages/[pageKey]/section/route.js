import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { getOrSeedPage } from '@/lib/page-defaults';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { pageKey } = await params;
    const page = await getOrSeedPage(pageKey);
    if (!page) return Response.json({ success: false, message: 'Page not found.' }, { status: 404 });

    const body = await request.json();
    const newSection = {
      sectionKey: body.sectionKey || `section_${Date.now()}`,
      sectionLabel: body.sectionLabel || 'New Section',
      miniTitle: body.miniTitle || '',
      title: body.title || '',
      subtitle: body.subtitle || '',
      paragraph: body.paragraph || '',
      images: [],
      buttons: [],
      isActive: true,
      order: page.sections.length,
    };

    page.sections.push(newSection);
    page.lastEditedBy = user._id;
    await page.save();

    return Response.json({ success: true, section: page.sections[page.sections.length - 1] }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
