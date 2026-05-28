"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isEncryptedHover, setIsEncryptedHover] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default true to avoid flash on mobile

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if mobile (don't show custom cursor on touch devices)
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Normal button hover
      if (
        target.tagName.toLowerCase() === "button" ||
        target.closest("button") ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("a") ||
        target.classList.contains("magnetic-hover")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      // Encrypted element hover
      if (target.closest(".encrypted-element")) {
        setIsEncryptedHover(true);
      } else {
        setIsEncryptedHover(false);
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    if (!isMobile) {
      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("mousemove", moveCursor);
        window.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [cursorX, cursorY, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Tiny solid dot that exactly tracks the pointer */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: isEncryptedHover ? "#00ff88" : "#00d4ff",
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ duration: 0 }}
      />

      {/* Larger glowing ring that trails behind via spring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHidden ? 0 : 1,
          border: `1px solid ${isEncryptedHover ? "rgba(0,255,136,0.6)" : "rgba(0,212,255,0.4)"}`,
          boxShadow: isEncryptedHover
            ? "0 0 20px rgba(0,255,136,0.3)"
            : "0 0 20px rgba(0,212,255,0.2)",
        }}
        animate={{
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
          backgroundColor: isHovered
            ? isEncryptedHover
              ? "rgba(0,255,136,0.1)"
              : "rgba(0,212,255,0.1)"
            : "transparent",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
}
