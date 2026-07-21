import jwt from 'jsonwebtoken';
import dbConnect from './db';

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
}

export async function getAuthUser(request) {
  await dbConnect();
  const User = require('../models/User');
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return null;
    return user;
  } catch { return null; }
}

export function unauthorized() {
  return Response.json({ success: false, message: 'Not authorized' }, { status: 401 });
}

export function forbidden() {
  return Response.json({ success: false, message: 'Access denied' }, { status: 403 });
}
