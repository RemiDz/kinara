# Feature: 3D Interactive Comparison Wheel

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: gigathink

---

## OVERVIEW

Transform the comparison wheel from a flat 2D SVG into a fully interactive 3D object that the user can rotate, zoom, and explore from any angle. This is the crown jewel feature of Kinara — nothing like this exists in any Dreamspell tool anywhere.

The 3D wheel must be:
- **Performant** — smooth 60fps on desktop and mobile
- **Beautiful** — sacred geometry aesthetic, warm parchment palette, soft lighting
- **Informative** — the 3D perspective must REVEAL connection patterns that are hidden in 2D (e.g. connections that overlap in 2D are clearly separated in 3D)
- **Intuitive** — anyone can rotate it immediately without instructions

---

## TECH STACK

Use **React Three Fiber** (R3F) + **@react-three/drei** for declarative Three.js in React.

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

Do NOT use raw Three.js imperative code. Use R3F's declarative JSX approach throughout.

---

## 3D GEOMETRY DESIGN

### The Primary Structure: Toroidal Ring

The nodes sit on a **torus (ring)** in 3D space, not a flat circle. This gives depth and dimension while maintaining the circular relationship metaphor.

```
        ╭──── ────╮         ← Top of torus
       /    ○   ○   \       ← Nodes sitting on the ring surface
      │  ○    ╳    ○  │     ← Centre is empty (or has a focal element)
       \  ○   ○   ○  /
        ╰──── ────╯         ← Bottom of torus
```

Torus parameters:
- Major radius (ring centre to tube centre): `5` units
- Minor radius (tube thickness): `0.3` units — thin, elegant ring
- The torus is tilted ~15° toward the viewer so it's not edge-on by default

### Node Placement on the Torus

Nodes are distributed around the torus ring at equal angles (or compatibility-clustered angles from the auto-arrange algorithm). Each node sits ON the torus surface, slightly elevated above it.

For N nodes, node i sits at angle `θ = (i / N) * 2π`:
```typescript
const x = majorRadius * Math.cos(theta);
const z = majorRadius * Math.sin(theta);
const y = 0; // All on the same horizontal plane of the torus
// Then apply the 15° tilt rotation to the whole group
```

### Node Visual: 3D Spheres with Labels

Each node is:
- A **sphere** (radius `0.35`) with the seal's colour as material
- Slightly emissive glow matching the seal colour
- A **billboard text label** (always faces camera) above the sphere showing:
  - Seal name + Kin number (top line)
  - Person's name (bottom line, in profile colour)
- On hover: sphere scales up 1.2×, emissive glow intensifies, label becomes fully opaque
- When not hovered: label is slightly transparent (`opacity: 0.8`)

```tsx
<mesh position={nodePosition} onPointerOver={handleHover} onPointerOut={handleUnhover}>
  <sphereGeometry args={[0.35, 32, 32]} />
  <meshStandardMaterial
    color={sealColour}
    emissive={sealColour}
    emissiveIntensity={isHovered ? 0.6 : 0.2}
  />
</mesh>
<Billboard position={[nodePosition[0], nodePosition[1] + 0.6, nodePosition[2]]}>
  <Text fontSize={0.18} color="#2c1a0e" anchorY="bottom" font="/fonts/serif.woff">
    {sealName} · Kin {kinNumber}
  </Text>
  <Text fontSize={0.15} color={profileColour} anchorY="top" font="/fonts/sans.woff">
    {personName}
  </Text>
</Billboard>
```

### Connection Lines: 3D Curves

This is where 3D truly shines. In 2D, overlapping connections are a mess. In 3D, connections can arc ABOVE and BELOW the ring plane, separating visually.

**Connection routing by type — each type uses a different vertical layer:**

| Connection Type | Vertical Offset | Arc Height | Why |
|---|---|---|---|
| Analog (best friend) | +0.8 above | High graceful arc | Most important — sits highest, most visible |
| Guide (teacher) | +0.5 above | Medium arc | Important — clearly visible above ring |
| Hidden power (secret gift) | -0.5 below | Medium arc below | Hidden = underneath, discovered by rotating |
| Antipode (challenge) | -0.8 below | High arc below | Tension = deep below, counterbalances Analog |
| Colour family | +0.2 above | Slight arc | Subtle, close to ring plane |
| Earth family | -0.2 below | Slight arc | Subtle, close to ring plane |
| Wavespell | 0 (ring plane) | Flat/minimal | On the ring itself |
| Castle | 0 (ring plane) | Flat/minimal | On the ring itself |

This creates a **layered 3D web** — the supportive connections (Analog, Guide) arc above like a protective canopy, while the challenging/hidden connections (Antipode, Hidden power) arc below like roots. The category connections stay close to the ring.

**Implement connections as quadratic bezier curves:**

```typescript
function createConnectionCurve(
  startPos: Vector3,
  endPos: Vector3,
  verticalOffset: number,
  arcHeight: number
): QuadraticBezierCurve3 {
  const midPoint = new Vector3(
    (startPos.x + endPos.x) / 2,
    (startPos.y + endPos.y) / 2 + verticalOffset + arcHeight,
    (startPos.z + endPos.z) / 2
  );
  return new QuadraticBezierCurve3(startPos, midPoint, endPos);
}
```

Render curves using drei's `<Line>` or `<QuadraticBezierLine>`:

```tsx
<QuadraticBezierLine
  start={startPos}
  end={endPos}
  mid={midPoint}
  color={connectionColour}
  lineWidth={isMutual ? 2.5 : 1.5}
  dashed={isDashed}
  dashScale={isDashed ? 5 : undefined}
  transparent
  opacity={isFiltered ? 1.0 : 0.3}
/>
```

### Arrowheads in 3D

For directional arrows, place small cone meshes at the end of each curve, oriented along the curve's tangent direction:

```tsx
// Get the tangent at the end of the curve
const tangent = curve.getTangentAt(1).normalize();
const arrowPos = endPos.clone().sub(tangent.multiplyScalar(0.4)); // slightly before end

<mesh position={arrowPos} quaternion={quaternionFromDirection(tangent)}>
  <coneGeometry args={[0.08, 0.2, 8]} />
  <meshStandardMaterial color={connectionColour} />
</mesh>
```

For mutual connections, place cones at BOTH ends.

---

## CAMERA AND CONTROLS

### Orbit Controls

Use drei's `<OrbitControls>`:

```tsx
<OrbitControls
  enablePan={false}           // No panning — keep the wheel centred
  enableZoom={true}
  minDistance={4}              // Can't zoom inside the ring
  maxDistance={18}             // Can't zoom too far out
  minPolarAngle={Math.PI * 0.1}   // Can't go fully top-down
  maxPolarAngle={Math.PI * 0.9}   // Can't go fully bottom-up
  autoRotate={true}           // Gentle auto-rotation when not interacting
  autoRotateSpeed={0.3}       // Very slow — atmospheric, not dizzy
  dampingFactor={0.08}        // Smooth deceleration when user stops dragging
  enableDamping={true}
/>
```

### Default Camera Position

Start with the camera slightly above and in front of the ring, looking toward centre:
```tsx
<Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
```

This gives a natural 3/4 view — you see the ring's shape, the connections arcing above and below, and all the labels.

### Preset View Buttons

Add 4 small buttons outside the 3D canvas for quick camera jumps:

| Button | Camera Position | What it shows |
|---|---|---|
| 🔝 Top | [0, 12, 0] | Bird's eye — see the circular arrangement and clustering |
| 👁 Front | [0, 3, 10] | Default 3/4 view — balanced perspective |
| 🔽 Below | [0, -8, 6] | Look up from underneath — see Hidden Power and Antipode connections |
| 🔄 Reset | [0, 4, 10] | Back to default with auto-rotate on |

Animate camera transitions smoothly (500ms ease-out) when clicking preset buttons. Use drei's `useCamera` or manually interpolate position.

---

## INTERACTION

### Node Click

Clicking a node:
1. Camera smoothly zooms toward that node (animate to a position ~3 units from the node, looking at it)
2. Highlight all connections FROM that node (full opacity, thicker lines)
3. Dim all other connections (`opacity: 0.1`)
4. Show a floating info panel (HTML overlay via drei's `<Html>`) next to the node with:
   - Full Kin name and seal icon
   - Person's name
   - List of connections from this node to other nodes
5. Click the same node again or click empty space to deselect (camera returns to previous position)

### Connection Hover

Hovering over a connection curve:
1. The curve thickens and brightens
2. Both connected nodes glow
3. A small tooltip appears with: "Remi → Mamyte: Hidden power — secret gift"

### Connection Type Filter

The existing legend filter (show/hide connection types) must work in 3D:
- When a type is filtered out, those curves fade to `opacity: 0` with a 300ms transition
- When a type is active, curves are full opacity
- "Show all" / "Hide all" still work
- The layered vertical offsets make filtering even more powerful in 3D — you can isolate just the Analog connections arcing above, or just the Antipode connections below

---

## VISUAL AESTHETICS

### Lighting

```tsx
<ambientLight intensity={0.4} color="#f5f0e8" />  // Warm ambient
<directionalLight position={[5, 8, 5]} intensity={0.6} color="#fff8e7" />  // Warm key light
<directionalLight position={[-3, -4, -3]} intensity={0.2} color="#e8d5c0" />  // Subtle fill from below
```

### Torus Ring Material

The ring itself should be subtle — it's a structural element, not the focus:
```tsx
<meshStandardMaterial
  color="#c9b99a"        // Warm tan
  transparent
  opacity={0.25}         // Very subtle — just enough to see the ring shape
  roughness={0.8}
  metalness={0.1}
/>
```

### Background

The 3D canvas background should match the app's cream palette:
```tsx
<Canvas style={{ background: 'transparent' }}>
  <color attach="background" args={['#f5f0e8']} />
```

Or use transparent background so the app's existing cream background shows through.

### Subtle Particle Field

Add a very subtle particle system around the torus — tiny floating dots that give a sense of cosmic space:

```tsx
// 200 small particles scattered in a sphere around the scene
<Points positions={randomPositions} stride={3}>
  <PointMaterial
    size={0.02}
    color="#c9b99a"
    transparent
    opacity={0.3}
    sizeAttenuation
  />
</Points>
```

Very subtle — atmospheric, not distracting.

---

## LAYOUT INTEGRATION

### Replace or Supplement the 2D Wheel

**Option A (recommended): Replace the 2D wheel entirely.**

The 3D wheel replaces the current SVG wheel in the comparison view. The legend, synastry panel, and all existing UI below the wheel remain unchanged.

The 3D canvas container:
```tsx
<div className="w-full" style={{ height: '70vh', minHeight: '500px', maxHeight: '800px' }}>
  <Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
    {/* ... 3D scene ... */}
  </Canvas>
</div>
```

On mobile (< 768px), reduce height to `50vh` (min 350px). Touch gestures for rotate/zoom work natively with OrbitControls.

**Option B (fallback): Toggle between 2D and 3D.**

If 3D performance is a concern on low-end devices, keep the 2D SVG as fallback with a toggle:
```
[2D ○ | ● 3D]
```

Detect WebGL support and default to 2D if WebGL is unavailable.

**Go with Option A first.** Only implement Option B if there are performance issues.

### Fullscreen Mode

The existing fullscreen expand button must work with the 3D canvas:
- In fullscreen, the canvas fills the entire viewport
- Camera adjusts FOV or distance so the full ring is visible
- Preset view buttons are visible in fullscreen
- Escape exits fullscreen

---

## PERFORMANCE REQUIREMENTS

- **60fps** on desktop (Chrome, Firefox, Safari)
- **30fps minimum** on mobile (iPhone 12+, recent Android)
- Limit geometry complexity:
  - Sphere segments: 32×32 (not 64×64)
  - Torus segments: 64×32
  - Connection curves: 20 segments each
  - Particle count: 200 max
- Use `React.memo` on node components to prevent unnecessary re-renders
- Use `useFrame` sparingly — only for auto-rotate and hover animations
- Dispose of geometries and materials on unmount

### Performance test

After building, test with:
- 3 profiles (minimal) — must be butter smooth
- 10 profiles (typical) — must maintain 60fps desktop
- 15 profiles (stress test) — must maintain 30fps+ desktop

If 15 profiles drops below 30fps, reduce curve segments to 12 and particle count to 100.

---

## ACCESSIBILITY

- The 3D canvas must have `role="img"` and an `aria-label` describing the comparison
- The preset view buttons must be keyboard-focusable
- Node click must work with keyboard (Tab to focus, Enter to select)
- The synastry panel below (HTML) remains fully accessible — 3D is a visual enhancement, not the only way to read the data

---

## WHAT NOT TO CHANGE

- Auto-arrange algorithm — keep using it for node ordering
- Connection scoring/weights — keep as-is
- Legend and filter system — keep working, connect to 3D visibility
- Synastry panel — keep entirely as-is (it's HTML below the canvas)
- Saved profile chips and add UX — do not touch
- Wavespell Journey — do not touch
- Other views/pages — do not touch

---

## CHECKLIST

### Core 3D
- [ ] React Three Fiber + drei installed and working
- [ ] Torus ring renders with warm tan semi-transparent material
- [ ] Nodes render as coloured spheres on the torus ring
- [ ] Billboard text labels show seal name, Kin number, and person name
- [ ] Labels always face the camera

### Connections
- [ ] All 8 connection types render as 3D bezier curves
- [ ] Connection types are layered vertically (Analog above, Antipode below, etc.)
- [ ] Directional cones (arrowheads) at curve endpoints
- [ ] Mutual connections have cones at both ends
- [ ] Connection colours match the existing 2D colour scheme
- [ ] Dashed lines render correctly in 3D

### Interaction
- [ ] Orbit controls: rotate (drag), zoom (scroll/pinch)
- [ ] Auto-rotate when idle (very slow)
- [ ] Node hover: scale up, glow intensify
- [ ] Node click: camera zooms in, highlights connections, shows info panel
- [ ] Connection hover: thicken + tooltip
- [ ] Click empty space to deselect
- [ ] 4 preset camera view buttons work with smooth animation

### Filtering
- [ ] Legend filter toggles connection type visibility in 3D
- [ ] Show all / Hide all work
- [ ] Filtered connections fade out smoothly (300ms)

### Visual
- [ ] Warm lighting matching cream palette
- [ ] Subtle particle field (200 particles, very low opacity)
- [ ] No harsh shadows or stark contrasts
- [ ] Torus ring is subtle structural element, not visually dominant

### Integration
- [ ] 3D canvas replaces 2D SVG wheel
- [ ] Fullscreen mode works with 3D canvas
- [ ] Legend below canvas works correctly
- [ ] Synastry panel below canvas unchanged
- [ ] Saved profile chips above canvas unchanged

### Performance
- [ ] 60fps with 10 profiles on desktop
- [ ] 30fps+ with 10 profiles on mobile
- [ ] No memory leaks (dispose geometries on unmount)
- [ ] WebGL context created successfully

### Build
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all existing tests pass
- [ ] No console warnings about Three.js deprecations
