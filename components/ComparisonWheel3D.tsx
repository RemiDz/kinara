'use client';
import { useRef, useEffect, useState } from 'react';
import { SEAL_COLOUR_HEX } from '@/lib/dreamspell-data';

interface NodeData {
  index: number;
  x: number; y: number; z: number;
  sealName: string;
  sealColour: string;
  kinNumber: number;
  personName: string;
  profileColor: string;
}

interface ProcessedConn {
  type: string; indexA: number; indexB: number;
  color: string; dashed: boolean; mutual: boolean;
}

interface Props {
  nodes: NodeData[];
  connections: ProcessedConn[];
  activeTypes: Set<string>;
  fullscreen: boolean;
}

const LAYER_Y: Record<string, number> = {
  analog: 0.9, guide: 0.5, occult: -0.5, antipode: -0.9,
  'colour-family': 0.2, 'earth-family': -0.2, wavespell: 0, castle: 0,
};

export default function ComparisonWheel3D({ nodes, connections, activeTypes, fullscreen }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;
    let animId = 0;
    const container = containerRef.current;

    async function init() {
      try {
        // Dynamic import — all Three.js loaded at runtime, not at bundle time
        const THREE = await import('three');

        // OrbitControls — import from addons path (three >= 0.160)
        let OrbitControlsClass: any;
        try {
          const mod = await import('three/addons/controls/OrbitControls.js' as any);
          OrbitControlsClass = mod.OrbitControls;
        } catch {
          // Fallback for older three versions
          const mod = await import('three/examples/jsm/controls/OrbitControls.js' as any);
          OrbitControlsClass = mod.OrbitControls;
        }

        // CSS2DRenderer for labels
        let CSS2DRendererClass: any, CSS2DObjectClass: any;
        try {
          const mod = await import('three/addons/renderers/CSS2DRenderer.js' as any);
          CSS2DRendererClass = mod.CSS2DRenderer;
          CSS2DObjectClass = mod.CSS2DObject;
        } catch {
          const mod = await import('three/examples/jsm/renderers/CSS2DRenderer.js' as any);
          CSS2DRendererClass = mod.CSS2DRenderer;
          CSS2DObjectClass = mod.CSS2DObject;
        }

        if (disposed || !container) return;

        // Clean up any existing renderers from previous mount (StrictMode double-mount)
        while (container.childNodes.length > 0) {
          container.removeChild(container.childNodes[0]);
        }

        // ── Scene ──
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#F5F0E8');

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 4, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const labelRenderer = new CSS2DRendererClass();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.left = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(labelRenderer.domElement);

        // Controls
        const controls = new OrbitControlsClass(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.minDistance = 4;
        controls.maxDistance = 18;
        controls.minPolarAngle = Math.PI * 0.1;
        controls.maxPolarAngle = Math.PI * 0.9;

        // ── Lighting (white, bright — material colours provide warmth) ──
        scene.add(new THREE.AmbientLight('#ffffff', 0.8));
        const key = new THREE.DirectionalLight('#ffffff', 1.0);
        key.position.set(5, 10, 8);
        scene.add(key);
        const fill = new THREE.DirectionalLight('#ffffff', 0.4);
        fill.position.set(-3, -5, -3);
        scene.add(fill);

        // ── Circle ring (flat, in XZ plane to match node positions) ──
        const ringPts: InstanceType<typeof THREE.Vector3>[] = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          ringPts.push(new THREE.Vector3(5 * Math.cos(a), 0, 5 * Math.sin(a)));
        }
        scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(ringPts),
          new THREE.LineBasicMaterial({ color: '#c9b99a', transparent: true, opacity: 0.2 })
        ));

        // ── Particles ──
        const pGeo = new THREE.BufferGeometry();
        const pArr = new Float32Array(200 * 3);
        for (let i = 0; i < 600; i++) pArr[i] = (Math.random() - 0.5) * (i % 3 === 1 ? 10 : 16);
        pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
        scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.03, color: '#c9b99a', transparent: true, opacity: 0.25, sizeAttenuation: true })));

        // ── Nodes ──
        const SPHERE_RADIUS = 0.35;
        nodes.forEach(node => {
          const geo = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 32);
          const mat = new THREE.MeshStandardMaterial({ color: node.profileColor, emissive: node.profileColor, emissiveIntensity: 0.7, roughness: 0.3, metalness: 0.0 });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(node.x, node.y, node.z);
          scene.add(mesh);

          const div = document.createElement('div');
          div.style.cssText = 'text-align:center;pointer-events:none;';
          div.innerHTML = `<div style="font-size:11px;font-weight:bold;color:#3D2E1E">${node.sealName} \u00B7 Kin ${node.kinNumber}</div><div style="font-size:10px;color:${node.profileColor};font-weight:600">${node.personName}</div>`;
          const label = new CSS2DObjectClass(div);
          label.position.set(0, 0.6, 0);
          mesh.add(label);
        });

        // ── Connection curves ──
        connections.forEach(conn => {
          if (!activeTypes.has(conn.type)) return;
          const a = nodes[conn.indexA];
          const b = nodes[conn.indexB];
          if (!a || !b) return;

          const ly = LAYER_Y[conn.type] || 0;
          const start = new THREE.Vector3(a.x, a.y, a.z);
          const end = new THREE.Vector3(b.x, b.y, b.z);
          const mid = new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2 + ly, (a.z + b.z) / 2);

          const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
          const pts = curve.getPoints(24);
          scene.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: conn.color, transparent: true, opacity: 0.7 })
          ));

          // Arrowheads
          const addCone = (from: import('three').Vector3, to: import('three').Vector3) => {
            const dir = new THREE.Vector3().subVectors(to, from).normalize();
            const pos = to.clone().sub(dir.clone().multiplyScalar(0.45));
            const cone = new THREE.Mesh(
              new THREE.ConeGeometry(0.06, 0.18, 8),
              new THREE.MeshStandardMaterial({ color: conn.color })
            );
            cone.position.copy(pos);
            cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            scene.add(cone);
          };
          addCone(mid, end);
          if (conn.mutual) addCone(mid, start);
        });

        setStatus('ready');

        // ── Animation ──
        const animate = () => {
          if (disposed) return;
          animId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
          labelRenderer.render(scene, camera);
        };
        animate();

        // ── Resize ──
        const onResize = () => {
          if (!container) return;
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
          labelRenderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);

        cleanupRef.current = () => {
          disposed = true;
          cancelAnimationFrame(animId);
          window.removeEventListener('resize', onResize);
          controls.dispose();
          renderer.dispose();
          if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
          if (container.contains(labelRenderer.domElement)) container.removeChild(labelRenderer.domElement);
          scene.traverse(obj => {
            if ((obj as any).geometry) (obj as any).geometry.dispose();
            const m = (obj as any).material;
            if (m) { if (Array.isArray(m)) m.forEach((x: any) => x.dispose()); else m.dispose(); }
          });
        };
      } catch (err) {
        console.error('3D init failed:', err);
        setStatus('error');
      }
    }

    init();
    return () => { disposed = true; cleanupRef.current?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden relative"
        style={{ height: fullscreen ? 'calc(100vh - 120px)' : '70vh', minHeight: fullscreen ? '400px' : '500px', maxHeight: fullscreen ? undefined : '800px' }}
        role="img"
        aria-label={`3D comparison wheel showing ${nodes.length} Kin profiles and their connections`}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-parchment/80">
          <p className="text-ink-muted text-sm">Loading 3D view...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-parchment/80">
          <p className="text-ink-muted text-sm">3D not available — use 2D wheel instead</p>
        </div>
      )}
    </div>
  );
}
