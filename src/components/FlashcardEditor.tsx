import { useState } from 'react'
import { ArrowLeft, Save, Plus, Trash2, Edit3 } from 'lucide-react'
import { FlashcardDeck, Flashcard } from '../types'

interface FlashcardEditorProps {
  deck: FlashcardDeck
  onSave: (updatedDeck: FlashcardDeck) => void
  onBack: () => void
}

export default function FlashcardEditor({ deck, onSave, onBack }: FlashcardEditorProps) {
  const [editedDeck, setEditedDeck] = useState<FlashcardDeck>({ ...deck })
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  const handleTitleChange = (newTitle: string) => {
    setEditedDeck(prev => ({ ...prev, title: newTitle }))
    setHasChanges(true)
  }

  const handleDescriptionChange = (newDescription: string) => {
    setEditedDeck(prev => ({ ...prev, description: newDescription }))
    setHasChanges(true)
  }

  const handleCardUpdate = (cardId: string, field: 'question' | 'answer', value: string) => {
    setEditedDeck(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }))
    setHasChanges(true)
  }

  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: generateId(),
      question: 'New question',
      answer: 'New answer'
    }
    setEditedDeck(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }))
    setEditingCard(newCard.id)
    setHasChanges(true)
  }

  const handleDeleteCard = (cardId: string) => {
    if (editedDeck.cards.length <= 1) {
      alert('A deck must have at least one flashcard.')
      return
    }
    
    if (confirm('Are you sure you want to delete this flashcard?')) {
      setEditedDeck(prev => ({
        ...prev,
        cards: prev.cards.filter(card => card.id !== cardId)
      }))
      setHasChanges(true)
    }
  }

  const handleSave = () => {
    // Validate that all cards have content
    const hasEmptyCards = editedDeck.cards.some(card => 
      !card.question.trim() || !card.answer.trim()
    )
    
    if (hasEmptyCards) {
      alert('Please ensure all flashcards have both a question and an answer.')
      return
    }

    if (!editedDeck.title.trim()) {
      alert('Please provide a title for the deck.')
      return
    }

    onSave(editedDeck)
    setHasChanges(false)
  }

  const handleBack = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to go back?')) {
        onBack()
      }
    } else {
      onBack()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Decks</span>
        </button>
        
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <span className="text-sm text-orange-600 font-medium">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Deck Info Editor */}
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Edit3 className="h-5 w-5 text-primary-600" />
          <span>Edit Deck Information</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deck Title
            </label>
            <input
              type="text"
              value={editedDeck.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter deck title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editedDeck.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter deck description..."
            />
          </div>
        </div>
      </div>

      {/* Flashcards Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Flashcards ({editedDeck.cards.length})
          </h2>
          <button
            onClick={handleAddCard}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="space-y-4">
          {editedDeck.cards.map((card, index) => (
            <div key={card.id} className="card relative">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-medium text-gray-900">Card {index + 1}</h3>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete this card"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={card.question}
                    onChange={(e) => handleCardUpdate(card.id, 'question', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={card.answer}
                    onChange={(e) => handleCardUpdate(card.id, 'answer', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter answer..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {editedDeck.cards.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">No flashcards in this deck</p>
            <button
              onClick={handleAddCard}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Card</span>
            </button>
          </div>
        )}
      </div>

      {/* Save Reminder */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-orange-100 border border-orange-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="text-orange-600">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">
                You have unsaved changes
              </p>
              <p className="text-xs text-orange-600">
                Don't forget to save your edits!
              </p>
            </div>
            <button
              onClick={handleSave}
              className="btn-primary text-xs px-3 py-1"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 