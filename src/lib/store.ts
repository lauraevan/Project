// Tiny localStorage-backed stores for "My List" and "Recently viewed".
import { useSyncExternalStore } from 'react'
import { typeOf, type Item } from './tmdb'

function createStore(key: string, max: number) {
  const load = (): Item[] => {
    try {
      const v = JSON.parse(localStorage.getItem(key) ?? '[]')
      return Array.isArray(v) ? v : []
    } catch {
      return []
    }
  }
  let state = load()
  const subs = new Set<() => void>()
  return {
    get: () => state,
    subscribe: (fn: () => void) => {
      subs.add(fn)
      return () => {
        subs.delete(fn)
      }
    },
    set(next: Item[]) {
      state = next.slice(0, max)
      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch {
        /* storage unavailable: keep in memory */
      }
      subs.forEach((fn) => fn())
    },
  }
}

const slim = (i: Item): Item => ({
  id: i.id,
  media_type: typeOf(i),
  title: i.title,
  name: i.name,
  overview: '',
  backdrop_path: i.backdrop_path,
  poster_path: i.poster_path,
  vote_average: i.vote_average,
  release_date: i.release_date,
  first_air_date: i.first_air_date,
})
const same = (a: Item, b: Item) => a.id === b.id && typeOf(a) === typeOf(b)

const myList = createStore('lumen:list', 200)
const recent = createStore('lumen:recent', 20)

export function useMyList() {
  const items = useSyncExternalStore(myList.subscribe, myList.get)
  return {
    items,
    has: (i: Item) => items.some((x) => same(x, i)),
    toggle: (i: Item) =>
      myList.set(items.some((x) => same(x, i)) ? items.filter((x) => !same(x, i)) : [slim(i), ...items]),
  }
}

export function useRecent() {
  const items = useSyncExternalStore(recent.subscribe, recent.get)
  return {
    items,
    push: (i: Item) => {
      const cur = recent.get()
      if (cur[0] && same(cur[0], i)) return
      recent.set([slim(i), ...cur.filter((x) => !same(x, i))])
    },
  }
}
