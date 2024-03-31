import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

interface ContextProps {
  params: { courseId: 'string' };
}

export async function POST(request: NextRequest, { params }: ContextProps) {
  try {
    const { userId } = auth();
    const { url } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  } catch (error) {
    console.log('[ATTACHMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
