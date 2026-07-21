import { getAuthUser, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();
  return Response.json({ success: true, user });
}
