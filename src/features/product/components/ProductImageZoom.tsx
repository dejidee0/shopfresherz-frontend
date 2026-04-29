'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent,
  type TouchEvent,
  type WheelEvent,
} from 'react'
import Image from 'next/image'
import { FiMaximize2, FiX, FiZoomIn, FiZoomOut, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'

interface ZoomImage {
  thumb: string
  display: string    // 540px — shown in main view
  zoom: string       // 1600px — lazy-loaded on hover/touch
  original: string   // Full res — loaded in lightbox
}

interface ProductImageZoomProps {
  images: ZoomImage[]
  productName: string
  isOutOfStock?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LENS_SIZE = 160        // px, per PRD spec
const PREVIEW_SIZE = 500     // px
const ZOOM_FACTOR = 2.5      // Hover lens magnification

const SCROLL_MIN = 1
const SCROLL_MAX = 3
const LIGHTBOX_MIN = 0.5
const LIGHTBOX_MAX = 5

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductImageZoom({ images, productName, isOutOfStock = false }: ProductImageZoomProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomImageLoaded, setZoomImageLoaded] = useState<Record<number, boolean>>({})

  // Hover lens state
  const [isHovering, setIsHovering] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })

  // Scroll zoom state (desktop)
  const [scrollZoom, setScrollZoom] = useState(1)
  const [scrollPanOffset, setScrollPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 })
  const [isLightboxDragging, setIsLightboxDragging] = useState(false)
  const lightboxDragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  // Touch state (mobile)
  const touchStartDist = useRef<number | null>(null)
  const touchStartZoom = useRef(1)
  const lastTap = useRef<number>(0)
  const [mobileZoom, setMobileZoom] = useState(1)
  const [mobilePan, setMobilePan] = useState({ x: 0, y: 0 })

  const mainRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  const activeImage = images[activeIndex]

  // ── Lazy-load zoom image on first hover/touch ────────────────────────────
  const loadZoomImage = useCallback(
    (index: number) => {
      if (zoomImageLoaded[index]) return
      const img = new window.Image()
      img.src = images[index].zoom
      img.onload = () => setZoomImageLoaded((prev) => ({ ...prev, [index]: true }))
    },
    [images, zoomImageLoaded]
  )

  // ── Hover lens (desktop only) ────────────────────────────────────────────
  function handleMouseEnter() {
    if (isOutOfStock) return
    setIsHovering(true)
    loadZoomImage(activeIndex)
  }

  function handleMouseLeave() {
    setIsHovering(false)
    setScrollZoom(1)
    setScrollPanOffset({ x: 0, y: 0 })
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!mainRef.current || scrollZoom > 1) return
    const rect = mainRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Clamp lens within image bounds
    const clampedX = Math.max(LENS_SIZE / 2, Math.min(rect.width - LENS_SIZE / 2, x))
    const clampedY = Math.max(LENS_SIZE / 2, Math.min(rect.height - LENS_SIZE / 2, y))

    setLensPos({ x: clampedX, y: clampedY })
  }

  // ── Scroll zoom (desktop) ─────────────────────────────────────────────────
  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    if (!isHovering) return
    e.preventDefault()
    setScrollZoom((prev) => {
      const next = prev - e.deltaY * 0.002
      return Math.min(SCROLL_MAX, Math.max(SCROLL_MIN, next))
    })
  }

  // ── Drag to pan when scroll-zoomed ───────────────────────────────────────
  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    if (scrollZoom <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: scrollPanOffset.x, panY: scrollPanOffset.y }
  }

  function handleMouseMoveGlobal(e: globalThis.MouseEvent) {
    if (!isDragging) return
    setScrollPanOffset({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveGlobal)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // ── Touch events (mobile pinch + double-tap) ──────────────────────────────
  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = getTouchDist(e)
      touchStartDist.current = dist
      touchStartZoom.current = mobileZoom
    } else if (e.touches.length === 1) {
      // Double-tap detection
      const now = Date.now()
      if (now - lastTap.current < 300) {
        // Double-tap: toggle 1x <-> 2.5x
        setMobileZoom((z) => (z > 1 ? 1 : ZOOM_FACTOR))
        setMobilePan({ x: 0, y: 0 })
        loadZoomImage(activeIndex)
      }
      lastTap.current = now
    }
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      const dist = getTouchDist(e)
      const scale = touchStartZoom.current * (dist / touchStartDist.current)
      setMobileZoom(Math.min(4, Math.max(1, scale)))
      if (scale > 1) loadZoomImage(activeIndex)
    }
  }

  function handleTouchEnd() {
    touchStartDist.current = null
  }

  function getTouchDist(e: TouchEvent<HTMLDivElement>) {
    const [t1, t2] = [e.touches[0], e.touches[1]]
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
  }

  // ── Lightbox ──────────────────────────────────────────────────────────────
  function openLightbox() {
    if (isOutOfStock) return
    setIsLightboxOpen(true)
    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
    loadZoomImage(activeIndex)
  }

  function closeLightbox() {
    setIsLightboxOpen(false)
    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
  }

  function lightboxZoomIn() {
    setLightboxZoom((z) => Math.min(LIGHTBOX_MAX, +(z + 0.5).toFixed(1)))
  }

  function lightboxZoomOut() {
    setLightboxZoom((z) => {
      const next = Math.max(LIGHTBOX_MIN, +(z - 0.5).toFixed(1))
      if (next <= 1) setLightboxPan({ x: 0, y: 0 })
      return next
    })
  }

  function lightboxWheel(e: WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    setLightboxZoom((z) => {
      const next = z - e.deltaY * 0.002
      return Math.min(LIGHTBOX_MAX, Math.max(LIGHTBOX_MIN, next))
    })
  }

  function lightboxMouseDown(e: MouseEvent<HTMLDivElement>) {
    if (lightboxZoom <= 1) return
    setIsLightboxDragging(true)
    lightboxDragStart.current = { x: e.clientX, y: e.clientY, panX: lightboxPan.x, panY: lightboxPan.y }
  }

  function lightboxMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!isLightboxDragging) return
    setLightboxPan({
      x: lightboxDragStart.current.panX + (e.clientX - lightboxDragStart.current.x),
      y: lightboxDragStart.current.panY + (e.clientY - lightboxDragStart.current.y),
    })
  }

  function lightboxMouseUp() {
    setIsLightboxDragging(false)
  }

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return
    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape': closeLightbox(); break
        case 'ArrowLeft': setActiveIndex((i) => (i - 1 + images.length) % images.length); break
        case 'ArrowRight': setActiveIndex((i) => (i + 1) % images.length); break
        case '+': lightboxZoomIn(); break
        case '-': lightboxZoomOut(); break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isLightboxOpen, images.length])

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isLightboxOpen])

  // Preload adjacent images after 3s on page (PRD spec)
  useEffect(() => {
    const timer = setTimeout(() => {
      const adjacent = [
        (activeIndex + 1) % images.length,
        (activeIndex - 1 + images.length) % images.length,
      ]
      adjacent.forEach((i) => {
        const img = new window.Image()
        img.src = images[i].display
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [activeIndex, images])

  // ── Preview lens position math ───────────────────────────────────────────
  const containerSize = 540
  const lensRatioX = (lensPos.x - LENS_SIZE / 2) / (containerSize - LENS_SIZE)
  const lensRatioY = (lensPos.y - LENS_SIZE / 2) / (containerSize - LENS_SIZE)
  const previewBgX = lensRatioX * (containerSize * ZOOM_FACTOR - PREVIEW_SIZE)
  const previewBgY = lensRatioY * (containerSize * ZOOM_FACTOR - PREVIEW_SIZE)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-3">

        {/* ── Main image + hover lens ── */}
        <div className="flex gap-5">
          <div
            ref={mainRef}
            className={cn(
              'relative rounded-card overflow-hidden bg-[#F5F5F5] shrink-0',
              'w-full max-w-135 aspect-square',
              isOutOfStock ? 'grayscale cursor-default' : 'cursor-crosshair'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={openLightbox}
          >
            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-card">
                <span className="bg-[#6B7280] text-white text-sm font-bold px-4 py-2 rounded-badge uppercase tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Main image with scroll/mobile zoom */}
            <Image
              src={
                (scrollZoom > 1 || mobileZoom > 1) && zoomImageLoaded[activeIndex]
                  ? activeImage.zoom
                  : activeImage.display
              }
              alt={`${productName} — image ${activeIndex + 1}`}
              fill
              sizes="540px"
              className="object-contain p-4 transition-transform duration-200 select-none"
              style={{
                transform: `scale(${Math.max(scrollZoom, mobileZoom)}) translate(${
                  scrollZoom > 1
                    ? `${scrollPanOffset.x / scrollZoom}px, ${scrollPanOffset.y / scrollZoom}px`
                    : `${mobilePan.x / mobileZoom}px, ${mobilePan.y / mobileZoom}px`
                })`,
                cursor: scrollZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
              }}
              priority
              draggable={false}
            />

            {/* Hover lens overlay */}
            {isHovering && !isOutOfStock && scrollZoom === 1 && (
              <div
                className="absolute pointer-events-none border-2 border-[#F5820A] bg-[#F5820A]/10 transition-opacity duration-150"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPos.x - LENS_SIZE / 2,
                  top: lensPos.y - LENS_SIZE / 2,
                }}
              />
            )}

            {/* Expand icon (appears on hover) */}
            {!isOutOfStock && (
              <button
                className={cn(
                  'absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center',
                  'text-[#6B7280] hover:text-[#F5820A] transition-all duration-200',
                  isHovering ? 'opacity-100' : 'opacity-0'
                )}
                onClick={(e) => { e.stopPropagation(); openLightbox() }}
                aria-label="View full screen"
              >
                <FiMaximize2 size={14} />
              </button>
            )}

            {/* Mobile zoom reset button */}
            {mobileZoom > 1 && (
              <button
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#F5820A] text-xs font-bold z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  setMobileZoom(1)
                  setMobilePan({ x: 0, y: 0 })
                }}
                aria-label="Reset zoom"
              >
                1:1
              </button>
            )}
          </div>

          {/* ── Zoom preview panel (desktop, right of image) ── */}
          {isHovering && !isOutOfStock && zoomImageLoaded[activeIndex] && scrollZoom === 1 && (
            <div
              className="hidden lg:block shrink-0 rounded-card overflow-hidden border border-[#E5E7EB] shadow-lg"
              style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
              aria-hidden="true"
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${activeImage.zoom})`,
                  backgroundSize: `${containerSize * ZOOM_FACTOR}px`,
                  backgroundPosition: `-${previewBgX}px -${previewBgY}px`,
                  backgroundRepeat: 'no-repeat',
                  imageRendering: 'crisp-edges',
                }}
              />
            </div>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Image ${i + 1}`}
              onClick={() => {
                setActiveIndex(i)
                setScrollZoom(1)
                setScrollPanOffset({ x: 0, y: 0 })
                setMobileZoom(1)
                setMobilePan({ x: 0, y: 0 })
              }}
              className={cn(
                'relative shrink-0 w-16 h-16 rounded border-2 overflow-hidden bg-[#F5F5F5] transition-all duration-150',
                i === activeIndex
                  ? 'border-[#F5820A] shadow-sm'
                  : 'border-[#E5E7EB] hover:border-[#F5820A]/50'
              )}
            >
              <Image
                src={img.thumb}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Lightbox modal ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-9999 bg-black/92 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom viewer"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox() }}
        >
          {/* Controls bar */}
          <div className="flex items-center justify-end gap-2 p-4 shrink-0">
            <button
              onClick={lightboxZoomIn}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F5820A] flex items-center justify-center transition-colors"
              aria-label="Zoom in"
            >
              <FiZoomIn size={16} />
            </button>
            <button
              onClick={lightboxZoomOut}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F5820A] flex items-center justify-center transition-colors"
              aria-label="Zoom out"
            >
              <FiZoomOut size={16} />
            </button>
            <button
              onClick={() => { setLightboxZoom(1); setLightboxPan({ x: 0, y: 0 }) }}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F5820A] flex items-center justify-center transition-colors"
              aria-label="Reset zoom"
            >
              <FiRefreshCw size={14} />
            </button>
            <button
              onClick={closeLightbox}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F5820A] flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Image area */}
          <div
            ref={lightboxRef}
            className="flex-1 flex items-center justify-center overflow-hidden relative"
            style={{ cursor: lightboxZoom > 1 ? (isLightboxDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            onWheel={lightboxWheel}
            onMouseDown={lightboxMouseDown}
            onMouseMove={lightboxMouseMove}
            onMouseUp={lightboxMouseUp}
            onMouseLeave={lightboxMouseUp}
          >
            <div
              style={{
                transform: `scale(${lightboxZoom}) translate(${lightboxPan.x / lightboxZoom}px, ${lightboxPan.y / lightboxZoom}px)`,
                transition: isLightboxDragging ? 'none' : 'transform 0.1s ease',
                maxWidth: '90vw',
                maxHeight: '90vh',
              }}
            >
              <Image
                src={activeImage.original}
                alt={`${productName} — full view`}
                width={900}
                height={900}
                className="object-contain max-w-[90vw] max-h-[80vh] select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-[#F5820A] flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-[#F5820A] flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          <div className="flex items-center justify-center gap-2 p-4 shrink-0">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); setLightboxZoom(1); setLightboxPan({ x: 0, y: 0 }) }}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  'relative w-12 h-12 rounded overflow-hidden bg-white/10 border-2 transition-all',
                  i === activeIndex ? 'border-[#F5820A]' : 'border-transparent hover:border-white/40'
                )}
              >
                <Image
                  src={img.thumb}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}