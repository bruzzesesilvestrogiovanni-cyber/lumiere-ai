interface Option {
  value: string
  label: string
}

interface GenerationOptionsProps {
  type: 'image' | 'video'
  aspectRatio: string
  onAspectRatioChange: (value: string) => void
  // Image specific
  style?: string
  onStyleChange?: (value: string) => void
  quality?: string
  onQualityChange?: (value: string) => void
  // Video specific
  duration?: number
  onDurationChange?: (value: number) => void
  fps?: number
  onFpsChange?: (value: number) => void
}

const ASPECT_RATIOS: Option[] = [
  { value: '1:1', label: '1:1 Square' },
  { value: '16:9', label: '16:9 Landscape' },
  { value: '9:16', label: '9:16 Portrait' },
  { value: '4:3', label: '4:3 Standard' },
  { value: '3:4', label: '3:4 Portrait' },
  { value: '21:9', label: '21:9 Cinematic' },
]

const STYLES: Option[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'anime', label: 'Anime' },
  { value: 'illustration', label: 'Illustration' },
  { value: '3d-render', label: '3D Render' },
]

const QUALITIES: Option[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'hd', label: 'HD' },
  { value: '4k', label: '4K (Pro)' },
]

const DURATIONS = [3, 5, 10, 15, 30]
const FPS_OPTIONS = [24, 30, 60]

export default function GenerationOptions({
  type,
  aspectRatio,
  onAspectRatioChange,
  style,
  onStyleChange,
  quality,
  onQualityChange,
  duration,
  onDurationChange,
  fps,
  onFpsChange,
}: GenerationOptionsProps) {
  return (
    <div className="generation-options">
      <div className="option-group">
        <label className="option-label">Aspect Ratio</label>
        <div className="option-buttons">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.value}
              className={`option-btn ${aspectRatio === ar.value ? 'active' : ''}`}
              onClick={() => onAspectRatioChange(ar.value)}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      {type === 'image' && (
        <>
          <div className="option-group">
            <label className="option-label">Style</label>
            <select
              className="option-select"
              value={style}
              onChange={(e) => onStyleChange?.(e.target.value)}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label className="option-label">Quality</label>
            <div className="option-buttons">
              {QUALITIES.map((q) => (
                <button
                  key={q.value}
                  className={`option-btn ${quality === q.value ? 'active' : ''}`}
                  onClick={() => onQualityChange?.(q.value)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {type === 'video' && (
        <>
          <div className="option-group">
            <label className="option-label">Duration</label>
            <div className="option-buttons">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={`option-btn ${duration === d ? 'active' : ''}`}
                  onClick={() => onDurationChange?.(d)}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label className="option-label">FPS</label>
            <div className="option-buttons">
              {FPS_OPTIONS.map((f) => (
                <button
                  key={f}
                  className={`option-btn ${fps === f ? 'active' : ''}`}
                  onClick={() => onFpsChange?.(f)}
                >
                  {f} fps
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
