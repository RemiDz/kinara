# Fix: 3D Wheel Node Colours — Too Dark, All Look the Same

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

All 3D node spheres are dark and muddy — they all look nearly the same colour. Night nodes look dark grey, Moon looks brown, Monkey looks dark navy. In the 2D wheel these same nodes have distinct, vibrant colours. The 3D nodes need to match.

## Root Cause

Three.js materials appear darker than expected because:
1. **Lighting is too dim** — `ambientLight` intensity too low, making everything dark
2. **MeshStandardMaterial absorbs light** — it's physically-based and needs strong lighting to show colour
3. **Emissive is too low or using the wrong colour** — dark emissive + dim scene = muddy

## Fix

### Step 1: Use the EXACT same colours as the 2D wheel

Find the 2D comparison wheel component. Look at how it assigns colours to each profile's node circle border. Extract those exact hex values and use them in 3D.

The 2D wheel likely assigns each profile a unique colour from a palette. Map those same colours to the 3D spheres.

If the 2D wheel uses the Dreamspell seal colour families, they should be:
- **Red seals** (Dragon, Serpent, Moon, Skywalker, Earth): `#c0392b` — earthy red
- **White seals** (Wind, Worldbridger, Dog, Wizard, Mirror): `#a0917b` — warm taupe (NOT pure white — it disappears in 3D)
- **Blue seals** (Night, Hand, Monkey, Eagle, Storm): `#2471a3` — calm blue
- **Yellow seals** (Seed, Star, Human, Warrior, Sun): `#d4a017` — golden yellow

But more likely, the 2D wheel assigns each PERSON a unique profile colour (green for Remi, orange for Nerijus, purple for Edvinas, etc.) regardless of seal. Use THOSE profile colours — they're what makes each node distinguishable.

### Step 2: Switch to MeshPhongMaterial or brighten dramatically

`MeshStandardMaterial` in a dimly lit scene will always look dark. Two options:

**Option A (recommended): Use MeshBasicMaterial for guaranteed bright colour**

```typescript
const sphereMat = new THREE.MeshBasicMaterial({
  color: profileColour,  // Exact hex from 2D wheel
});
```

`MeshBasicMaterial` ignores lighting entirely — the colour you set is the colour you see. No dark surprises. It won't have shading/shadows but the nodes will be VIVID and distinct.

**Option B: Keep MeshStandardMaterial but crank up emissive**

```typescript
const sphereMat = new THREE.MeshStandardMaterial({
  color: profileColour,
  emissive: profileColour,
  emissiveIntensity: 0.7,   // HIGH — makes the colour glow through
  roughness: 0.3,
  metalness: 0.0,
});
```

### Step 3: Boost scene lighting

Regardless of material choice, brighten the scene:

```typescript
// Bright ambient — fills the whole scene
const ambient = new THREE.AmbientLight('#ffffff', 0.8);  // was probably 0.4
scene.add(ambient);

// Strong key light from above-front
const keyLight = new THREE.DirectionalLight('#ffffff', 1.0);  // was probably 0.6
keyLight.position.set(5, 10, 8);
scene.add(keyLight);

// Fill light from below to prevent dark undersides
const fillLight = new THREE.DirectionalLight('#ffffff', 0.4);
fillLight.position.set(-3, -5, -3);
scene.add(fillLight);
```

Use white (`#ffffff`) for lights, NOT warm tinted. The warm palette comes from the material colours, not the lighting — warm lighting on warm materials = muddy dark.

### Step 4: Add a thin coloured outline ring around each sphere

To make nodes even more distinguishable (matching the 2D wheel's circle borders), add a wireframe ring around each sphere:

```typescript
const ringGeo = new THREE.RingGeometry(0.36, 0.40, 32);
const ringMat = new THREE.MeshBasicMaterial({
  color: profileColour,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.lookAt(camera.position); // billboard toward camera — or skip and let it sit flat
ring.position.copy(spherePosition);
```

This gives each node a bright coloured ring that's unmistakable even from a distance.

### Step 5: Make sphere sizes equal

Looking at the screenshot, some spheres appear much larger than others (Mamyte and Edvinas are huge, Nerijus is small). All profile nodes should be the SAME size — the connection count badge communicates importance, not sphere size.

```typescript
const SPHERE_RADIUS = 0.35; // same for ALL nodes
const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 32);
```

If sphere sizes are currently mapped to connection count or score, remove that mapping. Equal sizes.

---

## What NOT to change

- 2D wheel — do not touch
- Connection lines — do not touch
- Node positions / arrangement — do not touch
- Labels — do not touch (but ensure label colour also matches the bright profile colour)
- Other features — do not touch

## Checklist

- [ ] Each 3D node sphere is a distinct, bright colour matching its 2D wheel counterpart
- [ ] Colours are clearly distinguishable from each other (no two look the same)
- [ ] Scene lighting is bright enough that all colours read correctly
- [ ] All spheres are the same size
- [ ] Node label text colours match the sphere colours
- [ ] Rotating the scene shows vibrant nodes from all angles
- [ ] `npm run build` — zero errors
