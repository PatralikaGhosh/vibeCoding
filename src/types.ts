export interface Note {
  id: string;
  title: string;
  content: string;
  fileName: string;
  uploadDate: Date;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdFromNote: string; // Note ID
  createdDate: Date;
}

export type Tab = 'flashcard-decks' | 'uploaded-notes'; 