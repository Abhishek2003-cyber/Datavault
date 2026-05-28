"use client";

interface VaultIconProps {
  isOpen: boolean;
}

export function VaultIcon({ isOpen }: VaultIconProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-24 h-32 [perspective:1000px]">
        {/* Vault Frame */}
        <div className="absolute inset-0 bg-bg-surface border-2 border-bg-border rounded-sm shadow-xl" />
        
        {/* Vault Door */}
        <div 
          className="absolute inset-0 bg-bg-elevated border-2 border-accent-cyan rounded-sm origin-left transition-transform duration-1000 flex items-center justify-center"
          style={{ 
            transform: isOpen ? 'rotateY(-110deg)' : 'rotateY(0deg)',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
          }}
        >
          {/* Dial */}
          <div className="w-10 h-10 rounded-full border-2 border-accent-cyan flex items-center justify-center bg-bg">
            <div className="w-6 h-6 rounded-full border border-accent-cyan/50" />
            <div className="absolute w-1 h-3 bg-accent-cyan top-1" />
          </div>
        </div>

        {/* Inside Vault (visible when open) */}
        <div className="absolute inset-2 bg-[#050608] border border-bg-border shadow-inner flex flex-col items-center justify-center opacity-0 transition-opacity duration-1000" style={{ opacity: isOpen ? 1 : 0, transitionDelay: isOpen ? '0.3s' : '0s' }}>
          <div className="w-full h-1 bg-accent-green/20 mb-2 rounded-full overflow-hidden">
             <div className="w-1/2 h-full bg-accent-green animate-pulse" />
          </div>
          <div className="text-[0.5rem] text-accent-green font-mono">DATA DECRYPTED</div>
        </div>
      </div>
      
      <div className="font-mono text-xs font-bold tracking-widest text-text-tertiary">
        {isOpen ? (
          <span className="text-accent-green">OPEN</span>
        ) : (
          <span className="text-accent-cyan">SEALED</span>
        )}
      </div>
    </div>
  );
}
