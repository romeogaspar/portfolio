import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400&display=swap');`;

const css = `
${FONTS}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0A0A08;
  --bg2: #111110;
  --bg3: #1A1A18;
  --line: rgba(255,255,255,0.07);
  --white: #F5F4F0;
  --off: #A8A49C;
  --lime: #C8F53C;
  --lime-dark: #9DC42A;
  --red: #E84C3D;
  --font-display: 'Syne', sans-serif;
  --font-serif: 'Instrument Serif', serif;
  --font-mono: 'JetBrains Mono', monospace;
  --ease: cubic-bezier(0.16,1,0.3,1);
}
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--white); font-family: var(--font-display); overflow-x: hidden; }
::selection { background: var(--lime); color: var(--bg); }

/* NOISE OVERLAY */
body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 9999; opacity: 0.6; }

/* NAV */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 500; padding: 0 3rem; height: 64px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); background: rgba(10,10,8,0.85); backdrop-filter: blur(20px); }
.nav-logo { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.nav-logo-dot { width: 8px; height: 8px; background: var(--lime); border-radius: 50%; animation: pulse 2s ease infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
.nav-links { display: flex; gap: 2rem; align-items: center; }
.nav-link { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--off); cursor: pointer; background: none; border: none; font-family: var(--font-display); transition: color 0.2s; font-weight: 500; }
.nav-link:hover, .nav-link.active { color: var(--white); }
.nav-cta { background: var(--lime); color: var(--bg); padding: 9px 22px; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; border: none; cursor: pointer; font-family: var(--font-display); font-weight: 700; transition: all 0.2s; }
.nav-cta:hover { background: var(--white); transform: translateY(-1px); }
.nav-mobile { display: none; background: none; border: none; color: var(--white); font-size: 1.3rem; cursor: pointer; }

/* HERO */
.hero { min-height: 100vh; padding-top: 64px; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 4rem; position: relative; overflow: hidden; }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 80px 80px; }
.hero-grad { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(200,245,60,0.06) 0%, transparent 70%); }
.hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; position: relative; z-index: 2; width: 100%; }
.hero-tag { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lime); margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
.hero-tag::before { content: ''; width: 32px; height: 1px; background: var(--lime); }
.hero-title { font-size: clamp(4rem, 9vw, 10rem); font-weight: 800; line-height: 0.88; letter-spacing: -0.04em; margin-bottom: 2rem; }
.hero-title-serif { font-family: var(--font-serif); font-weight: 400; font-style: italic; color: var(--lime); font-size: clamp(4rem, 9vw, 10rem); line-height: 0.88; letter-spacing: -0.02em; }
.hero-bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4rem; flex-wrap: wrap; gap: 2rem; }
.hero-desc { font-size: 0.95rem; color: var(--off); line-height: 1.8; max-width: 400px; font-weight: 400; }
.hero-stats { display: flex; gap: 3rem; }
.hero-stat-val { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em; color: var(--white); }
.hero-stat-lbl { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--off); margin-top: 2px; }
.hero-scroll { position: absolute; right: 4rem; bottom: 4rem; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; }
.hero-scroll span { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--off); writing-mode: vertical-rl; }
.hero-scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, var(--lime), transparent); animation: scrollline 2s ease-in-out infinite; }
@keyframes scrollline { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
.hero-marquee-wrap { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 12px 0; overflow: hidden; margin-top: 4rem; position: relative; z-index: 2; }
.hero-marquee { display: flex; gap: 3rem; animation: marquee 20s linear infinite; white-space: nowrap; }
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.hero-marquee-item { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--off); display: flex; align-items: center; gap: 3rem; }
.hero-marquee-dot { width: 4px; height: 4px; background: var(--lime); border-radius: 50%; flex-shrink: 0; }

/* SECTIONS */
.section { padding: 7rem 0; }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
.section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; flex-wrap: wrap; gap: 1.5rem; }
.section-tag { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lime); margin-bottom: 0.75rem; }
.section-title { font-size: clamp(2.5rem, 4vw, 4rem); font-weight: 800; letter-spacing: -0.03em; line-height: 0.95; }
.section-title em { font-family: var(--font-serif); font-weight: 400; font-style: italic; color: var(--off); }

/* FILTERS */
.filter-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filter-btn { background: transparent; border: 1px solid var(--line); color: var(--off); padding: 8px 18px; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; font-family: var(--font-display); font-weight: 600; transition: all 0.2s; }
.filter-btn.active, .filter-btn:hover { background: var(--lime); border-color: var(--lime); color: var(--bg); }

/* PROJECTS GRID */
.projects-section { background: var(--bg); border-top: 1px solid var(--line); }
.projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); }
.project-card { background: var(--bg); overflow: hidden; cursor: pointer; position: relative; group; transition: transform 0.3s var(--ease); }
.project-card:hover { z-index: 2; }
.project-img-wrap { overflow: hidden; aspect-ratio: 4/3; position: relative; }
.project-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease), filter 0.4s; filter: saturate(0.8); }
.project-card:hover .project-img-wrap img { transform: scale(1.06); filter: saturate(1); }
.project-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.2) 60%, transparent 100%); opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; }
.project-card:hover .project-overlay { opacity: 1; }
.project-expand-btn { position: absolute; top: 1rem; right: 1rem; width: 36px; height: 36px; background: var(--lime); color: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; opacity: 0; transform: scale(0.7); transition: all 0.25s var(--ease); cursor: pointer; border: none; }
.project-card:hover .project-expand-btn { opacity: 1; transform: scale(1); }
.project-info { padding: 1.5rem; border-top: 1px solid var(--line); }
.project-cat { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--lime); margin-bottom: 0.4rem; }
.project-title { font-size: 1rem; font-weight: 700; color: var(--white); margin-bottom: 0.25rem; letter-spacing: -0.01em; }
.project-meta { font-family: var(--font-mono); font-size: 0.62rem; color: var(--off); }
.project-card.featured { grid-column: span 2; }
.project-card.featured .project-img-wrap { aspect-ratio: 16/7; }

/* MODAL */
.modal-backdrop { position: fixed; inset: 0; background: rgba(10,10,8,0.92); z-index: 800; display: flex; align-items: center; justify-content: center; padding: 2rem; backdrop-filter: blur(8px); animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
.modal { background: var(--bg2); border: 1px solid var(--line); max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s var(--ease); position: relative; }
@keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
.modal-close { position: absolute; top: 1.5rem; right: 1.5rem; background: var(--bg3); border: 1px solid var(--line); color: var(--off); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; z-index: 1; transition: all 0.2s; }
.modal-close:hover { background: var(--red); color: var(--white); border-color: var(--red); }
.modal-img { width: 100%; aspect-ratio: 16/8; object-fit: cover; }
.modal-body { padding: 2.5rem; }
.modal-cat { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lime); margin-bottom: 0.75rem; }
.modal-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; }
.modal-desc { font-size: 0.9rem; color: var(--off); line-height: 1.9; margin-bottom: 2rem; }
.modal-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.modal-tag { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.08em; padding: 5px 12px; border: 1px solid var(--line); color: var(--off); }
.modal-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--line); margin-top: 2rem; }
.modal-stat { background: var(--bg2); padding: 1.25rem; }
.modal-stat-val { font-size: 1.5rem; font-weight: 800; color: var(--lime); }
.modal-stat-lbl { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--off); margin-top: 0.2rem; }

/* TESTIMONIALS */
.testimonials-section { background: var(--bg2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); overflow: hidden; }
.testimonials-track-wrap { position: relative; }
.testimonials-track { display: flex; transition: transform 0.6s var(--ease); }
.testimonial-slide { min-width: 100%; padding: 0 4rem; }
.testimonial-inner { max-width: 800px; margin: 0 auto; text-align: center; }
.testimonial-quote-mark { font-family: var(--font-serif); font-size: 6rem; line-height: 1; color: var(--lime); opacity: 0.3; margin-bottom: -1rem; display: block; }
.testimonial-text { font-family: var(--font-serif); font-size: clamp(1.3rem, 2.5vw, 2rem); font-style: italic; line-height: 1.5; color: var(--white); margin-bottom: 2.5rem; }
.testimonial-author { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
.testimonial-author-img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--lime); margin-bottom: 0.5rem; }
.testimonial-name { font-size: 0.88rem; font-weight: 700; color: var(--white); }
.testimonial-role { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--off); }
.testimonial-controls { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 3rem; }
.testimonial-btn { background: transparent; border: 1px solid var(--line); color: var(--off); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; transition: all 0.2s; }
.testimonial-btn:hover { background: var(--lime); border-color: var(--lime); color: var(--bg); }
.testimonial-dots { display: flex; gap: 0.5rem; }
.testimonial-dot { width: 6px; height: 6px; background: var(--line); border-radius: 50%; cursor: pointer; transition: all 0.2s; border: none; }
.testimonial-dot.active { background: var(--lime); width: 20px; border-radius: 3px; }

/* ABOUT */
.about-section { background: var(--bg); border-top: 1px solid var(--line); }
.about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
.about-img-frame { position: relative; }
.about-img-frame img { width: 100%; aspect-ratio: 3/4; object-fit: cover; filter: saturate(0.7) contrast(1.1); }
.about-img-badge { position: absolute; bottom: -1.5rem; right: -1.5rem; background: var(--lime); color: var(--bg); padding: 1.5rem; }
.about-img-badge-val { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; display: block; line-height: 1; }
.about-img-badge-lbl { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.2rem; }
.about-body { }
.about-lead { font-family: var(--font-serif); font-size: 1.4rem; font-style: italic; color: var(--white); line-height: 1.6; margin-bottom: 2rem; border-left: 2px solid var(--lime); padding-left: 1.5rem; }
.about-text { font-size: 0.88rem; color: var(--off); line-height: 1.9; margin-bottom: 1.5rem; }
.about-values { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); margin-top: 2.5rem; }
.about-value { background: var(--bg); padding: 1.25rem; }
.about-value-icon { font-size: 1.3rem; margin-bottom: 0.5rem; }
.about-value-title { font-size: 0.82rem; font-weight: 700; color: var(--white); margin-bottom: 0.25rem; }
.about-value-text { font-family: var(--font-mono); font-size: 0.62rem; color: var(--off); line-height: 1.6; }
.team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--line); margin-top: 5rem; }
.team-card { background: var(--bg); overflow: hidden; cursor: pointer; }
.team-card img { width: 100%; aspect-ratio: 3/4; object-fit: cover; filter: grayscale(40%); transition: filter 0.4s, transform 0.4s var(--ease); }
.team-card:hover img { filter: grayscale(0%); transform: scale(1.03); }
.team-info { padding: 1.25rem; border-top: 1px solid var(--line); }
.team-name { font-size: 0.88rem; font-weight: 700; color: var(--white); }
.team-role { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lime); margin-top: 0.2rem; }

/* CONTACT */
.contact-section { background: var(--bg2); border-top: 1px solid var(--line); }
.contact-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; }
.contact-left { }
.contact-big { font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 800; letter-spacing: -0.04em; line-height: 0.9; margin-bottom: 2rem; }
.contact-big em { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--lime); }
.contact-channels { margin-top: 3rem; display: flex; flex-direction: column; gap: 1px; }
.contact-channel { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--line); }
.contact-channel-label { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--off); }
.contact-channel-value { font-size: 0.85rem; color: var(--white); font-weight: 500; }
.contact-form { background: var(--bg3); padding: 2.5rem; border: 1px solid var(--line); }
.contact-form-title { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lime); margin-bottom: 2rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
.field { margin-bottom: 1.25rem; }
.field-label { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--off); display: block; margin-bottom: 0.5rem; }
.field-input, .field-textarea, .field-select { width: 100%; background: var(--bg); border: 1px solid var(--line); color: var(--white); padding: 12px 14px; font-size: 0.88rem; font-family: var(--font-display); outline: none; transition: border-color 0.2s; appearance: none; }
.field-input::placeholder, .field-textarea::placeholder { color: rgba(168,164,156,0.4); }
.field-input:focus, .field-textarea:focus, .field-select:focus { border-color: var(--lime); }
.field-textarea { height: 110px; resize: vertical; }
.field-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A8A49C' stroke-width='1.2' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
.field-select option { background: var(--bg); }
.honeypot { display: none; }
.submit-row { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; }
.submit-note { font-family: var(--font-mono); font-size: 0.58rem; color: var(--off); }
.submit-btn { background: var(--lime); color: var(--bg); padding: 14px 32px; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; border: none; cursor: pointer; font-family: var(--font-display); font-weight: 700; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.submit-btn:hover { background: var(--white); transform: translateY(-2px); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.contact-success { text-align: center; padding: 4rem 2rem; }
.contact-success-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
.contact-success h3 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.75rem; }
.contact-success p { font-size: 0.85rem; color: var(--off); line-height: 1.8; }

/* FOOTER */
.footer { background: var(--bg); border-top: 1px solid var(--line); padding: 4rem 0 2rem; }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
.footer-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 2rem; }
.footer-logo { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
.footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }
.footer-link { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--off); background: none; border: none; cursor: pointer; font-family: var(--font-mono); transition: color 0.2s; }
.footer-link:hover { color: var(--lime); }
.footer-bottom { border-top: 1px solid var(--line); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.footer-copy { font-family: var(--font-mono); font-size: 0.6rem; color: var(--off); letter-spacing: 0.08em; }
.footer-socials { display: flex; gap: 0.5rem; }
.footer-social { width: 34px; height: 34px; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 0.65rem; color: var(--off); cursor: pointer; transition: all 0.2s; background: none; }
.footer-social:hover { border-color: var(--lime); color: var(--lime); }

/* TOAST */
.toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--lime); color: var(--bg); padding: 0.9rem 1.5rem; font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.08em; font-weight: 700; z-index: 999; transform: translateY(80px); opacity: 0; transition: all 0.3s var(--ease); pointer-events: none; }
.toast.show { transform: translateY(0); opacity: 1; }

/* RESPONSIVE */
@media (max-width: 960px) {
  .nav-links { display: none; }
  .nav-mobile { display: block; }
  .nav { padding: 0 1.5rem; }
  .hero-inner, .section-inner, .footer-inner { padding: 0 1.5rem; }
  .hero-title { font-size: clamp(3rem, 10vw, 6rem); }
  .projects-grid { grid-template-columns: 1fr 1fr; }
  .project-card.featured { grid-column: span 2; }
  .about-layout, .contact-layout { grid-template-columns: 1fr; gap: 3rem; }
  .team-grid { grid-template-columns: repeat(2,1fr); }
  .form-row { grid-template-columns: 1fr; }
  .hero-stats { flex-wrap: wrap; gap: 2rem; }
  .testimonial-slide { padding: 0 1.5rem; }
  .about-values { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .projects-grid { grid-template-columns: 1fr; }
  .project-card.featured { grid-column: auto; }
  .about-img-badge { right: 0; bottom: 0; }
  .hero-scroll { display: none; }
  .modal { margin: 1rem; }
  .section-header { flex-direction: column; align-items: flex-start; }
}
`;

const PROJECTS = [
  { id:1, cat:"Branding", title:"Meridian Identity System", meta:"2024 · Brand Strategy", img:"https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=900&q=80", desc:"Complete visual identity overhaul for a Series B fintech company. Included logo system, design tokens, brand guidelines, and component library.", tags:["Brand Strategy","Visual Identity","Design System"], stats:[["340%","Engagement Lift"],["18","Deliverables"],["6wk","Timeline"]], featured:true },
  { id:2, cat:"Web Design", title:"Aura E-Commerce Platform", meta:"2024 · UI/UX + Dev", img:"https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80", desc:"Full redesign of a premium skincare e-commerce site. Focused on conversion optimisation and luxury brand feel.", tags:["UI/UX","Next.js","Shopify"], stats:[["62%","Conv. Rate Up"],["2.1s","Load Time"],["4.9","Client Score"]] },
  { id:3, cat:"Motion", title:"Nocturne Campaign", meta:"2023 · Animation", img:"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80", desc:"Motion identity and social content for a luxury fragrance launch. 12 hero animations plus a full reel.", tags:["After Effects","3D Motion","Social"], stats:[["2.4M","Impressions"],["12","Assets"],["Award","Shortlisted"]] },
  { id:4, cat:"Web Design", title:"Construct Corporate Site", meta:"2024 · Web", img:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", desc:"Corporate presence for a Category AAA construction firm. Full Next.js build with CMS integration and SEO foundation.", tags:["Next.js","Payload CMS","SEO"], stats:[["98","PageSpeed"],["7","Sections"],["3wk","Build"]] },
  { id:5, cat:"Events", title:"Celebra Events Platform", meta:"2024 · Full Stack", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", desc:"End-to-end event booking platform for a premier events company. Booking system, gallery, and admin dashboard.", tags:["React","Node.js","PostgreSQL"], stats:[["3-step","Booking Flow"],["Full","Admin Panel"],["Mobile","Optimised"]] },
  { id:6, cat:"Research", title:"Artist Digital Archive", meta:"2023 · Editorial", img:"https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80", desc:"Editorial-magazine style personal site for a Manila-based choreographer and researcher. Custom cursor, animated transitions.", tags:["React","Sanity CMS","Editorial"], stats:[["7","Sections"],["Custom","CMS Setup"],["4.9","Review"]] },
];

const TESTIMONIALS = [
  { text:"Working with this team was transformative. They didn't just build a website — they built a brand platform that changed how our clients perceive us overnight.", name:"Sarah Chen", role:"CEO, Meridian Capital", img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80" },
  { text:"The attention to detail is extraordinary. Every animation, every interaction feels considered. Our conversion rate jumped 62% in the first month post-launch.", name:"Marcus Okafor", role:"Head of Digital, Aura Beauty", img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80" },
  { text:"We've worked with five agencies before this. The communication, quality, and delivery speed here is in a completely different league. Already recommending to our partners.", name:"Lena Park", role:"Founder, Nocturne Labs", img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80" },
  { text:"From brief to launch in three weeks, and the result looks like it took six months. The CMS handover was thorough — our team was editing content on day one.", name:"James Villanueva", role:"MD, Construct Corp", img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80" },
];

const TEAM = [
  { name:"Alex Rivera", role:"Creative Director", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name:"Mia Santos", role:"Lead Designer", img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name:"Jordan Kim", role:"Full Stack Dev", img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { name:"Priya Nair", role:"Strategy & SEO", img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
];

const PAGES = ["home","projects","about","contact"];

export default function App() {
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [contactDone, setContactDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(""); const [toastVisible, setToastVisible] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", company:"", budget:"", service:"", message:"", hp:"" });
  const autoRef = useRef(null);

  // Testimonial auto-rotate
  useEffect(() => {
    autoRef.current = setInterval(() => setTestimonialIdx(i => (i+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(autoRef.current);
  }, []);

  const goTestimonial = (idx) => { clearInterval(autoRef.current); setTestimonialIdx(idx); autoRef.current = setInterval(() => setTestimonialIdx(i => (i+1) % TESTIMONIALS.length), 5000); };

  const showToast = (msg) => { setToast(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), 3500); };

  const cats = ["All", ...Array.from(new Set(PROJECTS.map(p => p.cat)))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === filter);

  const handleSubmit = () => {
    if (form.hp) return; // honeypot
    if (!form.name || !form.email) { showToast("Please fill in name and email."); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setContactDone(true); showToast("✓ Message sent!"); }, 1200);
  };

  const nav = (p) => { setPage(p); window.scrollTo(0,0); };

  const marqueeItems = ["Web Design","Brand Identity","Motion Design","UX Strategy","React Development","CMS Integration","SEO","Performance","Accessibility"];

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => nav("home")}><div className="nav-logo-dot"/>Studio.dev</div>
        <div className="nav-links">
          {PAGES.map(p => <button key={p} className={`nav-link${page===p?" active":""}`} onClick={() => nav(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}
        </div>
        <button className="nav-cta" onClick={() => nav("contact")}>Start a Project</button>
        <button className="nav-mobile" onClick={() => { const i = PAGES.indexOf(page); nav(PAGES[(i+1)%PAGES.length]); }}>☰</button>
      </nav>

      {/* ── HOME ── */}
      {page === "home" && <>
        <section className="hero">
          <div className="hero-grid"/><div className="hero-grad"/>
          <div className="hero-inner">
            <div className="hero-tag">Digital Studio · Est. 2018</div>
            <h1 className="hero-title">WE CRAFT<br /><span className="hero-title-serif">digital</span><br />EXPERIENCES</h1>
            <div className="hero-bottom">
              <p className="hero-desc">Branding, web design, and interactive builds for companies that refuse to blend in.</p>
              <div className="hero-stats">
                {[["80+","Projects"],["98%","Satisfaction"],["4.8★","Avg. Rating"]].map(([v,l]) => (
                  <div key={l}><div className="hero-stat-val">{v}</div><div className="hero-stat-lbl">{l}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-marquee-wrap">
            <div className="hero-marquee">
              {[...marqueeItems,...marqueeItems,...marqueeItems,...marqueeItems].map((item,i) => (
                <span key={i} className="hero-marquee-item">{item}<span className="hero-marquee-dot"/></span>
              ))}
            </div>
          </div>
          <div className="hero-scroll"><span>Scroll</span><div className="hero-scroll-line"/></div>
        </section>

        {/* PROJECTS PREVIEW */}
        <section className="section projects-section">
          <div className="section-inner">
            <div className="section-header">
              <div><div className="section-tag">Selected Work</div><h2 className="section-title">Recent <em>Projects</em></h2></div>
              <button className="nav-cta" onClick={() => nav("projects")}>View All →</button>
            </div>
            <div className="projects-grid">
              {PROJECTS.slice(0,4).map((p,i) => (
                <div key={p.id} className={`project-card${i===0?" featured":""}`} onClick={() => setModal(p)}>
                  <div className="project-img-wrap"><img src={p.img} alt={p.title} loading="lazy"/>
                    <div className="project-overlay"><div style={{color:"var(--lime)",fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"0.4rem"}}>{p.cat}</div><div style={{fontFamily:"var(--font-display)",fontSize:"1.1rem",fontWeight:700}}>{p.title}</div></div>
                    <button className="project-expand-btn" onClick={e=>{e.stopPropagation();setModal(p);}}>+</button>
                  </div>
                  <div className="project-info"><div className="project-cat">{p.cat}</div><div className="project-title">{p.title}</div><div className="project-meta">{p.meta}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section testimonials-section">
          <div className="section-inner" style={{marginBottom:"3rem"}}>
            <div className="section-tag">Client Feedback</div>
            <h2 className="section-title">What They <em>Say</em></h2>
          </div>
          <div className="testimonials-track-wrap">
            <div className="testimonials-track" style={{transform:`translateX(-${testimonialIdx*100}%)`}}>
              {TESTIMONIALS.map((t,i) => (
                <div key={i} className="testimonial-slide">
                  <div className="testimonial-inner">
                    <span className="testimonial-quote-mark">"</span>
                    <p className="testimonial-text">{t.text}</p>
                    <div className="testimonial-author">
                      <img className="testimonial-author-img" src={t.img} alt={t.name}/>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="testimonial-controls">
            <button className="testimonial-btn" onClick={() => goTestimonial((testimonialIdx-1+TESTIMONIALS.length)%TESTIMONIALS.length)}>←</button>
            <div className="testimonial-dots">
              {TESTIMONIALS.map((_,i) => <button key={i} className={`testimonial-dot${testimonialIdx===i?" active":""}`} onClick={() => goTestimonial(i)}/>)}
            </div>
            <button className="testimonial-btn" onClick={() => goTestimonial((testimonialIdx+1)%TESTIMONIALS.length)}>→</button>
          </div>
        </section>
      </>}

      {/* ── PROJECTS ── */}
      {page === "projects" && (
        <section className="section projects-section" style={{paddingTop:"7rem"}}>
          <div className="section-inner">
            <div className="section-header">
              <div><div className="section-tag">Portfolio</div><h2 className="section-title">All <em>Work</em></h2></div>
              <div className="filter-row">
                {cats.map(c => <button key={c} className={`filter-btn${filter===c?" active":""}`} onClick={() => setFilter(c)}>{c}</button>)}
              </div>
            </div>
            <div className="projects-grid">
              {filtered.map((p,i) => (
                <div key={p.id} className={`project-card${p.featured?" featured":""}`} onClick={() => setModal(p)}>
                  <div className="project-img-wrap"><img src={p.img} alt={p.title} loading="lazy"/>
                    <div className="project-overlay"><div style={{color:"var(--lime)",fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"0.4rem"}}>{p.cat}</div><div style={{fontFamily:"var(--font-display)",fontSize:"1.1rem",fontWeight:700}}>{p.title}</div></div>
                    <button className="project-expand-btn" onClick={e=>{e.stopPropagation();setModal(p);}}>+</button>
                  </div>
                  <div className="project-info"><div className="project-cat">{p.cat}</div><div className="project-title">{p.title}</div><div className="project-meta">{p.meta}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT ── */}
      {page === "about" && (
        <section className="section about-section" style={{paddingTop:"7rem"}}>
          <div className="section-inner">
            <div className="section-tag">Our Story</div>
            <div className="about-layout" style={{marginTop:"3rem"}}>
              <div className="about-img-frame">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80" alt="Studio"/>
                <div className="about-img-badge"><span className="about-img-badge-val">6</span><span className="about-img-badge-lbl">Years Building</span></div>
              </div>
              <div className="about-body">
                <h2 className="section-title" style={{marginBottom:"2rem"}}>Built for <em>impact,</em><br />not just aesthetics</h2>
                <p className="about-lead">"We believe a great website isn't just beautiful — it's a business tool that earns its cost within months."</p>
                <p className="about-text">Studio.dev was founded in 2018 with one conviction: most digital agencies optimise for looking impressive in awards shows, not for results their clients actually care about. We're different — every decision we make is tied back to a measurable outcome.</p>
                <p className="about-text">Our lean team of designers, developers, and strategists has delivered 80+ projects across branding, web, and motion — from funded startups to established enterprises. We bring the rigour of a large agency with the accountability of a boutique.</p>
                <div className="about-values">
                  {[{icon:"⚡",title:"Performance First",text:"Sub-3s loads, clean code, 90+ PageSpeed on every delivery."},
                    {icon:"🎯",title:"Results-Led",text:"We track KPIs, not just aesthetics. Your success is our scorecard."},
                    {icon:"🔒",title:"Full Accountability",text:"One point of contact. No handoffs to juniors. Senior work always."},
                    {icon:"♿",title:"Accessible by Default",text:"WCAG 2.1 AA compliance built in, not bolted on after."}].map(v => (
                    <div key={v.title} className="about-value"><div className="about-value-icon">{v.icon}</div><div className="about-value-title">{v.title}</div><div className="about-value-text">{v.text}</div></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="section-tag" style={{marginTop:"6rem"}}>The Team</div>
            <h2 className="section-title" style={{marginBottom:"3rem",marginTop:"0.75rem"}}>Who <em>Builds</em> Your Vision</h2>
            <div className="team-grid">
              {TEAM.map(t => (
                <div key={t.name} className="team-card">
                  <img src={t.img} alt={t.name}/>
                  <div className="team-info"><div className="team-name">{t.name}</div><div className="team-role">{t.role}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      {page === "contact" && (
        <section className="section contact-section" style={{paddingTop:"7rem"}}>
          <div className="section-inner">
            <div className="contact-layout">
              <div className="contact-left">
                <div className="section-tag">Get in Touch</div>
                <h2 className="contact-big">Start a<br /><em>project</em><br />with us.</h2>
                <p style={{fontSize:"0.88rem",color:"var(--off)",lineHeight:1.9,marginTop:"1.5rem"}}>We take on 4–6 new projects per quarter to ensure every client gets our full attention. Tell us what you're building.</p>
                <div className="contact-channels">
                  {[{label:"Email",value:"hello@studio.dev"},{label:"Response",value:"Within 24 hours"},{label:"Based",value:"Global · Remote-First"},{label:"Availability",value:"Q3 2025 · 2 Spots Left"}].map(c => (
                    <div key={c.label} className="contact-channel"><span className="contact-channel-label">{c.label}</span><span className="contact-channel-value">{c.value}</span></div>
                  ))}
                </div>
              </div>
              <div>
                {contactDone ? (
                  <div className="contact-form">
                    <div className="contact-success">
                      <span className="contact-success-icon">✦</span>
                      <h3>Message Received.</h3>
                      <p>We'll review your brief and reply within 24 hours with initial thoughts and next steps.</p>
                      <button className="submit-btn" style={{margin:"2rem auto 0",display:"flex"}} onClick={() => {setContactDone(false);setForm({name:"",email:"",company:"",budget:"",service:"",message:"",hp:""});}}>Send Another →</button>
                    </div>
                  </div>
                ) : (
                  <div className="contact-form">
                    <div className="contact-form-title">Project Brief</div>
                    <div className="form-row">
                      <div className="field" style={{marginBottom:0}}><label className="field-label">Your Name *</label><input className="field-input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                      <div className="field" style={{marginBottom:0}}><label className="field-label">Email *</label><input type="email" className="field-input" placeholder="you@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                    </div>
                    <div className="form-row" style={{marginTop:"1.25rem"}}>
                      <div className="field" style={{marginBottom:0}}><label className="field-label">Company</label><input className="field-input" placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></div>
                      <div className="field" style={{marginBottom:0}}><label className="field-label">Budget Range</label>
                        <select className="field-select" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>
                          <option value="">Select range</option>
                          <option>Under $2,000</option><option>$2,000 – $5,000</option><option>$5,000 – $15,000</option><option>$15,000 – $50,000</option><option>$50,000+</option>
                        </select>
                      </div>
                    </div>
                    <div className="field" style={{marginTop:"1.25rem"}}><label className="field-label">Service Needed</label>
                      <select className="field-select" value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                        <option value="">Select service</option>
                        <option>Brand Identity</option><option>Web Design & Development</option><option>Motion & Animation</option><option>UX Strategy</option><option>Full Package</option>
                      </select>
                    </div>
                    <div className="field"><label className="field-label">Tell us about your project</label><textarea className="field-textarea" placeholder="What are you building? Who's the audience? What does success look like?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></div>
                    <input className="honeypot" type="text" value={form.hp} onChange={e=>setForm({...form,hp:e.target.value})} tabIndex="-1" autoComplete="off"/>
                    <div className="submit-row">
                      <span className="submit-note">Spam-protected · Replies in &lt;24hr</span>
                      <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>{submitting ? "Sending…" : "Send Brief →"}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-logo"><div className="nav-logo-dot"/>Studio.dev</div>
            <div className="footer-links">
              {PAGES.map(p => <button key={p} className="footer-link" onClick={() => nav(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 Studio.dev · All rights reserved · Semantic markup · WCAG 2.1 AA</div>
            <div className="footer-socials">
              {["tw","li","ig","gh"].map(s => <button key={s} className="footer-social">{s}</button>)}
            </div>
          </div>
        </div>
      </footer>

      {/* PROJECT MODAL */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <img className="modal-img" src={modal.img.replace("w=800","w=1200")} alt={modal.title}/>
            <div className="modal-body">
              <div className="modal-cat">{modal.cat}</div>
              <div className="modal-title">{modal.title}</div>
              <p className="modal-desc">{modal.desc}</p>
              <div className="modal-tags">{modal.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}</div>
              <div className="modal-stats">
                {modal.stats.map(([v,l]) => <div key={l} className="modal-stat"><div className="modal-stat-val">{v}</div><div className="modal-stat-lbl">{l}</div></div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toastVisible?" show":""}`}>{toast}</div>
    </>
  );
}