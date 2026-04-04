# Fix: 3D Wheel — Duplicate Nodes + Oversized Grey Ring

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## TWO issues to fix.

---

## Issue 1: Duplicate Nodes

### Problem

The 3D wheel is showing DUPLICATE nodes — each person appears TWICE with their label. For example, "Night · Kin 203 Mamyte" appears on both the left and right side, "Night · Kin 143 Remi" appears in two places, etc.

### Cause

The code is likely rendering nodes in TWO places:
- Once on the 3D torus/ring positions
- Once again as flat CSS/HTML labels that aren't positioned correctly

OR the node rendering loop is running twice — check for:
- Two separate `.map()` loops over the profiles array that both create meshes
- A node group being added to the scene twice
- The component rendering twice due to React StrictMode (in dev mode, React 18 double-invokes effects)

### Fix

1. Search `ComparisonWheel3D.tsx` for ALL places where nodes/spheres/labels are created
2. There should be exactly ONE loop that creates ONE mesh + ONE label per profile
3. If there are two loops (e.g. one for spheres, one for labels), merge them into one
4. If the issue is React StrictMode double-mounting, add cleanup in the useEffect that removes all objects from the scene before re-adding:

```typescript
useEffect(() => {
  // ... setup scene ...

  // CLEANUP: remove everything before re-rendering
  return () => {
    // Remove all children from nodeGroup
    while (nodeGroup.children.length > 0) {
      nodeGroup.remove(nodeGroup.children[0]);
    }
    // Remove all children from connectionGroup
    while (connectionGroup.children.length > 0) {
      connectionGroup.remove(connectionGroup.children[0]);
    }
    // Dispose renderer
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}, [mounted, profiles, connections]);
```

5. Also check if there's BOTH a Three.js sphere mesh AND a CSS2D/HTML label creating separate visual nodes — if so, the sphere should be the node and the label should be text only, positioned above the sphere, not a second sphere-like element.

**After fixing, verify:** exactly N spheres for N profiles. No duplicates.

---

## Issue 2: Oversized Grey Ring

### Problem

There's a massive grey torus ring dominating the scene. It's too large, too opaque, and too prominent. The ring should be a subtle structural guide, not the visual centrepiece.

### Fix

**A) Reduce the torus size and opacity dramatically:**

```typescript
// Torus ring — subtle, not dominant
const torusGeo = new THREE.TorusGeometry(
  5,      // majorRadius — match the node placement radius
  0.08,   // minorRadius — MUCH thinner (was probably 0.3+ making it chunky)
  16,     // radialSegments — can be low for a thin ring
  64      // tubularSegments
);
const torusMat = new THREE.MeshStandardMaterial({
  color: '#c9b99a',
  transparent: true,
  opacity: 0.15,       // Very subtle — barely visible
  roughness: 0.9,
  metalness: 0.0,
  depthWrite: false,    // Prevents z-fighting with other transparent objects
});
```

Key changes:
- `minorRadius: 0.08` (thin wire ring, not a chunky tube)
- `opacity: 0.15` (barely there)
- `depthWrite: false` (prevents visual glitches with transparent objects)

**B) Make sure the torus radius matches the node placement radius:**

The nodes should sit ON the ring, not inside or outside it. If nodes are placed at radius `5`, the torus `majorRadius` must also be `5`.

**C) Alternative — replace the torus with a simple circle line:**

If the torus still looks heavy, replace it with a flat circle outline using `THREE.Line`:

```typescript
const circlePoints = [];
const segments = 64;
for (let i = 0; i <= segments; i++) {
  const angle = (i / segments) * Math.PI * 2;
  circlePoints.push(new THREE.Vector3(
    5 * Math.cos(angle),
    0,
    5 * Math.sin(angle)
  ));
}
const circleGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
const circleMat = new THREE.LineBasicMaterial({
  color: '#c9b99a',
  transparent: true,
  opacity: 0.2,
});
const circleRing = new THREE.Line(circleGeo, circleMat);
scene.add(circleRing);
```

This gives a clean, thin circle outline instead of a 3D tube — much more elegant.

---

## Also check: Node colours

Looking at the screenshot, nodes are all dark blue/navy and one is dark red. They should use each person's SEAL COLOUR:
- Red seals (Dragon, Serpent, Moon, Skywalker, Earth) → `#c0392b`
- White seals (Wind, Worldbridger, Dog, Wizard, Mirror) → `#7f8c8d` or light grey
- Blue seals (Night, Hand, Monkey, Eagle, Storm) → `#2471a3`
- Yellow seals (Seed, Star, Human, Warrior, Sun) → `#d4a017`

OR use the profile's assigned colour (the same colour used for their circle border in 2D mode). Check how the 2D wheel assigns colours and use the same mapping.

If all nodes are appearing as the same dark blue, the colour is probably hardcoded or the profile colour property isn't being read correctly.

---

## What NOT to change

- 2D wheel — do not touch
- Connection line logic — do not touch (just fix duplicates if connections are also doubled)
- Comparison data / scoring — do not touch
- Compatibility cards — do not touch
- Other views — do not touch

## Checklist

- [ ] Exactly N nodes for N profiles — NO duplicates
- [ ] Each person appears once and only once
- [ ] Torus ring is thin and subtle (opacity 0.15 or less, thin tube)
- [ ] OR ring replaced with a simple circle line
- [ ] Ring radius matches node placement radius
- [ ] Node colours match seal colours (Red/White/Blue/Yellow) not all dark blue
- [ ] Labels are readable and not duplicated
- [ ] Cleanup function prevents double-rendering in React StrictMode
- [ ] 3D scene looks clean and uncluttered
- [ ] `npm run build` — zero errors
