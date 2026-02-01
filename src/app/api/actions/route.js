import { NextResponse } from 'next/server';
import { getActions, updateActionStatus } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignee = searchParams.get('assignee');

    const actions = await getActions({ status, assignee });
    return NextResponse.json({ actions });
  } catch (error) {
    console.error('Get actions error:', error);
    return NextResponse.json(
      { error: 'Failed to get actions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status required' },
        { status: 400 }
      );
    }

    const updated = await updateActionStatus(id, status);
    return NextResponse.json({ success: true, action: updated });
  } catch (error) {
    console.error('Update action error:', error);
    return NextResponse.json(
      { error: 'Failed to update action' },
      { status: 500 }
    );
  }
}
