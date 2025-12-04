# Le Village Numérique Résistant

An educational web application demonstrating a desktop-like navigation system for exploring the four pillars of a resistant digital village in schools.

## Features

- **Desktop-like Navigation**: Each topic behaves like a full-screen app window
- **Focused Mode**: One topic visible at a time with smooth transitions
- **Overview Mode**: See all topics as cards in a grid layout
- **Keyboard Shortcuts**:
  - `Alt + Q`: Navigate to next topic (circular)
  - `W`: Toggle overview mode
  - `Esc`: Close overview mode
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
  layout.tsx    # Root layout with metadata
  page.tsx      # Main component with desktop navigation
  globals.css   # Styling for windows and overview mode
```

## The Four Pillars

1. **Hardware & Sobriety**: Reusing and refurbishing hardware, reducing waste
2. **Free/Open-Source Software**: Independence from Big Tech ecosystems
3. **Digital Education & Awareness**: Understanding data, privacy, and algorithms
4. **Local Community & Shared Resources**: Co-building and sharing resources

## Ergonomics Explanation

See the detailed explanation in the comment at the bottom of `app/page.tsx` for the conceptual design and pedagogical value of this navigation metaphor.

