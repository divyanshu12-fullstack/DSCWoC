/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'space-black': '#0B0F1A',
        'midnight-blue': '#0E1629',
        'stellar-cyan': '#4CC9F0',
        'nebula-blue': '#72E0FF',
        'cosmic-purple': '#7A5CFF',
        'deep-space': '#0a0118',
        'midnight-void': '#0d0221',
        'nebula-pink': '#ec4899',
        'galaxy-violet': '#a855f7',
        'star-blue': '#3b82f6',
        'supernova-orange': '#f97316',
        'cosmos-indigo': '#6366f1',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 1s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)" },
          "100%": { boxShadow: "0 0 25px rgba(139, 92, 246, 0.8), 0 0 40px rgba(236, 72, 153, 0.5)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      }
    },
  },
  plugins: [],
}
