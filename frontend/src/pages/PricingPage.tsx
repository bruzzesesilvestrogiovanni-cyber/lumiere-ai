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
  period: string
  totalCredits: number
  color: 'green' | 'yellow' | 'cyan' | 'orange' | 'pink'
  badge?: 'popular' | 'maximum'
  models: { name: string; unlimited: boolean }[]
  features: string[]
  oneTime?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'Trial',
    tagline: 'Per provare',
    credits: 85,
    extraCredits: 0,
    price: '€2,49',
    priceValue: 2.49,
    period: '/3 giorni',
    totalCredits: 85,
    color: 'yellow',
    oneTime: true,
    models: [],
    features: [
      '2 immagini qualita TOP',
      'Solo Grok Aurora (TOP)',
      'Fotorealismo massimo',
      'Senza watermark',
      'Solo una volta per account',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Per iniziare',
    credits: 900,
    extraCredits: 0,
    price: '€24,99',
    priceValue: 24.99,
    period: '/mese',
    totalCredits: 900,
    color: 'green',
    models: [],
    features: [
      '~225 immagini o ~8 video',
      'Tutti i modelli',
      'Senza watermark',
      'Rinnovo automatico',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Per creare spesso',
    credits: 2100,
    extraCredits: 0,
    price: '€59,99',
    priceValue: 59.99,
    period: '/mese',
    totalCredits: 2100,
    color: 'cyan',
    badge: 'popular',
    models: [
      { name: 'Seedream 5.0', unlimited: true },
    ],
    features: [
      '~525 immagini o ~20 video',
      'Tutti i modelli',
      'Senza watermark',
      'Priorita generazione',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    tagline: 'Per professionisti',
    credits: 4400,
    extraCredits: 0,
    price: '€124,99',
    priceValue: 124.99,
    period: '/mese',
    totalCredits: 4400,
    color: 'orange',
    models: [
      { name: 'Seedream 5.0', unlimited: true },
      { name: 'Voci Cinematiche', unlimited: true },
    ],
    features: [
      '~1.100 immagini o ~42 video',
      'Tutti i modelli',
      'Senza watermark',
      'Supporto prioritario',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    tagline: 'Senza limiti',
    credits: 10500,
    extraCredits: 0,
    price: '€299,99',
    priceValue: 299.99,
    period: '/mese',
    totalCredits: 10500,
    color: 'pink',
    badge: 'maximum',
    models: [
      { name: 'Seedream 5.0', unlimited: true },
      { name: 'Voci Cinematiche', unlimited: true },
      { name: 'Accesso anticipato', unlimited: true },
    ],
    features: [
      '~2.625 immagini o ~100 video',
      'Accesso anticipato modelli',
      'Senza watermark',
      'Supporto dedicato',
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
              className={`plan-card-gvoid color-${plan.color} ${plan.badge ? `badge-${plan.badge}` : ''}`}
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
              {plan.oneTime && (
                <div className="plan-badge onetime">
                  <span>🎁</span> SOLO 1 VOLTA
                </div>
              )}

              {/* Header with Models inline */}
              <div className="plan-header-gvoid">
                <span className="plan-dot" style={{ background: getColorClass(plan.color) }} />
                <span className="plan-name-gvoid">{plan.name}</span>
                {/* Models inline with name */}
                {plan.models.length > 0 && (
                  <div className="plan-models-inline">
                    {plan.models.slice(0, 1).map((model, i) => (
                      <div key={i} className="model-badge-inline">
                        <span className="model-name-inline">{model.name}</span>
                        <span className="model-tag-inline">UNLIMITED</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="plan-tagline-gvoid">{plan.tagline}</p>

              {/* Credits */}
              <div className="plan-credits-gvoid">
                <span className="credits-number">{plan.credits.toLocaleString()}</span>
                <span className="credits-icon">◇</span>
                <span className="credits-period">{plan.period}</span>
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
                <span className="price-period">{plan.period}</span>
              </div>

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
                {plan.oneTime ? 'Prova ora' : `Scegli ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
