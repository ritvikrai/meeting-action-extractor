import { NextResponse } from 'next/server';
import { getMeetings, getMeeting } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const meeting = await getMeeting(id);
      if (!meeting) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
      }
      return NextResponse.json({ meeting });
    }

    const meetings = await getMeetings();
    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    return NextResponse.json(
      { error: 'Failed to get meetings' },
      { status: 500 }
    );
  }
}
