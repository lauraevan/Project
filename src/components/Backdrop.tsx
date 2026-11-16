// Slowly drifting colored light behind the content: the "ambient" layer that gives Liquid Glass something to refract.
export function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
    </div>
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
          host&apos;s environment variables, then restart.
        </p>
      )}
    </div>
  )
}
