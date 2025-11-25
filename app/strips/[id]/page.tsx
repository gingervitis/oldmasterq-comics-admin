import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StripEditForm } from './StripEditForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function StripEditPage({ params }: PageProps) {
  const { id } = await params

  // Fetch the strip with its tags
  const strip = await prisma.sourceStrip.findUnique({
    where: { id },
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
  })

  if (!strip) {
    notFound()
  }

  // Fetch all available tags for the tag selector
  const allTags = await prisma.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Strip:  <span className="text-muted-foreground">{strip.id}</span></h1>
        <Button asChild variant="outline">
          <Link href="/strips">Back to List</Link>
        </Button>
      </div>

      <StripEditForm strip={strip} allTags={allTags} />
    </div>
  )
}
