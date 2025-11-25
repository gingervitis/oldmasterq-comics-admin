import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Strip {
  id: string
  titleChinese: string
  titleEnglish: string | null
  yearRange: string
  format: number
  rating: number | null
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

interface StripTableProps {
  strips: Strip[]
}

export function StripTable({ strips }: StripTableProps) {
  const renderRating = (rating: number | null) => {
    if (rating === null) return <span className="text-muted-foreground">-</span>
    return '★'.repeat(rating)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Chinese Title</TableHead>
            <TableHead>English Title</TableHead>
            <TableHead>Year Range</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {strips.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No strips found
              </TableCell>
            </TableRow>
          ) : (
            strips.map((strip) => (
              <TableRow key={strip.id}>
                <TableCell>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {strip.id}
                  </code>
                </TableCell>
                <TableCell className="font-medium">{strip.titleChinese}</TableCell>
                <TableCell>
                  {strip.titleEnglish || (
                    <span className="text-muted-foreground italic">Not set</span>
                  )}
                </TableCell>
                <TableCell>{strip.yearRange}</TableCell>
                <TableCell>{strip.format} panels</TableCell>
                <TableCell className="text-base">{renderRating(strip.rating)}</TableCell>
                <TableCell>
                  {strip.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {strip.tags.slice(0, 3).map((t) => (
                        <Badge key={t.tag.id} variant="secondary">
                          {t.tag.name}
                        </Badge>
                      ))}
                      {strip.tags.length > 3 && (
                        <Badge variant="outline">
                          +{strip.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </TableCell>
                <TableCell>
                  {strip.publishedStrips.length > 0 ? (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild size="sm">
                    <Link href={`/strips/${strip.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
