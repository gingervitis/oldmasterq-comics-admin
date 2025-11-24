import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single source strip by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const strip = await prisma.sourceStrip.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        publishedStrips: true,
      },
    })

    if (!strip) {
      return NextResponse.json(
        { error: 'Source strip not found' },
        { status: 404 }
      )
    }

    // Format response
    const formattedStrip = {
      ...strip,
      tags: strip.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    }

    return NextResponse.json(formattedStrip)
  } catch (error) {
    console.error('Error fetching source strip:', error)
    return NextResponse.json(
      { error: 'Failed to fetch source strip' },
      { status: 500 }
    )
  }
}

// PATCH update source strip
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      titleChinese,
      titleEnglish,
      format,
      yearRange,
      topImageFileBase,
      bottomImageFileBase,
      altText,
      translation,
      rating,
      tags, // Array of tag names
    } = body

    // Start a transaction to update strip and tags
    const updatedStrip = await prisma.$transaction(async (tx) => {
      // Update the strip
      const strip = await tx.sourceStrip.update({
        where: { id: params.id },
        data: {
          titleChinese,
          titleEnglish,
          format,
          yearRange,
          topImageFileBase,
          bottomImageFileBase,
          altText,
          translation,
          rating: rating === null ? null : parseInt(rating),
        },
      })

      // Handle tags if provided
      if (tags !== undefined) {
        // Remove all existing tag relationships
        await tx.sourceStripTag.deleteMany({
          where: { sourceStripId: params.id },
        })

        // Add new tag relationships
        if (tags.length > 0) {
          // Ensure all tags exist, create if not
          const tagRecords = await Promise.all(
            tags.map(async (tagName: string) => {
              return tx.tag.upsert({
                where: { name: tagName },
                create: { name: tagName },
                update: {},
              })
            })
          )

          // Create relationships
          await tx.sourceStripTag.createMany({
            data: tagRecords.map((tag) => ({
              sourceStripId: params.id,
              tagId: tag.id,
            })),
          })
        }
      }

      // Fetch and return updated strip with tags
      return tx.sourceStrip.findUnique({
        where: { id: params.id },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          publishedStrips: true,
        },
      })
    })

    // Format response
    const formattedStrip = {
      ...updatedStrip,
      tags: updatedStrip!.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    }

    return NextResponse.json(formattedStrip)
  } catch (error) {
    console.error('Error updating source strip:', error)
    return NextResponse.json(
      { error: 'Failed to update source strip' },
      { status: 500 }
    )
  }
}

// DELETE source strip
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if strip has published versions
    const strip = await prisma.sourceStrip.findUnique({
      where: { id: params.id },
      include: {
        publishedStrips: true,
      },
    })

    if (!strip) {
      return NextResponse.json(
        { error: 'Source strip not found' },
        { status: 404 }
      )
    }

    if (strip.publishedStrips.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete source strip with published versions' },
        { status: 400 }
      )
    }

    // Delete the strip (tags will cascade delete via onDelete: Cascade)
    await prisma.sourceStrip.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Source strip deleted successfully' })
  } catch (error) {
    console.error('Error deleting source strip:', error)
    return NextResponse.json(
      { error: 'Failed to delete source strip' },
      { status: 500 }
    )
  }
}
