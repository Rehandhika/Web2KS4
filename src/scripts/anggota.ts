import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initPageAnimations(): void {
  const cards = document.querySelectorAll('.student-card');
  
  gsap.from(cards, {
    scrollTrigger: {
      trigger: '#anggota-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });
  
  // Hover micro-interactions
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  });
}

function filterOfficers(): void {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.student-card');
  
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach((b) => {
        b.classList.remove('bg-primary-600', 'text-white');
        b.classList.add('bg-gray-200', 'text-gray-700');
      });
      btn.classList.remove('bg-gray-200', 'text-gray-700');
      btn.classList.add('bg-primary-600', 'text-white');
      
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const role = cardElement.dataset.role;
        
        if (filter === 'all' || role === filter) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            display: 'block'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            onComplete: () => {
              cardElement.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

function initPage(): void {
  initPageAnimations();
  filterOfficers();
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
