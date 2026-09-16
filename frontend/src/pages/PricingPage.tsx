import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'
import CheckoutModal from '../components/CheckoutModal'

interface Plan {
  id: string
  name: string
  tagline: string
  credits: number
  extraCredits: number
  price: string
  priceValue: number
  color: 'green' | 'yellow' | 'cyan' | 'orange' | 'pink'
  badge?: 'popular' | 'maximum'
  models: { name: string; unlimited: boolean }[]
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Per iniziare',
    credits: 1000,
    extraCredits: 0,
    price: '€9,99',
    priceValue: 9.99,
    color: 'green',
    models: [],
    features: [
      '~12 video brevi o 5 in HD',
      '~100 immagini AI',
      'Tutti i modelli (video, immagine, audio)',
      'Canvas completo',
      'Crediti rinnovati ogni mese',
      'Video cinematici',
      '1 generazione alla volta',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    tagline: 'Per creare spesso',
    credits: 3000,
    extraCredits: 300,
    price: '€29,99',
    priceValue: 29.99,
    color: 'yellow',
    models: [
      { name: 'Seedream 4.5', unlimited: true },
    ],
    features: [
      'Tutti i modelli (video, immagine, audio)',
      'Canvas completo',
      'Video cinematici',
      'Voci cinematiche',
      'Volti reali in immagini e video',
      '~41 video brevi o 16 in HD',
      '~330 immagini AI',
      '+300 crediti regalo',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Video completi',
    credits: 7500,
    extraCredits: 800,
    price: '€72',
    priceValue: 72,
    color: 'cyan',
    models: [
      { name: 'SeedAudio 1.0', unlimited: true },
      { name: 'Voci Cinematiche', unlimited: true },
      { name: 'AutoDub', unlimited: true },
      { name: 'Seedream 4.5', unlimited: true },
      { name: 'Seedream 5.0 Lite', unlimited: true },
    ],
    features: [
      'Tutti i modelli (video, immagine, audio)',
      'Canvas completo',
      'Video cinematici',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    tagline: 'Produzione intensiva',
    credits: 15000,
    extraCredits: 3000,
    price: '€149',
    priceValue: 149,
    color: 'orange',
    badge: 'popular',
    models: [
      { name: 'SeedAudio 1.0', unlimited: true },
      { name: 'Voci Cinematiche', unlimited: true },
      { name: 'AutoDub', unlimited: true },
      { name: 'Seedream 4.5', unlimited: true },
      { name: 'Seedream 5.0 Lite', unlimited: true },
    ],
    features: [
      'Tutti i modelli (video, immagine, audio)',
      'Canvas completo',
      'Video cinematici',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Senza limiti',
    credits: 32000,
    extraCredits: 8000,
    price: '€319',
    priceValue: 319,
    color: 'pink',
    badge: 'maximum',
    models: [
      { name: 'SeedAudio 1.0', unlimited: true },
      { name: 'Voci Cinematiche', unlimited: true },
      { name: 'AutoDub', unlimited: true },
      { name: 'Seedream 4.5', unlimited: true },
      { name: 'Seedream 5.0 Lite', unlimited: true },
      { name: 'Seedream 5.0 Pro', unlimited: false },
    ],
    features: [
      'Tutti i modelli (video, immagine, audio)',
      'Canvas completo',
      'Video cinematici',
    ],
  },
]

export default function PricingPage() {
  const { t } = useTranslation()
  const { user, openLogin } = useUser()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null)

  useEffect(() => {
    if (user && pendingPlan) {
      setSelectedPlan(pendingPlan)
      setCheckoutOpen(true)
      setPendingPlan(null)
    }
  }, [user, pendingPlan])

  const handlePlanClick = (plan: Plan) => {
    if (!user) {
      setPendingPlan(plan)
      openLogin()
    } else {
      setSelectedPlan(plan)
      setCheckoutOpen(true)
    }
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      green: '#00ff88',
      yellow: '#ffd700',
      cyan: '#00d4ff',
      orange: '#ff9500',
      pink: '#ff6b9d',
    }
    return colors[color] || colors.green
  }

  return (
    <>
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={selectedPlan}
        userEmail={user?.email || ''}
      />

      <div className="pricing-gvoid">
        {/* Billing Toggle */}
        <div className="pricing-toggle">
          <button
            className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Mensile
          </button>
          <button
            className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Annuale <span className="discount-tag">-20%</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid-gvoid">
          {PLANS.map((plan, index) => (
            <div
              key={plan.id}
              className={`plan-card-gvoid ${plan.badge ? `badge-${plan.badge}` : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              {plan.badge === 'popular' && (
                <div className="plan-badge popular">
                  <span>⚡</span> PIU POPOLARE
                </div>
              )}
              {plan.badge === 'maximum' && (
                <div className="plan-badge maximum">
                  <span>✦</span> MAXIMUM
                </div>
              )}

              {/* Header */}
              <div className="plan-header-gvoid">
                <span className="plan-dot" style={{ background: getColorClass(plan.color) }} />
                <span className="plan-name-gvoid">{plan.name}</span>
              </div>
              <p className="plan-tagline-gvoid">{plan.tagline}</p>

              {/* Credits */}
              <div className="plan-credits-gvoid">
                <span className="credits-number">{plan.credits.toLocaleString()}</span>
                <span className="credits-icon">◇</span>
                <span className="credits-period">/mo</span>
              </div>
              {plan.extraCredits > 0 && (
                <p className="extra-credits">
                  <span className="bolt">⚡</span>
                  +{plan.extraCredits.toLocaleString()} ◇ extra ogni mese
                </p>
              )}

              {/* Price */}
              <div className="plan-price-gvoid">
                <span className="price-value">{plan.price}</span>
                <span className="price-period">/mo</span>
              </div>

              {/* Models */}
              {plan.models.length > 0 && (
                <div className="plan-models">
                  {plan.models.map((model, i) => (
                    <div key={i} className="model-badge">
                      <span className="model-icon">📊</span>
                      <span className="model-name">{model.name}</span>
                      <span className={`model-tag ${model.unlimited ? 'unlimited' : 'limited'}`}>
                        {model.unlimited ? 'UNLIMITED' : '-50%'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Features */}
              <ul className="plan-features-gvoid">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="plan-cta-gvoid"
                style={{
                  background: `linear-gradient(135deg, ${getColorClass(plan.color)}, ${getColorClass(plan.color)}88)`,
                }}
                onClick={() => handlePlanClick(plan)}
              >
                Scegli {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
