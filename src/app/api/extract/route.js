import { NextResponse } from 'next/server';
import { extractActionsFromTranscript, generateMeetingNotes } from '@/lib/services/openai';
import { saveMeeting } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { transcript, title, participants } = await request.json();

    if (!transcript || transcript.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide a meeting transcript (at least 50 characters)' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return demo extraction
      const demoExtraction = {
        summary: 'Team discussed project progress and upcoming deadlines. Key decisions were made regarding the implementation approach.',
        actionItems: [
          {
            task: 'Review the technical documentation',
            assignee: 'John',
            dueDate: 'Next Monday',
            priority: 'high',
            context: 'Needs to be done before the client meeting',
          },
          {
            task: 'Prepare the presentation slides',
            assignee: 'Sarah',
            dueDate: 'Friday',
            priority: 'medium',
            context: 'For the quarterly review',
          },
          {
            task: 'Schedule follow-up meeting with stakeholders',
            assignee: 'Unassigned',
            dueDate: null,
            priority: 'low',
            context: 'To discuss feedback',
          },
        ],
        decisions: [
          {
            decision: 'Proceed with Option A for the architecture',
            rationale: 'Better scalability and lower maintenance cost',
            stakeholders: ['Tech Lead', 'Product Manager'],
          },
        ],
        keyPoints: [
          'Project is on track for Q2 delivery',
          'Budget approved for additional resources',
          'New requirements need to be documented',
        ],
        followUps: ['Check with legal team on compliance'],
        participants: ['John', 'Sarah', 'Mike', 'Lisa'],
        nextMeeting: 'Next Tuesday at 2pm',
        note: 'Demo mode - Add OPENAI_API_KEY for real AI extraction',
      };

      const demoNotes = `# Meeting Notes: ${title || 'Team Meeting'}

## Summary
${demoExtraction.summary}

## Action Items
${demoExtraction.actionItems.map(a => `- [ ] **${a.task}** - ${a.assignee} (${a.priority} priority)`).join('\n')}

## Decisions
${demoExtraction.decisions.map(d => `- ${d.decision}`).join('\n')}

## Key Points
${demoExtraction.keyPoints.map(k => `- ${k}`).join('\n')}

## Next Meeting
${demoExtraction.nextMeeting || 'TBD'}`;

      const saved = await saveMeeting(title || 'Untitled Meeting', transcript, demoExtraction, demoNotes);
      return NextResponse.json({ success: true, data: saved });
    }

    // Extract with real AI
    const extraction = await extractActionsFromTranscript(transcript, { title, participants });

    if (!extraction) {
      return NextResponse.json(
        { error: 'Failed to extract meeting data' },
        { status: 500 }
      );
    }

    // Generate formatted notes
    const notes = await generateMeetingNotes(extraction);

    // Save meeting
    const saved = await saveMeeting(title || 'Untitled Meeting', transcript, extraction, notes);

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json(
      { error: 'Failed to extract meeting data', details: error.message },
      { status: 500 }
    );
  }
}
