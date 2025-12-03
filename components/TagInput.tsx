'use client'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'

export interface Tag {
  id: string
  name: string
}

interface TagInputProps {
  availableTags: Tag[]
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  onCreateTag?: (name: string) => Promise<Tag>
  placeholder?: string
}

export function TagInput({
  availableTags,
  selectedTags,
  onTagsChange,
  onCreateTag,
  placeholder = 'Type to search or add tags...',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter available tags based on input, excluding already selected
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  )

  // Check if exact match exists
  const exactMatch = availableTags.find(
    (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
  )
  const isExactMatchSelected = exactMatch
    ? selectedTags.some((t) => t.id === exactMatch.id)
    : false

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag])
    }
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId))
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (!inputValue.trim()) return

      // If there's a filtered tag, select the first one
      if (filteredTags.length > 0) {
        handleSelectTag(filteredTags[0])
        return
      }

      // If exact match exists and is already selected, do nothing
      if (exactMatch && isExactMatchSelected) {
        setInputValue('')
        return
      }

      // If exact match exists but not selected, select it
      if (exactMatch) {
        handleSelectTag(exactMatch)
        return
      }

      // Create new tag if onCreateTag is provided
      if (onCreateTag && inputValue.trim()) {
        setIsCreating(true)
        try {
          const newTag = await onCreateTag(inputValue.trim())
          onTagsChange([...selectedTags, newTag])
          setInputValue('')
          inputRef.current?.focus()
        } catch (error) {
          console.error('Failed to create tag:', error)
        } finally {
          setIsCreating(false)
        }
      }
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setInputValue('')
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => setShowSuggestions(false), 150)
  }

  const canCreateNew =
    onCreateTag &&
    inputValue.trim() &&
    !exactMatch &&
    filteredTags.length === 0

  return (
    <div className="relative">
      {/* Selected tags as pills */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="default"
            className="flex items-center gap-1 pr-1"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isCreating}
        />

        {/* Suggestions dropdown */}
        {showSuggestions && inputValue && (
          <div
            className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filteredTags.map((tag, index) => (
              <button
                key={tag.id}
                type="button"
                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent ${
                  index === 0 ? 'bg-accent/50' : ''
                }`}
                onClick={() => handleSelectTag(tag)}
              >
                {tag.name}
              </button>
            ))}

            {canCreateNew && (
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent text-muted-foreground border-t border-border"
                onClick={async () => {
                  if (onCreateTag) {
                    setIsCreating(true)
                    try {
                      const newTag = await onCreateTag(inputValue.trim())
                      onTagsChange([...selectedTags, newTag])
                      setInputValue('')
                      setShowSuggestions(false)
                    } catch (error) {
                      console.error('Failed to create tag:', error)
                    } finally {
                      setIsCreating(false)
                    }
                  }
                }}
              >
                Create &quot;{inputValue.trim()}&quot;
              </button>
            )}

            {filteredTags.length === 0 && !canCreateNew && inputValue && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No matching tags
              </div>
            )}
          </div>
        )}
      </div>

      {isCreating && (
        <p className="text-sm text-muted-foreground mt-1">Creating tag...</p>
      )}
    </div>
  )
}
