import React, { useState, useEffect } from 'react';

export type ReceiptType = 'upload' | 'purchase' | 'private' | 'renewal';

interface EmailReceiptModalProps {
  isOpen: boolean;
  type: ReceiptType;
  metadata: any;
  onClose: () => void;
}

export const EmailReceiptModal: React.FC<EmailReceiptModalProps> = ({ isOpen, type, metadata, onClose }) => {
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('datavault_receipt_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
      }
      setStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!email || !email.includes('@')) return;
    
    if (remember) {
      localStorage.setItem('datavault_receipt_email', email);
    } else {
      localStorage.removeItem('datavault_receipt_email');
    }

    setIsSending(true);
    setStatus('idle');

    try {
      const typeMapping = (type === 'private' || type === 'renewal') ? 'vault' : type;

      const payload = {
        to: email,
        type: typeMapping,
        datasetName: metadata.datasetName || "Private Dataset",
        walletAddress: metadata.walletAddress || "0x...",
        txHash: metadata.txHash,
        vaultUuid: metadata.vaultUuid,
        date: new Date().toISOString()
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("API Failed");
      
      setStatus('success');
      setTimeout(() => onClose(), 2000);
    } catch (e) {
      console.error(e);
      setStatus('error');
      // Do not block. Just close or let them skip.
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-md bg-bg border border-accent-cyan/30 p-8 rounded-xl shadow-[0_0_40px_-10px_rgba(0,255,255,0.2)]">
        
        <h2 className="text-2xl font-bold text-text-primary mb-2 font-mono flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Send Receipt
        </h2>
        
        <p className="text-text-secondary text-sm mb-6">
          Your transaction was successful. Would you like an encrypted receipt sent to your email?
        </p>

        <div className="space-y-4">
          <div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@nexus.com" 
              className="w-full bg-bg-elevated border border-bg-border rounded px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan font-mono text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input 
              type="checkbox" 
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-accent-cyan"
            />
            Remember this email
          </label>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              disabled={isSending}
              className="flex-1 py-3 text-sm font-medium rounded text-text-secondary border border-bg-border hover:bg-bg-elevated transition-colors"
            >
              Skip
            </button>
            <button 
              onClick={handleSend}
              disabled={isSending || !email}
              className="flex-1 py-3 text-sm font-bold font-mono rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/50 hover:bg-accent-cyan hover:text-black transition-all disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Receipt"}
            </button>
          </div>

          {status === 'success' && (
            <div className="text-center text-accent-cyan text-sm mt-2 animate-pulse">
              ✓ Receipt sent successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="text-center text-red-400 text-sm mt-2">
              Failed to send receipt. You can safely skip.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
