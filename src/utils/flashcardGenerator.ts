import { Note, Flashcard, FlashcardDeck } from '../types'

export function generateFlashcardsFromNote(note: Note): FlashcardDeck {
  const cards = analyzeNoteContent(note.content)
  
  return {
    id: generateId(),
    title: `${note.title} - Flashcards`,
    description: `Flashcards generated from "${note.fileName}"`,
    cards,
    createdFromNote: note.id,
    createdDate: new Date()
  }
}

function analyzeNoteContent(content: string): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Split content into sections and analyze
  const sections = content.split(/\n\s*\n/) // Split by double line breaks
  
  sections.forEach((section, index) => {
    const trimmedSection = section.trim()
    if (trimmedSection.length < 10) return // Skip very short sections
    
    // Strategy 1: Look for definition patterns
    const definitionCards = extractDefinitions(trimmedSection, index)
    cards.push(...definitionCards)
    
    // Strategy 2: Look for key concepts and explanations
    const conceptCards = extractConcepts(trimmedSection, index)
    cards.push(...conceptCards)
    
    // Strategy 3: Look for lists and enumerated items
    const listCards = extractListItems(trimmedSection, index)
    cards.push(...listCards)
  })
  
  // If no specific patterns found, create general Q&A cards
  if (cards.length === 0) {
    const generalCards = createGeneralCards(content)
    cards.push(...generalCards)
  }
  
  return cards.slice(0, 20) // Limit to 20 cards to avoid overwhelming
}

function extractDefinitions(text: string, sectionIndex: number): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Pattern 1: "Term: Definition" or "Term - Definition"
  const definitionPattern = /^(.+?)[:–-]\s*(.+)$/gm
  let match
  
  while ((match = definitionPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim()
    
    if (term.length > 2 && definition.length > 10) {
      cards.push({
        id: generateId(),
        question: `What is ${term}?`,
        answer: definition
      })
    }
  }
  
  return cards
}

function extractConcepts(text: string, sectionIndex: number): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Look for sentences that explain concepts
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim()
    
    // Pattern: Look for explanatory sentences
    if (trimmed.match(/\b(is|are|means|refers to|defined as)\b/i)) {
      const parts = trimmed.split(/\b(is|are|means|refers to|defined as)\b/i)
      if (parts.length >= 3) {
        const subject = parts[0].trim()
        const explanation = parts.slice(2).join('').trim()
        
        if (subject.length > 2 && explanation.length > 10) {
          cards.push({
            id: generateId(),
            question: `What ${parts[1].toLowerCase()} ${subject}?`,
            answer: explanation
          })
        }
      }
    }
  })
  
  return cards
}

function extractListItems(text: string, sectionIndex: number): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Pattern: Look for numbered or bulleted lists
  const listItemPattern = /^[\s]*[•\-\*\d]+[\.\)]*\s*(.+)$/gm
  const items: string[] = []
  let match
  
  while ((match = listItemPattern.exec(text)) !== null) {
    items.push(match[1].trim())
  }
  
  if (items.length >= 2) {
    // Create a "list all items" type question
    const listTitle = text.split('\n')[0].trim()
    if (listTitle && !listTitle.match(/^[\s]*[•\-\*\d]/)) {
      cards.push({
        id: generateId(),
        question: `List the items related to: ${listTitle}`,
        answer: items.join('\n• ')
      })
    }
    
    // Create individual cards for important items
    items.slice(0, 5).forEach(item => {
      if (item.length > 15) {
        cards.push({
          id: generateId(),
          question: `What is one key point about this topic?`,
          answer: item
        })
      }
    })
  }
  
  return cards
}

function createGeneralCards(content: string): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Split content into chunks and create general Q&A
  const chunks = content.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50)
  
  chunks.slice(0, 5).forEach((chunk, index) => {
    const trimmed = chunk.trim()
    const firstSentence = trimmed.split(/[.!?]/)[0] + '.'
    
    if (firstSentence.length > 20 && trimmed.length > firstSentence.length + 20) {
      cards.push({
        id: generateId(),
        question: `What does this section discuss? (${firstSentence})`,
        answer: trimmed.substring(firstSentence.length).trim()
      })
    }
  })
  
  return cards
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
} 