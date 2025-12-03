'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TagInput, Tag } from '@/components/TagInput'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { StripImagePreview } from './StripImagePreview'

const formSchema = z.object({
  titleChinese: z.string().min(1, 'Chinese title is required'),
  titleEnglish: z.string().optional(),
  rating: z.union([z.null(), z.number().int().min(0).max(3)]),
  altText: z.string().optional(),
  translation: z.string().optional(),
  topImageFileBase: z.string().min(1, 'Top image file is required'),
  bottomImageFileBase: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Strip {
  id: string
  yearRange: string
  titleChinese: string
  titleEnglish: string | null
  format: number
  rating: number | null
  altText: string | null
  translation: string | null
  topImageFileBase: string
  bottomImageFileBase: string | null
  tags: Array<{
    tag: {
      id: string
      name: string
    }
  }>
  publishedStrips: Array<{
    id: number
  }>
}

interface StripEditFormProps {
  strip: Strip
  allTags: Tag[]
}

export function StripEditForm({ strip, allTags }: StripEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    strip.tags.map((t) => t.tag)
  )
  const [isSavingTags, setIsSavingTags] = useState(false)

  // Auto-save tags when they change
  const handleTagsChange = async (newTags: Tag[]) => {
    setSelectedTags(newTags)
    setIsSavingTags(true)
    try {
      const response = await fetch(`/api/source-strips/${strip.id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagIds: newTags.map((t) => t.id),
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to save tags')
      }
    } catch (error) {
      console.error('Error saving tags:', error)
    } finally {
      setIsSavingTags(false)
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      titleChinese: strip.titleChinese,
      titleEnglish: strip.titleEnglish || '',
      rating: strip.rating,
      altText: strip.altText || '',
      translation: strip.translation || '',
      topImageFileBase: strip.topImageFileBase,
      bottomImageFileBase: strip.bottomImageFileBase || '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const tagIds = selectedTags.map((t) => t.id)
    console.log('Submitting form with tagIds:', tagIds)
    try {
      const response = await fetch(`/api/source-strips/${strip.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          titleEnglish: values.titleEnglish || null,
          altText: values.altText || null,
          translation: values.translation || null,
          bottomImageFileBase: values.bottomImageFileBase || null,
          tagIds: selectedTags.map((t) => t.id),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update strip')
      }

      router.refresh()
      alert('Strip updated successfully!')
    } catch (error) {
      console.error('Error updating strip:', error)
      alert('Failed to update strip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const createTag = async (name: string): Promise<Tag> => {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    // If tag already exists (409), find it in allTags
    if (response.status === 409) {
      const existing = allTags.find(
        (t) => t.name.toLowerCase() === name.toLowerCase()
      )
      if (existing) return existing
      throw new Error('Tag exists but not found')
    }

    if (!response.ok) {
      throw new Error('Failed to create tag')
    }
    return response.json()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-4">
      {/* Image Preview */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <StripImagePreview
          format={strip.format}
          topImageFileBase={strip.topImageFileBase}
          bottomImageFileBase={strip.bottomImageFileBase}
          alt={strip.titleChinese}
        />
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log('Form validation errors:', errors))} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value === null ? '' : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? null : Number(e.target.value)
                      )
                    }
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Not rated</option>
                    <option value="1">★ (1)</option>
                    <option value="2">★★ (2)</option>
                    <option value="3">★★★ (3)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="titleChinese"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chinese Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titleEnglish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Title (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Tags
              {isSavingTags && <span className="text-sm text-muted-foreground font-normal">Saving...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TagInput
              availableTags={allTags}
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              onCreateTag={createTag}
              placeholder="Search or create tags..."
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Accessible description of the strip..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="translation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Translation notes and context..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Publication Status</CardTitle>
          </CardHeader>
          <CardContent>
            {strip.publishedStrips.length > 0 ? (
              <div>
                <Badge className="bg-green-600 hover:bg-green-700">
                  Published
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  This strip has {strip.publishedStrips.length} published{' '}
                  {strip.publishedStrips.length === 1 ? 'version' : 'versions'}
                </p>
              </div>
            ) : (
              <div>
                <Badge variant="outline">Draft</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  This strip has not been published yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/strips')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => console.log('Submit button clicked, form values:', form.getValues(), 'form errors:', form.formState.errors)}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
    </div>
  )
}
