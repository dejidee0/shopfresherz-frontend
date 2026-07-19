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
import { AnimatePresence, motion } from 'framer-motion'
import { FiCamera, FiMaximize2, FiX, FiZoomIn, FiZoomOut, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils/format'
import { useParallaxTilt } from '@/lib/hooks/useParallaxTilt'
import { useHasHover } from '@/lib/hooks/useHasHover'

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
const FALLBACK_IMAGE = '/images/device-placeholder.jpg'

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductImageZoom({ images, productName, isOutOfStock = false }: ProductImageZoomProps) {
  const hasProvidedImages = images.length > 0
  const productImages = images.length > 0
    ? images
    : [{
        thumb: FALLBACK_IMAGE,
        display: FALLBACK_IMAGE,
        zoom: FALLBACK_IMAGE,
        original: FALLBACK_IMAGE,
      }]

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

  // ── Parallax tilt (desktop cursor / mobile gyroscope) ────────────────────
  // Suspended while any zoom or the lightbox is active so the tilt never
  // fights the zoom/pan transforms.
  const hasHover = useHasHover()
  const tiltDisabledRef = useRef(false)
  tiltDisabledRef.current = scrollZoom > 1 || mobileZoom > 1 || isLightboxOpen
  const tilt = useParallaxTilt<HTMLDivElement>({ maxTiltMouse: 5, maxTiltGyro: 6, disabledRef: tiltDisabledRef })

  const activeImage = productImages[activeIndex] ?? productImages[0]

  // ── Lazy-load zoom image on first hover/touch ────────────────────────────
  const loadZoomImage = useCallback(
    (index: number) => {
      if (zoomImageLoaded[index]) return
      const img = new window.Image()
      img.src = productImages[index]?.zoom ?? FALLBACK_IMAGE
      img.onload = () => setZoomImageLoaded((prev) => ({ ...prev, [index]: true }))
    },
    [productImages, zoomImageLoaded]
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
        case 'ArrowLeft': setActiveIndex((i) => (i - 1 + productImages.length) % productImages.length); break
        case 'ArrowRight': setActiveIndex((i) => (i + 1) % productImages.length); break
        case '+': lightboxZoomIn(); break
        case '-': lightboxZoomOut(); break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isLightboxOpen, productImages.length])

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isLightboxOpen])

  // Preload adjacent images after 3s on page (PRD spec)
  useEffect(() => {
    const timer = setTimeout(() => {
      const adjacent = [
        (activeIndex + 1) % productImages.length,
        (activeIndex - 1 + productImages.length) % productImages.length,
      ]
      adjacent.forEach((i) => {
        const img = new window.Image()
        img.src = productImages[i]?.display ?? FALLBACK_IMAGE
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [activeIndex, productImages])

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
            ref={(el) => {
              mainRef.current = el
              tilt.outerRef.current = el
            }}
            className={cn(
              'sf-tilt-card relative rounded-[20px] overflow-hidden bg-[#FFFFFF] border border-black/[0.07] shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]',
              'w-full aspect-square',
              isOutOfStock || !hasProvidedImages ? 'grayscale cursor-default' : 'cursor-crosshair'
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
              <div className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-card">
                <span className="bg-[#242424] text-white text-sm font-bold px-4 py-2 rounded-[20px] uppercase tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Main image with scroll/mobile zoom — crossfades between thumbnail switches.
                The sf-tilt-card-inner wrapper carries the parallax tilt transform;
                the zoom/pan transform lives on the <Image> itself, so they never conflict. */}
            {hasProvidedImages ? (
            <div ref={tilt.innerRef} className="sf-tilt-card-inner absolute inset-0">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <Image
                  src={
                    (scrollZoom > 1 || mobileZoom > 1) && zoomImageLoaded[activeIndex]
                      ? activeImage.zoom
                      : activeImage.display
                  }
                  alt={`${productName} — image ${activeIndex + 1}`}
                  fill
                  sizes="540px"
                  className="object-cover transition-transform duration-300 select-none hover:scale-[1.04]"
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
              </motion.div>
            </AnimatePresence>
            </div>
            ) : (
              <div className="absolute inset-6 rounded-[10px] bg-[#F5F5F5] flex flex-col items-center justify-center gap-2 text-[#999999]">
                <FiCamera size={28} />
                <span className="text-[12px]">No image available</span>
              </div>
            )}

            {/* Hover lens overlay */}
            {isHovering && !isOutOfStock && scrollZoom === 1 && (
              <div
                className="absolute pointer-events-none border-2 border-[#F97316] bg-[#F97316]/10 transition-opacity duration-150"
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
                  'absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFFFFF] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center',
                  'text-[#777777] hover:text-[#F97316] transition-all duration-200',
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
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#F97316] shadow flex items-center justify-center text-white text-xs font-bold z-10"
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
              className="hidden lg:block shrink-0 rounded-card overflow-hidden border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] bg-white"
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
          {productImages.map((img, i) => (
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
                'relative shrink-0 w-[72px] h-[72px] rounded-[10px] border overflow-hidden bg-[#F5F5F5] transition-all duration-150',
                i === activeIndex
                  ? 'border-2 border-[#F97316] shadow-[0_0_0_3px_rgba(249,115,22,0.12)]'
                  : 'border border-black/[0.07] hover:border-black/[0.2]'
              )}
            >
              <Image
                src={img.thumb}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <p className="flex items-center gap-1 text-[11px] text-[#888888]">
          <FiZoomIn size={12} />
          {hasHover ? 'Hover to zoom' : 'Pinch to zoom'}
        </p>
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
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F97316] flex items-center justify-center transition-colors"
              aria-label="Zoom in"
            >
              <FiZoomIn size={16} />
            </button>
            <button
              onClick={lightboxZoomOut}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F97316] flex items-center justify-center transition-colors"
              aria-label="Zoom out"
            >
              <FiZoomOut size={16} />
            </button>
            <button
              onClick={() => { setLightboxZoom(1); setLightboxPan({ x: 0, y: 0 }) }}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F97316] flex items-center justify-center transition-colors"
              aria-label="Reset zoom"
            >
              <FiRefreshCw size={14} />
            </button>
            <button
              onClick={closeLightbox}
              className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-[#F97316] flex items-center justify-center transition-colors"
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
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <Image
                    src={activeImage.original}
                    alt={`${productName} — full view`}
                    width={900}
                    height={900}
                    className="object-contain max-w-[90vw] max-h-[80vh] select-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Prev / Next arrows */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveIndex((i) => (i - 1 + productImages.length) % productImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-[#F97316] flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveIndex((i) => (i + 1) % productImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-[#F97316] flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          <div className="flex items-center justify-center gap-2 p-4 shrink-0">
            {productImages.map((img, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); setLightboxZoom(1); setLightboxPan({ x: 0, y: 0 }) }}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  'relative w-12 h-12 rounded overflow-hidden bg-white/10 border-2 transition-all',
                  i === activeIndex ? 'border-[#F97316]' : 'border-transparent hover:border-white/40'
                )}
              >
                <Image
                  src={img.thumb}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
