import { createCanvas, loadImage } from 'canvas';

/**
 * Draw ID Card with user data
 * Canvas: 2022 x 1278 pixels (2x resolution for high quality)
 * Uses system fonts only (no registration)
 */
export async function drawIdCard({ templatePath, photoBuffer, qrBuffer, user }) {
  console.log('🎨 Drawing ID card for:', user.fullName);
  
  // 2x resolution for maximum quality
  const SCALE = 2;
  const CARD_WIDTH = 1011 * SCALE;
  const CARD_HEIGHT = 639 * SCALE;

  // Layout coordinates (scaled 2x)
  const layout = {
    photo: { x: 187 * SCALE, y: 238 * SCALE, width: 186 * SCALE, height: 184 * SCALE },
    name: { x: 202 * SCALE, y: 463 * SCALE, width: 157 * SCALE, height: 25 * SCALE, maxFontSize: 24 * SCALE, minFontSize: 12 * SCALE },
    linkedin: { x: 251 * SCALE, y: 503 * SCALE, width: 121 * SCALE, height: 20 * SCALE },
    github: { x: 250 * SCALE, y: 531 * SCALE, width: 121 * SCALE, height: 20 * SCALE },
    authKey: { x: 143 * SCALE, y: 578 * SCALE, width: 126 * SCALE, height: 20 * SCALE },
    email: { x: 593 * SCALE, y: 579 * SCALE, width: 143 * SCALE, height: 20 * SCALE },
    qr: { x: 676 * SCALE, y: 454 * SCALE, size: 100 * SCALE }
  };

  // Create high-resolution canvas
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d', { alpha: false });
  
  // Enable antialiasing and high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.antialias = 'subpixel';
  ctx.patternQuality = 'best';
  ctx.quality = 'best';

  // Draw template
  const template = await loadImage(templatePath);
  ctx.drawImage(template, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw photo (ellipse clipping)
  const photo = await loadImage(photoBuffer);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    layout.photo.x + layout.photo.width / 2,
    layout.photo.y + layout.photo.height / 2,
    layout.photo.width / 2,
    layout.photo.height / 2,
    0, 0, Math.PI * 2
  );
  ctx.clip();
  ctx.drawImage(photo, layout.photo.x, layout.photo.y, layout.photo.width, layout.photo.height);
  ctx.restore();

  // Draw QR code (rounded corners)
  const qr = await loadImage(qrBuffer);
  ctx.save();
  const qrRadius = 8 * 2; // Scaled for 2x resolution
  ctx.beginPath();
  ctx.moveTo(layout.qr.x + qrRadius, layout.qr.y);
  ctx.lineTo(layout.qr.x + layout.qr.size - qrRadius, layout.qr.y);
  ctx.quadraticCurveTo(layout.qr.x + layout.qr.size, layout.qr.y, layout.qr.x + layout.qr.size, layout.qr.y + qrRadius);
  ctx.lineTo(layout.qr.x + layout.qr.size, layout.qr.y + layout.qr.size - qrRadius);
  ctx.quadraticCurveTo(layout.qr.x + layout.qr.size, layout.qr.y + layout.qr.size, layout.qr.x + layout.qr.size - qrRadius, layout.qr.y + layout.qr.size);
  ctx.lineTo(layout.qr.x + qrRadius, layout.qr.y + layout.qr.size);
  ctx.quadraticCurveTo(layout.qr.x, layout.qr.y + layout.qr.size, layout.qr.x, layout.qr.y + layout.qr.size - qrRadius);
  ctx.lineTo(layout.qr.x, layout.qr.y + qrRadius);
  ctx.quadraticCurveTo(layout.qr.x, layout.qr.y, layout.qr.x + qrRadius, layout.qr.y);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(qr, layout.qr.x, layout.qr.y, layout.qr.size, layout.qr.size);
  ctx.restore();

  // Setup text rendering
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.globalAlpha = 1.0;
  
  // Set text color based on role for readability
  // Admin and Mentor templates have white backgrounds, use black text
  // Contributor template has dark background, use white text
  const textColor = (user.role === 'Admin' || user.role === 'Mentor') ? '#000000' : '#FFFFFF';
  ctx.fillStyle = textColor;

  // Helper to fit text
  const fitText = (text, maxWidth, maxSize, minSize) => {
    let size = maxSize;
    while (size > minSize) {
      ctx.font = `bold ${size}px Arial, Helvetica, sans-serif`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 0.5;
    }
    return size;
  };

  // Draw NAME
  const nameText = String(user.fullName || 'Participant');
  const nameSize = fitText(nameText, layout.name.width, layout.name.maxFontSize, layout.name.minFontSize);
  ctx.font = `bold ${nameSize}px Arial, Helvetica, sans-serif`;
  console.log(`📝 NAME: "${nameText}" (${nameSize}px)`);
  ctx.fillText(nameText, layout.name.x, layout.name.y);

  // Draw LINKEDIN
  const linkedinText = user.linkedinUrl ? String(user.linkedinUrl.split('/').pop() || '') : '';
  if (linkedinText) {
    ctx.font = `500 ${Math.floor(layout.linkedin.height * 0.65)}px Arial, Helvetica, sans-serif`;
    console.log(`🔗 LINKEDIN: "${linkedinText}"`);
    ctx.fillText(linkedinText, layout.linkedin.x, layout.linkedin.y);
  }

  // Draw GITHUB
  const githubText = String(user.github_username || 'github');
  ctx.font = `500 ${Math.floor(layout.github.height * 0.65)}px Arial, Helvetica, sans-serif`;
  console.log(`🐙 GITHUB: "${githubText}"`);
  ctx.fillText(githubText, layout.github.x, layout.github.y);

  // Draw EMAIL
  const emailText = String(user.email || 'user@email.com');
  ctx.font = `400 ${Math.floor(layout.email.height * 0.7)}px Arial, Helvetica, sans-serif`;
  console.log(`📧 EMAIL: "${emailText}"`);
  ctx.fillText(emailText, layout.email.x, layout.email.y);

  // Draw AUTH KEY
  const authText = String(user.authKey || 'N/A');
  ctx.font = `400 ${Math.floor(layout.authKey.height * 0.7)}px Arial, Helvetica, sans-serif`;
  console.log(`🔑 AUTH KEY: "${authText}"`);
  ctx.fillText(authText, layout.authKey.x, layout.authKey.y);

  ctx.restore();

  // Export with maximum quality settings
  console.log('✅ ID card generated successfully (2x resolution)');
  return canvas.toBuffer('image/png', {
    compressionLevel: 0,  // 0 = no compression, maximum quality
    filters: canvas.PNG_FILTER_NONE,  // No filtering for best quality
    palette: undefined,  // Full color, no palette
    backgroundIndex: 0,
    resolution: 300  // 300 DPI for print quality
  });
}
