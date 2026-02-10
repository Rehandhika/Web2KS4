import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initPageAnimations(): void {
  const items = document.querySelectorAll('.gallery-item');
  
  items.forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.5,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
  
  // Hover animations
  items.forEach((item) => {
    const img = item.querySelector('img');
    
    item.addEventListener('mouseenter', () => {
      gsap.to(img, {
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(img, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}

function initPage(): void {
  initPageAnimations();
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
