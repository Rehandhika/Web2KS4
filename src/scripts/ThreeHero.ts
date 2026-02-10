import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  group: THREE.Group;
  animationId: number | null;
  isActive: boolean;
}

let threeScene: ThreeScene | null = null;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

export async function initThreeHero(canvas: HTMLCanvasElement): Promise<void> {
  if (typeof window === 'undefined' || !canvas) return;

  // 1. HARD CLEANUP: Prevent duplicate contexts
  destroyThreeHero();

  const scene = new THREE.Scene();
  const isMobile = window.innerWidth < 768;
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = isMobile ? 12 : 15;
  
  // 2. SAFE RENDERER INIT
  if (!isWebGLAvailable(canvas)) {
    console.warn("ThreeHero: WebGL not supported or context lost");
    return;
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "default", 
      precision: "mediump" 
    });
  } catch (e) {
    console.warn("ThreeHero: WebGL init failed", e);
    return;
  }

  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0x00D1FF, 2, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const group = new THREE.Group();
  scene.add(group);

  threeScene = { scene, camera, renderer, group, animationId: null, isActive: true };

  const loader = new FontLoader();
  const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json';

  loader.load(FONT_URL, (font) => {
    if (!threeScene || !threeScene.group) return;

    const geometry = new TextGeometry('2KS4', {
      font: font,
      size: 2.5,
      height: 0.4,
      curveSegments: 2, // LOW POLY OPTIMIZATION
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 1 // LOW POLY OPTIMIZATION
    });

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: 0x00D1FF,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    threeScene.group.add(mesh);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    wireframe.scale.set(1.05, 1.05, 1.05);
    threeScene.group.add(wireframe);
  });

  const animate = () => {
    if (!threeScene || !threeScene.isActive) return;
    
    // Safety check for context loss
    if (renderer.getContext().isContextLost()) return;

    threeScene.animationId = requestAnimationFrame(animate);
    
    currentRotationX += (targetRotationX - currentRotationX) * 0.02;
    currentRotationY += (targetRotationY - currentRotationY) * 0.02;

    threeScene.group.rotation.x = currentRotationX;
    threeScene.group.rotation.y = currentRotationY;

    const time = Date.now() * 0.0005;
    threeScene.group.position.y = Math.sin(time) * 0.1;
    
    threeScene.renderer.render(threeScene.scene, threeScene.camera);
  };

  animate();

  const handleInteraction = (x: number, y: number) => {
    const normalizedX = (x / window.innerWidth) * 2 - 1;
    const normalizedY = (y / window.innerHeight) * 2 - 1;
    targetRotationY = normalizedX * (Math.PI / 4);
    targetRotationX = normalizedY * (Math.PI / 8);
  };

  const onMouseMove = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  const onSlideEnter = ((e: CustomEvent) => {
    if (threeScene) {
      threeScene.isActive = (e.detail.index === 0);
      if (threeScene.isActive) animate();
    }
  }) as EventListener;
  window.addEventListener('slide-enter', onSlideEnter);

  const onResize = () => {
    if (!threeScene || !canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  };
  window.addEventListener('resize', onResize);

  (threeScene as any).cleanupListeners = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('slide-enter', onSlideEnter);
    window.removeEventListener('resize', onResize);
  };
}

export function destroyThreeHero(): void {
  if (threeScene) {
    threeScene.isActive = false;
    if (threeScene.animationId !== null) cancelAnimationFrame(threeScene.animationId);
    
    // Dispose Listeners
    if ((threeScene as any).cleanupListeners) (threeScene as any).cleanupListeners();

    // Deep Dispose - CRITICAL FOR MEMORY LEAKS
    threeScene.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });
    
    // Force context loss can be problematic for immediate re-init on some browsers
    try {
      threeScene.renderer.dispose();
    } catch(e) {
      // Ignore cleanup errors
    }
    
    threeScene = null;
  }
}

function isWebGLAvailable(canvas: HTMLCanvasElement): boolean {
  try {
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch (e) {
    return false;
  }
}