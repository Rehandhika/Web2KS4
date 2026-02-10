import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initPageAnimations(): void {
  const cards = document.querySelectorAll('.student-card');
  if (cards.length === 0) return;

  // Initial state via GSAP
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
  
  // Hover micro-interactions
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -5,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
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
      
      // Update active button style to match Azure theme
      filterButtons.forEach((b) => {
        b.classList.remove('bg-azure', 'text-midnight-900', 'border-azure');
        b.classList.add('bg-midnight-800', 'text-mist', 'border-white/10');
      });
      btn.classList.add('bg-azure', 'text-midnight-900', 'border-azure');
      btn.classList.remove('bg-midnight-800', 'text-mist', 'border-white/10');
      
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const role = cardElement.dataset.role;
        
        if (filter === 'all' || role === filter || (filter === 'Chairperson' && role !== 'Member')) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            display: 'block',
            ease: 'power2.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in',
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
  ScrollTrigger.getAll().forEach(t => t.kill());
  initPageAnimations();
  filterOfficers();
  
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
