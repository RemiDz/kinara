# Fix: ComparisonWheel3D ChunkLoadError — Quick Targeted Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## Error

```
ChunkLoadError: Loading chunk _app-pages-browser_components_ComparisonWheel3D_tsx failed.
```

This means webpack cannot compile `ComparisonWheel3D.tsx` into a valid chunk. The file itself has a syntax error, an unresolvable import, or a dependency issue.

## Fix — do these steps IN ORDER, stop as soon as it works

### Step 1: Clear cache and restart

```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

If the error persists, continue.

### Step 2: Check ComparisonWheel3D.tsx actually compiles

Open `components/ComparisonWheel3D.tsx` and check for:
- Any import that references a file that doesn't exist
- Any import from `@react-three/fiber`, `@react-three/drei`, or `three` — verify these packages are actually installed
- Any TypeScript errors (run `npx tsc --noEmit` to check)

Run:
```bash
npx tsc --noEmit 2>&1 | grep -i "ComparisonWheel3D"
```

Fix any TypeScript errors found.

### Step 3: Verify R3F packages are installed

```bash
npm ls three @react-three/fiber @react-three/drei
```

If any show as `MISSING` or `ERR!`, reinstall:
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

Then clear cache and rebuild:
```bash
rm -rf .next
npm run dev
```

### Step 4: Ensure dynamic import is correct

In `components/KinComparison.tsx` (the parent that loads the 3D component), the dynamic import MUST look exactly like this:

```tsx
import dynamic from 'next/dynamic';

const ComparisonWheel3D = dynamic(
  () => import('./ComparisonWheel3D'),
  { ssr: false, loading: () => <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading 3D...</p></div> }
);
```

Common mistakes that cause ChunkLoadError:
- `() => import('./ComparisonWheel3D').then(mod => mod.default)` — DON'T add `.then()` unless the component uses named exports
- Wrong file path — check the actual filename and casing exactly
- The component file not having `export default`

### Step 5: If still broken — simplify ComparisonWheel3D to minimal test

Temporarily replace the ENTIRE contents of `ComparisonWheel3D.tsx` with this minimal version to confirm the dynamic loading pipeline works:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function ComparisonWheel3D({ profiles }: { profiles: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Mounting...</div>;

  // Lazy import Three.js only after mount
  const [Canvas, setCanvas] = useState<any>(null);

  useEffect(() => {
    import('@react-three/fiber').then(mod => {
      setCanvas(() => mod.Canvas);
    });
  }, []);

  if (!Canvas) return <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Three.js...</div>;

  return (
    <div style={{ height: '70vh', minHeight: '500px' }}>
      <Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#c9b99a" />
        </mesh>
      </Canvas>
    </div>
  );
}
```

If this minimal version works → the issue is in the full component code (bad import, syntax error, etc.). Gradually add back the full code in sections to find what breaks.

If this minimal version ALSO fails → the issue is package-level. Run:
```bash
rm -rf node_modules
rm package-lock.json
npm install
rm -rf .next
npm run dev
```

### Step 6: Nuclear option — inline lazy loading of ALL Three.js

If R3F's module structure is incompatible with Next.js 14.2.35 (your version is old), bypass it entirely with manual lazy loading:

Replace the Canvas approach with a raw Three.js setup inside a useEffect:

```tsx
'use client';

import { useRef, useEffect, useState } from 'react';

export default function ComparisonWheel3D({ profiles, connections }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      const container = containerRef.current!;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.set(0, 4, 10);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.minDistance = 4;
      controls.maxDistance = 18;

      // Lighting
      scene.add(new THREE.AmbientLight('#f5f0e8', 0.4));
      const dirLight = new THREE.DirectionalLight('#fff8e7', 0.6);
      dirLight.position.set(5, 8, 5);
      scene.add(dirLight);

      // Torus ring
      const torusGeo = new THREE.TorusGeometry(5, 0.3, 32, 64);
      const torusMat = new THREE.MeshStandardMaterial({ color: '#c9b99a', transparent: true, opacity: 0.25, roughness: 0.8 });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI * 0.08; // slight tilt
      scene.add(torus);

      // Add nodes as spheres
      const nodeGroup = new THREE.Group();
      nodeGroup.rotation.x = Math.PI * 0.08; // match torus tilt
      const majorRadius = 5;

      profiles.forEach((profile, i) => {
        const angle = (i / profiles.length) * Math.PI * 2 - Math.PI / 2;
        const x = majorRadius * Math.cos(angle);
        const z = majorRadius * Math.sin(angle);

        const sphereGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: profile.colour || '#c9b99a',
          emissive: profile.colour || '#c9b99a',
          emissiveIntensity: 0.2,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(x, 0, z);
        nodeGroup.add(sphere);

        // TODO: Add text labels using CSS2DRenderer or sprite text
        // TODO: Add connection curves between nodes
      });
      scene.add(nodeGroup);

      // TODO: Add connection curves (THREE.QuadraticBezierCurve3 → THREE.Line)
      // TODO: Add arrowhead cones
      // TODO: Add interaction (raycasting for hover/click)

      // Animation loop
      let animId: number;
      function animate() {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      // Resize handler
      const onResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        controls.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    })();

    return () => cleanup?.();
  }, [mounted, profiles]);

  if (!mounted) return <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return <div ref={containerRef} style={{ width: '100%', height: '70vh', minHeight: '500px' }} />;
}
```

This approach:
- Uses dynamic `import()` for THREE inside useEffect — completely avoids SSR
- No R3F dependency at all — just raw Three.js
- OrbitControls imported from Three.js examples (always available)
- Works with ANY version of Next.js

**If you use this approach, uninstall R3F to save bundle size:**
```bash
npm uninstall @react-three/fiber @react-three/drei
```

Then build out the full 3D scene (connections, labels, interaction) incrementally inside this imperative setup. The TODO comments mark where to add each feature.

---

## After fixing, build the full 3D scene

Once the basic 3D renders without errors, gradually add back:
1. All node spheres with correct positions from the auto-arrange algorithm
2. Text labels (use `CSS2DRenderer` from Three.js for crisp HTML labels)
3. Connection curves with vertical layering
4. Arrowhead cones
5. Hover/click interaction via raycasting
6. Camera preset buttons
7. Filter integration with legend

Add each feature one at a time, testing after each addition.

---

## ALSO: Add Total Connection Count to Each Node Circle

In BOTH the 2D SVG wheel AND the 3D wheel, each Kin node should display a small badge showing the total number of connections that person has to all other people in the comparison.

### 2D (SVG wheel)

Add a small circular badge at the bottom-right of each node circle:

```
      ┌───────┐
      │ Night │
      │Kin 143│
      │       │ (12)  ← small badge
      └───────┘
        Remi
```

- Badge: small circle (`r="10"`) with warm tan fill (`#c9b99a`)
- Number: `font-size="9"`, bold, dark brown (`#2c1a0e`), centred in badge
- Position: bottom-right of the node circle, slightly overlapping the edge
- The count = total number of connection lines touching this node (count each line once, regardless of direction)

### 3D (Three.js wheel)

Same concept — small badge floating near each sphere node. Use a CSS2D label or a small sprite with the number.

### Counting logic

For each profile, count how many connections it has across ALL types:
- If Remi has 3 Analog connections, 2 Antipode, 1 Guide, 2 Colour family, 2 Earth family, 1 Wavespell, 1 Castle = **12 total**
- Count each connection line once (don't double-count mutual connections — one mutual Analog = 1 connection, not 2)

This immediately shows who is the most connected person in the group (the "hub") and who has fewer connections.

---

## Checklist

- [ ] 3D mode renders without any errors
- [ ] Torus ring visible
- [ ] Node spheres visible at correct positions
- [ ] Orbit controls work (drag to rotate, scroll to zoom)
- [ ] Auto-rotate when idle
- [ ] No console errors
- [ ] `npm run build` — zero errors
- [ ] 2D mode still works when toggled back
- [ ] Each node in 2D wheel shows connection count badge (bottom-right)
- [ ] Each node in 3D wheel shows connection count badge
- [ ] Counts are correct (verified manually for at least 2 profiles)
- [ ] Badge doesn't obscure the node text
