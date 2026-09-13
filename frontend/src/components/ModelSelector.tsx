interface Model {
  id: string
  name: string
  description: string
  badge?: 'hot' | 'new' | 'pro' | 'beta'
  icon: string
  credits?: number
}

interface ModelSelectorProps {
  models: Model[]
  selected: string
  onSelect: (id: string) => void
}

export default function ModelSelector({ models, selected, onSelect }: ModelSelectorProps) {
  return (
    <div className="model-selector">
      {models.map((model) => (
        <button
          key={model.id}
          className={`model-card ${selected === model.id ? 'active' : ''}`}
          onClick={() => onSelect(model.id)}
        >
          {model.badge && (
            <span className={`model-badge ${model.badge}`}>{model.badge}</span>
          )}
          <div className="model-icon">{model.icon}</div>
          <div className="model-name">{model.name}</div>
          <div className="model-desc">{model.description}</div>
          {model.credits !== undefined && (
            <div className="model-credits">{model.credits} credits</div>
          )}
        </button>
      ))}
    </div>
  )
}

// Image Models - from Lumina (pricing aligned)
// Credits based on Lumina: ai.byteplus.com/lumina
export const IMAGE_MODELS: Model[] = [
  { id: 'seedream_5_pro', name: 'Seedream 5.0 Pro', description: 'Production-ready visuals', icon: '🎨', badge: 'pro', credits: 9 },
  { id: 'seedream_5_lite', name: 'Seedream 5.0 Lite', description: 'Fast and efficient', icon: '⚡', credits: 4 },
  { id: 'seedream_4.5', name: 'Seedream 4.5', description: 'Balanced quality/speed', icon: '🖼', credits: 4 },
  { id: 'nano_banana_pro', name: 'Nano Banana Pro', description: 'Enhanced stylization (1K)', icon: '🎭', badge: 'beta', credits: 12 },
  { id: 'nano_banana_2', name: 'Nano Banana 2', description: 'Creative stylized art', icon: '🍌', badge: 'beta', credits: 24 },
  { id: 'gpt_image_2', name: 'GPT Image 2', description: 'OpenAI image generation', icon: '🌐', badge: 'beta', credits: 30 },
]

// Video Models - from Lumina
export const VIDEO_MODELS: Model[] = [
  { id: 'seedance-2.5', name: 'Seedance 2.5', description: 'Latest video generation', icon: '🎬', badge: 'hot' },
  { id: 'wan-3', name: 'Wan 3.0', description: 'Rich motion references', icon: '🌀', badge: 'new' },
  { id: 'minimax-h3', name: 'MiniMax H3', description: 'High quality output', icon: '📊' },
  { id: 'seedance-2-mini', name: 'Seedance 2.0 Mini', description: 'Fast and affordable', icon: '⚡' },
  { id: 'seedance-2', name: 'Seedance 2.0', description: 'Cinematic videos', icon: '📹' },
  { id: 'seedance-2-fast', name: 'Seedance 2.0 Fast', description: 'Quick generation', icon: '💨' },
  { id: 'minimax-h3-max', name: 'MiniMax H3 Max', description: 'Maximum quality', icon: '🔥', badge: 'pro' },
  { id: 'seedance-1.5-pro', name: 'Seedance 1.5 Pro', description: 'Professional output', icon: '🎥', badge: 'pro' },
  { id: 'seedance-1-pro', name: 'Seedance 1.0 Pro', description: 'Stable generation', icon: '📽' },
  { id: 'seedance-1-fast', name: 'Seedance 1.0 Fast', description: 'Quick preview', icon: '⏱' },
  { id: 'seedance-1', name: 'Seedance 1.0', description: 'Original version', icon: '🎞' },
]
