import { useState, useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { Note } from '../types'

interface UploadModalProps {
  onUpload: (note: Note) => void
  onClose: () => void
}

export default function UploadModal({ onUpload, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      alert('Please upload a text file (.txt or .md)')
      return
    }

    setUploading(true)

    try {
      const content = await file.text()
      const note: Note = {
        id: generateId(),
        title: extractTitleFromContent(content) || file.name.replace(/\.[^/.]+$/, ''),
        content,
        fileName: file.name,
        uploadDate: new Date()
      }

      onUpload(note)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Error reading file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const extractTitleFromContent = (content: string): string | null => {
    // Try to extract title from first line or markdown header
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length === 0) return null

    const firstLine = lines[0].trim()
    
    // Check for markdown header
    if (firstLine.startsWith('#')) {
      return firstLine.replace(/^#+\s*/, '')
    }
    
    // Use first line if it's short and looks like a title
    if (firstLine.length <= 100 && !firstLine.includes('.')) {
      return firstLine
    }
    
    return null
  }

  const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Notes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,text/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-600">Processing your notes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <FileText className="h-full w-full" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your notes here
                  </p>
                  <p className="text-gray-500">or click to browse</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Choose File</span>
                </button>
                <p className="text-sm text-gray-500">
                  Supports .txt and .md files
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 