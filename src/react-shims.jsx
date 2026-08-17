// Tiny stand-ins for the React APIs preact core does not ship (they live in
// preact/compat, which we dropped to keep the initial bundle small). lazyLoad
// mirrors React.lazy + Suspense for our all-client-side routes, and
// useDeferredValue defers a value by one frame, which is all the search input
// needs.
import { useEffect, useState } from 'preact/hooks'

export function lazyLoad(factory) {
  let Component = null
  let pending = null
  return function Lazy(props) {
    const [, force] = useState(0)
    if (!Component) {
      if (!pending) {
        pending = factory()
          .then((mod) => { Component = mod.default || mod })
          .catch(() => { pending = null })
          .finally(() => force((n) => n + 1))
      }
      return null
    }
    return <Component {...props} />
  }
}

export function useDeferredValue(value) {
  const [deferred, setDeferred] = useState(value)
  useEffect(() => {
    const id = requestAnimationFrame(() => setDeferred(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  return deferred
}
