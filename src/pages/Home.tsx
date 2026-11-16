import { useQuery } from '@tanstack/react-query'
import { list } from '../lib/tmdb'
import { useMyList, useRecent } from '../lib/store'
import { Hero } from '../components/Hero'
import { Row } from '../components/Rows'
import { Ambient, ErrorNotice } from '../components/Backdrop'

export function Home() {
  const probe = useQuery({ queryKey: ['hero'], queryFn: () => list('/trending/all/week') })
  const recent = useRecent()
  const myList = useMyList()

  if (probe.isError) return <ErrorNotice error={probe.error} />

  return (
    <>
      <Hero />
      <div className="rows">
        <Ambient />
        <Row title="Recently viewed" variant="wide" items={recent.items} eyebrow="Pick up where you left off" />
        <Row title="Top 10 this week" variant="top10" path="/trending/all/week" eyebrow="Trending" />
        <Row title="Popular films" variant="poster" path="/movie/popular" />
        <Row title="My List" variant="poster" items={myList.items} />
        <Row title="Top rated series" variant="wide" path="/tv/top_rated" eyebrow="Critically acclaimed" />
        <Row title="In theatres" variant="poster" path="/movie/now_playing" eyebrow="Now playing" />
        <Row title="On the air" variant="wide" path="/tv/on_the_air" eyebrow="New episodes" />
      </div>
    </>
  )
}
