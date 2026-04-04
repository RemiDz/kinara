# Fix: Calendar Datepicker Hidden Behind Container Below

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

## Thinking Level: megathink

---

## Problem

In the Comparison view, when adding a new profile and clicking the date input, the calendar dropdown/popover opens but is **clipped and hidden behind the Tzolkin matrix container below it**. The user cannot see or interact with the full calendar to select a date.

This is a z-index / overflow issue.

## Required Fix

### 1. The calendar popover needs a high z-index

Find the calendar/datepicker component. Ensure the dropdown popover has:

```css
z-index: 50;  /* or higher — must be above everything else on the page */
position: absolute;  /* or fixed */
```

### 2. The parent containers must NOT clip the popover

The calendar popover is being clipped because a parent container has `overflow: hidden` or `overflow: auto` or `overflow: scroll`. This traps the absolutely-positioned popover inside the container's bounds.

**Search up the DOM tree** from the calendar input to find which ancestor has `overflow: hidden` (or `auto`/`scroll`). Common culprits:

- The profile list/input area wrapper
- A card or section container
- A scrollable area wrapping the comparison inputs

**Fix options (in order of preference):**

**Option A — Change overflow on the clipping ancestor:**
```css
overflow: visible;  /* instead of hidden/auto */
```
Only do this if it doesn't break the layout elsewhere.

**Option B — Use a portal for the calendar popover:**

If using a library like `react-datepicker`, `@radix-ui`, or `shadcn/ui`, most support a `portal` or `portalContainer` prop that renders the popover at the document body level, escaping all overflow containers:

```tsx
// react-datepicker
<DatePicker portalId="root" ... />

// radix/shadcn Popover
<PopoverContent side="bottom" align="start" sideOffset={4}
  // Force portal rendering
  forceMount
  style={{ zIndex: 50 }}
/>

// Or wrap in a Portal
import { Portal } from '@radix-ui/react-portal';
```

**Option C — If it's a custom calendar component:**

Wrap the calendar dropdown in a React portal:

```tsx
import { createPortal } from 'react-dom';

{isCalendarOpen && createPortal(
  <div
    className="absolute bg-white rounded-lg shadow-lg border"
    style={{
      zIndex: 50,
      top: calendarPosition.top,
      left: calendarPosition.left,
    }}
  >
    <CalendarContent ... />
  </div>,
  document.body
)}
```

### 3. Ensure the calendar is positioned correctly when portalled

If using a portal, the calendar loses its relative positioning to the input. Calculate the input's bounding rect and position the calendar dropdown below it:

```tsx
const inputRef = useRef<HTMLDivElement>(null);
const [pos, setPos] = useState({ top: 0, left: 0 });

const openCalendar = () => {
  if (inputRef.current) {
    const rect = inputRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
  }
  setIsOpen(true);
};
```

### 4. Click-outside-to-close must still work

If portalling, ensure the click-outside handler still closes the calendar when clicking anywhere else on the page.

## What NOT to change

- Calendar functionality (date selection, month navigation) — do not touch
- Profile input fields — do not touch
- Tzolkin matrix below — do not touch
- Other views — do not touch

## Checklist

- [ ] Calendar datepicker fully visible when opened — not clipped by any container
- [ ] Calendar renders ON TOP of the Tzolkin matrix and all other content below
- [ ] Calendar is positioned directly below its date input field
- [ ] All calendar days are clickable and selectable
- [ ] Month/year navigation arrows work
- [ ] Clicking outside the calendar closes it
- [ ] Works correctly when adding the first profile AND when adding subsequent profiles
- [ ] Works on mobile (375px) — calendar may need to be full-width but must be fully visible
- [ ] `npm run build` — zero errors
