import { useQuery } from '@tanstack/react-query'
import { list } from '../lib/tmdb'
import { useMyList, useRecent } from '../lib/store'
import { HOME_SHELVES } from '../lib/shelves'
import { Hero } from '../components/Hero'
import { Row } from '../components/Rows'
import { ShelfList } from '../components/ShelfList'
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
        <Row title="My List" variant="poster" items={myList.items} />
        <ShelfList shelves={HOME_SHELVES} />
      </div>
    </>
  )
}
