"use client";

import React, { useEffect, useRef, useState } from "react";

const DEFAULT_WORDS = [
  "DATAVAULT",
  "CDR SECURED",
  "STORY PROTOCOL",
];

export function ParticleTextEffect({
  className = ""
}: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCountRef = useRef(0);
  const currentWordIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Width defaults to the container width in the new split layout
    let width = containerRef.current?.clientWidth || window.innerWidth / 2;
    let height = 300;

    class Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      color: { r: number; g: number; b: number };
      particleSize: number;
      easeSpeed: number;
      floatOffset: number;
      floatRadius: number;

      constructor(x: number, y: number, color: { r: number; g: number; b: number }) {
        // Start scattered
        this.x = width / 2 + (Math.random() - 0.5) * 400;
        this.y = height / 2 + (Math.random() - 0.5) * 200;
        this.targetX = x;
        this.targetY = y;
        this.color = color;
        
        // Slightly larger particles for better visibility on light background
        this.particleSize = Math.random() * 2.5 + 1.5; 
        
        this.easeSpeed = Math.random() * 0.15 + 0.08; 
        this.floatOffset = Math.random() * Math.PI * 2; 
        this.floatRadius = Math.random() * 2 + 0.5; 
      }

      draw() {
        if (!ctx) return;
        
        // Removed shadowBlur because shadows look muddy on light ivory backgrounds.
        // Solid pixels provide much crisper contrast.
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fillRect(this.x, this.y, this.particleSize, this.particleSize);
      }

      update(mouse: { x: number, y: number, radius: number }) {
        const time = Date.now() * 0.001;
        const floatX = Math.sin(time + this.floatOffset) * this.floatRadius;
        const floatY = Math.cos(time + this.floatOffset) * this.floatRadius;
        
        let actualTargetX = this.targetX + floatX;
        let actualTargetY = this.targetY + floatY;

        let dxMouse = mouse.x - this.x;
        let dyMouse = mouse.y - this.y;
        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distanceMouse < mouse.radius) {
            let force = (mouse.radius - distanceMouse) / mouse.radius;
            actualTargetX -= (dxMouse / distanceMouse) * force * 100;
            actualTargetY -= (dyMouse / distanceMouse) * force * 100;
        }

        this.x += (actualTargetX - this.x) * this.easeSpeed;
        this.y += (actualTargetY - this.y) * this.easeSpeed;
      }
    }

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 80
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const init = () => {
      width = containerRef.current?.clientWidth || window.innerWidth / 2;
      height = 300;
      canvas.width = width;
      canvas.height = height;

      changeWord();
    };

    const changeWord = () => {
      ctx.clearRect(0, 0, width, height);
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      if (!offscreenCtx) return;

      offscreenCtx.fillStyle = "white";
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.textAlign = "left";
      
      let fontSize = Math.max(Math.min(width / 7, 100), 40);
      offscreenCtx.font = `900 ${fontSize}px Inter, sans-serif`;
      offscreenCtx.letterSpacing = "2px";
      
      const word = DEFAULT_WORDS[currentWordIndexRef.current];
      
      // Auto-scale down if text is too wide for the screen
      let textWidth = offscreenCtx.measureText(word).width;
      if (textWidth > width * 0.9) {
          fontSize = fontSize * ((width * 0.9) / textWidth);
          offscreenCtx.font = `900 ${fontSize}px Inter, sans-serif`;
      }
      
      offscreenCtx.fillText(word, 0, height / 2);

      const textCoordinates = offscreenCtx.getImageData(0, 0, width, height);
      const newParticles = [];

      // Increased particle density (pixelSteps from 4 to 3) to make text bolder and more solid
      const pixelSteps = 3; 
      let particleIndex = 0;

      // New Contrast Palette: Mix of dark ink for structure, and copper for highlights.
      // This ensures it stands out clearly against the light ivory background.
      const themeColors = [
        { r: 26, g: 22, b: 18 },    // ink-900 (blackish brown, very dark)
        { r: 61, g: 53, b: 48 },    // ink-700 (dark brown)
        { r: 160, g: 98, b: 42 },   // copper-500 (primary accent)
        { r: 138, g: 82, b: 31 }    // copper-600 (darker copper)
      ];

      for (let y = 0; y < textCoordinates.height; y += pixelSteps) {
        for (let x = 0; x < textCoordinates.width; x += pixelSteps) {
          const index = (y * 4 * textCoordinates.width) + (x * 4) + 3;
          if (textCoordinates.data[index] > 128) {
            
            // Bias towards darker colors to ensure readability on ivory background
            // 50% chance of being ink-900, 50% chance of being another color
            let newColor;
            if (Math.random() > 0.5) {
                newColor = themeColors[0]; // ink-900
            } else {
                newColor = themeColors[Math.floor(Math.random() * themeColors.length)];
            }
            
            if (particleIndex < particles.length) {
                particles[particleIndex].targetX = x;
                particles[particleIndex].targetY = y;
                particles[particleIndex].color = newColor;
                newParticles.push(particles[particleIndex]);
            } else {
                newParticles.push(new Particle(x, y, newColor));
            }
            particleIndex++;
          }
        }
      }
      particles = newParticles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update(mouse);
      }
      
      frameCountRef.current++;
      // Change words gracefully every few seconds
      if (frameCountRef.current % 120 === 0) {
          currentWordIndexRef.current = (currentWordIndexRef.current + 1) % DEFAULT_WORDS.length;
          changeWord();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(init, 100); 
      });
    } else {
      setTimeout(init, 200);
    }
    
    animate();

    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-[300px] flex items-start justify-start ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="block absolute top-0 left-0 w-full h-full z-10 pointer-events-auto"
      />
      {/* Visually hidden text for SEO */}
      <h1 className="sr-only">
        DATAVAULT. CDR SECURED. STORY PROTOCOL.
      </h1>
    </div>
  );
}
