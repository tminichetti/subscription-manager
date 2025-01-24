import { prisma } from '@/lib/prisma';
import SubscriptionCalendar from '@/components/SubscriptionCalendar';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId: clerkId } = await auth();

  const user = clerkId ? await prisma.user.findUnique({
    where: { clerkId }
  }) : null;

  const subscriptions = user ? await prisma.subscription.findMany({
    where: {
      userId: user.id,
      status: 'active'
    }
  }) : [];

  return (
    <div className="min-h-screen p-8">
      <SubscriptionCalendar subscriptions={subscriptions} />
    </div>
  );
}
