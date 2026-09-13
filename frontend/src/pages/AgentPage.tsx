import { useNavigate } from 'react-router-dom'

const AGENTS = [
  {
    id: 'music-video',
    name: 'Music Video Agent',
    description: 'Turn any song into a stunning music video in seconds',
    icon: '🎵',
    status: 'new',
    path: '/agent/music-video',
  },
  {
    id: 'storyboard',
    name: 'Storyboard Agent',
    description: 'Generate complete storyboards from your script',
    icon: '🎬',
    status: 'coming',
    path: '/agent/storyboard',
  },
  {
    id: 'character',
    name: 'Character Agent',
    description: 'Create consistent characters across multiple scenes',
    icon: '👤',
    status: 'coming',
    path: '/agent/character',
  },
  {
    id: 'product',
    name: 'Product Agent',
    description: 'Generate product photos and ads automatically',
    icon: '📦',
    status: 'coming',
    path: '/agent/product',
  },
]

export default function AgentPage() {
  const navigate = useNavigate()

  const handleButtonClick = (agent: typeof AGENTS[0]) => {
    if (agent.status === 'new') {
      navigate(agent.path)
    } else {
      alert("You'll be notified when available!")
    }
  }

  return (
    <div className="agent-page">
      <div className="page-header">
        <h1 className="section-title">AI Agents</h1>
        <p className="page-subtitle">
          Autonomous AI agents that handle complex creative tasks for you
        </p>
      </div>

      <div className="agents-grid">
        {AGENTS.map((agent) => (
          <div key={agent.id} className={`agent-card ${agent.status}`}>
            {agent.status === 'new' && <span className="agent-badge new">NEW</span>}
            {agent.status === 'coming' && <span className="agent-badge coming">Coming Soon</span>}
            <div className="agent-icon">{agent.icon}</div>
            <h3 className="agent-name">{agent.name}</h3>
            <p className="agent-desc">{agent.description}</p>
            <button
              className={`agent-btn ${agent.status === 'new' ? 'active' : 'disabled'}`}
              onClick={() => handleButtonClick(agent)}
            >
              {agent.status === 'new' ? 'Try Now' : 'Notify Me'}
            </button>
          </div>
        ))}
      </div>

      <div className="agent-preview">
        <h2 className="section-title">How Agents Work</h2>
        <div className="preview-steps">
          <div className="preview-step">
            <div className="step-number">1</div>
            <h4>Describe your goal</h4>
            <p>Tell the agent what you want to create</p>
          </div>
          <div className="preview-step">
            <div className="step-number">2</div>
            <h4>Agent plans</h4>
            <p>AI breaks down the task into steps</p>
          </div>
          <div className="preview-step">
            <div className="step-number">3</div>
            <h4>Auto-generates</h4>
            <p>Agent creates all assets autonomously</p>
          </div>
          <div className="preview-step">
            <div className="step-number">4</div>
            <h4>Review & edit</h4>
            <p>Fine-tune the results to your liking</p>
          </div>
        </div>
      </div>
    </div>
  )
}
