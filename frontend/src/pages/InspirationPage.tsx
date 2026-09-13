import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface InspirationItem {
  id: number
  type: 'image' | 'video'
  prompt: string
  model: string
  likes: number
  gradient: string
}

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
]

const PROMPTS = [
  'A majestic dragon flying over ancient ruins at sunset, cinematic lighting, 8k',
  'Portrait of a cyberpunk samurai in neon-lit Tokyo streets, rain reflections',
  'Enchanted forest with glowing mushrooms and fairy lights, mystical atmosphere',
  'Astronaut discovering alien flowers on Mars, sci-fi concept art',
  'Steampunk clockwork city with airships, Victorian architecture',
  'Underwater palace with mermaids and bioluminescent creatures',
  'Time traveler in ancient Egypt meeting pharaohs, golden hour',
  'Cozy coffee shop on a rainy day in Paris, warm lighting',
  'Epic battle between ice and fire wizards, dramatic magic effects',
  'Abandoned space station overgrown with alien plants, atmospheric',
  'Ninja training in misty bamboo forest at dawn',
  'Futuristic racing through neon canyon, motion blur',
]

const MOCK_ITEMS: InspirationItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? 'video' : 'image',
  prompt: PROMPTS[i % PROMPTS.length],
  model: i % 2 === 0 ? 'Seedream 5.0 Pro' : 'Seedance 2.5',
  likes: Math.floor(Math.random() * 500) + 50,
  gradient: GRADIENTS[i % GRADIENTS.length],
}))

export default function InspirationPage() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = item.prompt.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tryPrompt = (item: InspirationItem) => {
    const path = item.type === 'video' ? '/video' : '/image'
    navigate(path, { state: { prompt: item.prompt } })
  }

  return (
    <div className="inspiration-page">
      <div className="inspiration-header">
        <div>
          <h1 className="section-title">Inspiration</h1>
          <p className="inspiration-subtitle">Fresh inspiration tailored for you</p>
        </div>
        <div className="section-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="inspiration-tabs">
        {(['all', 'image', 'video'] as const).map((tab) => (
          <button
            key={tab}
            className={`inspiration-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">
              {tab === 'all'
                ? MOCK_ITEMS.length
                : MOCK_ITEMS.filter((i) => i.type === tab).length}
            </span>
          </button>
        ))}
      </div>

      <div className="inspiration-masonry">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="inspiration-card"
            onClick={() => setSelectedItem(item)}
          >
            <div className="card-media" style={{ background: item.gradient }}>
              {item.type === 'video' && (
                <div className="card-play-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              )}
              <div className="card-badge">{item.type === 'video' ? 'Video' : 'AI'}</div>
            </div>
            <div className="card-overlay">
              <p className="card-prompt">{item.prompt}</p>
              <div className="card-actions">
                <button onClick={(e) => { e.stopPropagation(); copyPrompt(item.prompt) }}>
                  Copy Prompt
                </button>
                <button onClick={(e) => { e.stopPropagation(); tryPrompt(item) }}>
                  Try it
                </button>
              </div>
            </div>
            <div className="card-footer">
              <span className="card-model">{item.model}</span>
              <span className="card-likes">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {item.likes}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="inspiration-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="inspiration-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="modal-media" style={{ background: selectedItem.gradient }}>
              {selectedItem.type === 'video' && (
                <div className="modal-play-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="modal-content">
              <div className="modal-meta">
                <span className={`modal-type ${selectedItem.type}`}>
                  {selectedItem.type === 'video' ? 'Video' : 'Image'}
                </span>
                <span className="modal-model">{selectedItem.model}</span>
                <span className="modal-likes">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {selectedItem.likes}
                </span>
              </div>

              <div className="modal-prompt">
                <label>Prompt</label>
                <p>{selectedItem.prompt}</p>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn secondary"
                  onClick={() => copyPrompt(selectedItem.prompt)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button
                  className="modal-btn primary"
                  onClick={() => tryPrompt(selectedItem)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Try this prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
