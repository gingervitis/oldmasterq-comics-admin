import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StripFilters } from './StripFilters'
import { StripTable } from './StripTable'

interface SearchParams {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
  yearRange?: string
  format?: string
  rating?: string
  search?: string
}

export default async function StripsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Parse search params
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = parseInt(params.limit || '50')
  const sortBy = params.sortBy || 'id'
  const sortOrder = params.sortOrder || 'asc'
  const yearRange = params.yearRange
  const format = params.format
  const rating = params.rating
  const search = params.search

  // Build where clause
  const where: any = {}
  if (yearRange) where.yearRange = yearRange
  if (format) where.format = parseInt(format)
  if (rating) where.rating = rating === 'null' ? null : parseInt(rating)
  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { titleChinese: { contains: search, mode: 'insensitive' } },
      { titleEnglish: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Calculate pagination
  const skip = (page - 1) * limit
  const orderBy: any = {}
  orderBy[sortBy] = sortOrder

  // Fetch data
  const [strips, total] = await Promise.all([
    prisma.sourceStrip.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        publishedStrips: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.sourceStrip.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Source Strips</h1>
        <p className="text-muted-foreground mt-2">
          {total} total strips
        </p>
      </div>

      <StripFilters
        currentFilters={{
          yearRange,
          format,
          rating,
          search,
          sortBy,
          sortOrder,
        }}
      />

      <StripTable strips={strips} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 ? (
            <Button asChild variant="outline">
              <Link href={`/strips?page=${page - 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`}>
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Previous
            </Button>
          )}

          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Button asChild variant="outline">
              <Link href={`/strips?page=${page + 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`}>
                Next
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
