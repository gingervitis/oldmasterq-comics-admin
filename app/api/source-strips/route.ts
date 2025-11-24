import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const yearRange = searchParams.get('yearRange')
    const format = searchParams.get('format')
    const rating = searchParams.get('rating')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const search = searchParams.get('search')

    // Build where clause for filtering
    const where: any = {}

    if (yearRange) {
      where.yearRange = yearRange
    }

    if (format) {
      where.format = parseInt(format)
    }

    if (rating) {
      where.rating = rating === 'null' ? null : parseInt(rating)
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { titleChinese: { contains: search, mode: 'insensitive' } },
        { titleEnglish: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: {
              in: tags
            }
          }
        }
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Fetch data with pagination
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

    // Format response
    const formattedStrips = strips.map((strip) => ({
      ...strip,
      tags: strip.tags.map((t) => t.tag.name),
      hasPublished: strip.publishedStrips.length > 0,
      publishedStrips: undefined, // Remove from response
    }))

    return NextResponse.json({
      data: formattedStrips,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching source strips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch source strips' },
      { status: 500 }
    )
  }
}
