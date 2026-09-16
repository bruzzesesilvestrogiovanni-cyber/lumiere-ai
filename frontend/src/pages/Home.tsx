import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Seedream 5.0 Pro | Layer Separation',
    subtitle: 'Precise editing, multilingual generation, and high-density visuals, all in one',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Seedance 2.5 Showcase',
    subtitle: '30s videos. Rich references. Cinematic motion.',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Music Video Agent',
    subtitle: 'Turn any song into a stunning music video in seconds.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
  },
]

const FEATURE_MODELS = [
  { id: 'seedance', name: 'Seedance 2.0', desc: 'Cinematic video generation', icon: '📊', badge: 'hot' as const, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&h=200&fit=crop' },
  { id: 'gpt-image', name: 'GPT-image-2', desc: 'Sharper image creation', icon: '✨', image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=300&h=200&fit=crop' },
  { id: 'seedream', name: 'Seedream 5.0 Pro', desc: 'Production-ready visual creation', icon: '📊', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop' },
  { id: 'seedance-mini', name: 'Seedance 2.0 Mini', desc: 'Cheaper and Faster', icon: '📊', badge: 'new' as const, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop' },
]

const CANVAS_TEMPLATES = [
  { id: 1, name: 'Storyboard Grid', desc: 'Turn ideas into multi-frame scenes', image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop' },
  { id: 2, name: 'Shot Designer', desc: 'Create cinematic camera angles', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop' },
  { id: 3, name: 'Cinematic color', desc: 'Add film-style tones', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop' },
  { id: 4, name: 'Keyframe camera', desc: 'Control camera moves with precision', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop' },
  { id: 5, name: 'Character poses', desc: 'Generate dynamic character positions', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop' },
]

// Bonus gallery images (4 images + 4 videos)
const BONUS_IMAGES = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1699116548123-f27d4f0e5e23?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1684779847639-fbcc5a57dfe9?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1683009427666-340595e57e43?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1682686580849-3e7f67df4015?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1682687218147-9806132dc697?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=300&h=200&fit=crop',
]

// Bonus thumbnail images (3 small)
const BONUS_THUMBS = [
  'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1698778573682-346d219f7a2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1682686580186-b55d2a91053c?w=100&h=100&fit=crop',
]

interface InspirationItem {
  id: number
  type: 'video' | 'image'
  image: string
  video?: string
}

const INSPIRATION_ITEMS: InspirationItem[] = [
  { id: 1, type: 'video', image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=300&h=400&fit=crop', video: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4' },
  { id: 2, type: 'video', image: 'https://images.unsplash.com/photo-1699894009877-20c145e3a29c?w=300&h=400&fit=crop', video: 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4' },
  { id: 3, type: 'image', image: 'https://images.unsplash.com/photo-1684779847639-fbcc5a57dfe9?w=300&h=400&fit=crop' },
  { id: 4, type: 'image', image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=300&h=400&fit=crop' },
  { id: 5, type: 'image', image: 'https://images.unsplash.com/photo-1698778573682-346d219f7a2d?w=300&h=400&fit=crop' },
  { id: 6, type: 'video', image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&h=400&fit=crop', video: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4' },
  { id: 7, type: 'image', image: 'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=300&h=400&fit=crop' },
  { id: 8, type: 'image', image: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=300&h=400&fit=crop' },
  { id: 9, type: 'video', image: 'https://images.unsplash.com/photo-1682686580849-3e7f67df4015?w=300&h=400&fit=crop', video: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4' },
  { id: 10, type: 'image', image: 'https://images.unsplash.com/photo-1682687218147-9806132dc697?w=300&h=400&fit=crop' },
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
              <div className="hero-slide-bg" style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
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
        <div className="feature-card promo glass-card hover-lift">
          <div className="feature-card-title" style={{ fontSize: '18px', marginBottom: '8px' }}>
            {t('home.newRelease')}
          </div>
          <button className="btn-glow" style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'var(--color-video-bg)' }}>
            {t('home.tryNow')} <span>→</span>
          </button>
        </div>
        {FEATURE_MODELS.map((model) => (
          <div
            key={model.id}
            className={`feature-card glass-card hover-lift ${model.id.includes('seedance') ? 'card-video' : 'card-image'}`}
            style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%), url(${model.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onClick={() => navigate('/canvas', { state: { model: model.id } })}
          >
            {model.badge && (
              <span className={`badge-${model.badge === 'hot' ? 'popular' : 'new'}`}>{model.badge}</span>
            )}
            <div className={`feature-card-icon ${model.id.includes('seedance') ? 'icon-video' : 'icon-image'}`}>{model.icon}</div>
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
          {CANVAS_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="canvas-item glass-card hover-scale"
              onClick={() => navigate('/canvas', { state: { template: tpl.id } })}
            >
              <div
                className="canvas-item-bg"
                style={{ backgroundImage: `url(${tpl.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=1200&h=600&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>▶</div>
              <div style={{ fontSize: '18px', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{t('home.videoPlaceholder')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Section */}
      <div className="bonus-section glass-card">
        <div className="bonus-info">
          <div className="bonus-label">{t('home.limitedOffer')}</div>
          <h2 className="bonus-title">{t('home.launchBonus')}</h2>
          <p className="bonus-desc">
            {t('home.bonusDesc')}
          </p>
          <div className="bonus-thumbs">
            {BONUS_THUMBS.map((img, i) => (
              <div
                key={i}
                className="bonus-thumb"
                style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            ))}
          </div>
        </div>
        <div className="bonus-gallery">
          {BONUS_IMAGES.map((img, i) => (
            <div key={i} className={`bonus-gallery-item hover-scale ${i >= 4 ? 'card-video' : 'card-image'}`}>
              <div style={{
                width: '100%',
                height: '100%',
                minHeight: '80px',
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              {i >= 4 && (
                <span className="play-icon icon-video">▶</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Referral Section */}
      <div className="home-referral-section glass-card">
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
            <div className="home-referral-tool-card card-video hover-lift" onClick={() => navigate('/referral')}>
              <div className="tool-preview video">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="tool-info">
                <h4 className="text-neon-video">{t('referral.videoGenerator')}</h4>
                <p>{t('referral.videoGeneratorDesc')}</p>
                <div className="tool-link">
                  <span>lumiere-ai.com/video?ref={referralCode}</span>
                  <button className="btn-video" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://lumiere-ai.com/video?ref=${referralCode}`); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="home-referral-tool-card card-image hover-lift" onClick={() => navigate('/referral')}>
              <div className="tool-preview image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="tool-info">
                <h4 className="text-neon-image">{t('referral.imageGenerator')}</h4>
                <p>{t('referral.imageGeneratorDesc')}</p>
                <div className="tool-link">
                  <span>lumiere-ai.com/image?ref={referralCode}</span>
                  <button className="btn-image" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://lumiere-ai.com/image?ref=${referralCode}`); }}>
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
          {filteredInspiration.map((item) => (
            <div key={item.id} className={`inspiration-item hover-scale ${item.type === 'video' ? 'card-video' : 'card-image'}`}>
              {item.type === 'video' && item.video ? (
                <video
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              )}
              <span className={`inspiration-item-badge badge-${item.type === 'video' ? 'video' : 'image'}`}>
                {item.type === 'video' ? '▶ VIDEO' : 'AI IMAGE'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
