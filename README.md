**DataVault**
**Secure Decentralized Data Marketplace
Hackathon Project Summary  |  Story Protocol Aeneid Testnet**

**1. Problem Statement**
Data is the core asset of the AI economy — yet researchers, individuals, and organizations have no trustworthy mechanism to monetize high-value datasets (healthcare records, financial data, private NLP corpora) without surrendering control to a centralized intermediary.
Existing solutions force a trade-off: either share plaintext with a third party, or keep data siloed with zero monetization. DataVault eliminates this trade-off.

**2. Solution Overview**
DataVault is a decentralized data marketplace and private vault where:
•	Data is encrypted client-side (AES-256-GCM) before it ever leaves the user's browser
•	Encrypted payloads are stored on IPFS via Lighthouse — no centralized file server
•	Blockchain transactions on Story Protocol (Aeneid Testnet) gate marketplace purchases
•	Decryption happens locally in the buyer's browser after payment confirmation

Two modes are supported: a Public Marketplace for monetizing datasets, and a Private Vault for secure personal storage — functioning as a decentralized, encrypted alternative to Google Drive.

**3. Technology Stack**
Layer	Technology
Frontend	Next.js 16.2.6 (App Router, Turbopack) + TypeScript
Styling / UI	Tailwind CSS, Framer Motion, custom design system
Blockchain	Wagmi + Viem — Story Protocol Aeneid Testnet (Chain ID: 1315)
Decentralized Storage	IPFS via Lighthouse SDK
Cryptography	Web Crypto API — AES-256-GCM (client-side only)
Metadata / State	Supabase (PostgreSQL)
Deployment	Vercel (Edge network) + GitHub CI/CD
Email Receipts	Nodemailer via Next.js Serverless Route

**4. Core Features**
4.1 Client-Side Encryption & Decentralized Upload
•	A random AES-256-GCM key is generated in the browser at upload time
•	The file is encrypted locally — plaintext never reaches any server
•	Encrypted blob is pushed to IPFS via Lighthouse; a CID is returned and stored
•	AES key and metadata (CID, owner wallet, price) are stored in Supabase

**4.2 Marketplace with On-Chain Purchasing**
•	Buyers browse datasets filtered by category (Healthcare, Financial AI, IoT, etc.)
•	Clicking 'Purchase & Decrypt' triggers a MetaMask transaction on Story Protocol Aeneid
•	On confirmed payment, the frontend fetches the encrypted file from IPFS and decrypts it locally
•	Decrypted file is auto-downloaded to the buyer's machine — no server ever sees plaintext

**4.3 Private Vault Dashboard**
•	Wallet-gated personal dashboard — Supabase queries filter datasets by connected wallet address
•	Owners can decrypt and download their own files without additional fees
•	Supports both public marketplace listings and private vault items in one interface

**4.4 Email Receipt System**
•	After successful upload, users can request an HTML email receipt
•	Receipt contains: Vault UUID, on-chain transaction hash, and IPFS CID
•	Delivered via Nodemailer through a Next.js serverless API route (/api/send-receipt)

**5. Security Architecture**
DataVault implements a client-side encryption model where the application server has no access to file contents at any point in the data lifecycle:

•	Encryption/Decryption: All cryptographic operations run exclusively in the user's browser via the Web Crypto API
•	Storage layer: IPFS (via Lighthouse) stores only the encrypted payload — content is content-addressed and immutable
•	Access gating: Story Protocol smart contracts on the Aeneid Testnet are used for on-chain transaction verification during marketplace purchases
•	Secrets management: API keys and service credentials are injected at build time via Vercel environment variables — never hardcoded

**6. UI/UX Design System**
•	Typography: Playfair Display (headlines) + DM Mono (data/technical elements)
•	Color palette: Warm Ivory background, deep Ink text, Copper accents — custom Tailwind configuration
•	Animations: 3D Copper Vault logo, Particle Text hero effect, Framer Motion glassmorphism accordions
•	Design intent: Premium, trust-building aesthetic differentiated from typical Web3 project templates

**7. Deployment**
•	Platform: Vercel (Edge network)
•	CI/CD: GitHub main branch — automatic deploys on push
•	Environment variables: Supabase keys, Lighthouse API key, email credentials — all injected via Vercel dashboard


**DataVault  |  Story Protocol Hackathon  |  Built on Aeneid Testnet**
