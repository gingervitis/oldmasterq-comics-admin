import { prisma } from '@/lib/prisma'

export default async function TestPage() {
  const sourceStrips = await prisma.sourceStrip.findMany({
    include: {
      publishedStrips: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Database Connection Test</h1>

      <h2>Source Strips: {sourceStrips.length}</h2>

      {sourceStrips.map((strip) => (
        <div key={strip.id} style={{
          border: '1px solid #ccc',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          <p><strong>ID:</strong> {strip.id}</p>
          <p><strong>Year Range:</strong> {strip.yearRange}</p>
          <p><strong>Chinese Title:</strong> {strip.titleChinese}</p>
          <p><strong>English Title:</strong> {strip.titleEnglish || 'N/A'}</p>
          <p><strong>Format:</strong> {strip.format} panels</p>
          <p><strong>Rating:</strong> {strip.rating ?? 'Not rated'}</p>
          <p><strong>Tags:</strong> {strip.tags.map(t => t.tag.name).join(', ') || 'None'}</p>
          <p><strong>Published versions:</strong> {strip.publishedStrips.length}</p>
          {strip.altText && (
            <p><strong>Alt Text:</strong> {strip.altText}</p>
          )}
        </div>
      ))}
    </main>
  )
}
