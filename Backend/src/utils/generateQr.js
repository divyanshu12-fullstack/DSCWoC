import QRCode from 'qrcode';

const DEFAULT_BASE = process.env.VERIFY_BASE_URL || 'https://dswc.yoursite.com';

export async function generateQr(authKey) {
  const targetUrl = `${DEFAULT_BASE.replace(/\/$/, '')}/verify?id=${encodeURIComponent(authKey)}`;
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 320,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  const base64 = qrDataUrl.split(',')[1];
  return Buffer.from(base64, 'base64');
}
