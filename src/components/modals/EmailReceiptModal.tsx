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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory-100/90 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-md bg-ivory-50 border border-ivory-300 p-8">
        
        <h2 className="text-2xl font-[Playfair_Display] font-black text-ink-900 mb-2 flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-copper-500" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Send Receipt
        </h2>
        
        <p className="text-ink-500 text-sm mb-6 font-[Jost]">
          Your transaction was successful. Would you like an encrypted receipt sent to your email?
        </p>

        <div className="space-y-4">
          <div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@nexus.com" 
              className="w-full border-b border-ivory-300 bg-transparent px-0 py-3 text-ink-900 font-[Jost] focus:outline-none focus:border-copper-500 transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 text-[10px] font-[DM_Mono] uppercase tracking-widest text-ink-500 cursor-pointer">
            <input 
              type="checkbox" 
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-copper-500"
            />
            Remember this email
          </label>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              disabled={isSending}
              className="flex-1 py-3 text-[10px] font-[DM_Mono] uppercase tracking-widest text-ink-500 border border-ivory-300 hover:bg-ivory-100 hover:text-ink-900 transition-colors"
            >
              Skip
            </button>
            <button 
              onClick={handleSend}
              disabled={isSending || !email}
              className="flex-1 py-3 text-[10px] font-[DM_Mono] uppercase tracking-widest bg-copper-500 text-ivory-50 hover:bg-copper-600 transition-colors disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Receipt"}
            </button>
          </div>

          {status === 'success' && (
            <div className="text-center text-copper-500 text-[10px] font-[DM_Mono] uppercase tracking-widest mt-2 animate-pulse">
              ✓ Receipt sent successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="text-center text-red-500 text-[10px] font-[DM_Mono] uppercase tracking-widest mt-2">
              Failed to send receipt. You can safely skip.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
