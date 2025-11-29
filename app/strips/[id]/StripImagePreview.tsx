'use client'

import { Card, CardContent } from '@/components/ui/card'
import { getStripImageUrl } from '@/lib/constants'

interface StripImagePreviewProps {
  format: number
  topImageFileBase: string
  bottomImageFileBase: string | null
  alt: string
}

const fallbackImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533"%3E%3Crect width="400" height="533" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EImage not found%3C/text%3E%3C/svg%3E'

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.target as HTMLImageElement
  target.src = fallbackImage
}

const topHalfHeight = '560px';
const bottomHalfHeight = '285px';

export function StripImagePreview({
  format,
  topImageFileBase,
  bottomImageFileBase,
  alt,
}: StripImagePreviewProps) {
  const topImageUrl = getStripImageUrl(topImageFileBase)
  const bottomImageUrl = bottomImageFileBase
    ? getStripImageUrl(bottomImageFileBase)
    : null


  // Format 4: Show cropped portions
  if (format === 4) {
    if (bottomImageUrl) {
      // Bottom 40% of top image + bottom 40% of bottom image
      return (
        <Card>
          <CardContent>
            <div className="relative w-full bg-muted overflow-hidden flex flex-col">
              {/* Bottom 40% of top image */}
              <div className="relative w-full overflow-hidden" style={{ height: bottomHalfHeight}}>
                <img
                  src={topImageUrl}
                  alt={`${alt} (top)`}
                  className="absolute w-full object-cover object-bottom bottom-0"
                  onError={handleImageError}
                />
              </div>
              {/* Bottom 40% of bottom image */}
              <div className="relative w-full overflow-hidden" style={{ height: bottomHalfHeight}}>
                <img
                  src={bottomImageUrl}
                  alt={`${alt} (bottom)`}
                  className="absolute w-full object-cover object-bottom bottom-0"
                  onError={handleImageError}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else {
      // Top 60% of top image only
      return (
        <Card>
          <CardContent>
            <div className="relative w-full bg-muted overflow-hidden">
              <div className="relative w-full overflow-hidden" style={{ height: topHalfHeight}}>
                <img
                  src={topImageUrl}
                  alt={alt}
                  className="absolute w-full object-cover object-top top-0"
                  onError={handleImageError}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  // Format 8: Top 60% of each image stacked
  if (format === 8) {
    return (
      <Card>
        <CardContent>
          <div className="relative w-full bg-muted overflow-hidden flex flex-col">
            {/* Top 60% of top image */}
            <div className="relative w-full overflow-hidden"  style={{ height: topHalfHeight}}>
              <img
                src={topImageUrl}
                alt={`${alt} (top)`}
                className="absolute w-full object-cover object-top top-0"
                onError={handleImageError}
              />
            </div>
            {/* Top 60% of bottom image (if exists) */}
            {bottomImageUrl && (
              <div className="relative w-full overflow-hidden" style={{ height: topHalfHeight}}>
                <img
                  src={bottomImageUrl}
                  alt={`${alt} (bottom)`}
                  className="absolute w-full object-cover object-top top-0"
                  onError={handleImageError}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  } 

  // Default fallback (format 12 or other): show full top image
  return (
    <Card>
      <CardContent>
        <div className="relative w-full bg-muted overflow-hidden">
          <img
            src={topImageUrl}
            alt={alt}
            className="w-full h-full object-contain"
            onError={handleImageError}
          />
        </div>
      </CardContent>
    </Card>
  )
}
