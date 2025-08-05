import { useState, useEffect } from 'react'
import { BookOpen, FileText, Upload } from 'lucide-react'
import Navigation from './components/Navigation'
import FlashcardDecks from './components/FlashcardDecks'
import UploadedNotes from './components/UploadedNotes'
import UploadModal from './components/UploadModal'
import { Tab, Note, FlashcardDeck } from './types'
import { loadNotes, loadFlashcardDecks, saveNotes, saveFlashcardDecks } from './utils/storage'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('flashcard-decks')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    setNotes(loadNotes())
    setFlashcardDecks(loadFlashcardDecks())
  }, [])

  // Save data to localStorage whenever notes or decks change
  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  useEffect(() => {
    saveFlashcardDecks(flashcardDecks)
  }, [flashcardDecks])

  const handleNoteUpload = (note: Note) => {
    setNotes(prev => [...prev, note])
    setShowUploadModal(false)
  }

  const handleDeckCreated = (deck: FlashcardDeck) => {
    setFlashcardDecks(prev => [...prev, deck])
  }

  const handleDeckDeleted = (deckId: string) => {
    setFlashcardDecks(prev => prev.filter(deck => deck.id !== deckId))
  }

  const handleDeckUpdated = (updatedDeck: FlashcardDeck) => {
    setFlashcardDecks(prev => 
      prev.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FlashCard App</h1>
                <p className="text-gray-600">Transform your notes into powerful flashcard decks</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Notes</span>
            </button>
          </div>
        </header>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="py-8">
          {activeTab === 'flashcard-decks' && (
            <FlashcardDecks 
              decks={flashcardDecks} 
              notes={notes}
              onDeckCreated={handleDeckCreated}
              onDeckDeleted={handleDeckDeleted}
              onDeckUpdated={handleDeckUpdated}
            />
          )}
          {activeTab === 'uploaded-notes' && (
            <UploadedNotes 
              notes={notes} 
              onNotesChange={setNotes}
              onDeckCreated={handleDeckCreated}
            />
          )}
        </main>

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            onUpload={handleNoteUpload}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App 