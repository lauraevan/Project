// Slowly drifting colored light behind the content: the "ambient" layer of the Liquid Glass look.
export function Ambient() {
  return (
    <>
      <div
        className="orb1"
        style={{
          position: 'absolute', left: '46%', top: -140, width: 860, height: 860, borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, var(--glow), transparent 66%)', opacity: 0.55, pointerEvents: 'none',
        }}
      />
      <div
        className="orb2"
        style={{
          position: 'absolute', left: -180, top: 380, width: 760, height: 760, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, #1f6fff, transparent 64%)', opacity: 0.4, pointerEvents: 'none',
        }}
      />
    </>
  )
}

export function ErrorNotice({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : 'Something went wrong.'
  const needsToken = /TMDB_TOKEN|401|Invalid API key/i.test(msg)
  return (
    <div className="notice">
      <h2>Couldn&apos;t load this page</h2>
      <p>{msg}</p>
      {needsToken && (
        <p>
          Set <code>TMDB_TOKEN</code> in a local <code>.env</code> file (see <code>.env.example</code>) or in your
          Vercel project&apos;s environment variables, then restart.
        </p>
      )}
    </div>
  )
}
