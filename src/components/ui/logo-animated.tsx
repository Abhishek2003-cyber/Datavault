"use client";

import { useEffect, useRef } from "react";

export default function LogoAnimated() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    const t = setTimeout(() => {
      el.style.transition =
        "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0px)";
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        willChange: "opacity, transform",
        cursor: "pointer", // Changing to pointer since it will be wrapped in a link
      }}
    >
      {/* ── 3D VAULT ICON ── */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="dv-vF" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4895a" />
            <stop offset="50%" stopColor="#a0622a" />
            <stop offset="100%" stopColor="#7a3d0a" />
          </linearGradient>
          <linearGradient id="dv-vS" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a2206" />
            <stop offset="100%" stopColor="#2a1204" />
          </linearGradient>
          <linearGradient id="dv-vT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a97a" />
            <stop offset="100%" stopColor="#a0622a" />
          </linearGradient>
          <linearGradient id="dv-dF" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8b87a" />
            <stop offset="40%" stopColor="#c4895a" />
            <stop offset="100%" stopColor="#8a521f" />
          </linearGradient>
          <linearGradient id="dv-hG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8c890" />
            <stop offset="100%" stopColor="#7a4a1a" />
          </linearGradient>
          <linearGradient id="dv-kG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1208" />
            <stop offset="100%" stopColor="#0a0804" />
          </linearGradient>
          <linearGradient id="dv-nG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d0a0" />
            <stop offset="100%" stopColor="#a0622a" />
          </linearGradient>
        </defs>

        {/* Right side face — dark shadow */}
        <polygon points="62,14 72,20 72,74 62,68" fill="url(#dv-vS)" />
        {/* Top face — medium tone */}
        <polygon points="18,14 62,14 72,20 28,20" fill="url(#dv-vT)" />
        {/* Front face — main copper */}
        <rect x="18" y="20" width="44" height="48" rx="2" fill="url(#dv-vF)" />
        {/* Door panel */}
        <rect x="22" y="24" width="36" height="40" rx="2" fill="url(#dv-dF)" />
        {/* Door bevel top highlight */}
        <rect x="22" y="24" width="36" height="3" rx="1" fill="#f0c880" opacity="0.6" />
        {/* Door bevel left highlight */}
        <rect x="22" y="24" width="3" height="40" rx="1" fill="#f0c880" opacity="0.4" />
        {/* Inner rim */}
        <rect x="26" y="28" width="28" height="32" rx="2" fill="none" stroke="#f0c880" strokeWidth="1.5" />
        {/* Keyhole circle */}
        <circle cx="40" cy="40" r="6" fill="url(#dv-kG)" stroke="#f0c880" strokeWidth="1" />
        <circle cx="40" cy="40" r="3.5" fill="none" stroke="#c4895a" strokeWidth="0.75" />
        {/* Keyhole drop */}
        <rect x="37.5" y="44" width="5" height="8" rx="1.5" fill="url(#dv-kG)" stroke="#c4895a" strokeWidth="0.75" />
        {/* Handle */}
        <rect x="52" y="33" width="6" height="18" rx="3" fill="url(#dv-hG)" stroke="#f0d0a0" strokeWidth="0.5" />
        <rect x="57" y="34" width="2" height="16" rx="1" fill="#4a2206" opacity="0.5" />
        {/* Corner bolts */}
        <circle cx="29" cy="31" r="2" fill="#7a4a1a" stroke="#f0c880" strokeWidth="0.75" />
        <circle cx="51" cy="31" r="2" fill="#7a4a1a" stroke="#f0c880" strokeWidth="0.75" />
        <circle cx="29" cy="57" r="2" fill="#7a4a1a" stroke="#f0c880" strokeWidth="0.75" />
        <circle cx="51" cy="57" r="2" fill="#7a4a1a" stroke="#f0c880" strokeWidth="0.75" />
        {/* Ground shadow */}
        <ellipse cx="43" cy="75" rx="30" ry="4" fill="#000000" opacity="0.35" />
        {/* IPFS node dots */}
        <circle cx="22" cy="11" r="3.5" fill="url(#dv-nG)" opacity="0.9" />
        <circle cx="40" cy="6" r="4.5" fill="url(#dv-nG)" />
        <circle cx="58" cy="11" r="3.5" fill="url(#dv-nG)" opacity="0.9" />
        {/* Node connectors */}
        <line x1="25.5" y1="11" x2="36.5" y2="7" stroke="#d4a97a" strokeWidth="0.75" opacity="0.6" />
        <line x1="43.5" y1="7" x2="55" y2="11" stroke="#d4a97a" strokeWidth="0.75" opacity="0.6" />
        {/* Node glow centers */}
        <circle cx="40" cy="6" r="2" fill="#f0ece3" opacity="0.8" />
        <circle cx="22" cy="11" r="1.5" fill="#f0c880" opacity="0.7" />
        <circle cx="58" cy="11" r="1.5" fill="#f0c880" opacity="0.7" />
      </svg>

      {/* ── WORDMARK ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          <span
            style={{
              color: "#f0ece3",
              textShadow:
                "2px 2px 0px #5a3a18, 4px 4px 0px #3d2610, 6px 6px 0px #1a0f05, 7px 7px 14px rgba(0,0,0,0.5)",
            }}
          >
            Data
          </span>
          <span
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              color: "#d4895a",
              textShadow:
                "2px 2px 0px #7a3d0a, 4px 4px 0px #4a2206, 6px 6px 0px #1a0a02, 7px 7px 14px rgba(0,0,0,0.5)",
            }}
          >
            vault
          </span>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#5a5248",
          }}
        >
          Zero-knowledge data exchange
        </div>
      </div>
    </div>
  );
}
