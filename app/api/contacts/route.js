import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await dbConnect();
    const { Contact } = require('../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get('isRead');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const query = {};
    if (isRead !== null && isRead !== undefined && isRead !== '') query.isRead = isRead === 'true';

    const total = await Contact.countDocuments(query);
    const unreadCount = await Contact.countDocuments({ isRead: false });

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json({
      success: true,
      contacts,
      pagination: { total, unreadCount, currentPage: page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { Contact } = require('../../../models/index');
    const Notification = require('../../../models/Notification');

    const { name, email, subject, message, phone } = await request.json();
    if (!name || !email || !message) {
      return Response.json({ success: false, message: 'Please provide all required fields (Name, Email, Message).' }, { status: 400 });
    }

    const contact = await Contact.create({ name, email, subject, message, phone });

    try {
      await Notification.create({
        type: 'new_contact',
        icon: 'mail',
        title: `Contact: ${contact.name}`,
        message: contact.subject || message.substring(0, 60),
        link: `/dashboard/contacts`,
        meta: { contactId: contact._id, email: contact.email },
      });
    } catch (e) {}

    return Response.json({ success: true, message: 'Your message has been sent successfully!' }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
