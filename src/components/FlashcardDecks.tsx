import { useState } from 'react'
import { BookOpen, Calendar, FileText, Eye, Trash2, Edit3 } from 'lucide-react'
import { FlashcardDeck, Note } from '../types'
import FlashcardViewer from './FlashcardViewer'
import FlashcardEditor from './FlashcardEditor'

interface FlashcardDecksProps {
  decks: FlashcardDeck[]
  notes: Note[]
  onDeckCreated: (deck: FlashcardDeck) => void
  onDeckDeleted: (deckId: string) => void
  onDeckUpdated: (updatedDeck: FlashcardDeck) => void
}

export default function FlashcardDecks({ decks, notes, onDeckCreated: _onDeckCreated, onDeckDeleted, onDeckUpdated }: FlashcardDecksProps) {
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null)
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null)

  const handleViewDeck = (deck: FlashcardDeck) => {
    setSelectedDeck(deck)
  }

  const handleEditDeck = (deck: FlashcardDeck) => {
    setEditingDeck(deck)
  }

  const handleDeleteDeck = (deck: FlashcardDeck) => {
    const confirmMessage = `Are you sure you want to delete "${deck.title}"? This action cannot be undone.`
    if (confirm(confirmMessage)) {
      onDeckDeleted(deck.id)
    }
  }

  const handleSaveEdit = (updatedDeck: FlashcardDeck) => {
    onDeckUpdated(updatedDeck)
    setEditingDeck(null)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getSourceNote = (noteId: string) => {
    return notes.find(note => note.id === noteId)
  }

  if (editingDeck) {
    return (
      <FlashcardEditor 
        deck={editingDeck} 
        onSave={handleSaveEdit}
        onBack={() => setEditingDeck(null)} 
      />
    )
  }

  if (selectedDeck) {
    return (
      <FlashcardViewer 
        deck={selectedDeck} 
        onBack={() => setSelectedDeck(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flashcard Decks</h2>
          <p className="text-gray-600">
            {decks.length === 0 
              ? 'No flashcard decks yet. Upload some notes to get started!' 
              : `${decks.length} deck${decks.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300">
            <BookOpen className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No flashcard decks yet</h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            Upload your notes and we'll automatically generate flashcard decks based on the content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const sourceNote = getSourceNote(deck.createdFromNote)
            
            return (
              <div key={deck.id} className="card hover:shadow-lg transition-shadow duration-200 relative">
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteDeck(deck)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors z-10"
                  title="Delete this deck"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="flex items-start justify-between mb-4 pr-8">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {deck.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {deck.description}
                </p>

                <div className="space-y-2 mb-4">
                  {sourceNote && (
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="truncate">From: {sourceNote.fileName}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created {formatDate(deck.createdDate)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleViewDeck(deck)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Study Deck</span>
                  </button>
                  
                  <button
                    onClick={() => handleEditDeck(deck)}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Deck</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 