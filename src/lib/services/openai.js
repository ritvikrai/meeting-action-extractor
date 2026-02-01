import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractActionsFromTranscript(transcript, context = {}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert meeting analyst. Extract action items, decisions, and key points from meeting transcripts.

Return JSON:
{
  "summary": "2-3 sentence meeting summary",
  "actionItems": [
    {
      "task": "Clear description of the action",
      "assignee": "Person responsible (or 'Unassigned')",
      "dueDate": "If mentioned, otherwise null",
      "priority": "high/medium/low",
      "context": "Brief context from the meeting"
    }
  ],
  "decisions": [
    {
      "decision": "What was decided",
      "rationale": "Why it was decided",
      "stakeholders": ["people involved"]
    }
  ],
  "keyPoints": ["Important point 1", "Important point 2"],
  "followUps": ["Items that need follow-up but aren't action items"],
  "participants": ["List of identified participants"],
  "nextMeeting": "If mentioned, when the next meeting is"
}`,
      },
      {
        role: 'user',
        content: `Meeting context: ${context.title || 'Team Meeting'}\nParticipants: ${context.participants || 'Not specified'}\n\nTranscript:\n${transcript}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse extraction:', e);
  }
  
  return null;
}

export async function transcribeAudio(audioBuffer, mimeType = 'audio/webm') {
  const file = new File([audioBuffer], 'audio.webm', { type: mimeType });
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  });

  return {
    text: transcription.text,
    segments: transcription.segments,
    duration: transcription.duration,
  };
}

export async function generateMeetingNotes(extraction, format = 'markdown') {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Generate well-formatted meeting notes in ${format} format. Make them clear, professional, and actionable.`,
      },
      {
        role: 'user',
        content: `Create meeting notes from this extraction:\n${JSON.stringify(extraction, null, 2)}`,
      },
    ],
    max_tokens: 1500,
  });

  return response.choices[0].message.content;
}
