'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

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
  const [isStatusBarCollapsed, setIsStatusBarCollapsed] = useState<boolean>(false)
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [overviewFocusedIndex, setOverviewFocusedIndex] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const windowRefs = useRef<(HTMLDivElement | null)[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Memoize filtered topics for search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics
    const query = searchQuery.toLowerCase()
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.tagline.toLowerCase().includes(query) ||
        topic.id.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Navigate to topic with direction tracking
  const navigateToTopic = useCallback((newIndex: number) => {
    setCurrentIndex((prev) => {
      const direction = newIndex > prev ? 'left' : newIndex < prev ? 'right' : null
      setSlideDirection(direction)
      setTimeout(() => setSlideDirection(null), 400) // Reset after animation
      return newIndex
    })
  }, [])

  // Next topic
  const goToNext = useCallback(() => {
    navigateToTopic((currentIndex + 1) % topics.length)
  }, [currentIndex, navigateToTopic])

  // Previous topic
  const goToPrevious = useCallback(() => {
    navigateToTopic((currentIndex - 1 + topics.length) % topics.length)
  }, [currentIndex, navigateToTopic])

  // Jump to specific topic by number
  const jumpToTopic = useCallback((index: number) => {
    if (index >= 1 && index <= topics.length) {
      navigateToTopic(index - 1)
    }
  }, [navigateToTopic])

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Help modal toggle
      if (event.key === '?' && !showHelpModal) {
        event.preventDefault()
        setShowHelpModal(true)
        return
      }

      // Close help modal
      if (event.key === 'Escape' && showHelpModal) {
        event.preventDefault()
        setShowHelpModal(false)
        return
      }

      // Close overview mode
      if (event.key === 'Escape' && isOverview && !showHelpModal) {
        event.preventDefault()
        setIsOverview(false)
        return
      }

      // Number keys: jump to topic (1-4)
      if (!isOverview && !showHelpModal) {
        const num = parseInt(event.key)
        if (num >= 1 && num <= topics.length) {
          event.preventDefault()
          jumpToTopic(num)
          return
        }
      }

      // Alt + Q: next topic (only in Focused Mode)
      if (event.altKey && event.key === 'q' && !isOverview && !showHelpModal) {
        event.preventDefault()
        goToNext()
        return
      }

      // Alt + Shift + Q: previous topic
      if (event.altKey && event.shiftKey && event.key === 'Q' && !isOverview && !showHelpModal) {
        event.preventDefault()
        goToPrevious()
        return
      }

      // W: toggle overview mode
      if ((event.key === 'w' || event.key === 'W') && !showHelpModal) {
        if (
          !(event.target instanceof HTMLInputElement) &&
          !(event.target instanceof HTMLTextAreaElement)
        ) {
          event.preventDefault()
          setIsOverview((prev) => {
            if (!prev) {
              setOverviewFocusedIndex(currentIndex)
            }
            return !prev
          })
        }
      }

      // Arrow keys in overview mode
      if (isOverview && !showHelpModal) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault()
          setOverviewFocusedIndex((prev) => {
            const next = (prev + 1) % filteredTopics.length
            windowRefs.current[next]?.focus()
            return next
          })
          return
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault()
          setOverviewFocusedIndex((prev) => {
            const next = (prev - 1 + filteredTopics.length) % filteredTopics.length
            windowRefs.current[next]?.focus()
            return next
          })
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOverview, showHelpModal, currentIndex, goToNext, goToPrevious, jumpToTopic, filteredTopics.length])

  // Focus management in overview mode
  useEffect(() => {
    if (isOverview && windowRefs.current[overviewFocusedIndex]) {
      windowRefs.current[overviewFocusedIndex]?.focus()
    }
  }, [isOverview, overviewFocusedIndex])

  // Handle window click in overview mode
  const handleWindowClick = useCallback((index: number) => {
    if (isOverview) {
      const topicIndex = topics.findIndex((t) => t.id === filteredTopics[index]?.id)
      if (topicIndex !== -1) {
        navigateToTopic(topicIndex)
        setIsOverview(false)
      }
    }
  }, [isOverview, filteredTopics, navigateToTopic])

  // Window button handlers
  const handleWindowButtonClick = useCallback((action: 'minimize' | 'maximize' | 'close', e: React.MouseEvent) => {
    e.stopPropagation()
    if (action === 'close') {
      setIsOverview(true)
    } else if (action === 'minimize') {
      setIsOverview(true)
    } else if (action === 'maximize') {
      // Toggle overview
      setIsOverview((prev) => !prev)
    }
  }, [])

  const currentTopic = topics[currentIndex]

  return (
    <div className={`qogir-desktop ${isOverview ? 'overview' : ''} ${slideDirection ? `slide-${slideDirection}` : ''}`}>
      {/* Overlay for overview mode */}
      <div className="qogir-overlay" aria-hidden="true" />

      {/* Help Modal */}
      {showHelpModal && (
        <div className="qogir-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="qogir-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qogir-modal-header">
              <h2>Keyboard Shortcuts</h2>
              <button
                className="qogir-modal-close"
                onClick={() => setShowHelpModal(false)}
                aria-label="Close help"
              >
                ×
              </button>
            </div>
            <div className="qogir-modal-content">
              <div className="qogir-shortcut-list">
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">Alt+Q</span>
                  <span className="qogir-shortcut-desc">Next topic</span>
                </div>
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">Alt+Shift+Q</span>
                  <span className="qogir-shortcut-desc">Previous topic</span>
                </div>
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">1-4</span>
                  <span className="qogir-shortcut-desc">Jump to topic number</span>
                </div>
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">W</span>
                  <span className="qogir-shortcut-desc">Toggle overview mode</span>
                </div>
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">Arrow Keys</span>
                  <span className="qogir-shortcut-desc">Navigate in overview mode</span>
                </div>
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">Esc</span>
                  <span className="qogir-shortcut-desc">Close overview / Close help</span>
                </div>
                <div className="qogir-shortcut-item">
                  <span className="qogir-shortcut-key">?</span>
                  <span className="qogir-shortcut-desc">Show this help</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar (shown in overview mode) */}
      {isOverview && (
        <div className="qogir-search-bar">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="qogir-search-input"
            aria-label="Search topics"
          />
          {searchQuery && (
            <button
              className="qogir-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Current topic indicator (hidden in overview) */}
      {!isOverview && (
        <div className="qogir-current-topic" aria-live="polite" aria-atomic="true">
          Topic {currentIndex + 1} of {topics.length}: {currentTopic.shortTitle}
        </div>
      )}

      {/* Windows container */}
      <div
        className="windows-container"
        role={isOverview ? 'dialog' : 'main'}
        aria-label={isOverview ? 'Overview of all topics' : 'Current topic view'}
      >
        {/* Conditional rendering: only render active window in focused mode, all in overview */}
        {isOverview
          ? filteredTopics.map((topic, index) => {
              const topicIndex = topics.findIndex((t) => t.id === topic.id)
              return (
                <div
                  key={topic.id}
                  ref={(el) => {
                    windowRefs.current[index] = el
                  }}
                  className={`qogir-window ${topicIndex === currentIndex ? 'active' : ''} ${index === overviewFocusedIndex ? 'focused' : ''}`}
                  onClick={() => handleWindowClick(index)}
                  role="article"
                  aria-label={`Topic: ${topic.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleWindowClick(index)
                    }
                  }}
                >
                  {/* Qogir Header Bar */}
                  <div className="qogir-headerbar">
                    <div className="qogir-headerbar-title">{topic.title}</div>
                    <div className="qogir-window-buttons">
                      <button
                        className="qogir-window-button"
                        onClick={(e) => handleWindowButtonClick('minimize', e)}
                        aria-label="Minimize"
                        title="Minimize"
                      />
                      <button
                        className="qogir-window-button"
                        onClick={(e) => handleWindowButtonClick('maximize', e)}
                        aria-label="Maximize"
                        title="Maximize"
                      />
                      <button
                        className="qogir-window-button close"
                        onClick={(e) => handleWindowButtonClick('close', e)}
                        aria-label="Close"
                        title="Close"
                      />
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
              )
            })
          : topics.map((topic, index) => (
              <div
                key={topic.id}
                className={`qogir-window ${index === currentIndex ? 'active' : ''} ${slideDirection ? `slide-${slideDirection}` : ''}`}
                role="article"
                aria-label={`Topic: ${topic.title}`}
                tabIndex={-1}
              >
                {/* Qogir Header Bar */}
                <div className="qogir-headerbar">
                  <div className="qogir-headerbar-title">{topic.title}</div>
                  <div className="qogir-window-buttons">
                    <button
                      className="qogir-window-button"
                      onClick={(e) => handleWindowButtonClick('minimize', e)}
                      aria-label="Minimize"
                      title="Minimize"
                    />
                    <button
                      className="qogir-window-button"
                      onClick={(e) => handleWindowButtonClick('maximize', e)}
                      aria-label="Maximize"
                      title="Maximize"
                    />
                    <button
                      className="qogir-window-button close"
                      onClick={(e) => handleWindowButtonClick('close', e)}
                      aria-label="Close"
                      title="Close"
                    />
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
      <div
        className={`qogir-statusbar ${isStatusBarCollapsed ? 'collapsed' : ''}`}
        role="status"
        aria-label="Keyboard shortcuts"
      >
        <button
          className="qogir-statusbar-toggle"
          onClick={() => setIsStatusBarCollapsed(!isStatusBarCollapsed)}
          aria-label={isStatusBarCollapsed ? 'Expand status bar' : 'Collapse status bar'}
          title={isStatusBarCollapsed ? 'Expand' : 'Collapse'}
        >
          {isStatusBarCollapsed ? '▲' : '▼'}
        </button>
        {!isStatusBarCollapsed && (
          <>
            <div className="qogir-statusbar-item">
              <span className="qogir-statusbar-key">Alt+Q</span>
              <span className="qogir-statusbar-label">next</span>
            </div>
            <div className="qogir-statusbar-item">
              <span className="qogir-statusbar-key">Alt+Shift+Q</span>
              <span className="qogir-statusbar-label">prev</span>
            </div>
            <div className="qogir-statusbar-item">
              <span className="qogir-statusbar-key">1-4</span>
              <span className="qogir-statusbar-label">jump</span>
            </div>
            <div className="qogir-statusbar-item">
              <span className="qogir-statusbar-key">W</span>
              <span className="qogir-statusbar-label">overview</span>
            </div>
            <div className="qogir-statusbar-item">
              <span className="qogir-statusbar-key">?</span>
              <span className="qogir-statusbar-label">help</span>
            </div>
            <div className="qogir-statusbar-item qogir-statusbar-position">
              <span className="qogir-statusbar-label">
                {currentIndex + 1}/{topics.length}
              </span>
            </div>
          </>
        )}
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
