import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { actorId, actionId, targetId, location, metadata } = await request.json();

    const event = await prisma.event.create({
      data: {
        actorId,
        actionId,
        targetId,
        location,
        occurredAt: new Date(),
        metadata,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Pagination parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // Search parameters
  const actorId = searchParams.get('actorId') || undefined;
  const targetId = searchParams.get('targetId') || undefined;
  const actionId = searchParams.get('actionId') || undefined;
  const occurredAt = searchParams.get('occurredAt') || undefined;
  const location = searchParams.get('location') || undefined;

  const actorName = searchParams.get('actorName') || undefined;
  const actorGroup = searchParams.get('actorGroup') || undefined;
  const actorEmail = searchParams.get('actorEmail') || undefined;

  const actionName = searchParams.get('actionName') || undefined;

  try {
    const events = await prisma.event.findMany({
      where: {
        actorId: actorId ? actorId : undefined,
        targetId: targetId ? targetId : undefined,
        actionId: actionId ? actionId : undefined,
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
        occurredAt: occurredAt ? { equals: new Date(occurredAt) } : undefined,
        actor: {
          name: actorName ? { contains: actorName, mode: 'insensitive' } : undefined,
          email: actorEmail ? { contains: actorEmail, mode: 'insensitive' } : undefined,
          group: actorGroup ? { contains: actorGroup, mode: 'insensitive' } : undefined,
        },
        action: {
          name: actionName ? { contains: actionName, mode: 'insensitive' } : undefined,
        },
      },
      skip: 0,
      take: pageSize * page,
      orderBy: {
        occurredAt: 'desc',
      },
      include: {
        actor: true,
        action: true,
        target: true,
      },
    });

    const totalCount = await prisma.event.count({
      where: {
        actorId: actorId ? actorId : undefined,
        targetId: targetId ? targetId : undefined,
        actionId: actionId ? actionId : undefined,
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
        occurredAt: occurredAt ? { equals: new Date(occurredAt) } : undefined,
        actor: {
          name: actorName ? { contains: actorName, mode: 'insensitive' } : undefined,
          email: actorEmail ? { contains: actorEmail, mode: 'insensitive' } : undefined,
          group: actorGroup ? { contains: actorGroup, mode: 'insensitive' } : undefined,
        },
        action: {
          name: actionName ? { contains: actionName, mode: 'insensitive' } : undefined,
        },
      },
    });

    const numberOfPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      events,
      totalCount,
      pageSize,
      numberOfPages,
      page,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve events' }, { status: 500 });
  }
}