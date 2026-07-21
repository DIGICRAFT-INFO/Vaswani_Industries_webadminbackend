import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { Career } = require('../../../../../models/index');
    const Notification = require('../../../../../models/Notification');
    const { id } = await params;

    const job = await Career.findById(id);
    if (!job || !job.isActive) {
      return Response.json({ success: false, message: 'Position not available.' }, { status: 404 });
    }

    const body = await request.json();
    job.applications.push(body);
    await job.save();

    try {
      await Notification.create({
        type: 'new_application',
        icon: 'briefcase',
        title: `New application for "${job.title}"`,
        message: `${body.name} (${body.email}) applied`,
        link: '/dashboard/careers',
        meta: { jobId: job._id, applicantName: body.name },
      });
    } catch (e) {}

    return Response.json({ success: true, message: 'Application submitted successfully!' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
