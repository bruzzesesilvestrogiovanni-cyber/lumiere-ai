import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import PromptInput from '../components/PromptInput'
import ImageUploader from '../components/ImageUploader'

// Pricing table (credits) - ALIGNED WITH LUMINA (ai.byteplus.com/lumina)
// Base: 480p=21 cred/sec, 720p=46 cred/sec, 1080p=75 cred/sec (scontato)
const PRICING = {
  grok: {
    '480p': { 4: 84, 5: 105, 10: 210, 15: 315 },
    '720p': { 4: 184, 5: 230, 10: 460, 15: 690 },
    '1080p': { 4: 300, 5: 375, 10: 752, 15: 1128 },
  },
  byteplus: {
    '480p': { 4: 84, 5: 105, 10: 210, 15: 315, 20: 420, 25: 525, 30: 630 },
    '720p': { 4: 184, 5: 230, 10: 460, 15: 690, 20: 920, 25: 1150, 30: 1380 },
    '1080p': { 4: 300, 5: 375, 10: 752, 15: 1128, 20: 1504, 25: 1880, 30: 2257 },
  }
}

const ASPECT_RATIOS = [
  { id: 'adaptive', label: 'Adaptive', icon: '⬜' },
  { id: '1:1', label: '1:1', icon: '⬜' },
  { id: '3:4', label: '3:4', icon: '▯' },
  { id: '4:3', label: '4:3', icon: '▭' },
  { id: '9:16', label: '9:16', icon: '📱' },
  { id: '16:9', label: '16:9', icon: '🖥' },
  { id: '21:9', label: '21:9', icon: '🎬' },
]

const RESOLUTIONS = ['480p', '720p', '1080p']
const DURATIONS = [4, 5, 10, 15, 20, 25, 30]

export default function VideoPage() {
  const { user, openLogin, openPricing, updateCredits, hasWatermark } = useUser()

  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('adaptive')
  const [resolution, setResolution] = useState<'480p' | '720p' | '1080p'>('480p')
  const [duration, setDuration] = useState(4)
  const [startFrame, setStartFrame] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [creditsCost, setCreditsCost] = useState(84)

  // User credits (default to 84 for new users - 1 video 4s 480p OR 3 images)
  const userCredits = user?.credits ?? 84
  const canAfford = userCredits >= creditsCost

  // Determine which API to use and calculate credits
  useEffect(() => {
    const useGrok = duration <= 15 && aspectRatio !== '21:9'
    const api = useGrok ? 'grok' : 'byteplus'
    const effectiveDuration = duration

    const pricing = PRICING[api][resolution as keyof typeof PRICING.grok]
    const durations = Object.keys(pricing).map(Number).sort((a, b) => a - b)

    // Find closest duration
    let cost = 0
    for (const d of durations) {
      if (effectiveDuration <= d) {
        cost = pricing[d as keyof typeof pricing]
        break
      }
      cost = pricing[d as keyof typeof pricing]
    }

    setCreditsCost(cost)
  }, [duration, resolution, aspectRatio])

  const getApiUsed = () => {
    if (duration <= 15 && aspectRatio !== '21:9') {
      return { name: 'Optimized', hasAudio: true }
    }
    return { name: 'Premium', hasAudio: false }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Check if user is logged in
    if (!user) {
      openLogin()
      return
    }

    // Check if user has enough credits
    if (!canAfford) {
      openPricing()
      return
    }

    setIsGenerating(true)
    setResult(null)
    setProgress(0)

    try {
      // Call backend API
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspect_ratio: aspectRatio,
          resolution,
          duration,
          start_frame: startFrame,
        }),
      })

      if (response.status === 402) {
        // Insufficient credits
        openPricing()
        setIsGenerating(false)
        return
      }

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()

      // Update user credits
      updateCredits(userCredits - creditsCost)

      // Poll for progress
      const pollProgress = async () => {
        const statusRes = await fetch(`/api/generate/video/status/${data.task_id}`)
        const status = await statusRes.json()

        if (status.progress) {
          setProgress(status.progress)
        }

        if (status.status === 'completed') {
          setResult(status.video_url)
          setIsGenerating(false)
        } else if (status.status === 'failed') {
          throw new Error(status.error || 'Generation failed')
        } else {
          setTimeout(pollProgress, 1000)
        }
      }

      pollProgress()
    } catch (error) {
      console.error('Error:', error)
      // Mock result for demo
      updateCredits(userCredits - creditsCost)
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setProgress(i)
      }
      setResult('mock-video-url')
      setIsGenerating(false)
    }
  }

  const apiInfo = getApiUsed()

  return (
    <div className="generation-page">
      <div className="generation-header">
        <h1 className="section-title">AI Video</h1>
        <div className="generation-info-badges">
          {apiInfo.hasAudio && (
            <span className="info-badge audio">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              Audio incluso
            </span>
          )}
          {hasWatermark && (
            <span className="info-badge watermark" onClick={openPricing} style={{ cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Watermark
            </span>
          )}
          <span className={`info-badge credits ${!canAfford ? 'insufficient' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v12"/>
              <path d="M6 12h12"/>
            </svg>
            {creditsCost} crediti {!canAfford && `(hai ${userCredits})`}
          </span>
        </div>
      </div>

      <div className="generation-layout">
        <div className="generation-controls">
          {/* Prompt */}
          <div className="generation-section">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              placeholder="Describe the video scene you want to create..."
            />
          </div>

          {/* Reference Image */}
          <div className="generation-section">
            <h3 className="generation-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Starting Frame (Optional)
            </h3>
            <ImageUploader
              preview={startFrame || undefined}
              onUpload={(_, preview) => setStartFrame(preview)}
              onClear={() => setStartFrame(null)}
            />
          </div>

          {/* Video Settings */}
          <div className="generation-section video-settings">
            <div className="settings-header">
              <h3 className="generation-section-title">Video Settings</h3>
              <button className="reset-btn" onClick={() => {
                setAspectRatio('adaptive')
                setResolution('480p')
                setDuration(4)
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Reset
              </button>
            </div>

            {/* Aspect Ratio */}
            <div className="setting-group">
              <label>Aspect Ratio</label>
              <div className="option-grid aspect-grid">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    className={`option-btn ${aspectRatio === ratio.id ? 'active' : ''}`}
                    onClick={() => setAspectRatio(ratio.id)}
                  >
                    <span className="option-icon">{ratio.icon}</span>
                    <span>{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="setting-group">
              <label>
                Resolution
                <span className="label-hint">ⓘ</span>
              </label>
              <div className="option-grid resolution-grid">
                {RESOLUTIONS.map((res) => (
                  <button
                    key={res}
                    className={`option-btn ${resolution === res ? 'active' : ''}`}
                    onClick={() => setResolution(res as '480p' | '720p' | '1080p')}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="setting-group">
              <label>
                Duration
                <span className="label-hint">ⓘ</span>
              </label>
              <div className="duration-slider-container">
                <input
                  type="range"
                  min="4"
                  max="30"
                  step="1"
                  value={duration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    // Snap to nearest valid duration
                    const nearest = DURATIONS.reduce((prev, curr) =>
                      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                    )
                    setDuration(nearest)
                  }}
                  className="duration-slider"
                />
                <div className="duration-labels">
                  {DURATIONS.map((d) => (
                    <span
                      key={d}
                      className={`duration-label ${duration === d ? 'active' : ''}`}
                      onClick={() => setDuration(d)}
                    >
                      {d}s
                    </span>
                  ))}
                </div>
              </div>
              <div className="duration-display">{duration} seconds</div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            className={`generate-btn ${!canAfford ? 'upgrade-required' : ''}`}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="generate-spinner" />
                Generating... {progress}%
              </>
            ) : !canAfford ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                Upgrade per generare
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Generate Video • {creditsCost} credits
              </>
            )}
          </button>

          {!canAfford && !isGenerating && (
            <div className="credits-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Crediti insufficienti. Hai {userCredits} crediti, servono {creditsCost}.
            </div>
          )}

          {isGenerating && (
            <div className="generation-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-text">
                {progress < 30 ? 'Analyzing prompt...' :
                 progress < 60 ? 'Generating frames...' :
                 progress < 90 ? 'Rendering video...' : 'Finalizing...'}
              </span>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="generation-preview">
          <div className="preview-container video">
            {result ? (
              <div className="preview-result video-result">
                <div className="video-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  <span>Video Preview</span>
                  <span className="video-duration">{duration}s • {resolution}</span>
                </div>
                <div className="preview-actions">
                  <button className="preview-action-btn" onClick={() => {
                    alert('Download video avviato!')
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download MP4
                  </button>
                  <button className="preview-action-btn" onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copiato!')
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share
                  </button>
                  <button className="preview-action-btn" onClick={() => setResult(null)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    New Video
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="preview-loading">
                <div className="loading-spinner" />
                <span>Creating your video...</span>
                <span className="loading-progress">{progress}%</span>
              </div>
            ) : (
              <div className="preview-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                <span>Your generated video will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
