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
    oneTime: true
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
    oneTime: false
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
    oneTime: false
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
    oneTime: false
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
    oneTime: false
  },
]

export default function Pricing() {
  const { user } = useUser()

  // Filtra il piano Trial se l'utente l'ha già usato
  const availablePlans = PLANS.filter(plan => {
    if (plan.id === 'trial' && user?.trial_used) {
      return false // Nascondi Trial se già usato
    }
    return true
  })

  const handleSelectPlan = (planId: string) => {
    // TODO: Integrare con Stripe Checkout
    console.log('Piano selezionato:', planId)
    alert(`Checkout per piano ${planId} - Integrazione Stripe in arrivo`)
  }

  return (
    <>
      <div className="topbar">
        <h2>Piani & Crediti</h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Scegli il piano perfetto per te</h1>
          <p style={{ color: 'var(--text-dim)' }}>
            Genera immagini e video AI di alta qualita. Annulla quando vuoi.
          </p>
        </div>

        {/* Messaggio Trial gia usato */}
        {user?.trial_used && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            padding: '12px 20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Hai gia utilizzato il piano Trial. Scegli uno dei piani mensili per continuare.
          </div>
        )}

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {availablePlans.map(plan => (
            <div
              key={plan.id}
              className="template"
              style={{
                padding: '24px',
                position: 'relative',
                border: plan.popular ? '2px solid var(--accent)' : undefined
              }}
            >
              {/* Badge Popular */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  Piu popolare
                </div>
              )}

              {/* Badge One-Time */}
              {plan.oneTime && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#ff9800',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  Solo 1 volta
                </div>
              )}

              {/* Plan Name */}
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{plan.name}</h3>

              {/* Price */}
              <p style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0' }}>
                {plan.price}
                <span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/{plan.period}</span>
              </p>

              {/* Credits */}
              <p style={{
                color: 'var(--accent)',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                {plan.credits.toLocaleString()} crediti
              </p>

              {/* Description */}
              <p style={{ color: 'var(--text-dim)', marginBottom: '16px', fontSize: '13px' }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 20px 0',
                fontSize: '13px'
              }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{
                    padding: '4px 0',
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: 'var(--accent)' }}>&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: 'auto'
                }}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{
          color: 'var(--text-dim)',
          marginTop: '30px',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          Pagamenti sicuri con Stripe. Puoi annullare in qualsiasi momento.
        </p>
      </div>
    </>
  )
}
