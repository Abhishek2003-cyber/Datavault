"use client";

import React, { useEffect, useRef, useState } from "react";

// STEP 1 — REPLACE DEFAULT WORDS
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
    
    // STEP 5 — FIX CANVAS SIZE
    let width = window.innerWidth;
    let height = 380;

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
        // Start slightly scattered around the center, not full screen, so they form faster
        this.x = width / 2 + (Math.random() - 0.5) * 400;
        this.y = height / 2 + (Math.random() - 0.5) * 200;
        this.targetX = x;
        this.targetY = y;
        this.color = color;
        
        // Increased particle size and base size to make text look brighter and thicker without trails
        this.particleSize = Math.random() * 1.5 + 1.0; 
        
        // Spring physics settings (INCREASED SPEED)
        this.easeSpeed = Math.random() * 0.15 + 0.08; // Super fast snappy formation
        this.floatOffset = Math.random() * Math.PI * 2; // Random phase
        this.floatRadius = Math.random() * 2 + 0.5; // How far they wobble from their letter
      }

      draw() {
        if (!ctx) return;
        
        // Increased shadow blur for stronger neon glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fillRect(this.x, this.y, this.particleSize, this.particleSize);
        ctx.shadowBlur = 0; 
      }

      update(mouse: { x: number, y: number, radius: number }) {
        // 1. Calculate cinematic floating target
        const time = Date.now() * 0.001;
        const floatX = Math.sin(time + this.floatOffset) * this.floatRadius;
        const floatY = Math.cos(time + this.floatOffset) * this.floatRadius;
        
        let actualTargetX = this.targetX + floatX;
        let actualTargetY = this.targetY + floatY;

        // 2. Mouse Repulsion
        let dxMouse = mouse.x - this.x;
        let dyMouse = mouse.y - this.y;
        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distanceMouse < mouse.radius) {
            let force = (mouse.radius - distanceMouse) / mouse.radius;
            // Push away from mouse
            actualTargetX -= (dxMouse / distanceMouse) * force * 100;
            actualTargetY -= (dyMouse / distanceMouse) * force * 100;
        }

        // 3. Easing (Spring to target)
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
      width = window.innerWidth;
      height = 380;
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
      offscreenCtx.textAlign = "center";
      
      // Baseline massive font
      let fontSize = Math.max(Math.min(width / 7, 180), 80);
      offscreenCtx.font = `900 ${fontSize}px Inter, sans-serif`;
      // Adding letter spacing hack for canvas
      offscreenCtx.letterSpacing = "8px";
      
      const word = DEFAULT_WORDS[currentWordIndexRef.current];
      
      // Auto-scale down if text is too wide for the screen
      let textWidth = offscreenCtx.measureText(word).width;
      if (textWidth > width * 0.9) {
          fontSize = fontSize * ((width * 0.9) / textWidth);
          offscreenCtx.font = `900 ${fontSize}px Inter, sans-serif`;
      }
      
      offscreenCtx.fillText(word, width / 2, height / 2 + 20);

      const textCoordinates = offscreenCtx.getImageData(0, 0, width, height);
      const newParticles = [];

      // Decrease pixelSteps to generate MORE particles (makes text much denser and brighter)
      const pixelSteps = 5; 
      let particleIndex = 0;

      for (let y = 0; y < textCoordinates.height; y += pixelSteps) {
        for (let x = 0; x < textCoordinates.width; x += pixelSteps) {
          const index = (y * 4 * textCoordinates.width) + (x * 4) + 3;
          if (textCoordinates.data[index] > 128) {
            // STEP 3 — REMOVE RANDOM COLORS
            const colors = [
              { r: 0, g: 212, b: 255 },
              { r: 59, g: 130, b: 246 },
            ];
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Reuse existing particles for smooth transitions
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
      // 100% transparent background, clear frame
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update(mouse);
      }
      
      frameCountRef.current++;
      // Change words gracefully every few seconds (much faster now)
      if (frameCountRef.current % 90 === 0) {
          currentWordIndexRef.current = (currentWordIndexRef.current + 1) % DEFAULT_WORDS.length;
          changeWord();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      setTimeout(init, 100);
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
    <div ref={containerRef} className={`relative w-full h-[380px] flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="block absolute top-0 left-0 w-full h-full z-10 pointer-events-auto"
      />
    </div>
  );
}
