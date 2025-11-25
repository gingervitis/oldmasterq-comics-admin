import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { StripEditForm } from './StripEditForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Strip</h1>
          <p className="text-muted-foreground mt-2">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {strip.id}
            </code>
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/strips">Back to List</Link>
        </Button>
      </div>

      <StripEditForm strip={strip} allTags={allTags} />
    </div>
  )
}
