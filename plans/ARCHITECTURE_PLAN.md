# Class Portfolio Website - Architecture Plan

## Project Overview
A production-ready static multi-page website built with Astro, TailwindCSS, GSAP + ScrollTrigger, Three.js, and TypeScript. Optimized for Netlify deployment with clean modular architecture.

---

## Phase 1: Installation & Configuration

### 1.1 Initialize Astro Project with TypeScript

```bash
# Create new Astro project
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git

# Install dependencies
npm install

# Install TailwindCSS via official Astro integration
npx astro add tailwind --yes

# Install GSAP and ScrollTrigger
npm install gsap

# Install Three.js
npm install three @types/three

# Install Netlify adapter for static deployment
npx astro add netlify --yes
```

### 1.2 Configuration Files

#### `tsconfig.json`
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@data/*": ["src/data/*"]
    },
    "jsx": "preserve",
    "jsxImportSource": "astro"
  }
}
```

#### `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  adapter: netlify(),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser'
    }
  }
});
```

#### `tailwind.config.mjs`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
```

#### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Phase 2: Project Structure

### 2.1 Folder Structure
```
src/
├── assets/
│   └── images/
├── components/
│   ├── Navbar.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── StatSection.astro
│   ├── CourseCard.astro
│   ├── StudentCard.astro
│   └── GalleryGrid.astro
├── layouts/
│   └── MainLayout.astro
├── pages/
│   ├── index.astro
│   ├── anggota.astro
│   ├── akademik.astro
│   └── galeri.astro
├── data/
│   ├── students.json
│   └── courses.json
├── scripts/
│   ├── home.ts
│   ├── anggota.ts
│   ├── akademik.ts
│   └── galeri.ts
└── styles/
    └── global.css

public/
├── images/
└── favicon.svg

astro.config.mjs
tailwind.config.mjs
tsconfig.json
netlify.toml
package.json
```

### 2.2 Global Styles

#### `src/styles/global.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

@layer components {
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .section-padding {
    @apply py-16 md:py-24 lg:py-32;
  }
  
  .card-base {
    @apply bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300;
  }
  
  .card-hover {
    @apply hover:shadow-xl hover:-translate-y-1;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## Phase 3: Data Files

### 3.1 Students Data

#### `src/data/students.json`
```json
{
  "totalStudents": 36,
  "officers": [
    {
      "id": 1,
      "name": "Ahmad Fauzi",
      "role": "Chairperson",
      "photo": "/images/students/chairperson.webp",
      "quote": "Leadership is about making others better."
    },
    {
      "id": 2,
      "name": "Sarah Putri",
      "role": "Vice Chairperson",
      "photo": "/images/students/vice.webp",
      "quote": "Together we achieve more."
    },
    {
      "id": 3,
      "name": "Rizky Darmawan",
      "role": "Secretary",
      "photo": "/images/students/secretary.webp",
      "quote": "Organization is key to success."
    },
    {
      "id": 4,
      "name": "Dewi Lestari",
      "role": "Treasurer",
      "photo": "/images/students/treasurer.webp",
      "quote": "Every penny counts."
    }
  ],
  "members": [
    {
      "id": 5,
      "name": "Budi Santoso",
      "role": "Member",
      "photo": "/images/students/member-1.webp"
    },
    {
      "id": 6,
      "name": "Citra Dewi",
      "role": "Member",
      "photo": "/images/students/member-2.webp"
    },
    {
      "id": 7,
      "name": "Dimas Prasetyo",
      "role": "Member",
      "photo": "/images/students/member-3.webp"
    },
    {
      "id": 8,
      "name": "Eka Putri",
      "role": "Member",
      "photo": "/images/students/member-4.webp"
    },
    {
      "id": 9,
      "name": "Fajar Nugroho",
      "role": "Member",
      "photo": "/images/students/member-5.webp"
    },
    {
      "id": 10,
      "name": "Gita Safitri",
      "role": "Member",
      "photo": "/images/students/member-6.webp"
    },
    {
      "id": 11,
      "name": "Hendra Wijaya",
      "role": "Member",
      "photo": "/images/students/member-7.webp"
    },
    {
      "id": 12,
      "name": "Ira Maharani",
      "role": "Member",
      "photo": "/images/students/member-8.webp"
    },
    {
      "id": 13,
      "name": "Joko Susilo",
      "role": "Member",
      "photo": "/images/students/member-9.webp"
    },
    {
      "id": 14,
      "name": "Kartika Sari",
      "role": "Member",
      "photo": "/images/students/member-10.webp"
    },
    {
      "id": 15,
      "name": "Lukman Hakim",
      "role": "Member",
      "photo": "/images/students/member-11.webp"
    },
    {
      "id": 16,
      "name": "Maya Angelia",
      "role": "Member",
      "photo": "/images/students/member-12.webp"
    },
    {
      "id": 17,
      "name": "Nanda Pratama",
      "role": "Member",
      "photo": "/images/students/member-13.webp"
    },
    {
      "id": 18,
      "name": "Olivia Kumala",
      "role": "Member",
      "photo": "/images/students/member-14.webp"
    },
    {
      "id": 19,
      "name": "Pandu Setiawan",
      "role": "Member",
      "photo": "/images/students/member-15.webp"
    },
    {
      "id": 20,
      "name": "Qori Amelia",
      "role": "Member",
      "photo": "/images/students/member-16.webp"
    },
    {
      "id": 21,
      "name": "Rafi Putra",
      "role": "Member",
      "photo": "/images/students/member-17.webp"
    },
    {
      "id": 22,
      "name": "Sinta Rahayu",
      "role": "Member",
      "photo": "/images/students/member-18.webp"
    },
    {
      "id": 23,
      "name": "Tomi Anderson",
      "role": "Member",
      "photo": "/images/students/member-19.webp"
    },
    {
      "id": 24,
      "name": "Umi Kalsum",
      "role": "Member",
      "photo": "/images/students/member-20.webp"
    },
    {
      "id": 25,
      "name": "Vian Dharma",
      "role": "Member",
      "photo": "/images/students/member-21.webp"
    },
    {
      "id": 26,
      "name": "Wulan Sari",
      "role": "Member",
      "photo": "/images/students/member-22.webp"
    },
    {
      "id": 27,
      "name": "Xavier Lee",
      "role": "Member",
      "photo": "/images/students/member-23.webp"
    },
    {
      "id": 28,
      "name": "Yuni Astuti",
      "role": "Member",
      "photo": "/images/students/member-24.webp"
    },
    {
      "id": 29,
      "name": "Zaki Rahman",
      "role": "Member",
      "photo": "/images/students/member-25.webp"
    },
    {
      "id": 30,
      "name": "Adinda Permata",
      "role": "Member",
      "photo": "/images/students/member-26.webp"
    },
    {
      "id": 31,
      "name": "Bagus Pranowo",
      "role": "Member",
      "photo": "/images/students/member-27.webp"
    },
    {
      "id": 32,
      "name": "Cici Novitasari",
      "role": "Member",
      "photo": "/images/students/member-28.webp"
    },
    {
      "id": 33,
      "name": "Deni Kurniawan",
      "role": "Member",
      "photo": "/images/students/member-29.webp"
    },
    {
      "id": 34,
      "name": "Erna Wulandari",
      "role": "Member",
      "photo": "/images/students/member-30.webp"
    },
    {
      "id": 35,
      "name": "Fauzi Rahman",
      "role": "Member",
      "photo": "/images/students/member-31.webp"
    },
    {
      "id": 36,
      "name": "Gina Kusuma",
      "role": "Member",
      "photo": "/images/students/member-32.webp"
    }
  ]
}
```

### 3.2 Courses Data

#### `src/data/courses.json`
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Web Development Fundamentals",
      "code": "WD101",
      "credits": 3,
      "semester": "Semester 1",
      "description": "Introduction to HTML, CSS, and JavaScript basics for building modern websites.",
      "details": [
        "HTML5 semantic markup",
        "CSS3 styling and layouts",
        "JavaScript fundamentals",
        "Responsive design principles"
      ],
      "instructor": "Dr. Ahmad Yani",
      "hours": 48
    },
    {
      "id": 2,
      "title": "Advanced JavaScript",
      "code": "JS201",
      "credits": 4,
      "semester": "Semester 2",
      "description": "Deep dive into modern JavaScript including ES6+, async programming, and design patterns.",
      "details": [
        "ES6+ features and syntax",
        "Async/await and promises",
        "Module patterns",
        "Performance optimization"
      ],
      "instructor": "Prof. Budi Santoso",
      "hours": 64
    },
    {
      "id": 3,
      "title": "Database Systems",
      "code": "DB301",
      "credits": 4,
      "semester": "Semester 3",
      "description": "Comprehensive study of relational databases, SQL, and database design principles.",
      "details": [
        "ER modeling",
        "SQL queries and optimization",
        "Normalization techniques",
        "Transaction management"
      ],
      "instructor": "Dr. Citra Dewi",
      "hours": 64
    },
    {
      "id": 4,
      "title": "UI/UX Design Principles",
      "code": "UX401",
      "credits": 3,
      "semester": "Semester 4",
      "description": "Learn user interface and experience design methodologies for creating intuitive applications.",
      "details": [
        "User research methods",
        "Wireframing and prototyping",
        "Design systems",
        "Usability testing"
      ],
      "instructor": "Prof. Dina Putri",
      "hours": 48
    },
    {
      "id": 5,
      "title": "React Framework",
      "code": "RE501",
      "credits": 4,
      "semester": "Semester 5",
      "description": "Build modern single-page applications using React.js and its ecosystem.",
      "details": [
        "Components and props",
        "State management with hooks",
        "React Router",
        "Context API and Redux"
      ],
      "instructor": "Dr. Eko Prasetyo",
      "hours": 64
    },
    {
      "id": 6,
      "title": "DevOps Fundamentals",
      "code": "DO601",
      "credits": 3,
      "semester": "Semester 6",
      "description": "Introduction to DevOps practices including CI/CD, containerization, and cloud deployment.",
      "details": [
        "Git workflows",
        "Docker basics",
        "CI/CD pipelines",
        "Cloud platforms overview"
      ],
      "instructor": "Prof. Fajar Nugroho",
      "hours": 48
    },
    {
      "id": 7,
      "title": "Capstone Project",
      "code": "CP701",
      "credits": 6,
      "semester": "Semester 7",
      "description": "Final project demonstrating comprehensive skills acquired throughout the program.",
      "details": [
        "Project planning",
        "Full-stack development",
        "Team collaboration",
        "Documentation and presentation"
      ],
      "instructor": "Dr. Gita Maharani",
      "hours": 96
    }
  ]
}
```

---

## Phase 4: Layout Components

### 4.1 Main Layout

#### `src/layouts/MainLayout.astro`
```astro
---
import Navbar from '@components/Navbar.astro';
import Footer from '@components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  pageClass?: string;
}

const { title, description = 'Class Portfolio Website', pageClass = '' } = Astro.props;
---

<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title} | Class Portfolio</title>
  </head>
  <body class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow {pageClass}">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 4.2 Navbar Component

#### `src/components/Navbar.astro`
```astro
---
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/anggota', label: 'Anggota' },
  { href: '/akademik', label: 'Akademik' },
  { href: '/galeri', label: 'Galeri' }
];

const currentPath = Astro.url.pathname;
---

<header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
  <nav class="container-custom">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-primary-600">2KS4</span>
      </a>
      
      <ul class="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <li>
            <a
              href={item.href}
              class:list={[
                'text-sm font-medium transition-colors duration-200 hover:text-primary-600',
                currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
                  ? 'text-primary-600'
                  : 'text-gray-600'
              ]}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      
      <button
        id="mobile-menu-toggle"
        class="md:hidden p-2 text-gray-600 hover:text-primary-600"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <ul class="flex flex-col space-y-3">
        {navItems.map((item) => (
          <li>
            <a
              href={item.href}
              class:list={[
                'block text-sm font-medium transition-colors duration-200 hover:text-primary-600',
                currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
                  ? 'text-primary-600'
                  : 'text-gray-600'
              ]}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
</header>

<script>
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
</script>
```

### 4.3 Footer Component

#### `src/components/Footer.astro`
```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="bg-gray-900 text-gray-300">
  <div class="container-custom section-padding">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 class="text-xl font-bold text-white mb-4">2KS4 Class</h3>
        <p class="text-gray-400">
          A class portfolio website showcasing our achievements, members, and academic journey.
        </p>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li><a href="/" class="hover:text-primary-400 transition-colors">Home</a></li>
          <li><a href="/anggota" class="hover:text-primary-400 transition-colors">Anggota</a></li>
          <li><a href="/akademik" class="hover:text-primary-400 transition-colors">Akademik</a></li>
          <li><a href="/galeri" class="hover:text-primary-400 transition-colors">Galeri</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">Contact</h3>
        <p class="text-gray-400">
          Email: info@2ks4-class.edu<br />
          Location: Building A, Room 201
        </p>
      </div>
    </div>
    
    <div class="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
      <p>&copy; {currentYear} 2KS4 Class. All rights reserved.</p>
    </div>
  </div>
</footer>
```

---

## Phase 5: Homepage Components

### 5.1 Hero Component with Three.js

#### `src/components/Hero.astro`
```astro
<section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden">
  <canvas id="three-canvas" class="absolute inset-0 w-full h-full"></canvas>
  
  <div class="relative z-10 container-custom text-center">
    <h1
      id="hero-title"
      class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 opacity-0"
    >
      Welcome to <span class="text-primary-400">2KS4</span>
    </h1>
    <p
      id="hero-subtitle"
      class="text-xl md:text-2xl text-gray-200 mb-8 opacity-0 max-w-2xl mx-auto"
    >
      Building tomorrow's leaders through collaboration, innovation, and excellence.
    </p>
    <div id="hero-cta" class="opacity-0">
      <a
        href="/anggota"
        class="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
      >
        Meet Our Team
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
  
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>
```

#### `src/scripts/home.ts` (Three.js + GSAP Implementation)
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  geometry: THREE.IcosahedronGeometry;
  material: THREE.MeshPhongMaterial;
  mesh: THREE.Mesh;
  animationId: number | null;
}

let threeScene: ThreeScene | null = null;

async function initThreeJS(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  
  // Dynamically import Three.js
  const THREE = await import('three');
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create geometry
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x0ea5e9,
    flatShading: true,
    transparent: true,
    opacity: 0.8
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0xd946ef, 1, 100);
  pointLight.position.set(-5, 5, 5);
  scene.add(pointLight);
  
  camera.position.z = 5;
  
  threeScene = {
    scene,
    camera,
    renderer,
    geometry,
    material,
    mesh,
    animationId: null
  };
  
  function animate(): void {
    threeScene!.animationId = requestAnimationFrame(animate);
    
    // Rotate mesh
    threeScene!.mesh.rotation.x += 0.002;
    threeScene!.mesh.rotation.y += 0.003;
    
    threeScene!.renderer.render(threeScene!.scene, threeScene!.camera);
  }
  
  animate();
}

function destroyThreeJS(): void {
  if (threeScene) {
    if (threeScene.animationId !== null) {
      cancelAnimationFrame(threeScene.animationId);
    }
    
    threeScene.geometry.dispose();
    threeScene.material.dispose();
    threeScene.renderer.dispose();
    threeScene = null;
  }
}

function initHeroAnimations(): void {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  tl.to('#hero-title', {
    opacity: 1,
    y: 0,
    duration: 1
  })
  .to('#hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.5')
  .to('#hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.6
  }, '-=0.3');
  
  // Parallax effect on scroll
  gsap.to('#hero', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    yPercent: 30,
    opacity: 0.5
  });
}

function initAboutAnimation(): void {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;
  
  gsap.from(aboutSection.children, {
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
  });
}

function initStatisticsAnimation(): void {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach((stat) => {
    const finalValue = parseInt(stat.textContent || '0', 10);
    
    gsap.from(stat, {
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      textContent: 0,
      duration: 2,
      snap: { textContent: 1 },
      ease: 'power2.out',
      onUpdate: function () {
        stat.textContent = Math.ceil(this.targets()[0].textContent).toString();
      }
    });
  });
}

async function initPage(): Promise<void> {
  // Check if mobile
  const isMobile = window.innerWidth < 768;
  
  if (!isMobile) {
    await initThreeJS();
  }
  
  // GSAP animations
  initHeroAnimations();
  initAboutAnimation();
  initStatisticsAnimation();
  
  // ScrollTrigger refresh
  ScrollTrigger.refresh();
}

function cleanup(): void {
  destroyThreeJS();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { initPage, cleanup };

if (typeof window !== 'undefined') {
  initPage();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
}
```

### 5.2 StatSection Component

#### `src/components/StatSection.astro`
```astro
---
import studentsData from '@data/students.json';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

const stats: StatItem[] = [
  { label: 'Total Students', value: studentsData.totalStudents },
  { label: 'Officers', value: studentsData.officers.length },
  { label: 'Regular Members', value: studentsData.members.length },
  { label: 'Courses Available', value: 7 }
];
---

<section id="statistics" class="py-16 bg-primary-600">
  <div class="container-custom">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat) => (
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-white mb-2">
            <span class="stat-number">{stat.value}</span>{stat.suffix || ''}
          </div>
          <div class="text-primary-100 text-sm md:text-base">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 5.3 About Section Component

#### `src/components/AboutSection.astro`
```astro
<section id="about" class="section-padding bg-white">
  <div class="container-custom">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Our Class</h2>
      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        Class 2KS4 is a vibrant community of dedicated students committed to academic excellence 
        and personal growth. Together, we strive to create an environment that fosters learning, 
        creativity, and collaboration.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 bg-gray-50 rounded-lg">
          <div class="text-3xl mb-3">🎯</div>
          <h3 class="font-semibold mb-2">Goals</h3>
          <p class="text-gray-600 text-sm">Achieving academic excellence while building lasting friendships.</p>
        </div>
        <div class="p-6 bg-gray-50 rounded-lg">
          <div class="text-3xl mb-3">🤝</div>
          <h3 class="font-semibold mb-2">Community</h3>
          <p class="text-gray-600 text-sm">Supporting each other through challenges and celebrating successes.</p>
        </div>
        <div class="p-6 bg-gray-50 rounded-lg">
          <div class="text-3xl mb-3">🚀</div>
          <h3 class="font-semibold mb-2">Future</h3>
          <p class="text-gray-600 text-sm">Preparing for careers that will shape tomorrow's world.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Phase 6: Anggota Page Components

### 6.1 StudentCard Component

#### `src/components/StudentCard.astro`
```astro
---
interface Props {
  id: number;
  name: string;
  role: string;
  photo: string;
  quote?: string;
  isOfficer?: boolean;
}

const { id, name, role, photo, quote, isOfficer = false } = Astro.props;
---

<div
  class="student-card card-base card-hover group"
  data-role={role}
>
  <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
    <img
      src={photo}
      alt={name}
      loading="lazy"
      class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
  <div class="p-4">
    <div class="flex items-center justify-between mb-1">
      <h3 class="font-semibold text-gray-900">{name}</h3>
      {isOfficer && (
        <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
          {role}
        </span>
      )}
    </div>
    {!isOfficer && (
      <p class="text-sm text-gray-500">{role}</p>
    )}
    {quote && (
      <p class="mt-2 text-sm text-gray-600 italic">"{quote}"</p>
    )}
  </div>
</div>
```

### 6.2 Page Script

#### `src/scripts/anggota.ts`
```typescript
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
      filterButtons.forEach((b) => b.classList.remove('bg-primary-600', 'text-white'));
      filterButtons.forEach((b) => b.classList.add('bg-gray-200', 'text-gray-700'));
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
```

---

## Phase 7: Akademik Page Components

### 7.1 CourseCard Component

#### `src/components/CourseCard.astro`
```astro
---
interface Course {
  id: number;
  title: string;
  code: string;
  credits: number;
  semester: string;
  description: string;
  details: string[];
  instructor: string;
  hours: number;
}

interface Props {
  course: Course;
}

const { course } = Astro.props;
---

<article class="course-card card-base">
  <div class="p-6 cursor-pointer course-header">
    <div class="flex items-start justify-between mb-4">
      <div>
        <span class="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-2">
          {course.code}
        </span>
        <h3 class="text-xl font-bold text-gray-900">{course.title}</h3>
      </div>
      <svg
        class="w-6 h-6 text-gray-400 transition-transform duration-300 course-arrow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <p class="text-gray-600 mb-4">{course.description}</p>
    
    <div class="flex flex-wrap gap-4 text-sm text-gray-500">
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {course.credits} Credits
      </div>
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {course.hours} Hours
      </div>
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {course.semester}
      </div>
    </div>
  </div>
  
  <div class="course-details hidden px-6 pb-6">
    <div class="border-t border-gray-100 pt-4">
      <h4 class="font-semibold text-gray-900 mb-3">Course Topics:</h4>
      <ul class="space-y-2">
        {course.details.map((detail) => (
          <li class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {detail}
          </li>
        ))}
      </ul>
      <div class="mt-4 pt-4 border-t border-gray-100">
        <p class="text-sm text-gray-500">
          <span class="font-medium text-gray-700">Instructor:</span> {course.instructor}
        </p>
      </div>
    </div>
  </div>
</article>
```

### 7.2 Page Script

#### `src/scripts/akademik.ts`
```typescript
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
```

---

## Phase 8: Galeri Page

### 8.1 GalleryGrid Component

#### `src/components/GalleryGrid.astro`
```astro
---
interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

interface Props {
  items: GalleryItem[];
}

const { items } = Astro.props;
---

<div id="gallery-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <article class="gallery-item relative group overflow-hidden rounded-xl shadow-lg">
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <span class="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full mb-2">
            {item.category}
          </span>
          <h3 class="text-white font-semibold text-lg">{item.title}</h3>
        </div>
      </div>
    </article>
  ))}
</div>
```

### 8.2 Page Script

#### `src/scripts/galeri.ts`
```typescript
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
```

---

## Phase 9: Page Implementations

### 9.1 Homepage

#### `src/pages/index.astro`
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import Hero from '../components/Hero.astro';
import AboutSection from '../components/AboutSection.astro';
import StatSection from '../components/StatSection.astro';
---

<MainLayout title="Home">
  <Hero />
  <AboutSection />
  <StatSection />
</MainLayout>

<script>
  import { initPage, cleanup } from '../scripts/home';
  
  document.addEventListener('astro:page-load', () => {
    initPage();
  });
  
  document.addEventListener('astro:before-swap', () => {
    cleanup();
  });
</script>
```

### 9.2 Anggota Page

#### `src/pages/anggota.astro`
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import StudentCard from '../components/StudentCard.astro';
import studentsData from '../data/students.json';

const { officers, members } = studentsData;
---

<MainLayout title="Anggota" pageClass="bg-gray-50">
  <section class="pt-24 pb-12">
    <div class="container-custom">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Members</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Meet the dedicated individuals who make our class special.
        </p>
      </div>
      
      <div class="flex justify-center gap-4 mb-12">
        <button
          class="filter-btn px-6 py-2 bg-primary-600 text-white font-medium rounded-full transition-colors"
          data-filter="all"
        >
          All
        </button>
        <button
          class="filter-btn px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-full transition-colors"
          data-filter="Chairperson"
        >
          Officers
        </button>
        <button
          class="filter-btn px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-full transition-colors"
          data-filter="Member"
        >
          Members
        </button>
      </div>
      
      <div id="anggota-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {officers.map((officer) => (
          <StudentCard
            id={officer.id}
            name={officer.name}
            role={officer.role}
            photo={officer.photo}
            quote={officer.quote}
            isOfficer={true}
          />
        ))}
        
        {members.map((member) => (
          <StudentCard
            id={member.id}
            name={member.name}
            role={member.role}
            photo={member.photo}
            isOfficer={false}
          />
        ))}
      </div>
    </div>
  </section>
</MainLayout>

<script>
  import { initPage, cleanup } from '../scripts/anggota';
  
  document.addEventListener('astro:page-load', () => {
    initPage();
  });
  
  document.addEventListener('astro:before-swap', () => {
    cleanup();
  });
</script>
```

### 9.3 Akademik Page

#### `src/pages/akademik.astro`
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import CourseCard from '../components/CourseCard.astro';
import coursesData from '../data/courses.json';
---

<MainLayout title="Akademik" pageClass="bg-gray-50">
  <section class="pt-24 pb-12">
    <div class="container-custom">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Academic Programs</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Our comprehensive curriculum designed to prepare students for success.
        </p>
      </div>
      
      <div id="courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.courses.map((course) => (
          <CourseCard course={course} />
        ))}
      </div>
    </div>
  </section>
</MainLayout>

<script>
  import { initPage, cleanup } from '../scripts/akademik';
  
  document.addEventListener('astro:page-load', () => {
    initPage();
  });
  
  document.addEventListener('astro:before-swap', () => {
    cleanup();
  });
</script>
```

### 9.4 Galeri Page

#### `src/pages/galeri.astro`
```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import GalleryGrid from '../components/GalleryGrid.astro';

const galleryItems = [
  {
    id: 1,
    src: '/images/gallery/photo-1.webp',
    alt: 'Classroom Activity',
    title: 'Classroom Learning',
    category: 'Academic'
  },
  {
    id: 2,
    src: '/images/gallery/photo-2.webp',
    alt: 'Group Project',
    title: 'Team Collaboration',
    category: 'Activities'
  },
  {
    id: 3,
    src: '/images/gallery/photo-3.webp',
    alt: 'Science Lab',
    title: 'Lab Experiments',
    category: 'Academic'
  },
  {
    id: 4,
    src: '/images/gallery/photo-4.webp',
    alt: 'Sports Day',
    title: 'Annual Sports Day',
    category: 'Events'
  },
  {
    id: 5,
    src: '/images/gallery/photo-5.webp',
    alt: 'Art Exhibition',
    title: 'Creative Showcase',
    category: 'Arts'
  },
  {
    id: 6,
    src: '/images/gallery/photo-6.webp',
    alt: 'Graduation',
    title: 'Class Celebration',
    category: 'Events'
  }
];
---

<MainLayout title="Galeri" pageClass="bg-gray-50">
  <section class="pt-24 pb-12">
    <div class="container-custom">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Capturing memories from our journey together.
        </p>
      </div>
      
      <GalleryGrid items={galleryItems} />
    </div>
  </section>
</MainLayout>

<script>
  import { initPage, cleanup } from '../scripts/galeri';
  
  document.addEventListener('astro:page-load', () => {
    initPage();
  });
  
  document.addEventListener('astro:before-swap', () => {
    cleanup();
  });
</script>
```

---

## Phase 10: Deployment Instructions

### 10.1 Build and Deploy

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### 10.2 Netlify Deployment

1. Connect your Git repository to Netlify
2. Netlify will auto-detect Astro configuration
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables if needed
5. Deploy site

### 10.3 Performance Checklist

- [ ] Images converted to WebP
- [ ] Lazy loading enabled on all images
- [ ] Three.js dynamically imported
- [ ] GSAP plugins registered properly
- [ ] ScrollTrigger cleaned up on page unload
- [ ] TypeScript strict mode enabled
- [ ] Path aliases configured
- [ ] Production build minified
- [ ] Lighthouse score 90+

---

## Architecture Summary

### Key Design Decisions

1. **Static Multi-Page**: Each page is a separate Astro page with dedicated scripts
2. **No SPA Routing**: Traditional page navigation with proper cleanup
3. **Dynamic Three.js Import**: Loaded only on desktop for performance
4. **Scoped Animations**: Each page manages its own GSAP/ScrollTrigger instances
5. **JSON Data Layer**: All content driven by JSON files for easy maintenance
6. **Component Modularity**: Reusable components with proper prop typing
7. **Performance First**: Lazy loading, dynamic imports, cleanup on unload

### Animation Strategy

- Homepage: Hero Three.js + GSAP timeline
- Anggota: Staggered grid reveal + hover interactions
- Akademik: Collapsible cards with smooth transitions
- Galery: Scroll-triggered reveal animations

### Responsive Design

- Mobile-first approach
- Navbar with collapsible menu
- Grid layouts adapt to screen size
- Three.js disabled on mobile for performance
