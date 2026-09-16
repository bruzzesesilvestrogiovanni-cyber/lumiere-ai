import { useUser } from '../context/UserContext'

// Piani tariffari LUMIERE AI
const PLANS = [
  {
    id: 'trial',
    name: 'Trial',
    price: '2.49',
    period: '3 giorni',
    credits: 85,
    description: '2 immagini qualita TOP',
    features: ['Solo Grok Aurora (TOP)', 'Fotorealismo massimo', 'Senza watermark', 'Solo una volta'],
    cta: 'Prova ora',
    popular: false,
    oneTime: true,
    color: 'audio' as const
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '24.99',
    period: 'mese',
    credits: 900,
    description: '~225 immagini o ~8 video',
    features: ['900 crediti/mese', 'Tutti i modelli', 'Senza watermark', 'Rinnovo automatico'],
    cta: 'Scegli Basic',
    popular: false,
    oneTime: false,
    color: 'image' as const
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '59.99',
    period: 'mese',
    credits: 2100,
    description: '~525 immagini o ~20 video',
    features: ['2.100 crediti/mese', 'Tutti i modelli', 'Senza watermark', 'Priorita generazione'],
    cta: 'Scegli Standard',
    popular: true,
    oneTime: false,
    color: 'video' as const
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: '124.99',
    period: 'mese',
    credits: 4400,
    description: '~1.100 immagini o ~42 video',
    features: ['4.400 crediti/mese', 'Tutti i modelli', 'Senza watermark', 'Supporto prioritario'],
    cta: 'Scegli Advanced',
    popular: false,
    oneTime: false,
    color: 'chat' as const
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '299.99',
    period: 'mese',
    credits: 10500,
    description: '~2.625 immagini o ~100 video',
    features: ['10.500 crediti/mese', 'Accesso anticipato modelli', 'Senza watermark', 'Supporto dedicato'],
    cta: 'Scegli Ultra',
    popular: false,
    oneTime: false,
    color: 'video' as const
  },
]

export default function Pricing() {
  const { user } = useUser()

  // Filtra il piano Trial se l'utente l'ha già usato
  const availablePlans = PLANS.filter(plan => {
    if (plan.id === 'trial' && user?.trial_used) {
      return false
    }
    return true
  })

  const handleSelectPlan = (planId: string) => {
    console.log('Piano selezionato:', planId)
    alert(`Checkout per piano ${planId} - Integrazione Stripe in arrivo`)
  }

  return (
    <div className="pricing-page">
      {/* Header */}
      <div className="pricing-header">
        <h1 className="pricing-title">
          Scegli il piano perfetto per te
        </h1>
        <p className="pricing-subtitle">
          Genera immagini e video AI di alta qualita. Annulla quando vuoi.
        </p>
      </div>

      {/* Trial Warning */}
      {user?.trial_used && (
        <div className="pricing-warning glass-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Hai gia utilizzato il piano Trial. Scegli uno dei piani mensili per continuare.
        </div>
      )}

      {/* Plans Grid */}
      <div className="pricing-grid">
        {availablePlans.map(plan => (
          <div
            key={plan.id}
            className={`pricing-plan-card glass-card hover-lift card-${plan.color} ${plan.popular ? 'popular' : ''}`}
          >
            {/* Badge */}
            {plan.popular && (
              <div className="pricing-badge badge-popular">
                Piu popolare
              </div>
            )}
            {plan.oneTime && (
              <div className="pricing-badge badge-new">
                Solo 1 volta
              </div>
            )}

            {/* Plan Header */}
            <div className="pricing-plan-header">
              <h3 className={`pricing-plan-name text-neon-${plan.color}`}>{plan.name}</h3>
              <div className="pricing-plan-price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">/{plan.period}</span>
              </div>
            </div>

            {/* Credits */}
            <div className={`pricing-plan-credits badge-${plan.color}`}>
              {plan.credits.toLocaleString()} crediti
            </div>

            {/* Description */}
            <p className="pricing-plan-desc">{plan.description}</p>

            {/* Features */}
            <ul className="pricing-plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <svg className={`icon-${plan.color}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`pricing-plan-cta btn-${plan.color}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pricing-footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Pagamenti sicuri con Stripe. Puoi annullare in qualsiasi momento.
      </div>
    </div>
  )
}
