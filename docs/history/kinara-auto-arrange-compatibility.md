# Feature: Auto-Arrange Comparison Wheel Nodes by Compatibility

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: ultrathink

---

## Problem

Currently, the comparison wheel positions Kin nodes around the circle based on the order they were added. This means:
- Two people with deep connections might end up on opposite sides of the wheel
- Closely related people are scattered randomly
- Connection lines cross unnecessarily, creating visual clutter
- The layout tells you NOTHING about the group's relational structure

## Required: Intelligent Node Placement Based on Compatibility

Nodes should be automatically positioned around the circle so that the MOST compatible/connected people sit NEXT to each other, and the LEAST connected sit furthest apart. This turns the wheel from a random arrangement into a meaningful relationship map — you can see clusters at a glance.

---

### Step 1: Build a Compatibility Score Matrix

For each pair of profiles, calculate a **connection weight score**. Different connection types have different weights because some relationships are deeper than others:

| Connection Type | Weight | Reasoning |
|---|---|---|
| Analog (best friend) | 5 | Strongest supportive bond |
| Guide (higher-self teacher) | 4 | Deep wisdom connection |
| Hidden power (secret gift) | 4 | Deep hidden connection |
| Antipode (growth partner) | 3 | Strong but challenging |
| Colour family (shared purpose) | 2 | Meaningful shared direction |
| Earth family (same tribe) | 2 | Tribal bond |
| Wavespell (shared 13-day cycle) | 1 | Lighter shared timing |
| Castle (shared 52-day court) | 1 | Broadest, weakest link |

For mutual connections (both directions), double the weight.

**Score formula for a pair:**
```typescript
score(A, B) = sum of all connection weights between A and B
// Mutual Analog = 5 × 2 = 10
// One-way Guide = 4
// Shared Colour family = 2 (always mutual, so 2 × 2 = 4)
// etc.
```

Build a full N×N score matrix for all profiles.

### Step 2: Optimal Circular Arrangement Algorithm

Using the score matrix, arrange nodes around the circle so that highly connected pairs are adjacent and weakly connected pairs are distant.

**Algorithm — greedy nearest-neighbour with optimisation:**

1. Start with the profile that has the highest TOTAL connection score (the "hub" of the group) — place it at position 0 (top of circle).
2. From the placed nodes, find the unplaced profile with the highest connection score to the most recently placed node. Place it in the next position.
3. Repeat until all nodes are placed.
4. **Optimisation pass**: After initial placement, do 2-3 rounds of pairwise swaps — for each pair of nodes, check if swapping their positions reduces the total "wasted distance" (highly connected pairs that are far apart). If a swap improves the layout, keep it.

**Alternative (simpler but effective):**

If the greedy approach is complex, use this simpler method:
1. Build an adjacency list sorted by weight
2. Start with the pair that has the highest combined score — place them adjacent at top
3. For each remaining profile, find which already-placed profile it's most connected to, and place it adjacent to that one (on whichever side has space or has the weaker existing neighbour)

The goal is NOT a perfect mathematical optimisation — it's a visually meaningful layout where clusters are obvious.

### Step 3: Visual Clustering Cues

After arrangement, add subtle visual cues to reinforce the clusters:

**A) Proximity arcs:**
Draw subtle background arcs behind groups of 2-3 highly connected adjacent nodes:
```css
/* Semi-transparent background arc behind a cluster */
fill: rgba(200, 169, 110, 0.08);  /* very subtle warm tan */
```
These arcs help the eye group related people without adding visual noise.

**B) Gap spacing:**
Instead of perfectly even spacing around the circle, introduce slight gaps between clusters:
- Nodes within a cluster: slightly closer together (e.g. 30° apart)
- Gap between clusters: slightly wider (e.g. 40° apart)
- Keep total = 360° — just redistribute the spacing

This creates a natural visual rhythm: cluster-gap-cluster-gap.

**C) Cluster label (optional, only if 3+ nodes in a cluster):**
If 3+ adjacent nodes all share a connection type (e.g. all in the same Earth family), show a tiny curved label along the arc:
```
"Polar family" (curved text along the arc behind the 3 nodes)
```
Only show this for the strongest shared trait. Keep it very subtle — `text-[9px] opacity-40`.

### Step 4: Maintain Manual Override

Some users might prefer a specific arrangement. Add a toggle:

```
[Auto-arrange: ON ○ | ● OFF]
```

- **ON** (default): Nodes arranged by compatibility
- **OFF**: Nodes arranged by entry order (current behaviour)

Place the toggle near the legend, small and unobtrusive.

### Step 5: Re-arrange When Profiles Change

Every time a profile is added or removed from the comparison:
- Recalculate the score matrix
- Re-run the arrangement algorithm
- Animate nodes smoothly to their new positions (300ms ease-out transition on SVG transform/position)

The animation is important — nodes should glide to new positions, not jump. This makes the rearrangement feel alive and intentional.

---

## Implementation Notes

### Score calculation

Reuse the existing oracle calculation functions to determine connection types between pairs. The comparison view already does this for rendering lines — extract the pair-connection data and feed it into the scoring function.

```typescript
interface PairScore {
  profileA: string;
  profileB: string;
  totalScore: number;
  connections: { type: string; direction: 'one-way' | 'mutual'; weight: number }[];
}

function calculateScoreMatrix(profiles: Profile[]): PairScore[] {
  const scores: PairScore[] = [];
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const connections = getConnectionsBetween(profiles[i], profiles[j]);
      const totalScore = connections.reduce((sum, c) => {
        const baseWeight = CONNECTION_WEIGHTS[c.type];
        return sum + (c.direction === 'mutual' ? baseWeight * 2 : baseWeight);
      }, 0);
      scores.push({ profileA: profiles[i].name, profileB: profiles[j].name, totalScore, connections });
    }
  }
  return scores;
}
```

### Circular position calculation

```typescript
function arrangeNodes(orderedProfiles: Profile[], clusterGaps: number[]): Position[] {
  // Calculate angle for each node, with variable spacing
  // clusterGaps[i] = extra gap before node i (0 for within-cluster, e.g. 8° for between-cluster)
  const baseAngle = 360 / orderedProfiles.length;
  const totalExtra = clusterGaps.reduce((a, b) => a + b, 0);
  const adjustedBase = (360 - totalExtra) / orderedProfiles.length;
  
  let currentAngle = -90; // start from top
  return orderedProfiles.map((p, i) => {
    const angle = currentAngle;
    currentAngle += adjustedBase + (clusterGaps[i] || 0);
    return {
      x: centerX + radius * Math.cos(angle * Math.PI / 180),
      y: centerY + radius * Math.sin(angle * Math.PI / 180),
    };
  });
}
```

---

## What NOT to change

- Connection line rendering logic — do not touch
- Node visual design (circles, colours, text) — do not touch
- Legend — do not touch
- Synastry panel — do not touch
- Fullscreen mode — do not touch
- Wavespell Journey — do not touch

## Checklist

- [ ] Score matrix correctly computed for all pairs using weighted connection types
- [ ] Nodes auto-arrange with most compatible profiles adjacent
- [ ] Visual clusters are obvious at a glance
- [ ] Subtle background arcs behind clusters of 3+
- [ ] Slight gap spacing between clusters
- [ ] Smooth 300ms animation when nodes rearrange
- [ ] Toggle to switch between auto-arrange and entry-order
- [ ] Re-arrangement triggers on profile add/remove
- [ ] Works correctly with 3 profiles (minimal case)
- [ ] Works correctly with 10+ profiles
- [ ] Connection lines still render correctly after rearrangement
- [ ] Fullscreen mode respects the new arrangement
- [ ] `npm run build` — zero errors
