import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { getContent, getStorageMode } from '@/lib/content';
import { AdminApp } from './AdminApp';
import { AdminLogin } from './AdminLogin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const store = await cookies();
  const authed = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  const content = await getContent();

  if (!authed) {
    return <AdminLogin brand={content.brand} />;
  }

  return <AdminApp initialContent={content} storageMode={getStorageMode()} />;
}
