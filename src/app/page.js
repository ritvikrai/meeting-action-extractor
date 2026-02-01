'use client'
import { useState } from 'react'
import { Mic, FileText, CheckSquare, User, Calendar, Loader2, Upload } from 'lucide-react'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState(null)

  const processTranscript = async () => {
    if (!transcript.trim()) return
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setResults({
      summary: "The team discussed Q4 planning, reviewed the new product roadmap, and assigned responsibilities for the upcoming launch. Key decisions were made regarding the marketing budget and timeline adjustments.",
      actionItems: [
        { id: 1, task: "Prepare Q4 marketing budget proposal", owner: "Sarah", deadline: "Friday", priority: "High" },
        { id: 2, task: "Schedule user research sessions", owner: "Mike", deadline: "Next Monday", priority: "Medium" },
        { id: 3, task: "Review competitor analysis report", owner: "Team", deadline: "This week", priority: "Medium" },
        { id: 4, task: "Update product roadmap in Notion", owner: "Alex", deadline: "Tomorrow", priority: "High" },
        { id: 5, task: "Send meeting notes to stakeholders", owner: "You", deadline: "Today", priority: "Low" },
      ],
      decisions: [
        "Approved $50k additional marketing budget for Q4",
        "Postponed feature X launch to January",
        "Will hire 2 additional engineers"
      ],
      nextMeeting: "Thursday 2pm - Follow-up on action items"
    })
    setProcessing(false)
  }

  const priorityColors = { High: 'bg-red-100 text-red-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700' }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Mic className="text-blue-600" />
          Meeting Action Extractor
        </h1>
        <p className="text-gray-600 mb-8">Turn meeting transcripts into actionable tasks</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-blue-500" />
              <h3 className="font-medium">Meeting Transcript</h3>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript or notes here... You can also upload audio files for transcription."
              className="w-full h-64 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={processTranscript}
                disabled={processing || !transcript.trim()}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <><Loader2 className="animate-spin" /> Extracting...</> : 'Extract Actions'}
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Upload className="text-gray-500" />
              </button>
            </div>
          </div>

          {results && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">Meeting Summary</h3>
                <p className="text-gray-600 text-sm">{results.summary}</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <CheckSquare className="text-blue-500" /> Action Items ({results.actionItems.length})
                </h3>
                <div className="space-y-2">
                  {results.actionItems.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-gray-800">{item.task}</p>
                        <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[item.priority]}`}>{item.priority}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><User size={14} /> {item.owner}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {item.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">Key Decisions</h3>
                <ul className="space-y-1">
                  {results.decisions.map((d, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500">✓</span> {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white">
                <p className="text-sm text-blue-100">Next Meeting</p>
                <p className="font-medium">{results.nextMeeting}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
