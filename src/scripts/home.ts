import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initThreeHero, destroyThreeHero } from './ThreeHero';

gsap.registerPlugin(ScrollTrigger);

function initHeroAnimations(): void {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });
  
  // Heading fade + slide up
  tl.to('#hero-title', {
    opacity: 1,
    y: 0,
    duration: 0.6
  })
  // Subtitle fade
  .to('#hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.5
  }, '-=0.3')
  // CTA stagger
  .to('#hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.4
  }, '-=0.2')
  // 3D visual scale-in
  .to('#hero-visual', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.2');
}

function initStatisticsAnimation(): void {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach((stat) => {
    if (!stat) return;
    
    const finalValue = parseInt(stat.textContent || '0', 10);
    const animatedStat = stat as HTMLElement;
    
    // Prevent re-trigger
    if (animatedStat.dataset.animated === 'true') return;
    
    gsap.fromTo(
      animatedStat,
      { textContent: 0 },
      {
        textContent: finalValue,
        duration: 1.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: animatedStat,
          start: 'top 60%',
          toggleActions: 'play none none none',
          once: true
        },
        onUpdate: function () {
          animatedStat.textContent = Math.ceil(this.targets()[0].textContent).toString();
        },
        onComplete: () => {
          animatedStat.dataset.animated = 'true';
        }
      }
    );
  });
}

function initStatCardsHover(): void {
  const cards = document.querySelectorAll('.stat-card');
  
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -4,
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

async function initPage(): Promise<void> {
  // Initialize Three.js hero (desktop only)
  const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
  if (canvas && window.innerWidth >= 768) {
    await initThreeHero(canvas);
  }
  
  // Initialize animations
  initHeroAnimations();
  initStatisticsAnimation();
  initStatCardsHover();
  
  ScrollTrigger.refresh();
}

function cleanup(): void {
  destroyThreeHero();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { initPage, cleanup };

if (typeof window !== 'undefined') {
  initPage();
  window.addEventListener('beforeunload', cleanup);
}
