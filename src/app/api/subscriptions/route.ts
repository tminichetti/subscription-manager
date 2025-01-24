import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const data = await request.json();
        const startDate = new Date(data.startDate);

        let user = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: { clerkId }
            });
        }

        const subscription = await prisma.subscription.create({
            data: {
                name: data.name,
                startDate: startDate,
                renewalDate: startDate,
                price: data.price,
                userId: user.id,
                status: 'active',
                billingCycle: data.billingCycle
            }
        });

        return NextResponse.json(subscription);
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
} 