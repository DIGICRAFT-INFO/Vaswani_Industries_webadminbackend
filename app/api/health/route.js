import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();
    const mongoose = require('mongoose');
    return Response.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  } catch (err) {
    return Response.json({ success: false, status: 'ERROR', message: err.message }, { status: 500 });
  }
}
