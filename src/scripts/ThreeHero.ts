// Three.js types for dynamic import
type ThreeModule = typeof import('three');

interface ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  geometry: THREE.IcosahedronGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  wireframe: THREE.LineSegments;
  animationId: number | null;
}

namespace THREE {
  export interface Scene {}
  export interface PerspectiveCamera {}
  export interface WebGLRenderer {
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
  }
  export interface IcosahedronGeometry {
    dispose(): void;
  }
  export interface MeshBasicMaterial {
    dispose(): void;
  }
  export interface Mesh {
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }
  export interface LineSegments {
    geometry: IcosahedronGeometry;
    material: MeshBasicMaterial;
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }
}

let threeScene: ThreeScene | null = null;
let threeModule: ThreeModule | null = null;

export async function initThreeHero(canvas: HTMLCanvasElement): Promise<void> {
  if (typeof window === 'undefined') return;
  
  if (window.innerWidth < 768) return;
  
  // Load Three.js module
  threeModule = await import('three');
  
  const THREE = threeModule;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.width / canvas.height,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Wireframe icosahedron
  const geometry = new THREE.IcosahedronGeometry(1.8, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0ea5e9,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  // Wireframe lines
  const wireframeGeometry = new THREE.WireframeGeometry(geometry);
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.8
  });
  const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
  scene.add(wireframe);
  
  camera.position.z = 4;
  
  threeScene = {
    scene,
    camera,
    renderer,
    geometry,
    material,
    mesh,
    wireframe,
    animationId: null
  };
  
  function animate(): void {
    threeScene!.animationId = requestAnimationFrame(animate);
    
    // Slow rotation
    threeScene!.mesh.rotation.x += 0.003;
    threeScene!.mesh.rotation.y += 0.004;
    threeScene!.wireframe.rotation.x += 0.003;
    threeScene!.wireframe.rotation.y += 0.004;
    
    threeScene!.renderer.render(threeScene!.scene, threeScene!.camera);
  }
  
  animate();
}

export function destroyThreeHero(): void {
  if (threeScene) {
    if (threeScene.animationId !== null) {
      cancelAnimationFrame(threeScene.animationId);
    }
    
    threeScene.geometry.dispose();
    threeScene.material.dispose();
    threeScene.wireframe.geometry.dispose();
    threeScene.wireframe.material.dispose();
    threeScene.renderer.dispose();
    threeScene = null;
    threeModule = null;
  }
}

export function isThreeSceneActive(): boolean {
  return threeScene !== null;
}
