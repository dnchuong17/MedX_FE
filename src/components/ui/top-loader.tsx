"use client"
import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })

export function TopLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const minVisibleRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start loader after a short delay to avoid flicker
    timeoutRef.current = setTimeout(() => {
      NProgress.start()
      // Ensure loader is visible for at least 300ms
      minVisibleRef.current = setTimeout(() => {}, 300)
    }, 200)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Wait for min visible time before finishing
      if (minVisibleRef.current) {
        setTimeout(() => {
          NProgress.done()
        }, 300)
        clearTimeout(minVisibleRef.current)
      } else {
        NProgress.done()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()])

  return (
    <>
      <style
        jsx
        global
      >{`
        #nprogress .bar {
          background: #a259ff !important; /* purple */
        }
        #nprogress .peg {
          box-shadow: 0 0 10px #a259ff, 0 0 5px #a259ff !important;
        }
      `}</style>
    </>
  )
}
