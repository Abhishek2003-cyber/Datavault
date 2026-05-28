import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVaultEmail({
  to,
  type,
  datasetName,
  walletAddress,
  txHash,
  vaultUuid,
  date,
}: {
  to: string;
  type: "upload" | "purchase" | "vault";
  datasetName: string;
  walletAddress: string;
  txHash?: string;
  vaultUuid?: number | string;
  date: string;
}) {
  const subjectMap = {
    upload: `🔐 Dataset Uploaded — ${datasetName}`,
    purchase: `🛒 Dataset Purchased — ${datasetName}`,
    vault: `🧊 Private Vault Created — ${datasetName}`,
  };

  const colorMap = {
    upload: "#00d4ff",
    purchase: "#00ff88",
    vault: "#ffaa00",
  };

  await transporter.sendMail({
    from: `"DataVault" <${process.env.EMAIL_USER}>`,
    to,
    subject: subjectMap[type],
    html: `
      <div style="background:#08090b;padding:40px;font-family:Arial;color:#e2e8f5">
        <div style="max-width:620px;margin:auto;background:#0f1117;border:1px solid #1c2130;border-radius:16px;padding:32px">
          
          <h1 style="color:${colorMap[type]};margin-bottom:10px">
            DataVault Notification
          </h1>

          <p style="color:#94a3b8">
            Your encrypted dataset activity has been recorded.
          </p>

          <div style="margin-top:24px;padding:20px;background:#08090b;border-radius:12px">
            <p><strong>Dataset:</strong> ${datasetName}</p>
            <p><strong>Wallet:</strong> ${walletAddress}</p>
            <p><strong>Vault UUID:</strong> ${vaultUuid || "N/A"}</p>
            <p><strong>Date:</strong> ${date}</p>
            ${
              txHash
                ? `<p><strong>Transaction:</strong> ${txHash}</p>`
                : ""
            }
          </div>

          <div style="margin-top:28px;padding:16px;background:#081018;border-radius:12px;border:1px solid #00d4ff22">
            <p style="margin:0;color:#00d4ff">
              🔒 Your plaintext dataset is never stored by DataVault.
            </p>
            <p style="margin-top:8px;color:#64748b;font-size:13px">
              Encryption keys are protected by Story Protocol CDR validator threshold encryption.
            </p>
          </div>

        </div>
      </div>
    `,
  });
}
