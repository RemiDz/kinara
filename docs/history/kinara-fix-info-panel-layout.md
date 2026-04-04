# Fix: Node Info Panel — Position and Size

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

The info panel that opens when clicking a node looks randomly placed and randomly sized. It floats on the left without a clear relationship to the wheel. It needs precise, intentional positioning.

## Required Layout

The wheel section should become a **two-column layout** when the panel is open:

```
Panel CLOSED:
┌──────────────────────────────────────────────────┐
│                                                   │
│              [  Wheel — centred  ]                │
│              [  full width       ]                │
│                                                   │
└──────────────────────────────────────────────────┘

Panel OPEN:
┌────────────────┬─────────────────────────────────┐
│                │                                  │
│   Info Panel   │       [  Wheel — centred  ]     │
│   fixed 360px  │       [  in remaining     ]     │
│                │       [  space             ]     │
│                │                                  │
│   scrollable   │                                  │
│                │                                  │
│                │                                  │
└────────────────┴─────────────────────────────────┘
```

### Implementation

Wrap the wheel area in a flex container:

```tsx
<div className="relative flex gap-0">
  {/* Info Panel — only rendered when a node is selected */}
  {selectedNode && (
    <div className="w-[360px] flex-shrink-0 border-r border-[#c9b99a]/30
      bg-[#f5f0e8] overflow-y-auto rounded-l-xl shadow-[4px_0_20px_rgba(44,26,14,0.06)]
      transition-all duration-300 ease-out"
      style={{ maxHeight: '700px' }}
    >
      {/* Panel content */}
    </div>
  )}

  {/* Wheel container — takes remaining space */}
  <div className="flex-1 min-w-0 flex items-center justify-center">
    {/* Wheel SVG */}
  </div>
</div>
```

### Key rules

1. **Panel width: exactly 360px** — fixed, never stretches or shrinks (`w-[360px] flex-shrink-0`)

2. **Panel height: match the wheel container height** — use `maxHeight` matching the wheel's height (e.g. `700px` or whatever the wheel container is). Panel scrolls internally if content is longer.

3. **Panel is flush against the left edge** of the wheel section — no gap, no random offset. It's part of the layout, not floating on top.

4. **The wheel auto-centres in the remaining space** — when the panel opens, the wheel area shrinks from the left. The wheel SVG re-centres itself within the smaller remaining space. This may mean the wheel gets slightly smaller, which is fine.

5. **Smooth transition when panel opens/closes:**
   - Panel opening: the panel slides in from left AND the wheel shifts right simultaneously
   - Use `transition-all duration-300 ease-out` on the flex container
   - For the animate-in effect, you can use:
     ```tsx
     // Panel wrapper with animation
     <div className={`overflow-hidden transition-all duration-300 ease-out
       ${selectedNode ? 'w-[360px]' : 'w-0'}`}>
       <div className="w-[360px]">
         {/* Panel content — always 360px wide, parent clips it */}
       </div>
     </div>
     ```
     This clips the panel to 0 width when closed and expands to 360px when open, pushing the wheel smoothly.

6. **Panel top edge aligns with wheel top edge** — both should start at the same vertical position. Use `items-start` on the flex container if needed, not `items-center`.

7. **Panel has consistent internal padding**: `p-5` (20px all sides)

8. **Panel header is sticky** — the person's name, seal icon, and close button stick to the top while the connection list scrolls:
   ```tsx
   <div className="sticky top-0 bg-[#f5f0e8] pb-3 mb-3 border-b border-[#c9b99a]/30 z-10">
     <button onClick={onClose} className="absolute top-0 right-0 ...">✕</button>
     <div className="flex items-center gap-3">
       <img src={sealIcon} className="w-12 h-12 object-contain" />
       <div>
         <div className="text-lg font-semibold text-[#2c1a0e]">{name}</div>
         <div className="text-sm text-[#6b4c2a]">{fullKinName}</div>
         <div className="text-xs text-[#6b4c2a]/70">{toneInfo} · {connectionCount} connections</div>
       </div>
     </div>
   </div>
   ```

### Mobile (< 768px)

On mobile, the two-column layout doesn't work. Switch to a **bottom sheet overlay**:

```tsx
{/* Mobile: bottom sheet */}
<div className="md:hidden fixed inset-x-0 bottom-0 z-30
  bg-[#f5f0e8] rounded-t-2xl shadow-[0_-4px_20px_rgba(44,26,14,0.1)]
  max-h-[70vh] overflow-y-auto p-5 pt-3
  transition-transform duration-300 ease-out"
  style={{ transform: selectedNode ? 'translateY(0)' : 'translateY(100%)' }}
>
  {/* Drag handle */}
  <div className="w-10 h-1 bg-[#c9b99a] rounded-full mx-auto mb-4" />
  {/* Same panel content */}
</div>

{/* Backdrop */}
{selectedNode && (
  <div className="md:hidden fixed inset-0 bg-black/20 z-20" onClick={onClose} />
)}
```

### Desktop layout: hide the panel column completely when closed

Don't leave an empty 0px column — the flex container should behave as if the panel doesn't exist when no node is selected:

```tsx
<div className="flex">
  {/* Animated width container */}
  <div
    className="overflow-hidden transition-[width] duration-300 ease-out flex-shrink-0"
    style={{ width: selectedNode ? '360px' : '0px' }}
  >
    <div className="w-[360px] h-full overflow-y-auto bg-[#f5f0e8]
      border-r border-[#c9b99a]/30 p-5"
      style={{ maxHeight: '700px' }}
    >
      {/* Panel content */}
    </div>
  </div>

  {/* Wheel */}
  <div className="flex-1 min-w-0 flex items-start justify-center transition-all duration-300">
    {/* SVG wheel */}
  </div>
</div>
```

---

## What NOT to change

- Panel content (connection descriptions, scoring, sorting) — it's working great, do not touch
- Node click highlight/filter — keep as-is
- Wheel rendering — do not touch the SVG content
- Legend, synastry, compatibility cards — do not touch
- 3D view — do not touch

## Checklist

- [ ] Panel is exactly 360px wide on desktop
- [ ] Panel is flush left, no random gap or offset
- [ ] Panel top aligns with wheel top
- [ ] Panel height matches wheel container (scrolls internally)
- [ ] Panel header is sticky during scroll
- [ ] Wheel re-centres in remaining space when panel opens
- [ ] Smooth 300ms transition when panel opens/closes
- [ ] No layout jump or jitter during transition
- [ ] Mobile: bottom sheet overlay (not left panel)
- [ ] Mobile: backdrop dismisses panel on tap
- [ ] Close button works
- [ ] Clicking different node swaps content without re-animating panel
- [ ] `npm run build` — zero errors
