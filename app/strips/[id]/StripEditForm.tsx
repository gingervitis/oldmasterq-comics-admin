'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getStripImageUrl } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  yearRange: z.string().min(1, 'Year range is required'),
  titleChinese: z.string().min(1, 'Chinese title is required'),
  titleEnglish: z.string().optional(),
  format: z.coerce.number().int().min(4).max(12),
  rating: z.coerce.number().int().min(0).max(3).nullable(),
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

interface Tag {
  id: string
  name: string
}

interface StripEditFormProps {
  strip: Strip
  allTags: Tag[]
}

export function StripEditForm({ strip, allTags }: StripEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(
    strip.tags.map((t) => t.tag.id)
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearRange: strip.yearRange,
      titleChinese: strip.titleChinese,
      titleEnglish: strip.titleEnglish || '',
      format: strip.format,
      rating: strip.rating,
      altText: strip.altText || '',
      translation: strip.translation || '',
      topImageFileBase: strip.topImageFileBase,
      bottomImageFileBase: strip.bottomImageFileBase || '',
    },
  })

  // Construct image URL
  const imageUrl = getStripImageUrl(strip.topImageFileBase)

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
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
          tagIds: selectedTags,
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

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-4">
      {/* Image Preview */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <Card>
          <CardContent>
            <div className="relative w-full bg-muted  overflow-hidden">
              <img
                src={imageUrl}
                alt={strip.titleChinese}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533"%3E%3Crect width="400" height="533" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EImage not found%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="yearRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Range</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="1962 - 1967">1962 - 1967</option>
                        <option value="1968 - 1972">1968 - 1972</option>
                        <option value="1973 - 1982">1973 - 1982</option>
                        <option value="1983 - 1989">1983 - 1989</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="4">4 panels</option>
                        <option value="6">6 panels</option>
                        <option value="8">8 panels</option>
                        <option value="12">12 panels</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topImageFileBase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top Image File</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Source image filename for the main strip
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bottomImageFileBase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bottom Image File (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Additional bottom image for multi-part strips
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
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
                  <FormDescription>
                    Text description for accessibility
                  </FormDescription>
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
                  <FormDescription>
                    Notes about translation or cultural context
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            {allTags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No tags available. Create tags first.
              </p>
            )}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
    </div>
  )
}
