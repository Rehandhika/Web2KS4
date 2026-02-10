import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initPageAnimations(): void {
  const cards = document.querySelectorAll('.course-card');
  
  gsap.from(cards, {
    scrollTrigger: {
      trigger: '#courses-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  });
}

function initCollapsibleCards(): void {
  const cards = document.querySelectorAll('.course-card');
  
  cards.forEach((card) => {
    const header = card.querySelector('.course-header');
    const details = card.querySelector('.course-details');
    const arrow = card.querySelector('.course-arrow');
    let isOpen = false;
    
    if (!header || !details || !arrow) return;
    
    header.addEventListener('click', () => {
      isOpen = !isOpen;
      
      if (isOpen) {
        gsap.to(details, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onStart: () => {
            details.classList.remove('hidden');
          }
        });
        gsap.to(arrow, {
          rotate: 180,
          duration: 0.3
        });
      } else {
        gsap.to(details, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            details.classList.add('hidden');
          }
        });
        gsap.to(arrow, {
          rotate: 0,
          duration: 0.3
        });
      }
    });
  });
}

function initPage(): void {
  initPageAnimations();
  initCollapsibleCards();
  ScrollTrigger.refresh();
}

function cleanup(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { initPage, cleanup };

if (typeof window !== 'undefined') {
  initPage();
  window.addEventListener('beforeunload', cleanup);
}
