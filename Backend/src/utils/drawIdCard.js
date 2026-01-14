import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Skip font registration - use system fonts
console.log('✅ Using system fonts (no registration needed)');

/**
 * THE GUARANTEED FIX - STEP BY STEP IMPLEMENTATION
 * Canvas: 1011 x 639 pixels (verified 1× scale)
 * All positioning: TOP-LEFT ORIGIN ONLY
 */
export async function drawIdCard({ templatePath, photoBuffer, qrBuffer, user }) {
  console.log('=== drawIdCard called with user data:', JSON.stringify(user, null, 2));
  
  const CARD_WIDTH = 1011;
  const CARD_HEIGHT = 639;
  const DEBUG = false; // DISABLE DEBUG BOXES

  // Precise layout coordinates from position tool (1011 x 639 template)
  const layout = {
    photo: { x: 187, y: 238, width: 186, height: 184 },
    name: { x: 202, y: 463, width: 157, height: 25, maxFontSize: 24, minFontSize: 12 },
    linkedin: { x: 251, y: 503, width: 121, height: 20 },
    github: { x: 250, y: 531, width: 121, height: 20 },
    authKey: { x: 143, y: 578, width: 126, height: 20 },
    email: { x: 593, y: 579, width: 143, height: 20 },
    qr: { x: 676, y: 454, size: 100 }
  };

  // STEP 1: Create canvas at exact 1:1 scale (1011 x 639)
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d');

  // STEP 2: Draw template with TOP-LEFT ORIGIN (no centering)
  const template = await loadImage(templatePath);
  ctx.drawImage(template, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // STEP 3: PHOTO CLIPPING FIX (aligned ellipse with top-left origin)
  const photo = await loadImage(photoBuffer);
  
  ctx.save();
  ctx.beginPath();
  // Ellipse center = photo box center
  ctx.ellipse(
    layout.photo.x + layout.photo.width / 2,
    layout.photo.y + layout.photo.height / 2,
    layout.photo.width / 2,
    layout.photo.height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.clip();
  
  // Draw photo at TOP-LEFT of bounding box (fills to edges)
  ctx.drawImage(
    photo,
    layout.photo.x,
    layout.photo.y,
    layout.photo.width,
    layout.photo.height
  );
  ctx.restore();

  // STEP 5: QR CODE FIX with rounded corners to match template
  const qr = await loadImage(qrBuffer);
  ctx.save();
  
  // Create rounded rectangle clipping path for QR
  const qrRadius = 8; // Adjust this value to match your template's corner radius
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

  // STEP 4: TEXT DRAWING - SIMPLIFIED AND EXPLICIT
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.globalAlpha = 1.0; // Ensure full opacity
  ctx.fillStyle = '#FFFFFF'; // Pure white for dark template
  ctx.font = 'bold 20px sans-serif'; // Use generic sans-serif
  
  // Test text - hardcoded to ensure it appears
  console.log('Drawing test text with system sans-serif font...');
  ctx.fillText('TEST NAME HERE', layout.name.x, layout.name.y);
  ctx.fillText('github123', layout.github.x, layout.github.y);
  ctx.fillText('linkedin456', layout.linkedin.x, layout.linkedin.y);
  ctx.fillText('test@email.com', layout.email.x, layout.email.y);
  ctx.fillText('AUTH-KEY-TEST', layout.authKey.x, layout.authKey.y);
  
  ctx.restore();

  // STEP 6: DEBUG OVERLAY (red boxes prove alignment)
  if (DEBUG) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    
    // Photo box
    ctx.strokeRect(layout.photo.x, layout.photo.y, layout.photo.width, layout.photo.height);
    
    // Name box
    ctx.strokeRect(layout.name.x, layout.name.y, layout.name.width, layout.name.height);
    
    // QR box
    ctx.strokeRect(layout.qr.x, layout.qr.y, layout.qr.size, layout.qr.size);
    
    // Social boxes
    ctx.strokeRect(layout.linkedin.x, layout.linkedin.y, layout.linkedin.width, layout.linkedin.height);
    ctx.strokeRect(layout.github.x, layout.github.y, layout.github.width, layout.github.height);
    
    // Bottom text boxes
    ctx.strokeRect(layout.email.x, layout.email.y, layout.email.width, layout.email.height);
    ctx.strokeRect(layout.authKey.x, layout.authKey.y, layout.authKey.width, layout.authKey.height);
  }

  // Export at 1× scale
  return canvas.toBuffer('image/png');
}
