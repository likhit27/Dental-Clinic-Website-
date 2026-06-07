import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import { galleryItems } from '@/data/siteContent';

import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../icons/SvgIcons';
import { SectionHeader } from '../ui/SectionHeader';

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeImage = activeIndex === null ? null : galleryItems[activeIndex];

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPreviousImage = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === null
        ? currentIndex
        : (currentIndex - 1 + galleryItems.length) % galleryItems.length,
    );
  }, []);

  const showNextImage = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === null ? currentIndex : (currentIndex + 1) % galleryItems.length,
    );
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeViewer();
      }

      if (event.key === 'ArrowLeft') {
        showPreviousImage();
      }

      if (event.key === 'ArrowRight') {
        showNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, closeViewer, showNextImage, showPreviousImage]);

  return (
    <section className="gallery" id="gallery">
      <div className="container gallery-container">
        <SectionHeader
          light
          title={
            <>
              Our <span className="highlight">Gallery</span>
            </>
          }
          subtitle="Take a tour of Mani Dental Clinic."
        />

        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <button
              className={clsx('gallery-item', item.featured && 'featured')}
              type="button"
              aria-label={`View ${item.caption}`}
              key={item.src}
              onClick={() => setActiveIndex(index)}
            >
              <img
                className={clsx(
                  'gallery-image',
                  item.imagePosition === 'top' && 'gallery-image-top',
                )}
                src={item.src}
                alt={item.alt}
                loading={item.featured ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className="gallery-caption">{item.caption}</span>
            </button>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          className="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-viewer-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeViewer();
            }
          }}
        >
          <div className="gallery-viewer-panel">
            <div className="gallery-viewer-bar">
              <div>
                <p className="gallery-viewer-count">
                  {(activeIndex ?? 0) + 1} / {galleryItems.length}
                </p>
                <h3 id="gallery-viewer-title">{activeImage.caption}</h3>
              </div>

              <button
                className="gallery-viewer-close"
                type="button"
                aria-label="Close image viewer"
                ref={closeButtonRef}
                onClick={closeViewer}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="gallery-viewer-stage">
              <button
                className="gallery-viewer-nav gallery-viewer-prev"
                type="button"
                aria-label="Previous image"
                onClick={showPreviousImage}
              >
                <ChevronLeftIcon />
              </button>

              <img className="gallery-viewer-image" src={activeImage.src} alt={activeImage.alt} />

              <button
                className="gallery-viewer-nav gallery-viewer-next"
                type="button"
                aria-label="Next image"
                onClick={showNextImage}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
