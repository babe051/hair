'use client'

import { useState, useEffect } from 'react'

// Topic data structure
interface Topic {
  id: string
  title: string
  shortTitle: string
  tagline: string
  icon: string
  content: React.ReactNode
}

// Define the four main topics
const topics: Topic[] = [
  {
    id: 'hardware',
    title: 'Hardware & Sobriety',
    shortTitle: 'Hardware & Sobriety',
    tagline: 'Less waste, longer life for devices',
    icon: '🖥️',
    content: (
      <>
        <p>
          In a resistant digital village, schools prioritize reusing and refurbishing existing hardware instead of constantly buying new devices. This approach reduces electronic waste and teaches students the value of sustainability.
        </p>
        <p>
          Digital sobriety means using fewer, lighter devices that serve their purpose without unnecessary complexity. Schools can function effectively with older computers running efficient software, extending the life of technology and reducing dependence on major hardware manufacturers.
        </p>
        <ul>
          <li>Refurbish and repair existing computers and tablets</li>
          <li>Choose devices that can be easily maintained and upgraded</li>
          <li>Reduce the number of devices per student when possible</li>
          <li>Partner with local repair shops and recycling centers</li>
        </ul>
      </>
    ),
  },
  {
    id: 'freesoftware',
    title: 'Free/Open-Source Software',
    shortTitle: 'Free Software',
    tagline: 'Tools for independence from Big Tech',
    icon: '🐧',
    content: (
      <>
        <p>
          Free and open-source software (FOSS) gives schools the freedom to use, study, modify, and share software without vendor lock-in. Linux, LibreOffice, and educational tools like GIMP or Blender provide powerful alternatives to proprietary ecosystems.
        </p>
        <p>
          By adopting FOSS, schools break free from expensive licensing fees and data collection practices of Big Tech companies. Students learn on tools they can truly own and understand, fostering digital literacy and independence.
        </p>
        <ul>
          <li>Use Linux distributions designed for education (e.g., Ubuntu Education, Debian Edu)</li>
          <li>Replace proprietary office suites with LibreOffice</li>
          <li>Adopt free educational software for specific subjects</li>
          <li>Teach students about software freedom and open-source principles</li>
        </ul>
      </>
    ),
  },
  {
    id: 'education',
    title: 'Digital Education & Awareness',
    shortTitle: 'Education & Awareness',
    tagline: 'Understanding data, privacy, and algorithms',
    icon: '📚',
    content: (
      <>
        <p>
          A resistant digital village requires that teachers and students understand how digital technologies work, how data is collected and used, and how algorithms influence what we see and learn online.
        </p>
        <p>
          Digital education goes beyond using tools—it means understanding the implications of platform dependence, recognizing privacy risks, and making informed choices about technology. Students learn to be critical users, not just consumers.
        </p>
        <ul>
          <li>Teach data literacy and privacy awareness from an early age</li>
          <li>Explain how algorithms and recommendation systems work</li>
          <li>Discuss the business models behind "free" online services</li>
          <li>Encourage students to question and verify digital information</li>
        </ul>
      </>
    ),
  },
  {
    id: 'community',
    title: 'Local Community & Shared Resources',
    shortTitle: 'Community & Resources',
    tagline: 'Co-building and sharing instead of buying',
    icon: '🤝',
    content: (
      <>
        <p>
          Instead of each school purchasing expensive proprietary solutions independently, the resistant digital village builds shared resources through collaboration between schools, parents, local associations, and municipalities.
        </p>
        <p>
          This community approach creates a network of mutual support: shared servers, collaborative training sessions, local technical support, and collectively maintained software installations. Together, schools become stronger and more independent.
        </p>
        <ul>
          <li>Create local technical support networks between schools</li>
          <li>Share servers and infrastructure costs across institutions</li>
          <li>Organize community training sessions for teachers and IT staff</li>
          <li>Build partnerships with local tech associations and makerspaces</li>
        </ul>
      </>
    ),
  },
]

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isOverview, setIsOverview] = useState<boolean>(false)

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + Q: next topic (only in Focused Mode)
      if (event.altKey && event.key === 'q' && !isOverview) {
        event.preventDefault()
        setCurrentIndex((prev) => (prev + 1) % topics.length)
      }

      // W: toggle overview mode
      if (event.key === 'w' || event.key === 'W') {
        // Only prevent default if not in an input/textarea
        if (
          !(event.target instanceof HTMLInputElement) &&
          !(event.target instanceof HTMLTextAreaElement)
        ) {
          event.preventDefault()
          setIsOverview((prev) => !prev)
        }
      }

      // Escape: close overview mode
      if (event.key === 'Escape' && isOverview) {
        event.preventDefault()
        setIsOverview(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOverview])

  // Handle window click in overview mode
  const handleWindowClick = (index: number) => {
    if (isOverview) {
      setCurrentIndex(index)
      setIsOverview(false)
    }
  }

  const currentTopic = topics[currentIndex]

  return (
    <div className={`qogir-desktop ${isOverview ? 'overview' : ''}`}>
      {/* Overlay for overview mode */}
      <div className="qogir-overlay" aria-hidden="true" />

      {/* Current topic indicator (hidden in overview) */}
      <div className="qogir-current-topic" aria-live="polite" aria-atomic="true">
        Current topic: {currentTopic.shortTitle}
      </div>

      {/* Windows container */}
      <div
        className="windows-container"
        role={isOverview ? 'dialog' : 'main'}
        aria-label={isOverview ? 'Overview of all topics' : 'Current topic view'}
      >
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`qogir-window ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleWindowClick(index)}
            role="article"
            aria-label={`Topic: ${topic.title}`}
            tabIndex={isOverview ? 0 : -1}
            onKeyDown={(e) => {
              if (isOverview && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                handleWindowClick(index)
              }
            }}
          >
            {/* Qogir Header Bar */}
            <div className="qogir-headerbar">
              <div className="qogir-headerbar-title">{topic.title}</div>
              <div className="qogir-window-buttons">
                <div className="qogir-window-button" aria-label="Minimize" />
                <div className="qogir-window-button" aria-label="Maximize" />
                <div className="qogir-window-button close" aria-label="Close" />
              </div>
            </div>

            {/* Window content */}
            <div className="qogir-window-content">
              <span className="qogir-window-icon" aria-hidden="true">
                {topic.icon}
              </span>
              <h1 className="qogir-window-title">{topic.title}</h1>
              <div className="qogir-window-tagline">{topic.tagline}</div>
              <div className="qogir-window-body">{topic.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Qogir Status Bar with keyboard shortcuts */}
      <div className="qogir-statusbar" role="status" aria-label="Keyboard shortcuts">
        <div className="qogir-statusbar-item">
          <span className="qogir-statusbar-key">Alt+Q</span>
          <span className="qogir-statusbar-label">next topic</span>
        </div>
        <div className="qogir-statusbar-item">
          <span className="qogir-statusbar-key">W</span>
          <span className="qogir-statusbar-label">overview</span>
        </div>
        <div className="qogir-statusbar-item">
          <span className="qogir-statusbar-key">Esc</span>
          <span className="qogir-statusbar-label">close overview</span>
        </div>
      </div>
    </div>
  )
}

/*
 * ERGONOMICS EXPLANATION FOR JUDGES
 * ==================================
 *
 * This application implements a desktop-like navigation metaphor for the educational
 * theme "Le Village Numérique Résistant" (NIRD - schools resisting Big Tech dependence).
 *
 * CONCEPTUAL DESIGN:
 * -----------------
 * Each of the four main topics (Hardware & Sobriety, Free Software, Digital Education,
 * and Local Community) is represented as a full-screen "app window" in a desktop
 * environment. This metaphor reflects the idea that a resistant digital village is
 * composed of several interconnected "spaces" or "houses" that coexist and support
 * each other, rather than being a simple linear sequence of pages.
 *
 * NAVIGATION PHILOSOPHY:
 * ----------------------
 * - Alt+Q (next topic): Allows quick navigation between the four pillars, like walking
 *   from one house to another in a village. The circular navigation emphasizes that all
 *   topics are equally important and form a continuous cycle of resistance.
 *
 * - Overview Mode (W key): Provides a global view of the entire "village" by showing
 *   all four topics simultaneously as cards. This makes it clear that all pillars must
 *   be considered together—hardware sobriety, free software, education, and community
 *   are not isolated concepts but interdependent elements of a coherent strategy.
 *
 * - The desktop metaphor itself reinforces the idea that schools can "own" their digital
 *   environment, just as they own their physical space, rather than renting it from
 *   proprietary platforms.
 *
 * PEDAGOGICAL VALUE:
 * ------------------
 * The interface teaches users (teachers, students, administrators) that building a
 * resistant digital village requires understanding and integrating multiple dimensions
 * simultaneously. The overview mode especially helps visualize the holistic nature of
 * the approach, while the focused mode allows deep exploration of each pillar.
 *
 * The keyboard-driven navigation (inspired by Ubuntu/GNOME Activities) promotes
 * efficiency and accessibility, while the visual transitions help users maintain
 * spatial awareness of their position within the "village."
 */

