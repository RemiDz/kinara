# Fix: Node Click Filter + Connection Count Badges + Select All Button

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## THREE issues to fix. Do ALL three.

---

## Issue 1: Node Click Should Toggle-Filter Connections

### Problem

Clicking on any Kin circle node in the comparison wheel does NOTHING. No response, no visual change.

### Required Behaviour

Clicking a node should work as a **toggle filter** — show only that person's connections and hide everything else:

**First click on a node (activate filter):**
1. ALL connection lines that DO NOT involve this person → fade to `opacity: 0.05` (nearly invisible)
2. ALL connection lines that DO involve this person → full opacity, slightly thicker (`stroke-width + 0.5`)
3. The clicked node → scale up 1.15×, add a golden glow/ring highlight
4. All OTHER nodes that are connected to the clicked person → normal opacity
5. All OTHER nodes that are NOT connected to the clicked person → fade to `opacity: 0.3`
6. Person names of connected nodes stay fully visible

**Second click on the SAME node (deactivate filter):**
1. ALL connections return to normal visibility
2. ALL nodes return to normal opacity and scale
3. The golden glow/ring disappears
4. Back to default "show all" state

**Click on a DIFFERENT node while one is active:**
1. Switch the filter to the newly clicked node
2. Previous node returns to normal
3. New node gets the highlight

### Implementation

Add state to the comparison wheel component:

```tsx
const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

const handleNodeClick = (profileId: string) => {
  setSelectedNodeId(prev => prev === profileId ? null : profileId);
};
```

When rendering connections, check if a filter is active:

```tsx
const getConnectionOpacity = (connection: Connection) => {
  if (!selectedNodeId) return 1; // no filter active — show all
  // Does this connection involve the selected person?
  if (connection.profileA === selectedNodeId || connection.profileB === selectedNodeId) {
    return 1; // involved — full opacity
  }
  return 0.05; // not involved — nearly invisible
};
```

When rendering nodes:

```tsx
const getNodeStyle = (profileId: string) => {
  if (!selectedNodeId) return { opacity: 1, scale: 1, glow: false };
  if (profileId === selectedNodeId) return { opacity: 1, scale: 1.15, glow: true };
  // Is this node connected to the selected node?
  const isConnected = connections.some(c =>
    (c.profileA === selectedNodeId && c.profileB === profileId) ||
    (c.profileB === selectedNodeId && c.profileA === profileId)
  );
  return { opacity: isConnected ? 1 : 0.3, scale: 1, glow: false };
};
```

Add `cursor: pointer` to all node circles and a `transition: all 300ms ease` for smooth opacity/scale changes.

The golden glow on the selected node:
```css
/* SVG filter or additional circle */
<circle r={nodeRadius + 4} fill="none" stroke="#d4a017" stroke-width="2" opacity="0.6" />
```

### Make sure the click target is large enough

The clickable area should be the entire node group (circle + text), not just the circle stroke. Wrap each node's elements in a `<g>` with the click handler and `cursor: pointer`:

```tsx
<g onClick={() => handleNodeClick(profile.id)} style={{ cursor: 'pointer' }}>
  <circle ... />
  <text>{sealName}</text>
  <text>{kinNumber}</text>
  <text>{personName}</text>
</g>
```

---

## Issue 2: Total Connection Count Badge on Each Node

### Problem

Connection count badges are still not showing on any node circles.

### Implementation — Step by Step

**Step A: Calculate connection counts.**

Create a function that counts connections per profile:

```tsx
function getConnectionCounts(profiles: Profile[], connections: Connection[]): Record<string, number> {
  const counts: Record<string, number> = {};

  // Initialise all to 0
  profiles.forEach(p => { counts[p.id] = 0; });

  // Count each connection line once per profile it touches
  connections.forEach(conn => {
    counts[conn.profileA] = (counts[conn.profileA] || 0) + 1;
    counts[conn.profileB] = (counts[conn.profileB] || 0) + 1;
  });

  return counts;
}
```

Call this where connections are calculated, pass the result to the wheel renderer.

**Step B: Render the badge on each node.**

Inside the SVG, for each node, add a badge circle + text AFTER the main node elements (so it renders on top):

```tsx
{/* Connection count badge — bottom-right of node */}
{connectionCount > 0 && (
  <g transform={`translate(${nodeX + nodeRadius * 0.65}, ${nodeY + nodeRadius * 0.65})`}>
    <circle r="11" fill="#c9b99a" stroke="#2c1a0e" stroke-width="0.5" />
    <text
      text-anchor="middle"
      dominant-baseline="central"
      font-size="9"
      font-weight="bold"
      fill="#2c1a0e"
    >
      {connectionCount}
    </text>
  </g>
)}
```

Position: offset from the node centre by `nodeRadius * 0.65` in both X and Y to place it at the bottom-right corner of the circle, slightly overlapping the edge.

**Step C: Verify the badge renders.**

After implementing, verify visually:
- Every node with connections shows a small tan badge with a number
- The number matches the actual count of connection lines touching that node
- Nodes with zero connections (if any) show no badge
- Badge doesn't overlap with the person's name text below the node — adjust Y offset if needed

**Step D: If the badge STILL doesn't render, debug:**
- Add `console.log('Connection counts:', connectionCounts)` to verify the data
- Check if the badge elements are in the DOM (inspect element)
- Check if they're hidden behind other SVG elements (move them to render LAST in the SVG)
- Check if the position calculation puts them off-screen

---

## Issue 3: "Select All" Button for Saved Profiles

### Problem

When a user has many saved profiles, they have to click each one individually to add them to the comparison. Need a "Select all" button to load every saved profile at once.

### Implementation

In the comparison view's profile selection area, add a "Select all" button:

```tsx
{savedProfiles.length > 0 && (
  <div className="flex items-center gap-3 mb-3">
    <button
      onClick={handleSelectAll}
      className="text-sm font-medium px-4 py-1.5 rounded-full
        bg-[#c8a96e] text-[#2c1a0e] hover:bg-[#b8993e]
        transition-colors duration-200"
    >
      Select all ({savedProfiles.length})
    </button>
    {activeProfiles.length > 0 && (
      <button
        onClick={handleClearAll}
        className="text-sm px-4 py-1.5 rounded-full
          border border-[#c9b99a] text-[#6b4c2a] hover:bg-[#ede7d9]
          transition-colors duration-200"
      >
        Clear all
      </button>
    )}
  </div>
)}
```

**Select all handler:**
```tsx
const handleSelectAll = () => {
  // Add all saved profiles that aren't already in the comparison
  const newProfiles = savedProfiles.filter(
    saved => !activeProfiles.some(active => active.id === saved.id)
  );
  setActiveProfiles([...activeProfiles, ...newProfiles]);
};
```

**Clear all handler:**
```tsx
const handleClearAll = () => {
  setActiveProfiles([]);
};
```

### Layout

Place the buttons above the individual profile chips:

```
┌──────────────────────────────────────────────────┐
│  [Select all (11)]  [Clear all]                  │
│                                                   │
│  Saved: [Remi] [Jolanta] [Leja] [Azuolas]       │
│         [Rmigijus] [Mamyte] [Edvinas] [Valdas]  │
│         [Iveta] [Nerijus] [Janina] [+ Add new]  │
└──────────────────────────────────────────────────┘
```

- "Select all" button: golden background, shows count in parentheses
- "Clear all" button: outline style, only visible when profiles are loaded
- If ALL saved profiles are already added, disable "Select all" (greyed out or hidden)

---

## What NOT to change

- Connection line rendering logic — do not change line styles, colours, or types
- Auto-arrange algorithm — do not touch
- Synastry panel — do not touch
- Wavespell Journey — do not touch
- 3D mode (if implemented) — do not touch
- Legend and filter system — do not touch (node click filter is SEPARATE from legend filter — both should work independently)

## How node filter and legend filter interact

- **Legend filter** = filter by CONNECTION TYPE (show/hide Analog, Antipode, etc.)
- **Node click filter** = filter by PERSON (show only one person's connections)
- Both can be active simultaneously: if user clicks Remi AND has "Analog only" active in the legend, show only Remi's Analog connections
- To combine: a connection is visible only if BOTH filters pass:
  ```tsx
  const isVisible = legendFilter.includes(connection.type) &&
    (!selectedNodeId || connection.profileA === selectedNodeId || connection.profileB === selectedNodeId);
  ```

## Checklist

- [ ] Clicking a node highlights it and shows only its connections
- [ ] All other connections fade to near-invisible
- [ ] Unconnected nodes fade to 30% opacity
- [ ] Clicking the same node again deactivates the filter
- [ ] Clicking a different node switches the filter
- [ ] Node click filter works alongside legend type filter
- [ ] Smooth 300ms transitions on all opacity/scale changes
- [ ] All nodes show connection count badge (small tan circle with number)
- [ ] Badge positioned at bottom-right of node circle
- [ ] Badge numbers are correct
- [ ] "Select all" button loads all saved profiles at once
- [ ] "Clear all" button removes all profiles
- [ ] "Select all" shows count in parentheses
- [ ] Buttons styled consistently with app palette
- [ ] `npm run build` — zero errors
