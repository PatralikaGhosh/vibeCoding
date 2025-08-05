import { useState } from 'react'
import { FileText, Calendar, Trash2, Sparkles, Eye, X } from 'lucide-react'
import { Note, FlashcardDeck } from '../types'
import { generateFlashcardsFromNote } from '../utils/flashcardGenerator'

interface UploadedNotesProps {
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
  onDeckCreated: (deck: FlashcardDeck) => void
}

export default function UploadedNotes({ notes, onNotesChange, onDeckCreated }: UploadedNotesProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      onNotesChange(notes.filter(note => note.id !== noteId))
    }
  }

  const handleGenerateFlashcards = async (note: Note) => {
    setGenerating(note.id)
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const deck = generateFlashcardsFromNote(note)
      onDeckCreated(deck)
      
      // Show success message
      alert(`Successfully generated ${deck.cards.length} flashcards from "${note.title}"!`)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('Error generating flashcards. Please try again.')
    } finally {
      setGenerating(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const NoteViewer = ({ note, onClose }: { note: Note; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
            <p className="text-sm text-gray-500">{note.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {note.content}
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Uploaded Notes</h2>
          <p className="text-gray-600">
            {notes.length === 0 
              ? 'No notes uploaded yet. Click the upload button to get started!' 
              : `${notes.length} note${notes.length !== 1 ? 's' : ''} uploaded`}
          </p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300">
            <FileText className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No notes uploaded yet</h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            Upload your first note to start creating flashcard decks. We support .txt and .md files.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {note.fileName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {note.content.substring(0, 150)}...
                </p>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Uploaded {formatDate(note.uploadDate)}</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedNote(note)}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Note</span>
                </button>
                
                <button
                  onClick={() => handleGenerateFlashcards(note)}
                  disabled={generating === note.id}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {generating === note.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Flashcards</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Viewer Modal */}
      {selectedNote && (
        <NoteViewer 
          note={selectedNote} 
          onClose={() => setSelectedNote(null)} 
        />
      )}
    </div>
  )
} 