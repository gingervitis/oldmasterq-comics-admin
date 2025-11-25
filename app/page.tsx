import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Old Master Q Comics Admin</h1>
      <p style={{ color: '#666', marginBottom: '3rem' }}>
        Admin interface for managing comic strips.
      </p>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <Link
          href="/strips"
          style={{
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            textDecoration: 'none',
            backgroundColor: 'white',
            transition: 'box-shadow 0.2s',
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Source Strips</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Browse, filter, and manage comic strip source images
          </p>
        </Link>

        <div
          style={{
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            opacity: 0.6,
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Published Strips</h2>
          <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
            Manage published website strips (coming soon)
          </p>
        </div>

        <div
          style={{
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            opacity: 0.6,
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Tags</h2>
          <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
            Manage tags and bulk operations (coming soon)
          </p>
        </div>

        <Link
          href="/test"
          style={{
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            textDecoration: 'none',
            backgroundColor: 'white',
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Database Test</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            View database connection test page
          </p>
        </Link>
      </div>
    </main>
  )
}
