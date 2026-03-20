import { useRef, useState, useCallback, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  leftLabel?: string;
  rightLabel?: string;
}

const THRESHOLD = 80;

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, leftLabel = 'Refusé', rightLabel = 'Contacté' }: SwipeableCardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    locked.current = false;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Lock direction on first significant move
    if (!locked.current && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      locked.current = true;
      if (Math.abs(dy) > Math.abs(dx)) {
        setSwiping(false);
        setOffsetX(0);
        return;
      }
    }

    if (locked.current) {
      e.preventDefault();
      // Apply resistance
      const dampened = dx * 0.6;
      setOffsetX(dampened);
    }
  }, [swiping]);

  const handleTouchEnd = useCallback(() => {
    if (!swiping) return;
    setSwiping(false);

    if (offsetX > THRESHOLD) {
      // Animate out right
      setOffsetX(300);
      setTimeout(() => {
        onSwipeRight();
        setOffsetX(0);
      }, 200);
    } else if (offsetX < -THRESHOLD) {
      // Animate out left
      setOffsetX(-300);
      setTimeout(() => {
        onSwipeLeft();
        setOffsetX(0);
      }, 200);
    } else {
      setOffsetX(0);
    }
  }, [swiping, offsetX, onSwipeLeft, onSwipeRight]);

  const progress = Math.min(Math.abs(offsetX) / THRESHOLD, 1);
  const isRight = offsetX > 0;
  const isLeft = offsetX < 0;

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background indicators */}
      {offsetX !== 0 && (
        <div className={`absolute inset-0 rounded-xl flex items-center ${isRight ? 'justify-start pl-5 bg-emerald-500/20' : 'justify-end pr-5 bg-destructive/20'}`}>
          <div className={`flex items-center gap-2 text-sm font-bold ${isRight ? 'text-emerald-600' : 'text-destructive'}`}
            style={{ opacity: progress }}>
            {isRight ? <Check size={20} /> : <X size={20} />}
            <span>{isRight ? rightLabel : leftLabel}</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 0.25s ease-out',
        }}
        className="relative z-10"
      >
        {children}
      </div>
    </div>
  );
}
