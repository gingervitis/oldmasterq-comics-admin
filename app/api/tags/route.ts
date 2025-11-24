import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all tags with usage counts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    const where: any = {}

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            sourceStrips: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Format response with usage counts
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      usageCount: tag._count.sourceStrips,
      createdAt: tag.createdAt,
    }))

    return NextResponse.json(formattedTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: name.trim().toLowerCase() },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 409 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim().toLowerCase(),
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
