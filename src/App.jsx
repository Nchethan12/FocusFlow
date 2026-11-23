import React, { useState, useEffect } from 'react'

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Explore React 19 and Vite setup',
    category: 'Work',
    priority: 'High',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Customize app components and styles',
    category: 'Study',
    priority: 'Medium',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Take a break and drink some water',
    category: 'Personal',
    priority: 'Low',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('focusflow_tasks')
      return saved ? JSON.parse(saved) : INITIAL_TASKS
    } catch {
      return INITIAL_TASKS
    }
  })

  const [titleInput, setTitleInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('Work')
  const [priorityInput, setPriorityInput] = useState('Medium')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('focusflow_tasks', JSON.stringify(tasks))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  }, [tasks])

  const handleAddTask = (e) => {
    e.preventDefault()
    const trimmed = titleInput.trim()
    if (!trimmed) return

    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: trimmed,
      category: categoryInput,
      priority: priorityInput,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])
    setTitleInput('')
  }

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      activeTab === 'all'
        ? true
        : activeTab === 'active'
        ? !task.completed
        : task.completed

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Stats calculation
  const totalCount = tasks.length
  const completedCount = tasks.filter((t) => t.completed).length
  const activeCount = totalCount - completedCount
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <div className="app-container">
      {/* Header section */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h1 className="title">FocusFlow</h1>
            <p className="subtitle">Streamlined React Task Planner</p>
          </div>
        </div>
        <div className="badge-chip">React + Vite</div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In Progress</span>
          <span className="stat-value text-amber">{activeCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value text-emerald">{completedCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Progress Rate</span>
          <div className="progress-container">
            <span className="stat-value text-indigo">{completionRate}%</span>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <main className="main-card">
        {/* Input form */}
        <form onSubmit={handleAddTask} className="task-form">
          <div className="input-row">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="task-input"
            />
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="select-input"
            >
              <option value="Work">💼 Work</option>
              <option value="Personal">🏠 Personal</option>
              <option value="Study">📚 Study</option>
            </select>
            <select
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value)}
              className="select-input"
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
            <button type="submit" className="add-button" disabled={!titleInput.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Task
            </button>
          </div>
        </form>

        {/* Toolbar: Search & Filter Tabs */}
        <div className="toolbar">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              className={`filter-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              className={`filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No tasks found</p>
              <p className="empty-desc">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Add a new task above to get started!'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <button
                  type="button"
                  className="checkbox-btn"
                  onClick={() => toggleComplete(task.id)}
                  aria-label="Toggle task completion"
                >
                  {task.completed && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>

                <div className="task-content">
                  <span className="task-title">{task.title}</span>
                  <div className="task-meta">
                    <span className={`tag tag-cat-${task.category.toLowerCase()}`}>
                      {task.category}
                    </span>
                    <span className={`tag tag-priority-${task.priority.toLowerCase()}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer controls */}
        {completedCount > 0 && (
          <div className="list-footer">
            <span className="footer-summary">
              {completedCount} of {totalCount} task{totalCount === 1 ? '' : 's'} completed
            </span>
            <button type="button" onClick={clearCompleted} className="clear-btn">
              Clear completed
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
