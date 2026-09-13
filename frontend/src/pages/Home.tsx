import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'

// Placeholder colors for demo images
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
]

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Seedream 5.0 Pro | Layer Separation',
    subtitle: 'Precise editing, multilingual generation, and high-density visuals, all in one',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 2,
    title: 'Seedance 2.5 Showcase',
    subtitle: '30s videos. Rich references. Cinematic motion.',
    gradient: 'linear-gradient(135deg, #2d1f3d 0%, #1a1a2e 50%, #16213e 100%)',
  },
  {
    id: 3,
    title: 'Music Video Agent',
    subtitle: 'Turn any song into a stunning music video in seconds.',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
]

const FEATURE_MODELS = [
  { id: 'seedance', name: 'Seedance 2.0', desc: 'Cinematic video generation', icon: '📊', badge: 'hot' as const },
  { id: 'gpt-image', name: 'GPT-image-2', desc: 'Sharper image creation', icon: '✨' },
  { id: 'seedream', name: 'Seedream 5.0 Pro', desc: 'Production-ready visual creation', icon: '📊' },
  { id: 'seedance-mini', name: 'Seedance 2.0 Mini', desc: 'Cheaper and Faster', icon: '📊', badge: 'new' as const },
]

const CANVAS_TEMPLATES = [
  { id: 1, name: 'Storyboard Grid', desc: 'Turn ideas into multi-frame scenes' },
  { id: 2, name: 'Shot Designer', desc: 'Create cinematic camera angles' },
  { id: 3, name: 'Cinematic color', desc: 'Add film-style tones' },
  { id: 4, name: 'Keyframe camera', desc: 'Control camera moves with precision' },
  { id: 5, name: 'Character poses', desc: 'Generate dynamic character positions' },
]

const INSPIRATION_ITEMS = [
  { id: 1, type: 'video' as const },
  { id: 2, type: 'video' as const },
  { id: 3, type: 'image' as const },
  { id: 4, type: 'image' as const },
  { id: 5, type: 'image' as const },
  { id: 6, type: 'video' as const },
  { id: 7, type: 'image' as const },
  { id: 8, type: 'image' as const },
  { id: 9, type: 'video' as const },
  { id: 10, type: 'image' as const },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useUser()

  // Referral link
  const referralCode = user ? btoa(user.email).slice(0, 8).toUpperCase() : 'DEMO1234'
  const referralLink = `https://lumiere-ai.com/signup?ref=${referralCode}`

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)

  const filteredInspiration = INSPIRATION_ITEMS.filter(
    (item) => activeTab === 'all' || item.type === activeTab
  )

  return (
    <div className="main-content">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <div className="hero-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="hero-slide">
              <div className="hero-slide-bg" style={{ background: slide.gradient }} />
              <div className="hero-slide-content">
                <h2 className="hero-slide-title">{slide.title}</h2>
                <p className="hero-slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="hero-nav prev" onClick={prevSlide}>‹</button>
        <button className="hero-nav next" onClick={nextSlide}>›</button>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="feature-cards">
        <div className="feature-card promo">
          <div className="feature-card-title" style={{ fontSize: '18px', marginBottom: '8px' }}>
            {t('home.newRelease')}
          </div>
          <button style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {t('home.tryNow')} <span>→</span>
          </button>
        </div>
        {FEATURE_MODELS.map((model) => (
          <div
            key={model.id}
            className="feature-card"
            onClick={() => navigate('/canvas', { state: { model: model.id } })}
          >
            {model.badge && (
              <span className={`feature-card-badge ${model.badge}`}>{model.badge}</span>
            )}
            <div className="feature-card-icon">{model.icon}</div>
            <div className="feature-card-title">{model.name}</div>
            <div className="feature-card-desc">{model.desc}</div>
          </div>
        ))}
      </div>

      {/* Canvas Templates Section */}
      <div className="canvas-section">
        <div className="section-header">
          <h2 className="section-title">{t('home.createWithCanvas')}</h2>
        </div>
        <div className="canvas-grid">
          {CANVAS_TEMPLATES.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="canvas-item"
              onClick={() => navigate('/canvas', { state: { template: tpl.id } })}
            >
              <div
                className="canvas-item-bg"
                style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
              />
              <div className="canvas-item-label">{tpl.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Showcase Section */}
      <div className="showcase-section">
        <div className="section-header">
          <h2 className="section-title">{t('home.showcase')}</h2>
        </div>
        <div className="showcase-video">
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 50%, #16213e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dim)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>▶</div>
              <div>{t('home.videoPlaceholder')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Section */}
      <div className="bonus-section">
        <div className="bonus-info">
          <div className="bonus-label">{t('home.limitedOffer')}</div>
          <h2 className="bonus-title">{t('home.launchBonus')}</h2>
          <p className="bonus-desc">
            {t('home.bonusDesc')}
          </p>
          <div className="bonus-thumbs">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bonus-thumb"
                style={{ background: GRADIENTS[i + 3] }}
              />
            ))}
          </div>
        </div>
        <div className="bonus-gallery">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bonus-gallery-item">
              <div style={{
                width: '100%',
                height: '100%',
                minHeight: '80px',
                background: GRADIENTS[i % GRADIENTS.length]
              }} />
              {i >= 4 && (
                <span className="play-icon">▶</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Referral Section */}
      <div className="home-referral-section">
        <div className="home-referral-header">
          <div className="home-referral-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h2>{t('referral.title')}</h2>
            <p>{t('referral.subtitle')}</p>
          </div>
        </div>

        <div className="home-referral-url-box">
          <span className="home-referral-label">{t('referral.yourLink')}</span>
          <div className="home-referral-url">
            <input type="text" value={referralLink} readOnly />
            <button onClick={handleCopyReferral} className={copied ? 'copied' : ''}>
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t('referral.copied')}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {t('referral.copy')}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="home-referral-tools">
          <h3>{t('referral.earnCreditsTitle')}</h3>
          <p className="home-referral-tools-subtitle">{t('referral.earnCreditsSubtitle')}</p>
          <div className="home-referral-tools-grid">
            <div className="home-referral-tool-card" onClick={() => navigate('/referral')}>
              <div className="tool-preview video">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="tool-info">
                <h4>{t('referral.videoGenerator')}</h4>
                <p>{t('referral.videoGeneratorDesc')}</p>
                <div className="tool-link">
                  <span>lumiere-ai.com/video?ref={referralCode}</span>
                  <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://lumiere-ai.com/video?ref=${referralCode}`); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="home-referral-tool-card" onClick={() => navigate('/referral')}>
              <div className="tool-preview image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="tool-info">
                <h4>{t('referral.imageGenerator')}</h4>
                <p>{t('referral.imageGeneratorDesc')}</p>
                <div className="tool-link">
                  <span>lumiere-ai.com/image?ref={referralCode}</span>
                  <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://lumiere-ai.com/image?ref=${referralCode}`); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-referral-rewards">
          <div className="reward-item">
            <span className="reward-value">+50</span>
            <span className="reward-label">credits per signup</span>
          </div>
          <div className="reward-item">
            <span className="reward-value">+100</span>
            <span className="reward-label">credits per subscription</span>
          </div>
          <div className="reward-item highlight">
            <span className="reward-value">10%</span>
            <span className="reward-label">recurring credits</span>
          </div>
        </div>

        <button className="home-referral-cta" onClick={() => navigate('/referral')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Go to Referral Dashboard
        </button>
      </div>

      {/* Inspiration Section */}
      <div className="inspiration-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">{t('home.inspiration')}</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>
              {t('home.inspirationSubtitle')}
            </p>
          </div>
          <div className="section-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder={t('home.search')} />
          </div>
        </div>

        <div className="inspiration-tabs">
          {(['all', 'image', 'video'] as const).map((tab) => (
            <button
              key={tab}
              className={`inspiration-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {t(`home.tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div className="inspiration-grid">
          {filteredInspiration.map((item, idx) => (
            <div key={item.id} className="inspiration-item">
              <div style={{
                width: '100%',
                height: '100%',
                background: GRADIENTS[idx % GRADIENTS.length]
              }} />
              <span className="inspiration-item-badge">
                {item.type === 'video' ? '▶' : 'AI'} {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
