# 📚 Flashcard App

A modern, intelligent flashcard application that automatically generates flashcards from your uploaded notes. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Intelligent Flashcard Generation**: Upload your notes and our smart algorithm automatically creates flashcards based on the content
- **Modern UI**: Beautiful, responsive design with smooth animations and transitions
- **File Upload**: Drag-and-drop or click to upload .txt and .md files
- **Note Management**: View, organize, and delete your uploaded notes
- **Deck Management**: Create, study, edit, and delete flashcard decks with confirmation dialogs
- **Interactive Study Mode**: Flip through flashcards with progress tracking
- **Local Storage**: All your data is stored locally in your browser
- **Multiple Analysis Strategies**: Extracts definitions, concepts, lists, and key information

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:5173`

### Try it with Sample Data

Want to test the app immediately? Upload the included `sample-notes.md` file to see how the flashcard generation works with various content types.

## 🎯 How to Use

### 1. Upload Notes
- Click the "Upload Notes" button in the header
- Drag and drop your .txt or .md files, or click to browse
- The app will automatically extract a title from your content

### 2. Generate Flashcards
- Go to the "Uploaded Notes" tab
- Click "Generate Flashcards" on any note
- The app will analyze your content and create relevant flashcards
- Generated flashcard decks will appear in the "Flashcard Decks" tab

### 3. Study with Flashcards
- Go to the "Flashcard Decks" tab
- Click "Study Deck" on any flashcard collection
- Use the navigation buttons or click the card to flip between questions and answers
- Track your progress with the built-in progress bar

### 4. Edit Your Flashcards
- Go to the "Flashcard Decks" tab
- Click "Edit Deck" on any flashcard collection
- Modify deck title and description
- Edit individual flashcard questions and answers
- Add new flashcards to existing decks
- Remove unwanted flashcards
- Save your changes

### 5. Manage Your Content
- **Delete Notes**: Click the trash icon on any note card to remove it
- **Delete Flashcard Decks**: Click the trash icon on any deck card to delete it (with confirmation)
- **View Notes**: Click "View Note" to read the full content of any uploaded note

## 🧠 Flashcard Generation Logic

The app uses multiple strategies to create meaningful flashcards:

1. **Definition Extraction**: Finds patterns like "Term: Definition" or "Term - Definition"
2. **Concept Analysis**: Identifies explanatory sentences with keywords like "is", "means", "refers to"
3. **List Processing**: Converts bulleted or numbered lists into flashcards
4. **General Q&A**: Creates general questions and answers from content sections

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: Browser localStorage

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Navigation.tsx   # Tab navigation
│   ├── FlashcardDecks.tsx  # Deck management
│   ├── FlashcardViewer.tsx # Study interface
│   ├── FlashcardEditor.tsx # Edit flashcards
│   ├── UploadedNotes.tsx   # Note management
│   └── UploadModal.tsx     # File upload
├── utils/               # Utility functions
│   ├── storage.ts       # localStorage operations
│   └── flashcardGenerator.ts # AI logic for flashcards
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Flashcard Generation Strategies

Edit `src/utils/flashcardGenerator.ts` to add new analysis patterns:

```typescript
function newStrategy(text: string): Flashcard[] {
  // Your custom logic here
  return cards
}
```

### Styling

The app uses Tailwind CSS with custom components defined in `src/index.css`. Modify the `@layer components` section to customize the design.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Known Issues

- Large files (>10MB) may cause performance issues
- Some special characters in notes might not be processed correctly
- Flashcard generation works best with well-structured content

## 🚀 Future Enhancements

- [ ] Cloud storage integration
- [ ] Spaced repetition algorithm  
- [ ] Export flashcards to various formats
- [ ] Collaborative flashcard sharing
- [ ] Mobile app version
- [ ] AI-powered difficulty assessment
- [ ] Bulk card operations (select multiple cards)
- [ ] Card templates and themes
- [ ] Study statistics and progress tracking

---