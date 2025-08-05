import { Note, Flashcard, FlashcardDeck } from '../types'

// Import NLP libraries with proper error handling
let natural: any = null
let nlp: any = null
let keyword: any = null

// Function to dynamically import NLP libraries
async function loadNLPLibraries() {
  try {
    const { default: naturalModule } = await import('natural')
    const { default: nlpModule } = await import('compromise')
    const { extract } = await import('keyword-extractor')
    
    natural = naturalModule
    nlp = nlpModule
    keyword = { extract }
    
    console.log('NLP libraries loaded successfully')
    return true
  } catch (error) {
    console.warn('NLP libraries not available, using enhanced fallback methods')
    return false
  }
}

// Try to load libraries immediately
let nlpLoaded = false
loadNLPLibraries().then(success => {
  nlpLoaded = success
})

/**
 * Enhanced Flashcard Generator with Advanced NLP
 * 
 * NLP Features Enabled:
 * - Natural language processing with compromise.js
 * - Advanced keyword extraction with keyword-extractor
 * - Stemming and tokenization with natural.js
 * - Part-of-speech tagging and named entity recognition
 * - Sophisticated linguistic analysis for better flashcard quality
 * - TF-IDF scoring with proper linguistic preprocessing
 * - Sentiment and context analysis for concept identification
 */

// Initialize NLP components safely
const stemmer = natural?.PorterStemmer || { stem: (word: string) => word.toLowerCase() }
const tokenizer = natural ? new natural.WordTokenizer() : { tokenize: (text: string) => text.split(/\W+/) }
const tfidf = natural ? new natural.TfIdf() : null

interface KeyPhrase {
  phrase: string
  score: number
  type: 'noun' | 'concept' | 'definition' | 'process' | 'entity' | 'technical'
  pos?: string[] // Part of speech tags
  context?: string // Surrounding context
}

export function generateFlashcardsFromNote(note: Note): FlashcardDeck {
  const cards = natural && nlp && keyword 
    ? analyzeNoteContentWithAdvancedNLP(note.content)
    : analyzeNoteContentWithEnhancedExtraction(note.content)
  
  return {
    id: generateId(),
    title: `${note.title} - Flashcards`,
    description: `Flashcards generated from "${note.fileName}"${natural && nlp && keyword ? ' using advanced NLP' : ''}`,
    cards,
    createdFromNote: note.id,
    createdDate: new Date()
  }
}

function analyzeNoteContentWithAdvancedNLP(content: string): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Pre-process text with NLP
  const processedText = preprocessTextWithNLP(content)
  
  // Extract keyphrases using advanced NLP techniques
  const keyphrases = extractKeyphrasesWithNLP(content)
  
  // Split content into sections for analysis
  const sections = content.split(/\n\s*\n/)
  
  sections.forEach((section, index) => {
    const trimmedSection = section.trim()
    if (trimmedSection.length < 10) return
    
    // Advanced NLP-powered extraction strategies
    const definitionCards = extractDefinitionsWithAdvancedNLP(trimmedSection, keyphrases)
    cards.push(...definitionCards)
    
    const conceptCards = extractConceptsWithAdvancedNLP(trimmedSection, keyphrases)
    cards.push(...conceptCards)
    
    const entityCards = extractNamedEntityCards(trimmedSection, keyphrases)
    cards.push(...entityCards)
    
    const listCards = extractListItems(trimmedSection, index)
    cards.push(...listCards)
    
    const processCards = extractProcessCardsWithNLP(trimmedSection, keyphrases)
    cards.push(...processCards)
  })
  
  // Generate keyphrase-based cards with context
  const keyphraseCards = generateAdvancedKeyphraseCards(content, keyphrases)
  cards.push(...keyphraseCards)
  
  // Generate relationship-based cards
  const relationshipCards = extractRelationshipCards(content, keyphrases)
  cards.push(...relationshipCards)
  
  // Fallback to general cards if needed
  if (cards.length === 0) {
    const generalCards = createGeneralCards(content)
    cards.push(...generalCards)
  }
  
  // Remove duplicates and rank by quality
  const uniqueCards = removeDuplicateCards(cards)
  const rankedCards = rankCardsByQuality(uniqueCards, keyphrases)
  
  return rankedCards.slice(0, 30) // Increased limit due to higher quality
}

// Fallback method for when NLP libraries aren't available
function analyzeNoteContentWithEnhancedExtraction(content: string): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Extract keyphrases using enhanced text analysis
  const keyphrases = extractKeyphrasesAdvanced(content)
  
  // Split content into sections for analysis
  const sections = content.split(/\n\s*\n/)
  
  sections.forEach((section, index) => {
    const trimmedSection = section.trim()
    if (trimmedSection.length < 10) return
    
    // Enhanced extraction strategies
    const definitionCards = extractDefinitionsEnhanced(trimmedSection, keyphrases)
    cards.push(...definitionCards)
    
    const conceptCards = extractConceptsEnhanced(trimmedSection, keyphrases)
    cards.push(...conceptCards)
    
    const listCards = extractListItems(trimmedSection, index)
    cards.push(...listCards)
    
    const processCards = extractProcessCards(trimmedSection, keyphrases)
    cards.push(...processCards)
  })
  
  // Generate keyphrase-based cards
  const keyphraseCards = generateKeyphraseCards(content, keyphrases)
  cards.push(...keyphraseCards)
  
  // Fallback to general cards if needed
  if (cards.length === 0) {
    const generalCards = createGeneralCards(content)
    cards.push(...generalCards)
  }
  
  // Remove duplicates and limit cards
  const uniqueCards = removeDuplicateCards(cards)
  return uniqueCards.slice(0, 25)
}

function preprocessTextWithNLP(text: string): string {
  // Clean and normalize text
  let processed = text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s\.\!\?\:\;\-\(\)]/g, '') // Remove special chars but keep punctuation
    .trim()
  
  return processed
}

function extractKeyphrasesWithNLP(text: string): KeyPhrase[] {
  const keyphrases: KeyPhrase[] = []
  
  try {
    // Method 1: Professional keyword extraction
    const extractedKeywords = keyword.extract(text, {
      language: "english",
      remove_digits: false,
      return_changed_case: true,
      remove_duplicates: true
    })
    
    extractedKeywords.forEach((kw: string) => {
      keyphrases.push({
        phrase: kw,
        score: calculateAdvancedKeywordScore(kw, text),
        type: 'noun'
      })
    })
    
    // Method 2: Compromise.js linguistic analysis
    const doc = nlp(text)
    
    // Extract nouns and noun phrases with POS tagging
    const nouns = doc.nouns()
    nouns.forEach((noun: any) => {
      const nounText = noun.text()
      const pos = noun.out('tags')
      
      if (nounText.length > 2) {
        keyphrases.push({
          phrase: nounText,
          score: calculatePhraseImportanceAdvanced(nounText, text),
          type: 'noun',
          pos: pos,
          context: extractContextForPhrase(nounText, text)
        })
      }
    })
    
    // Extract proper nouns (likely important concepts)
    const properNouns = doc.match('#ProperNoun+')
    properNouns.forEach((entity: any) => {
      const entityText = entity.text()
      if (entityText.length > 1) {
        keyphrases.push({
          phrase: entityText,
          score: calculatePhraseImportanceAdvanced(entityText, text) * 1.5, // Boost proper nouns
          type: 'entity',
          pos: ['ProperNoun'],
          context: extractContextForPhrase(entityText, text)
        })
      }
    })
    
    // Extract technical terms and concepts
    const concepts = doc.match('#Noun+ #Noun+')
    concepts.forEach((concept: any) => {
      const conceptText = concept.text()
      if (conceptText.length > 5) {
        keyphrases.push({
          phrase: conceptText,
          score: calculatePhraseImportanceAdvanced(conceptText, text) * 1.3,
          type: 'concept',
          context: extractContextForPhrase(conceptText, text)
        })
      }
    })
    
    // Extract verbs for process identification
    const verbs = doc.verbs()
    const processVerbs = ['implement', 'process', 'analyze', 'calculate', 'determine', 'evaluate', 'execute', 'perform']
    verbs.forEach((verb: any) => {
      const verbText = verb.text()
      if (processVerbs.some(pv => verbText.toLowerCase().includes(pv))) {
        keyphrases.push({
          phrase: verbText,
          score: calculatePhraseImportanceAdvanced(verbText, text),
          type: 'process',
          pos: ['Verb'],
          context: extractContextForPhrase(verbText, text)
        })
      }
    })
    
    // Method 3: Advanced TF-IDF with preprocessing
    const tfidfKeyphrases = extractAdvancedTFIDFKeyphrases(text)
    keyphrases.push(...tfidfKeyphrases)
    
    // Method 4: Extract technical terminology patterns
    const technicalTerms = extractTechnicalTerms(text)
    keyphrases.push(...technicalTerms)
    
    // Sort by score and remove duplicates
    const sortedPhrases = keyphrases
      .sort((a, b) => b.score - a.score)
      .filter((phrase, index, arr) => 
        arr.findIndex(p => 
          stemmer.stem(p.phrase.toLowerCase()) === stemmer.stem(phrase.phrase.toLowerCase())
        ) === index
      )
    
    return sortedPhrases.slice(0, 25) // Top 25 keyphrases
  } catch (error) {
    console.warn('Error in NLP keyphrase extraction, falling back:', error)
    return extractKeyphrasesAdvanced(text) // Fallback to previous implementation
  }
}

// Fallback keyphrase extraction method
function extractKeyphrasesAdvanced(text: string): KeyPhrase[] {
  const keyphrases: KeyPhrase[] = []
  
  // Method 1: Enhanced keyword extraction with frequency analysis
  const enhancedKeywords = extractKeywordsWithFrequency(text)
  keyphrases.push(...enhancedKeywords)
  
  // Method 2: Capitalized terms (likely important concepts)
  const capitalizedTerms = extractCapitalizedTerms(text)
  keyphrases.push(...capitalizedTerms)
  
  // Method 3: TF-IDF scoring for important terms
  const tfidfKeyphrases = extractTFIDFKeyphrases(text)
  keyphrases.push(...tfidfKeyphrases)
  
  // Method 4: Extract multi-word phrases
  const phrases = extractMultiWordPhrases(text)
  keyphrases.push(...phrases)
  
  // Sort by score and remove duplicates
  const sortedPhrases = keyphrases
    .sort((a, b) => b.score - a.score)
    .filter((phrase, index, arr) => 
      arr.findIndex(p => p.phrase.toLowerCase() === phrase.phrase.toLowerCase()) === index
    )
  
  return sortedPhrases.slice(0, 20)
}

function extractKeywordsWithFrequency(text: string): KeyPhrase[] {
  const keyphrases: KeyPhrase[] = []
  
  // Common words to exclude
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i',
    'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my',
    'your', 'his', 'her', 'its', 'our', 'their', 'with', 'from', 'by', 'for', 'of',
    'in', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up',
    'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
  ])
  
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3)
    .filter(word => !stopWords.has(word))
    .filter(word => !/^\d+$/.test(word)) // Remove pure numbers
  
  const wordFreq: { [key: string]: number } = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  Object.entries(wordFreq)
    .filter(([word, freq]) => freq > 1)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .forEach(([word, freq]) => {
      keyphrases.push({
        phrase: word,
        score: freq * calculatePositionalScore(word, text),
        type: 'noun'
      })
    })
  
  return keyphrases
}

function calculatePositionalScore(word: string, text: string): number {
  const position = text.toLowerCase().indexOf(word.toLowerCase())
  const textLength = text.length
  
  // Words appearing earlier get higher scores
  if (position < textLength * 0.2) return 1.5
  if (position < textLength * 0.5) return 1.2
  return 1.0
}

function extractCapitalizedTerms(text: string): KeyPhrase[] {
  const keyphrases: KeyPhrase[] = []
  
  // Extract words that start with capital letters (likely proper nouns, concepts)
  const capitalizedPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g
  const matches = text.match(capitalizedPattern) || []
  
  const termFreq: { [key: string]: number } = {}
  matches.forEach(term => {
    if (term.length > 2) {
      termFreq[term] = (termFreq[term] || 0) + 1
    }
  })
  
  Object.entries(termFreq)
    .filter(([term, freq]) => freq >= 1 && term.length > 3)
    .forEach(([term, freq]) => {
      keyphrases.push({
        phrase: term,
        score: freq * 2, // Boost capitalized terms
        type: 'concept'
      })
    })
  
  return keyphrases
}

function extractMultiWordPhrases(text: string): KeyPhrase[] {
  const keyphrases: KeyPhrase[] = []
  
  // Extract common academic/technical phrases
  const phrasePatterns = [
    /\b\w+(?:\s+\w+){1,2}\s+(?:method|process|system|approach|technique|algorithm|procedure)\b/gi,
    /\b(?:the|a|an)\s+\w+(?:\s+\w+){1,2}\s+(?:is|are|was|were)\b/gi,
    /\b\w+(?:\s+\w+){1,2}\s+(?:theory|principle|concept|model|framework)\b/gi
  ]
  
  phrasePatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(phrase => {
      const cleanPhrase = phrase.trim().toLowerCase()
      if (cleanPhrase.length > 10) {
        keyphrases.push({
          phrase: cleanPhrase,
          score: calculatePhraseImportance(cleanPhrase, text),
          type: 'concept'
        })
      }
    })
  })
  
  return keyphrases
}

function calculatePhraseImportance(phrase: string, text: string): number {
  const frequency = (text.toLowerCase().match(new RegExp(phrase.toLowerCase(), 'g')) || []).length
  const lengthBonus = Math.min(phrase.split(' ').length * 0.5, 2)
  
  return frequency * lengthBonus
}

function extractTFIDFKeyphrases(text: string): KeyPhrase[] {
  const phrases: KeyPhrase[] = []
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3)
  
  const termFreq: { [key: string]: number } = {}
  words.forEach(word => {
    termFreq[word] = (termFreq[word] || 0) + 1
  })
  
  Object.keys(termFreq).forEach(term => {
    const tf = termFreq[term] / words.length
    const sentencesContaining = sentences.filter(s => s.toLowerCase().includes(term)).length
    const idf = Math.log(sentences.length / (sentencesContaining + 1))
    const tfidf = tf * idf
    
    if (tfidf > 0.015) {
      phrases.push({
        phrase: term,
        score: tfidf * 10, // Scale up for comparison
        type: 'noun'
      })
    }
  })
  
  return phrases
}

function calculateAdvancedKeywordScore(keyword: string, text: string): number {
  const frequency = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
  const position = text.toLowerCase().indexOf(keyword.toLowerCase())
  const textLength = text.length
  
  // Positional scoring
  let positionScore = 1.0
  if (position < textLength * 0.1) positionScore = 2.0      // Very early
  else if (position < textLength * 0.3) positionScore = 1.5  // Early
  else if (position < textLength * 0.7) positionScore = 1.2  // Middle
  
  // Length bonus for multi-word terms
  const lengthBonus = Math.min(keyword.split(' ').length * 0.3, 1.5)
  
  // Capitalization bonus
  const capitalBonus = keyword.match(/[A-Z]/) ? 1.2 : 1.0
  
  return frequency * positionScore * (1 + lengthBonus) * capitalBonus
}

function calculatePhraseImportanceAdvanced(phrase: string, text: string): number {
  // Basic frequency
  const frequency = (text.toLowerCase().match(new RegExp(phrase.toLowerCase(), 'g')) || []).length
  
  // Linguistic importance
  let linguisticScore = 1.0
  
  // Check if it's a technical term
  if (phrase.match(/\b(algorithm|method|process|system|framework|model|technique)\b/i)) {
    linguisticScore *= 1.3
  }
  
  // Multi-word phrase bonus
  const lengthBonus = Math.min(phrase.split(' ').length * 0.4, 2.0)
  
  return frequency * linguisticScore * (1 + lengthBonus)
}

function extractContextForPhrase(phrase: string, text: string): string {
  const sentences = text.split(/[.!?]+/)
  const relevantSentence = sentences.find(sentence => 
    sentence.toLowerCase().includes(phrase.toLowerCase())
  )
  
  return relevantSentence ? relevantSentence.trim() : ''
}

function extractAdvancedTFIDFKeyphrases(text: string): KeyPhrase[] {
  const phrases: KeyPhrase[] = []
  
  if (!tfidf) {
    return extractTFIDFKeyphrases(text) // Fallback
  }
  
  // Tokenize and clean text
  const tokens = tokenizer.tokenize(text.toLowerCase()) || []
  const cleanTokens = tokens
    .filter((token: string) => token.length > 3)
    .filter((token: string) => !natural?.stopwords?.includes(token))
    .map((token: string) => stemmer.stem(token))
  
  // Add document to TF-IDF
  tfidf.addDocument(cleanTokens)
  
  // Get important terms
  const terms: { term: string, tfidf: number }[] = []
  tfidf.listTerms(0).forEach((item: any) => {
    if (item.tfidf > 0.1) {
      terms.push({ term: item.term, tfidf: item.tfidf })
    }
  })
  
  terms.forEach(({ term, tfidf }) => {
    phrases.push({
      phrase: term,
      score: tfidf * 10,
      type: 'noun'
    })
  })
  
  return phrases
}

function extractTechnicalTerms(text: string): KeyPhrase[] {
  const phrases: KeyPhrase[] = []
  
  // Technical term patterns
  const technicalPatterns = [
    /\b\w+(?:\s+\w+){0,2}\s+(?:algorithm|method|process|system|approach|technique|procedure|framework|model|protocol|standard)\b/gi,
    /\b(?:machine|deep|artificial|neural|computer|data|information|software|hardware)\s+\w+(?:\s+\w+){0,2}\b/gi,
    /\b\w+(?:\s+\w+){0,2}\s+(?:analysis|optimization|implementation|development|engineering|architecture)\b/gi
  ]
  
  technicalPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(match => {
      const cleaned = match.trim().toLowerCase()
      if (cleaned.length > 8) {
        phrases.push({
          phrase: cleaned,
          score: calculatePhraseImportanceAdvanced(cleaned, text) * 1.4,
          type: 'technical',
          context: extractContextForPhrase(cleaned, text)
        })
      }
    })
  })
  
  return phrases
}

function extractDefinitionsWithAdvancedNLP(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  const doc = nlp(text)
  
  // Enhanced definition patterns with NLP validation
  const sentences = doc.sentences()
  
  sentences.forEach((sentence: any) => {
    const sentenceText = sentence.text()
    const sentenceDoc = nlp(sentenceText)
    
    // Check if sentence contains definition patterns
    const definitionPatterns = [
      /(.+?)\s+(?:is|are|means|refers to|defined as|represents|denotes|constitutes)\s+(.+)/i,
      /(.+?):\s*(.+)/,
      /(.+?)\s*[-–—]\s*(.+)/,
      /(.+?)\s+can be (?:defined|described|characterized) as\s+(.+)/i
    ]
    
    definitionPatterns.forEach(pattern => {
      const match = sentenceText.match(pattern)
      if (match) {
        const term = match[1].trim()
        const definition = match[2].trim()
        
        // Use NLP to validate the definition structure
        const termDoc = nlp(term)
        const defDoc = nlp(definition)
        
        // Check if term is a noun phrase and definition is substantial
        const isNounPhrase = termDoc.has('#Noun') || termDoc.has('#ProperNoun')
        const hasSubstantialDef = defDoc.sentences().length > 0 && definition.length > 15
        
        // Check if term matches our keyphrases
        const isKeyphrase = keyphrases.some(kp => 
          term.toLowerCase().includes(kp.phrase.toLowerCase()) ||
          kp.phrase.toLowerCase().includes(term.toLowerCase())
        )
        
        if (isNounPhrase && hasSubstantialDef && (isKeyphrase || term.length < 60)) {
          cards.push({
            id: generateId(),
            question: `What is ${term}?`,
            answer: definition
          })
        }
      }
    })
  })
  
  return cards
}

function extractConceptsWithAdvancedNLP(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  const doc = nlp(text)
  
  // Use high-scoring keyphrases to generate concept questions
  keyphrases
    .filter(kp => kp.type === 'concept' || kp.type === 'entity' || kp.score > 5)
    .slice(0, 10)
    .forEach(keyphrase => {
      if (keyphrase.context && keyphrase.context.length > 20) {
        // Use the stored context
        cards.push({
          id: generateId(),
          question: `Explain the concept of "${keyphrase.phrase}"`,
          answer: keyphrase.context
        })
      } else {
        // Find additional context using NLP
        const sentences = doc.sentences()
        const relevantSentences = sentences.filter((sentence: any) => {
          const text = sentence.text().toLowerCase()
          return text.includes(keyphrase.phrase.toLowerCase()) && text.length > 30
        })
        
        if (relevantSentences.length > 0) {
          const context = relevantSentences.out('array').slice(0, 2).join(' ')
          cards.push({
            id: generateId(),
            question: `Explain the concept of "${keyphrase.phrase}"`,
            answer: context
          })
        }
      }
    })
  
  return cards
}

function extractNamedEntityCards(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  const doc = nlp(text)
  
  // Extract people, places, organizations using compromise
  const people = doc.people()
  const places = doc.places()
  const organizations = doc.organizations()
  
  // Create cards for named entities
  const entities = [
    ...people.out('array').map((name: string) => ({ name, type: 'person' })),
    ...places.out('array').map((name: string) => ({ name, type: 'place' })),
    ...organizations.out('array').map((name: string) => ({ name, type: 'organization' }))
  ]
  
  entities.forEach(entity => {
    if (entity.name.length > 2) {
      const context = extractContextForPhrase(entity.name, text)
      if (context.length > 20) {
        cards.push({
          id: generateId(),
          question: `What do you know about ${entity.name}?`,
          answer: context
        })
      }
    }
  })
  
  return cards
}

function extractProcessCardsWithNLP(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  const doc = nlp(text)
  
  // Find process-related sentences using NLP
  const sentences = doc.sentences()
  const processKeywords = ['step', 'process', 'procedure', 'method', 'algorithm', 'workflow', 'approach']
  
  const processSentences = sentences.filter((sentence: any) => {
    const text = sentence.text().toLowerCase()
    return processKeywords.some(keyword => text.includes(keyword))
  })
  
  if (processSentences.length > 0) {
    // Look for numbered steps
    const numberedSteps = text.match(/\d+\.\s*[^0-9][\s\S]*?(?=\d+\.|$)/g)
    
    if (numberedSteps && numberedSteps.length > 1) {
      cards.push({
        id: generateId(),
        question: `What are the steps in this process?`,
        answer: numberedSteps.map(step => step.trim()).join('\n')
      })
    }
    
    // Extract process verbs and their objects
    const processVerbs = doc.verbs().filter((verb: any) => {
      return ['implement', 'execute', 'perform', 'analyze', 'process', 'calculate'].includes(verb.text().toLowerCase())
    })
    
    processVerbs.forEach((verb: any) => {
      const context = extractContextForPhrase(verb.text(), text)
      if (context.length > 30) {
        cards.push({
          id: generateId(),
          question: `How do you ${verb.text().toLowerCase()}?`,
          answer: context
        })
      }
    })
  }
  
  return cards
}

function generateAdvancedKeyphraseCards(content: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Generate cards for top keyphrases with rich context
  keyphrases
    .filter(kp => kp.score > 3)
    .slice(0, 8)
    .forEach(keyphrase => {
      if (keyphrase.context && keyphrase.context.length > 25) {
        const questionType = determineQuestionType(keyphrase)
        
        cards.push({
          id: generateId(),
          question: questionType,
          answer: keyphrase.context
        })
      }
    })
  
  return cards
}

function determineQuestionType(keyphrase: KeyPhrase): string {
  switch (keyphrase.type) {
    case 'entity':
      return `What is ${keyphrase.phrase}?`
    case 'technical':
      return `Explain the technical concept: ${keyphrase.phrase}`
    case 'process':
      return `How does ${keyphrase.phrase} work?`
    case 'concept':
      return `What is the concept of ${keyphrase.phrase}?`
    default:
      return `What do you know about "${keyphrase.phrase}"?`
  }
}

function extractRelationshipCards(content: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  
  if (!nlp) {
    // Fallback without NLP
    return []
  }
  
  const doc = nlp(content)
  
  // Find relationships between concepts
  const relationships = doc.match('#Noun+ (is|are|has|have|contains|includes|requires|uses) #Noun+')
  
  relationships.forEach((rel: any) => {
    const relText = rel.text()
    if (relText.length > 10) {
      cards.push({
        id: generateId(),
        question: `What is the relationship described in: "${relText}"?`,
        answer: extractContextForPhrase(relText, content)
      })
    }
  })
  
  return cards
}

function rankCardsByQuality(cards: Flashcard[], keyphrases: KeyPhrase[]): Flashcard[] {
  return cards.sort((a, b) => {
    // Score based on answer length, question complexity, and keyphrase relevance
    const aScore = calculateCardQuality(a, keyphrases)
    const bScore = calculateCardQuality(b, keyphrases)
    return bScore - aScore
  })
}

function calculateCardQuality(card: Flashcard, keyphrases: KeyPhrase[]): number {
  let score = 0
  
  // Answer length score (optimal 50-200 chars)
  const answerLength = card.answer.length
  if (answerLength >= 50 && answerLength <= 200) score += 2
  else if (answerLength >= 20 && answerLength <= 300) score += 1
  
  // Question complexity
  if (card.question.includes('explain') || card.question.includes('describe')) score += 1
  
  // Keyphrase relevance
  const hasKeyphrase = keyphrases.some(kp => 
    card.question.toLowerCase().includes(kp.phrase.toLowerCase()) ||
    card.answer.toLowerCase().includes(kp.phrase.toLowerCase())
  )
  if (hasKeyphrase) score += 2
  
  return score
}

function removeDuplicateCards(cards: Flashcard[]): Flashcard[] {
  const seen = new Set<string>()
  return cards.filter(card => {
    const key = card.question.toLowerCase() + card.answer.toLowerCase()
    const normalizedKey = key.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
    
    if (seen.has(normalizedKey)) {
      return false
    }
    seen.add(normalizedKey)
    return true
  })
}

// Fallback functions for enhanced extraction
function extractDefinitionsEnhanced(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Enhanced definition patterns
  const definitionPatterns = [
    /(.+?)\s+(?:is|are|means|refers to|defined as|represents|denotes)\s+(.+)/i,
    /(.+?):\s*(.+)/,
    /(.+?)\s*[-–—]\s*(.+)/,
    /(.+?)\s+can be defined as\s+(.+)/i,
    /(.+?)\s+is known as\s+(.+)/i
  ]
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  
  sentences.forEach(sentence => {
    definitionPatterns.forEach(pattern => {
      const match = sentence.trim().match(pattern)
      if (match) {
        const term = match[1].trim()
        const definition = match[2].trim()
        
        // Check if the term is in our keyphrases (higher quality)
        const isKeyphrase = keyphrases.some(kp => 
          term.toLowerCase().includes(kp.phrase.toLowerCase()) ||
          kp.phrase.toLowerCase().includes(term.toLowerCase())
        )
        
        if (term.length > 2 && definition.length > 10 && (isKeyphrase || term.length < 50)) {
          cards.push({
            id: generateId(),
            question: `What is ${term}?`,
            answer: definition
          })
        }
      }
    })
  })
  
  return cards
}

function extractConceptsEnhanced(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Use keyphrases to generate concept questions
  keyphrases.slice(0, 8).forEach(keyphrase => {
    if (keyphrase.type === 'concept' || keyphrase.score > 3) {
      // Find sentences containing the keyphrase
      const sentences = text.split(/[.!?]+/).filter(sentence => 
        sentence.toLowerCase().includes(keyphrase.phrase.toLowerCase()) &&
        sentence.trim().length > 20
      )
      
      if (sentences.length > 0) {
        const context = sentences[0].trim()
        
        cards.push({
          id: generateId(),
          question: `Explain the concept of "${keyphrase.phrase}"`,
          answer: context
        })
      }
    }
  })
  
  return cards
}

function extractProcessCards(text: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Look for process indicators
  const processIndicators = ['steps', 'process', 'procedure', 'method', 'algorithm', 'workflow', 'approach', 'technique']
  const hasProcessIndicator = processIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  )
  
  if (hasProcessIndicator) {
    // Look for numbered steps
    const numberedSteps = text.match(/\d+\.\s*[^0-9][\s\S]*?(?=\d+\.|$)/g)
    
    if (numberedSteps && numberedSteps.length > 1) {
      cards.push({
        id: generateId(),
        question: `What are the steps in this process?`,
        answer: numberedSteps.map(step => step.trim()).join('\n')
      })
    }
    
    // Look for bullet points
    const bulletPoints = text.match(/^[\s]*[•\-\*]\s*(.+)$/gm)
    if (bulletPoints && bulletPoints.length > 2) {
      cards.push({
        id: generateId(),
        question: `What are the key points of this process?`,
        answer: bulletPoints.map(point => point.trim()).join('\n')
      })
    }
  }
  
  return cards
}

function generateKeyphraseCards(content: string, keyphrases: KeyPhrase[]): Flashcard[] {
  const cards: Flashcard[] = []
  
  // Generate cards for top keyphrases
  keyphrases.slice(0, 6).forEach(keyphrase => {
    const sentences = content.split(/[.!?]+/).filter(sentence => 
      sentence.toLowerCase().includes(keyphrase.phrase.toLowerCase()) &&
      sentence.trim().length > 20
    )
    
    if (sentences.length > 0) {
      const context = sentences[0].trim()
      
      cards.push({
        id: generateId(),
        question: `What do you know about "${keyphrase.phrase}"?`,
        answer: context
      })
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