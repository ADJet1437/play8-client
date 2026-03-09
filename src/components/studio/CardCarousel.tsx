import { useState, useRef, useEffect, ReactNode } from 'react';

interface CardCarouselProps {
  children: ReactNode[];
}

export default function CardCarousel({ children }: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const totalCards = children.length;

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Mouse/Touch drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Threshold: swipe 80px to trigger navigation
    if (translateX < -80 && currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (translateX > 80 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTranslateX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Card width calculation - larger for full-size cards
  const cardWidth = isMobile ? 340 : 650;
  const gap = 20;
  const peekAmount = isMobile ? 50 : 100;

  // Calculate transform
  const baseTransform = -(currentIndex * (cardWidth + gap));
  const currentTransform = baseTransform + translateX;

  if (totalCards === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Carousel container */}
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{
          width: isMobile ? '100%' : `${cardWidth + peekAmount}px`,
          maxWidth: '100%',
        }}
      >
        <div className="overflow-visible">
          <div
            className="flex items-stretch transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${currentTransform}px)`,
              gap: `${gap}px`,
            }}
          >
            {children.map((child, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{
                  width: `${cardWidth}px`,
                  minHeight: '500px',
                  opacity: isDragging ? 0.9 : 1,
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Navigation Arrows */}
      {!isMobile && totalCards > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
              aria-label="Previous card"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {currentIndex < totalCards - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
              aria-label="Next card"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Navigation Dots */}
      {totalCards > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-200 rounded-full ${
                index === currentIndex
                  ? 'bg-blue-600 w-6 h-2'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
