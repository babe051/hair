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
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const windowRefs = useRef<(HTMLDivElement | null)[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  const isOverviewRef = useRef(isOverview)
  const filteredTopicsRef = useRef<Topic[]>([])

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
  
  // Keep refs in sync
  useEffect(() => {
    isOverviewRef.current = isOverview
    filteredTopicsRef.current = filteredTopics
  }, [isOverview, filteredTopics])

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
      // Use refs to get latest values
      const currentIsOverview = isOverviewRef.current
      const currentFilteredTopics = filteredTopicsRef.current
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
              // Find current topic index in filtered topics
              const currentTopicId = topics[currentIndex].id
              const filteredIndex = currentFilteredTopics.findIndex((t) => t.id === currentTopicId)
              setOverviewFocusedIndex(filteredIndex >= 0 ? filteredIndex : 0)
            }
            return !prev
          })
        }
      }

      // Arrow keys in overview mode - must be checked early
      if (currentIsOverview && !showHelpModal) {
        // Don't handle arrow keys if user is typing in search input
        const target = event.target as HTMLElement
        const isSearchInput = target instanceof HTMLInputElement && 
                              target.classList.contains('qogir-search-input')
        
        if (isSearchInput) {
          return // Let the input handle its own arrow keys
        }
        
        // Check if it's an arrow key
        const isArrowKey = event.key === 'ArrowRight' || 
                          event.key === 'ArrowDown' || 
                          event.key === 'ArrowLeft' || 
                          event.key === 'ArrowUp'
        
        if (isArrowKey) {
          const topicsCount = currentFilteredTopics.length
          if (topicsCount === 0) {
            return
          }
          
          event.preventDefault()
          event.stopPropagation()
          
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            setOverviewFocusedIndex((prev) => {
              return (prev + 1) % topicsCount
            })
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            setOverviewFocusedIndex((prev) => {
              return (prev - 1 + topicsCount) % topicsCount
            })
          }
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showHelpModal, currentIndex, goToNext, goToPrevious, jumpToTopic])

  // Focus management in overview mode
  useEffect(() => {
    if (isOverview && filteredTopics.length > 0) {
      // Ensure focused index is valid
      const validIndex = Math.max(0, Math.min(overviewFocusedIndex, filteredTopics.length - 1))
      if (validIndex !== overviewFocusedIndex && overviewFocusedIndex >= 0) {
        setOverviewFocusedIndex(validIndex)
        return
      }
      // Focus and scroll the window after DOM is ready
      // Use double requestAnimationFrame to ensure React has rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = windowRefs.current[validIndex]
          if (element) {
            element.focus()
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        })
      })
    }
  }, [isOverview, overviewFocusedIndex, filteredTopics])

  // Reset focused index when search query changes
  useEffect(() => {
    if (isOverview) {
      if (searchQuery) {
        // When search changes, reset to first result
        setOverviewFocusedIndex(0)
      } else {
        // When search is cleared, find current topic in all topics
        const currentTopicId = topics[currentIndex].id
        const filteredIndex = filteredTopics.findIndex((t) => t.id === currentTopicId)
        if (filteredIndex >= 0) {
          setOverviewFocusedIndex(filteredIndex)
        } else {
          setOverviewFocusedIndex(0)
        }
      }
    }
  }, [searchQuery, isOverview, currentIndex, filteredTopics])

  // Mouse tracking for 3D parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (desktopRef.current) {
        const rect = desktopRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2 // -1 to 1
        setMousePosition({ x, y })
      }
    }

    if (!isOverview) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [isOverview])

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

  // 3D tilt effect on mouse move for overview cards
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!isOverview) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -10 // Max 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10 // Max 10 degrees
    
    card.style.transform = `scale(1.05) translateZ(100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [isOverview])

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOverview) return
    e.currentTarget.style.transform = ''
  }, [isOverview])

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

  // Calculate the position to display in footer
  // In overview mode, show the position of the currently focused card
  // In focused mode, show the current topic position
  const displayPosition = isOverview && filteredTopics.length > 0
    ? (() => {
        const focusedTopic = filteredTopics[overviewFocusedIndex]
        const topicIndex = topics.findIndex((t) => t.id === focusedTopic?.id)
        return topicIndex >= 0 ? topicIndex + 1 : currentIndex + 1
      })()
    : currentIndex + 1

  // Calculate 3D transform based on mouse position
  const activeWindowTransform = !isOverview
    ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 3}deg) translateZ(${Math.abs(mousePosition.x) * 20 + Math.abs(mousePosition.y) * 20}px)`
    : ''

  return (
    <div
      ref={desktopRef}
      className={`qogir-desktop ${isOverview ? 'overview' : ''} ${slideDirection ? `slide-${slideDirection}` : ''}`}
      style={
        !isOverview
          ? {
              '--mouse-x': `${mousePosition.x}`,
              '--mouse-y': `${mousePosition.y}`,
            } as React.CSSProperties
          : undefined
      }
    >
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
              const isFocused = index === overviewFocusedIndex
              return (
                <div
                  key={`${topic.id}-${index}`}
                  ref={(el) => {
                    if (el) {
                      windowRefs.current[index] = el
                    } else {
                      // Clean up ref when element is removed
                      windowRefs.current[index] = null
                    }
                  }}
                  className={`qogir-window ${topicIndex === currentIndex ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
                  onClick={() => handleWindowClick(index)}
                  onMouseMove={(e) => handleCardMouseMove(e, index)}
                  onMouseLeave={handleCardMouseLeave}
                  role="article"
                  aria-label={`Topic: ${topic.title}`}
                  tabIndex={isFocused ? 0 : -1}
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
                style={
                  index === currentIndex && !isOverview
                    ? {
                        transform: activeWindowTransform,
                      }
                    : undefined
                }
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
                {displayPosition}/{topics.length}
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
