"use client";

import React, { useEffect, useRef, useState } from "react";

export function ParticleTextEffect({
  className = ""
}: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
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
        
        this.particleSize = Math.random() * 1.5 + 1.0; 
        
        this.easeSpeed = Math.random() * 0.15 + 0.08; 
        this.floatOffset = Math.random() * Math.PI * 2; 
        this.floatRadius = Math.random() * 2 + 0.5; 
      }

      draw() {
        if (!ctx) return;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fillRect(this.x, this.y, this.particleSize, this.particleSize);
        ctx.shadowBlur = 0; 
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

      drawText();
    };

    const drawText = () => {
      ctx.clearRect(0, 0, width, height);
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      if (!offscreenCtx) return;

      offscreenCtx.textBaseline = "top";
      offscreenCtx.textAlign = "left";
      
      let fontSize = Math.max(Math.min(width / 6, 85), 50);
      const lineHeight = fontSize * 0.95;
      const startY = 20;

      // Line 1 & 2 (Ink-like structure)
      offscreenCtx.fillStyle = "white"; 
      offscreenCtx.font = `900 ${fontSize}px "Playfair Display", serif`;
      offscreenCtx.letterSpacing = "-2px";
      offscreenCtx.fillText("Own your", 0, startY);
      offscreenCtx.fillText("data.", 0, startY + lineHeight);
      
      // Line 3 (Always in italic)
      offscreenCtx.font = `italic 500 ${fontSize}px "Playfair Display", serif`;
      // We will render "Always." slightly differently in particles
      offscreenCtx.fillText("Always.", 0, startY + lineHeight * 2);

      const textCoordinates = offscreenCtx.getImageData(0, 0, width, height);
      const newParticles = [];

      const pixelSteps = 4; // Dense particles
      
      // Copper palette
      const copperColors = [
        { r: 160, g: 98, b: 42 },   // copper-500
        { r: 196, g: 137, b: 90 },  // copper-400
        { r: 212, g: 169, b: 122 }, // copper-300
        { r: 26, g: 22, b: 18 }     // ink-900 (for contrast)
      ];

      for (let y = 0; y < textCoordinates.height; y += pixelSteps) {
        for (let x = 0; x < textCoordinates.width; x += pixelSteps) {
          const index = (y * 4 * textCoordinates.width) + (x * 4) + 3;
          if (textCoordinates.data[index] > 128) {
            
            // If it's the 3rd line (Always.), make it mostly copper
            let newColor;
            if (y > startY + lineHeight * 1.8) {
                newColor = copperColors[Math.floor(Math.random() * 3)]; // pure copper
            } else {
                // Mix of ink and copper for top text
                newColor = Math.random() > 0.8 ? copperColors[Math.floor(Math.random() * 3)] : copperColors[3];
            }
            
            newParticles.push(new Particle(x, y, newColor));
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
      
      animationFrameId = requestAnimationFrame(animate);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(init, 200); // give font time to render
      });
    } else {
      setTimeout(init, 500);
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
      {/* Visually hidden h1 for SEO and screen readers */}
      <h1 className="sr-only">
        Own your data. Always.
      </h1>
    </div>
  );
}
