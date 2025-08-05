import { Note, FlashcardDeck } from '../types'

const NOTES_STORAGE_KEY = 'flashcard-app-notes'
const DECKS_STORAGE_KEY = 'flashcard-app-decks'

// Note storage functions
export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error)
  }
}

export function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY)
    if (!stored) return []
    
    const notes = JSON.parse(stored)
    // Convert date strings back to Date objects
    return notes.map((note: any) => ({
      ...note,
      uploadDate: new Date(note.uploadDate)
    }))
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error)
    return []
  }
}

// Flashcard deck storage functions
export function saveFlashcardDecks(decks: FlashcardDeck[]): void {
  try {
    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks))
  } catch (error) {
    console.error('Failed to save flashcard decks to localStorage:', error)
  }
}

export function loadFlashcardDecks(): FlashcardDeck[] {
  try {
    const stored = localStorage.getItem(DECKS_STORAGE_KEY)
    if (!stored) return []
    
    const decks = JSON.parse(stored)
    // Convert date strings back to Date objects
    return decks.map((deck: any) => ({
      ...deck,
      createdDate: new Date(deck.createdDate)
    }))
  } catch (error) {
    console.error('Failed to load flashcard decks from localStorage:', error)
    return []
  }
}

// Clear all data (useful for testing)
export function clearAllData(): void {
  try {
    localStorage.removeItem(NOTES_STORAGE_KEY)
    localStorage.removeItem(DECKS_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear data from localStorage:', error)
  }
} 