import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initPageAnimations(): void {
  const items = document.querySelectorAll('.gallery-item');
  if (items.length === 0) return;

  gsap.set(items, { opacity: 0, y: 40 });

  ScrollTrigger.batch(items, {
    onEnter: batch => gsap.to(batch, { 
      opacity: 1, 
      y: 0, 
      stagger: 0.1, 
      duration: 1,
      ease: 'power3.out',
      overwrite: true
    }),
    start: 'top 90%'
  });
  
  // Hover animations refined
  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    item.addEventListener('mouseenter', () => {
      gsap.to(img, {
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(img, {
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Parallax effect on scroll
    gsap.to(img, {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

function initPage(): void {
  ScrollTrigger.getAll().forEach(t => t.kill());
  initPageAnimations();
  
  setTimeout(() => ScrollTrigger.refresh(), 100);
}

function cleanup(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { initPage, cleanup };

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') initPage();
  else window.addEventListener('load', initPage);
  window.addEventListener('beforeunload', cleanup);
}