import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update only the tags for a source strip
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { tagIds } = body

    if (!Array.isArray(tagIds)) {
      return NextResponse.json(
        { error: 'tagIds must be an array' },
        { status: 400 }
      )
    }

    // Update only the tag relationships in a transaction
    await prisma.$transaction(async (tx) => {
      // Remove all existing tag relationships
      await tx.sourceStripTag.deleteMany({
        where: { sourceStripId: id },
      })

      // Add new tag relationships
      if (tagIds.length > 0) {
        await tx.sourceStripTag.createMany({
          data: tagIds.map((tagId: string) => ({
            sourceStripId: id,
            tagId,
          })),
        })
      }
    })

    // Fetch and return updated tags
    const updatedTags = await prisma.sourceStripTag.findMany({
      where: { sourceStripId: id },
      include: { tag: true },
    })

    return NextResponse.json({
      tags: updatedTags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    })
  } catch (error) {
    console.error('Error updating tags:', error)
    return NextResponse.json(
      { error: 'Failed to update tags' },
      { status: 500 }
    )
  }
}
