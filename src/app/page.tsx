import { prisma } from '@/lib/prisma';
import SubscriptionCalendar from '@/components/SubscriptionCalendar';

export default async function Home() {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: 'active'
    }
  });

  const monthlySpend = subscriptions.reduce((total: number, sub: { price: number }) => total + sub.price, 0);

  return (
    <div className="min-h-screen p-8">
      <SubscriptionCalendar
        subscriptions={subscriptions}
        monthlySpend={monthlySpend}
      />
    </div>
  );
}
