// Tiny stand-ins for the React APIs preact core does not ship (they live in
// preact/compat, which we dropped to keep the initial bundle small). lazyLoad
// mirrors React.lazy + Suspense for our all-client-side routes, and
// useDeferredValue defers a value by one frame, which is all the search input
// needs.
import { useEffect, useState } from 'preact/hooks'

// Registry consulted by lazyLoad so the SSR pass (and the client boot, which
// preloads the current route) can supply the resolved component and render it
// on the first paint instead of a null placeholder. It lives on globalThis so
// the SSR bundle cannot end up with two copies of this module (one registering,
// one reading) under different bundling conditions.
const routeRegistry = globalThis.__dbwRouteRegistry || (globalThis.__dbwRouteRegistry = new Map())

export function registerRoute(loader, Component) {
  routeRegistry.set(loader, Component)
}

export function lazyLoad(factory) {
  let pending = null
  return function Lazy(props) {
    // Checked at render time: the SSR pass registers routes after main.jsx's
    // module body has run, so a creation-time lookup would always miss.
    let Component = routeRegistry.get(factory) || null
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
