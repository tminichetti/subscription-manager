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
        if (!data || !data.name || !data.startDate || !data.price || !data.billingCycle) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

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
                startDate: new Date(data.startDate),
                price: parseFloat(data.price),
                billingCycle: data.billingCycle,
                userId: user.id,
                status: 'active'
            }
        });

        return NextResponse.json(subscription);
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
} 