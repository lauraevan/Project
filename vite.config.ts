import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, /api/tmdb is proxied to TMDB with the token added server-side,
// mirroring what api/tmdb.ts does on Vercel. The token never reaches the browser.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          rewrite: (url) => {
            const u = new URL(url, 'http://local')
            const path = u.searchParams.get('path') ?? ''
            u.searchParams.delete('path')
            const qs = u.searchParams.toString()
            return `/3${path}${qs ? `?${qs}` : ''}`
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              if (env.TMDB_TOKEN) req.setHeader('Authorization', `Bearer ${env.TMDB_TOKEN}`)
            })
          },
        },
      },
    },
  }
})
