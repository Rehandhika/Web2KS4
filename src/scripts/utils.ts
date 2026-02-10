export function digitalReveal(el: HTMLElement, duration: number = 1.5) {
  const finalString = el.innerText;
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&';
  const durationPerChar = duration / finalString.length;
  
  el.innerText = '';
  
  finalString.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.style.opacity = '0';
    span.style.display = 'inline-block';
    span.style.minWidth = char === ' ' ? '0.3em' : 'auto';
    el.appendChild(span);

    const delay = index * durationPerChar * 0.5;
    
    // Rapid shuffle for this specific char
    const shuffleCount = 10;
    let currentShuffle = 0;
    
    const shuffle = () => {
      if (currentShuffle < shuffleCount) {
        span.innerText = chars[Math.floor(Math.random() * chars.length)];
        span.style.opacity = '0.5';
        span.style.color = '#00D1FF'; // CHANGED TO AZURE
        currentShuffle++;
        setTimeout(shuffle, 40);
      } else {
        span.innerText = char;
        span.style.opacity = '1';
        span.style.color = 'inherit';
      }
    };

    setTimeout(shuffle, delay * 1000);
  });
}

export class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: any[];
  frame: number;
  frameRequest: number;
  resolve: any;
  isAnimating: boolean;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.isAnimating = false;
  }

  setText(newText: string) {
    if (this.isAnimating) {
      cancelAnimationFrame(this.frameRequest);
    }
    
    this.isAnimating = true;
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30);
      this.queue.push({ from, to, start, end });
    }
    
    this.frame = 0;
    this.update();
    return promise;
  }

  cancel() {
    this.isAnimating = false;
    cancelAnimationFrame(this.frameRequest);
  }

  update() {
    if (!this.el || !this.isAnimating) return;

    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="opacity-40 text-azure">${char}</span>`; // CHANGED TO AZURE
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.isAnimating = false;
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}
