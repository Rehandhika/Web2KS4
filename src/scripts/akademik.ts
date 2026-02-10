import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initPageAnimations(): void {
  const cards = document.querySelectorAll('.course-card');
  if (cards.length === 0) return;

  gsap.set(cards, { opacity: 0, y: 30 });

  ScrollTrigger.batch(cards, {
    onEnter: batch => gsap.to(batch, { 
      opacity: 1, 
      y: 0, 
      stagger: 0.1, 
      duration: 0.8,
      ease: 'power3.out',
      overwrite: true
    }),
    start: 'top 85%'
  });
}

function initCollapsibleCards(): void {
  const cards = document.querySelectorAll('.course-card');
  
  cards.forEach((card) => {
    const header = card.querySelector('.course-header');
    const details = card.querySelector('.course-details') as HTMLElement;
    const arrow = card.querySelector('.course-arrow');
    let isOpen = false;
    
    if (!header || !details || !arrow) return;
    
    header.addEventListener('click', () => {
      isOpen = !isOpen;
      
      if (isOpen) {
        gsap.set(details, { display: 'block', height: 0, opacity: 0 });
        gsap.to(details, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'expo.out',
          onComplete: () => ScrollTrigger.refresh()
        });
        gsap.to(arrow, { rotate: 180, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(details, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'expo.in',
          onComplete: () => {
            details.style.display = 'none';
            ScrollTrigger.refresh();
          }
        });
        gsap.to(arrow, { rotate: 0, duration: 0.4, ease: 'power2.out' });
      }
    });
  });
}

function initPage(): void {
  ScrollTrigger.getAll().forEach(t => t.kill());
  initPageAnimations();
  initCollapsibleCards();
  
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