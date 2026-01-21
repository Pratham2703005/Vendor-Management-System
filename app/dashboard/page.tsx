import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || !['writer', 'manager'].includes(role)) {
    redirect('/');
  }

  return (
    <main className="min-h-screen p-8 relative">
      <DashboardClient role={role} />
    </main>
  );
}
