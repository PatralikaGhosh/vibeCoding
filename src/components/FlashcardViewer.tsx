import { useState } from 'react'
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { FlashcardDeck } from '../types'

interface FlashcardViewerProps {
  deck: FlashcardDeck
  onBack: () => void
}

export default function FlashcardViewer({ deck, onBack }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentCard = deck.cards[currentIndex]

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleFlip = () => {
    setShowAnswer(!showAnswer)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No cards available in this deck.</p>
        <button onClick={onBack} className="btn-primary mt-4">
          Back to Decks
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Decks</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
          <p className="text-gray-600">
            Card {currentIndex + 1} of {deck.cards.length}
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / deck.cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="relative">
        <div 
          onClick={handleFlip}
          className="flashcard min-h-[300px] relative overflow-hidden"
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8">
            {!showAnswer ? (
              <div className="text-center space-y-4">
                <div className="text-primary-600 mb-4">
                  <BookOpen className="h-8 w-8 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Question</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentCard.question}
                </p>
                <p className="text-sm text-gray-500 mt-8">Click to reveal answer</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 mb-4">
                  <BookOpen className="h-8 w-8 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Answer</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentCard.answer}
                </p>
                <p className="text-sm text-gray-500 mt-8">Click to show question</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleFlip}
            className="btn-secondary"
          >
            {showAnswer ? 'Show Question' : 'Show Answer'}
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === deck.cards.length - 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentIndex === deck.cards.length - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Study Complete */}
      {currentIndex === deck.cards.length - 1 && showAnswer && (
        <div className="text-center py-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🎉 You've completed this deck!
          </h3>
          <p className="text-gray-600 mb-4">
            Great job studying all {deck.cards.length} cards.
          </p>
          <div className="space-x-4">
            <button onClick={handleRestart} className="btn-primary">
              Study Again
            </button>
            <button onClick={onBack} className="btn-secondary">
              Back to Decks
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 