'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface StripFiltersProps {
  currentFilters: {
    yearRange?: string
    format?: string
    rating?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }
}

export function StripFilters({ currentFilters }: StripFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilters.search || '')

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // Reset to first page on filter change
    router.push(`/strips?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilterChange('search', search)
  }

  const handleClearFilters = () => {
    setSearch('')
    router.push('/strips')
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4">
          <div>
            <Label htmlFor="yearRange">Year Range</Label>
            <select
              id="yearRange"
              value={currentFilters.yearRange || ''}
              onChange={(e) => handleFilterChange('yearRange', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">All</option>
              <option value="1962 - 1967">1962 - 1967</option>
              <option value="1968 - 1972">1968 - 1972</option>
              <option value="1973 - 1982">1973 - 1982</option>
              <option value="1983 - 1989">1983 - 1989</option>
            </select>
          </div>

          <div>
            <Label htmlFor="format">Format</Label>
            <select
              id="format"
              value={currentFilters.format || ''}
              onChange={(e) => handleFilterChange('format', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">All</option>
              <option value="4">4 panels</option>
              <option value="6">6 panels</option>
              <option value="8">8 panels</option>
              <option value="12">12 panels</option>
            </select>
          </div>

          <div>
            <Label htmlFor="rating">Rating</Label>
            <select
              id="rating"
              value={currentFilters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">All</option>
              <option value="null">Not rated</option>
              <option value="1">★ (1)</option>
              <option value="2">★★ (2)</option>
              <option value="3">★★★ (3)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <select
              id="sortBy"
              value={currentFilters.sortBy || 'id'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="id">ID</option>
              <option value="titleEnglish">Title</option>
              <option value="yearRange">Year Range</option>
              <option value="format">Format</option>
              <option value="rating">Rating</option>
              <option value="date">Last Modified</option>
            </select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <select
              id="sortOrder"
              value={currentFilters.sortOrder || 'asc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
