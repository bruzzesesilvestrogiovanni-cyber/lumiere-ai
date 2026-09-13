const AUDIO_FEATURES = [
  {
    id: 'music',
    name: 'Music Generation',
    description: 'Create original music tracks in any genre',
    icon: '🎵',
    status: 'coming',
  },
  {
    id: 'sfx',
    name: 'Sound Effects',
    description: 'Generate realistic sound effects for videos',
    icon: '🔊',
    status: 'coming',
  },
  {
    id: 'voice',
    name: 'Voice Cloning',
    description: 'Clone voices for narration and dubbing',
    icon: '🎙️',
    status: 'coming',
  },
  {
    id: 'tts',
    name: 'Text to Speech',
    description: 'Natural sounding speech from text',
    icon: '💬',
    status: 'coming',
  },
]

export default function AudioPage() {
  const handleNotifyClick = () => {
    alert("You'll be notified when available!")
  }

  return (
    <div className="audio-page">
      <div className="page-header">
        <h1 className="section-title">Audio Generation</h1>
        <p className="page-subtitle">
          AI-powered audio creation tools - coming soon
        </p>
      </div>

      <div className="coming-soon-banner">
        <div className="banner-icon">🎧</div>
        <h2>Audio Features Coming Soon</h2>
        <p>We're working on powerful audio generation capabilities</p>
        <button className="notify-btn" onClick={handleNotifyClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Notify me when available
        </button>
      </div>

      <div className="features-preview">
        <h2 className="section-title">Upcoming Features</h2>
        <div className="features-grid">
          {AUDIO_FEATURES.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.name}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
