import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const MEETINGS_FILE = path.join(DATA_DIR, 'meetings.json');
const ACTIONS_FILE = path.join(DATA_DIR, 'actions.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Meetings
async function readMeetings() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(MEETINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { meetings: [] };
  }
}

async function writeMeetings(data) {
  await ensureDataDir();
  await fs.writeFile(MEETINGS_FILE, JSON.stringify(data, null, 2));
}

export async function saveMeeting(title, transcript, extraction, notes) {
  const data = await readMeetings();
  
  const meeting = {
    id: Date.now().toString(),
    title,
    transcript,
    extraction,
    notes,
    createdAt: new Date().toISOString(),
  };
  
  data.meetings.unshift(meeting);
  data.meetings = data.meetings.slice(0, 100);
  
  await writeMeetings(data);
  
  // Also save action items to dedicated store
  if (extraction?.actionItems) {
    await saveActions(meeting.id, extraction.actionItems);
  }
  
  return meeting;
}

export async function getMeetings() {
  const data = await readMeetings();
  return data.meetings;
}

export async function getMeeting(id) {
  const data = await readMeetings();
  return data.meetings.find(m => m.id === id);
}

// Actions
async function readActions() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(ACTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { actions: [] };
  }
}

async function writeActions(data) {
  await ensureDataDir();
  await fs.writeFile(ACTIONS_FILE, JSON.stringify(data, null, 2));
}

export async function saveActions(meetingId, actionItems) {
  const data = await readActions();
  
  const newActions = actionItems.map((item, index) => ({
    id: `${meetingId}-${index}`,
    meetingId,
    ...item,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }));
  
  data.actions.unshift(...newActions);
  await writeActions(data);
}

export async function getActions(filter = {}) {
  const data = await readActions();
  let actions = data.actions;
  
  if (filter.status) {
    actions = actions.filter(a => a.status === filter.status);
  }
  if (filter.assignee) {
    actions = actions.filter(a => 
      a.assignee?.toLowerCase().includes(filter.assignee.toLowerCase())
    );
  }
  
  return actions;
}

export async function updateActionStatus(id, status) {
  const data = await readActions();
  const action = data.actions.find(a => a.id === id);
  if (action) {
    action.status = status;
    action.updatedAt = new Date().toISOString();
    await writeActions(data);
  }
  return action;
}
