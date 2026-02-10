import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initThreeHero, destroyThreeHero } from './ThreeHero';

gsap.registerPlugin(ScrollTrigger);

function initHeroEntrance(): void {
  const lines = document.querySelectorAll('.hero-line');
  const label = document.getElementById('hero-label');
  const subtitle = document.getElementById('hero-subtitle');
  const cta = document.getElementById('hero-cta');
  const visual = document.getElementById('hero-visual');

  if (!lines.length) return;

  // Kill any running animations on these elements
  gsap.killTweensOf([lines, label, subtitle, cta, visual]);

  const tl = gsap.timeline({ 
    defaults: { ease: 'expo.out', duration: 1.5 }
  });

  tl.to(label, { opacity: 1, duration: 1 })
    .to(lines, {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      ease: 'power4.out'
    }, '-=0.8')
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 1.2
    }, '-=1.2')
    .to(cta, {
      opacity: 1,
      y: 0,
      duration: 1
    }, '-=1')
    .to(visual, {
      opacity: 1,
      duration: 2,
      scale: 1
    }, '-=1.5');
}

function initScrollAnimations(): void {
  // Stat Numbers Reveal - Solid simple approach
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((stat) => {
    const finalVal = parseInt(stat.getAttribute('data-value') || '0', 10);
    gsap.fromTo(stat, 
      { textContent: '0' },
      {
        textContent: finalVal,
        duration: 2,
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%'
        },
        snap: { textContent: 1 },
        ease: 'power2.out'
      }
    );
  });
}

async function initPage(): Promise<void> {
  const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
  if (canvas) {
    await initThreeHero(canvas);
  }
  
  initHeroEntrance();
  initScrollAnimations();
  ScrollTrigger.refresh();
}

function cleanup(): void {
  destroyThreeHero();
  ScrollTrigger.getAll().forEach(t => t.kill());
}

export { initPage, cleanup };
