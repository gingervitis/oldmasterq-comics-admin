import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH rename tag
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // Check if new name already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: name.trim().toLowerCase() },
    })

    if (existingTag && existingTag.id !== id) {
      return NextResponse.json(
        { error: 'Tag name already exists' },
        { status: 409 }
      )
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: name.trim().toLowerCase(),
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

// DELETE tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if tag is in use
    const tagWithUsage = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            sourceStrips: true,
          },
        },
      },
    })

    if (!tagWithUsage) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    if (tagWithUsage._count.sourceStrips > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag. It is used by ${tagWithUsage._count.sourceStrips} source strip(s)`,
        },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
