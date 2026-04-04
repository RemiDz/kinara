# Fix: ComparisonWheel3D — "Cannot read properties of undefined (reading 'S')" Runtime Error

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

Switching to 3D mode in the comparison view throws:

```
TypeError: Cannot read properties of undefined (reading 'S')
```

Call stack points to `@react-three/fiber/dist/events-*.esm.js` inside `ComparisonWheel3D.tsx`.

This is a well-known React Three Fiber + Next.js compatibility issue. R3F uses browser APIs (WebGL, DOM) that don't exist during Next.js server-side rendering. The error occurs because R3F tries to initialise during SSR or hydration before the browser context is ready.

## Fix

### 1. Dynamic import with SSR disabled

The `ComparisonWheel3D` component MUST be loaded with `next/dynamic` and `ssr: false`. This is non-negotiable for any R3F component in Next.js.

Find wherever `ComparisonWheel3D` is imported. Change from:

```tsx
// WRONG — will crash
import ComparisonWheel3D from './ComparisonWheel3D';
```

To:

```tsx
// CORRECT — prevents SSR
import dynamic from 'next/dynamic';

const ComparisonWheel3D = dynamic(() => import('./ComparisonWheel3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center" style={{ height: '70vh', minHeight: '500px' }}>
      <div className="text-center text-[#6b4c2a]">
        <div className="text-sm">Loading 3D view...</div>
      </div>
    </div>
  ),
});
```

### 2. Also dynamic-import ALL R3F sub-components

If `ComparisonWheel3D.tsx` imports from `@react-three/fiber` or `@react-three/drei` at the top level, those imports also trigger during SSR. Make sure ALL of these imports are INSIDE the dynamically loaded component, NOT in the parent.

Check that the parent component (likely the comparison page or a wrapper) does NOT have any of these at the top:

```tsx
// NONE of these should be in the parent component
import { Canvas } from '@react-three/fiber';        // ❌ WRONG if in parent
import { OrbitControls } from '@react-three/drei';   // ❌ WRONG if in parent
import * as THREE from 'three';                       // ❌ WRONG if in parent
```

All R3F and Three.js imports must live INSIDE `ComparisonWheel3D.tsx` (the dynamically imported file) — never in the parent that conditionally renders it.

### 3. Add 'use client' directive

Ensure `ComparisonWheel3D.tsx` has the client directive at the very top:

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Billboard, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
// ... rest of component
```

### 4. Guard against missing window/document

As an extra safety layer, add a mount check inside the component:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function ComparisonWheel3D({ profiles, connections }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: '70vh' }}>
        <div className="text-sm text-[#6b4c2a]">Initialising 3D...</div>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
      {/* ... scene contents ... */}
    </Canvas>
  );
}
```

### 5. Check for version compatibility

Verify the installed versions are compatible:

```bash
npm ls three @react-three/fiber @react-three/drei
```

Known compatible set:
- `three`: `^0.160.0` to `^0.170.0`
- `@react-three/fiber`: `^8.15.0` or `^9.0.0`
- `@react-three/drei`: `^9.88.0` or later

If versions are mismatched or too old/new, fix with:

```bash
npm install three@0.169.0 @react-three/fiber@8.17.10 @react-three/drei@9.117.3
```

Adjust versions to latest compatible set — check npmjs.com for the most recent stable versions that work together.

### 6. Check for the specific 'S' error

The `reading 'S'` error specifically often comes from R3F's event system trying to access `document.createElement` or similar DOM API during SSR. The dynamic import with `ssr: false` is the primary fix. If it persists after the dynamic import fix:

- Check if there's a `useEffect` or `useLayoutEffect` that runs during render instead of after mount
- Check if any Three.js objects (Vector3, Color, etc.) are instantiated at module scope outside of components:

```tsx
// ❌ WRONG — runs at import time (during SSR)
const defaultPosition = new THREE.Vector3(0, 0, 0);

// ✅ CORRECT — runs only inside component after mount
function MyComponent() {
  const defaultPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
}
```

Search the entire `ComparisonWheel3D.tsx` file for any `new THREE.*` calls at the top level (outside of components/hooks) and move them inside `useMemo` or `useRef`.

### 7. Clear cache and rebuild

After all fixes:

```bash
rm -rf .next
npm run dev
```

The `.next` cache often holds stale compiled chunks that cause phantom errors.

---

## What NOT to change

- The 3D scene content (torus, nodes, connections) — do not touch the visual design
- The 2D fallback wheel — keep it available
- The toggle between 2D/3D — keep it
- Legend, synastry panel — do not touch
- Other views — do not touch

## Checklist

- [ ] `ComparisonWheel3D` imported with `next/dynamic` and `ssr: false`
- [ ] No R3F or Three.js imports in the parent component
- [ ] `'use client'` directive at top of `ComparisonWheel3D.tsx`
- [ ] Mount guard (`useState` + `useEffect`) before rendering Canvas
- [ ] No `new THREE.*` calls at module scope — all inside components
- [ ] `.next` cache cleared
- [ ] 3D mode loads without errors
- [ ] 3D scene renders and is interactive (rotate, zoom)
- [ ] 2D mode still works when toggled back
- [ ] `npm run build` — zero errors
- [ ] No console errors
