'use client';
import { useEffect, useRef, useState } from 'react';

interface Star {
    id: number;
    size: number;
    left: number;
    top: number;
    dx: number;
    dy: number;
    duration: number;
    twinkleDuration: number;
    color: string;
  }

export default function Background() {
    const [stars, setStars] = useState<Star[]>([]);
    const idRef = useRef(0);
    const colors = ['#ffffff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#caffbf', '#ffd6a5', '#9bf6ff'];

  useEffect(() => {
    const interval = setInterval(() => {
      for(let i = 0; i<=5; i++){
        const size = Math.random() * 8 + 1;
        const left = 50; // centro horizontal
        const top = 50;

        const duration = 10 + Math.random() * 1;

        const angleX = Math.random() * 2 * 360;
        const angleY = Math.random() * 2 * 360;
        const speedX = ((Math.random() * 2) * 360) * 2;
        const speedY = ((Math.random() * 2) * 360) / 2; // cuánto se mueve

        const dx = Math.cos(angleX) * speedX;
        const dy = Math.sin(angleY) * speedY;
        
        
        const twinkleDuration = 1 + Math.random() * 1;

        const id = idRef.current++;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const newStar: Star = { id, size, left, top, dx, dy, duration, twinkleDuration, color};
        setStars((prev) => [...prev, newStar]);

        // Remove the star after its animation ends
        setTimeout(() => {
          setStars((prev) => prev.filter((star) => star.id !== id));
        }, duration * 1000);
      }
      
    }, 250); // new star every 100ms

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div className="starry-sky">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            '--dx': `${star.dx}px`,
            '--dy': `${star.dy}vh`,
            animationDuration: `${star.twinkleDuration}s, ${star.duration}s`,
            animationDelay: `${Math.random() * 2}s, 0s`,
            backgroundColor: star.color,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}