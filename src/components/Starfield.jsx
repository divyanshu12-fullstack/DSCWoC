import { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let shootingStars = [];
    let nebulaParticles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    // Create stars with color variations
    const createStars = (count) => {
      stars = [];
      for (let i = 0; i < count; i++) {
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.7) {
          color = { r: 255, g: 255, b: 255 }; // White
        } else if (colorChoice < 0.85) {
          color = { r: 139, g: 92, b: 246 }; // Purple
        } else {
          color = { r: 236, g: 72, b: 153 }; // Pink
        }
        
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8,
          opacity: Math.random() * 0.8 + 0.2,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          color: color,
        });
      }
    };

    // Create nebula particles
    const createNebulaParticles = (count) => {
      nebulaParticles = [];
      for (let i = 0; i < count; i++) {
        nebulaParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 40 + 20,
          opacity: Math.random() * 0.15 + 0.05,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          color: Math.random() > 0.5 ? { r: 139, g: 92, b: 246 } : { r: 236, g: 72, b: 153 },
        });
      }
    };

    // Create shooting star
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? { r: 139, g: 92, b: 246 } : { r: 236, g: 72, b: 153 },
      });
    };

    // Animate everything
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula particles first (background layer)
      nebulaParticles.forEach((particle) => {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - particle.radius,
          particle.y - particle.radius,
          particle.radius * 2,
          particle.radius * 2
        );

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius;
        if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius;
        if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius;
      });

      // Draw stars with twinkling
      stars.forEach((star) => {
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Add glow to colored stars
        if (star.color.r !== 255) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
          glow.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity})`);
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(star.x - star.radius * 3, star.y - star.radius * 3, star.radius * 6, star.radius * 6);
        }
        
        ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity})`;
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });

      // Draw shooting stars
      shootingStars.forEach((star, index) => {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        const endX = star.x + Math.cos(star.angle) * star.length;
        const endY = star.y + Math.sin(star.angle) * star.length;
        
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Add glow
        ctx.strokeStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity * 0.3})`;
        ctx.lineWidth = 4;
        ctx.stroke();

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.01;

        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    createStars(300);
    createNebulaParticles(15);
    animate();

    // Create shooting stars periodically
    const shootingStarInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        createShootingStar();
      }
    }, 2000);

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      createStars(300);
      createNebulaParticles(15);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(shootingStarInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'radial-gradient(ellipse at 20% 20%, rgba(13, 2, 33, 0.8) 0%, rgba(0, 0, 0, 1) 50%), radial-gradient(ellipse at 80% 80%, rgba(26, 5, 51, 0.6) 0%, rgba(0, 0, 0, 1) 50%), #000000'
      }}
    />
  );
};

export default Starfield;
