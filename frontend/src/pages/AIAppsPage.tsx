import { useNavigate } from 'react-router-dom'

const AI_APPS = [
  {
    id: 'remove-bg',
    name: 'Background Remover',
    description: 'Remove backgrounds from images instantly',
    icon: '✂️',
    category: 'Image',
    status: 'available',
    path: '/image',
  },
  {
    id: 'upscale',
    name: 'Image Upscaler',
    description: 'Enhance image resolution up to 4x',
    icon: '🔍',
    category: 'Image',
    status: 'available',
    path: '/image',
  },
  {
    id: 'face-swap',
    name: 'Face Swap',
    description: 'Swap faces in photos and videos',
    icon: '🎭',
    category: 'Image',
    status: 'available',
    path: '/image',
  },
  {
    id: 'colorize',
    name: 'Photo Colorizer',
    description: 'Add color to black and white photos',
    icon: '🎨',
    category: 'Image',
    status: 'available',
    path: '/image',
  },
  {
    id: 'extend',
    name: 'Image Extender',
    description: 'Extend images beyond their borders',
    icon: '↔️',
    category: 'Image',
    status: 'new',
    path: '/image',
  },
  {
    id: 'inpaint',
    name: 'Object Remover',
    description: 'Remove unwanted objects from images',
    icon: '🧹',
    category: 'Image',
    status: 'available',
    path: '/image',
  },
  {
    id: 'vid-upscale',
    name: 'Video Upscaler',
    description: 'Enhance video resolution',
    icon: '📹',
    category: 'Video',
    status: 'coming',
    path: '/video',
  },
  {
    id: 'slow-mo',
    name: 'Slow Motion',
    description: 'Create smooth slow motion videos',
    icon: '🐢',
    category: 'Video',
    status: 'coming',
    path: '/video',
  },
]

export default function AIAppsPage() {
  const navigate = useNavigate()

  const handleOpenClick = (app: typeof AI_APPS[0]) => {
    if (app.status === 'available' || app.status === 'new') {
      navigate(app.path)
    }
  }

  return (
    <div className="ai-apps-page">
      <div className="page-header">
        <h1 className="section-title">AI Apps</h1>
        <p className="page-subtitle">
          Ready-to-use AI tools for common creative tasks
        </p>
      </div>

      <div className="apps-categories">
        <h2 className="category-title">Image Tools</h2>
        <div className="apps-grid">
          {AI_APPS.filter((app) => app.category === 'Image').map((app) => (
            <div key={app.id} className={`app-card ${app.status}`}>
              {app.status === 'new' && <span className="app-badge new">NEW</span>}
              <div className="app-icon">{app.icon}</div>
              <h3 className="app-name">{app.name}</h3>
              <p className="app-desc">{app.description}</p>
              <button className="app-btn" onClick={() => handleOpenClick(app)}>
                {app.status === 'available' || app.status === 'new' ? 'Open' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>

        <h2 className="category-title">Video Tools</h2>
        <div className="apps-grid">
          {AI_APPS.filter((app) => app.category === 'Video').map((app) => (
            <div key={app.id} className={`app-card ${app.status}`}>
              {app.status === 'coming' && <span className="app-badge coming">Coming Soon</span>}
              <div className="app-icon">{app.icon}</div>
              <h3 className="app-name">{app.name}</h3>
              <p className="app-desc">{app.description}</p>
              <button
                className="app-btn"
                disabled={app.status === 'coming'}
                onClick={() => handleOpenClick(app)}
              >
                {app.status === 'coming' ? 'Coming Soon' : 'Open'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
