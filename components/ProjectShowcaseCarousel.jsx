'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, MonitorSmartphone, Smartphone, X } from 'lucide-react'
import ProjectStoreBadges from '@/components/StoreBadges'
import SaukiGoMark from '@/components/SaukiGoMark'

export default function ProjectShowcaseCarousel({ projects = [] }) {
  const trackRef = useRef(null)
  const lightboxRef = useRef(null)
  const pendingIndexRef = useRef(null)
  const settleTimerRef = useRef(null)
  const settledIndexRef = useRef(0)
  const isInitialRef = useRef(true)

  const [activeIndex, setActiveIndex] = useState(0)
  const [statusAnnouncement, setStatusAnnouncement] = useState('')
  const [lightboxMedia, setLightboxMedia] = useState(null)

  const slides = projects.slice(0, 6)
  const slideCount = slides.length

  const computeNearestIndex = useCallback(() => {
    const track = trackRef.current
    if (!track || !track.children.length) return 0
    const center = track.scrollLeft + track.clientWidth / 2
    let bestIdx = 0
    let bestDist = Infinity
    Array.from(track.children).forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(childCenter - center)
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = idx
      }
    })
    return bestIdx
  }, [])

  const scrollToSlide = useCallback(
    (targetIdx) => {
      const track = trackRef.current
      if (!track || !slideCount) return
      const wrapped = ((targetIdx % slideCount) + slideCount) % slideCount
      const targetEl = track.children[wrapped]
      if (!targetEl) return
      pendingIndexRef.current = wrapped
      setActiveIndex(wrapped)
      track.scrollTo({
        left: targetEl.offsetLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    },
    [slideCount]
  )

  const handleSettled = useCallback(() => {
    const idx = pendingIndexRef.current !== null ? pendingIndexRef.current : computeNearestIndex()
    pendingIndexRef.current = null
    setActiveIndex(idx)
    if (isInitialRef.current) {
      isInitialRef.current = false
      settledIndexRef.current = idx
      return
    }
    if (idx !== settledIndexRef.current) {
      settledIndexRef.current = idx
      const item = slides[idx]
      setStatusAnnouncement(`Slide ${idx + 1} of ${slideCount}: ${item?.title || 'Project'}`)
    }
  }, [computeNearestIndex, slideCount, slides])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let rafId = null
    const onScroll = () => {
      if (pendingIndexRef.current === null && rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null
          const nearest = computeNearestIndex()
          setActiveIndex((prev) => (prev === nearest ? prev : nearest))
        })
      }
      if (!('onscrollend' in window)) {
        clearTimeout(settleTimerRef.current)
        settleTimerRef.current = setTimeout(handleSettled, 130)
      }
    }

    const onScrollEnd = () => {
      handleSettled()
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    if ('onscrollend' in window) {
      track.addEventListener('scrollend', onScrollEnd)
    }

    return () => {
      track.removeEventListener('scroll', onScroll)
      if ('onscrollend' in window) {
        track.removeEventListener('scrollend', onScrollEnd)
      }
      if (rafId !== null) cancelAnimationFrame(rafId)
      clearTimeout(settleTimerRef.current)
    }
  }, [computeNearestIndex, handleSettled])

  useEffect(() => {
    const dialog = lightboxRef.current
    if (!dialog) return
    if (lightboxMedia && !dialog.open) {
      dialog.showModal()
    } else if (!lightboxMedia && dialog.open) {
      dialog.close()
    }
  }, [lightboxMedia])

  // Pointer-outside fallback for Safari where closedby="any" is unsupported
  useEffect(() => {
    const dialog = lightboxRef.current
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
    const outside = (e) => {
      const r = dialog.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }
    let pressedOutside = false
    const onDown = (e) => { pressedOutside = outside(e) }
    const onUp = (e) => {
      if (pressedOutside && outside(e)) {
        dialog.close()
        setLightboxMedia(null)
      }
    }
    dialog.addEventListener('pointerdown', onDown)
    dialog.addEventListener('pointerup', onUp)
    return () => {
      dialog.removeEventListener('pointerdown', onDown)
      dialog.removeEventListener('pointerup', onUp)
    }
  }, [])

  if (!slideCount) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Anjal Solutions LTD Featured Products and Case Studies"
      className="border-y border-slate-200 bg-slate-50 px-5 py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
              Flagship Showcase
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Production platforms & upcoming ecosystem.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Swipe or step through shipped mobile utilities, structured developer APIs, and upcoming commerce and logistics releases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex - 1)}
              aria-label="Previous project slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-900 shadow-2xs transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex + 1)}
              aria-label="Next project slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-900 shadow-2xs transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link
              href="/work"
              className="ml-2 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
            >
              View All Work
            </Link>
          </div>
        </div>

        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label="Project slides"
          className="carousel-track pb-2"
        >
          {slides.map((project, idx) => {
            const media = project.media || []
            const portrait = media.filter((m) => m.orientation === 'portrait').slice(0, 4)
            const primary = media.find((m) => m.is_primary) || media[0]
            const isApp = project.project_type === 'mobile-app'
            const isComingSoon = String(project.status || '').toUpperCase().includes('COMING')
            const isSaukiGo = String(project.slug || '').includes('sauki-go')
            const href = `/work/${project.slug || project.id}`

            return (
              <article
                key={project.id || project.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${slideCount}: ${project.title}`}
                className="carousel-slide overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                  {/* Visual Device Stage */}
                  <div className="relative flex flex-col justify-between bg-slate-950 p-6 text-white sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {isSaukiGo && <SaukiGoMark className="h-9 w-9 shrink-0" decorative />}
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-wider text-white/55">
                            {project.industry || project.project_type}
                          </p>
                          <p className="text-sm font-semibold text-white">{project.title}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          isComingSoon
                            ? 'border border-amber-400/40 bg-amber-400/15 text-amber-200'
                            : 'border border-emerald-400/40 bg-emerald-400/15 text-emerald-300'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isComingSoon ? 'bg-amber-300' : 'bg-emerald-400'
                          }`}
                        />
                        {project.status || 'LIVE'}
                      </span>
                    </div>

                    {isApp && portrait.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {portrait.map((shot, sIdx) => (
                          <button
                            key={shot.id || sIdx}
                            type="button"
                            onClick={() => setLightboxMedia(shot)}
                            aria-label={`Inspect ${shot.alt || project.title} screenshot`}
                            className="group relative aspect-[9/19] overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-lg transition hover:border-sky-400/70"
                          >
                            <img
                              src={shot.url}
                              alt={shot.alt || project.title}
                              width={240}
                              height={507}
                              loading={idx === 0 ? 'eager' : 'lazy'}
                              decoding="async"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white/80 opacity-0 transition group-hover:opacity-100">
                              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : primary?.url ? (
                      <button
                        type="button"
                        onClick={() => setLightboxMedia(primary)}
                        aria-label={`Inspect ${primary.alt || project.title} preview`}
                        className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-xl"
                      >
                        <img
                          src={primary.url}
                          alt={primary.alt || project.title}
                          width={800}
                          height={500}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
                        />
                        <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">
                          <Maximize2 className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </button>
                    ) : (
                      <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
                        {isApp ? (
                          <Smartphone className="mb-3 h-10 w-10 text-sky-400" aria-hidden="true" />
                        ) : (
                          <MonitorSmartphone className="mb-3 h-10 w-10 text-sky-400" aria-hidden="true" />
                        )}
                        <p className="text-sm font-semibold text-white">
                          {isComingSoon ? `${project.title} — Launching Soon` : project.title}
                        </p>
                        <p className="mt-1 max-w-sm text-xs text-white/55">
                          {project.summary || project.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Narrative & Outcomes */}
                  <div className="flex flex-col justify-between p-7 sm:p-9">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                          {isApp ? 'Mobile Platform' : 'Web & Cloud System'}
                        </span>
                        {(project.tags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 font-mono text-[11px] text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        {project.summary || project.description}
                      </p>

                      {Array.isArray(project.outcomes) && project.outcomes.length > 0 && (
                        <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                          {project.outcomes.slice(0, 3).map((outcome) => (
                            <li key={outcome} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
                      <ProjectStoreBadges
                        appStoreUrl={project.app_store_url}
                        playStoreUrl={project.play_store_url}
                      />

                      <div className="flex flex-wrap items-center gap-3">
                        {project.url && !isComingSoon && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:border-slate-950"
                          >
                            Visit Live
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        )}
                        <Link
                          href={href}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-700"
                        >
                          Read Case Study
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          {statusAnnouncement}
        </p>

        {/* Named Slide Markers */}
        <nav
          aria-label="Select featured project slide"
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {slides.map((project, idx) => {
            const active = activeIndex === idx
            return (
              <button
                key={project.id || project.slug}
                type="button"
                aria-current={active ? 'true' : undefined}
                aria-label={`Slide ${idx + 1} of ${slideCount}: ${project.title}`}
                onClick={() => scrollToSlide(idx)}
                className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-slate-950 bg-slate-950 text-white shadow-xs'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500 hover:text-slate-950'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    active ? 'bg-sky-400' : 'bg-slate-300'
                  }`}
                />
                <span>{project.title}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Native Accessible Lightbox Dialog */}
      <dialog
        ref={lightboxRef}
        closedby="any"
        aria-labelledby="lightbox-caption"
        onClose={() => {
          if (lightboxRef.current) lightboxRef.current.returnValue = ''
          setLightboxMedia(null)
        }}
        className="m-auto max-h-[90dvh] w-[min(92vw,760px)] overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 p-0 text-white shadow-2xl"
      >
        {lightboxMedia && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <p id="lightbox-caption" className="text-sm font-semibold text-white">
                {lightboxMedia.alt || 'Product Preview'}
              </p>
              <form method="dialog">
                <button
                  type="submit"
                  aria-label="Close preview"
                  onClick={() => setLightboxMedia(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/15"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
            <div className="flex max-h-[76dvh] items-center justify-center bg-slate-900 p-4">
              <img
                src={lightboxMedia.url}
                alt={lightboxMedia.alt || 'Product preview'}
                className="max-h-[70dvh] w-auto rounded-xl object-contain"
              />
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
