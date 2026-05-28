"use client";

import { explorerTxUrl, formatAddress } from "../../lib/utils/format";

interface TxLinkProps {
  hash: string;
  label?: string;
}

export function TxLink({ hash, label }: TxLinkProps) {
  return (
    <a 
      href={explorerTxUrl(hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-accent-cyan hover:text-accent-cyan-dim transition-colors group text-sm font-mono"
    >
      {label || formatAddress(hash)}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-70 group-hover:opacity-100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  );
}
