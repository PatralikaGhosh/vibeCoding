import { BookOpen, FileText } from 'lucide-react'
import { Tab } from '../types'

interface NavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    {
      id: 'flashcard-decks' as Tab,
      name: 'Flashcard Decks',
      icon: BookOpen,
      description: 'View and manage your flashcard collections'
    },
    {
      id: 'uploaded-notes' as Tab,
      name: 'Uploaded Notes',
      icon: FileText,
      description: 'Manage your uploaded notes'
    }
  ]

  return (
    <nav className="border-b border-gray-200">
      <div className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
} 