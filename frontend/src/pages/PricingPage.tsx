import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'
import CheckoutModal from '../components/CheckoutModal'

interface Plan {
  id: string
  name: string
  badge?: string
  badgeColor?: string
  discount?: string
  discountColor?: string
  tagline: string
  price: string
  period: string
  billedText: string
  cta: string
  ctaStyle?: 'primary' | 'gold' | 'outline'
  subCta: string
  totalCredits: number
  baseCredits: number
  monthlyBonus: number
  seedanceCredits: number
  seedanceTime: string
  promoText?: string
  features: { text: string; included: boolean; badge?: string; badgeType?: string }[]
  highlight?: 'teal' | 'gold'
  bonusSection?: { title: string; subtitle: string; perCredit: string; usage: string }
}

const PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'Trial',
    badge: 'Trial Experience',
    badgeColor: 'teal',
    discount: 'Starter Pack',
    discountColor: 'pink',
    tagline: 'For new users only',
    price: '€2.49',
    period: '/ 3 giorni',
    billedText: 'Valido per 3 giorni',
    cta: 'Claim Starter Pass',
    subCta: 'No Auto-Renewal',
    totalCredits: 85,
    baseCredits: 50,
    monthlyBonus: 35,
    seedanceCredits: 0,
    seedanceTime: '',
    highlight: 'teal',
    bonusSection: {
      title: '+35 Credits Bonus',
      subtitle: '85 Credits totali',
      perCredit: 'Solo €2.93 per 100 Credits',
      usage: 'Fino a 42 immagini / 8 video (720p, 5s)'
    },
    features: [
      { text: 'Remove Watermarks in Downloads', included: true },
      { text: 'Access to all models', included: true },
      { text: 'Access to basic features', included: true },
      { text: 'Access to Canvas', included: true, badge: 'NEW', badgeType: 'green' },
      { text: 'No Auto-Renewal, No Lock-In', included: true },
      { text: 'One-time only offer. New accounts only', included: true },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    discount: '40% off',
    discountColor: 'yellow',
    tagline: 'For essential creation',
    price: '€24.99',
    period: '/ mese',
    billedText: 'Fatturato mensilmente',
    cta: 'Subscribe Basic Monthly',
    ctaStyle: 'outline',
    subCta: 'Cancel auto-renew anytime',
    totalCredits: 900,
    baseCredits: 540,
    monthlyBonus: 215,
    seedanceCredits: 145,
    seedanceTime: 'Up to 7 seconds of 480p Seedance 2.5',
    promoText: 'SD2.0 Mini 74% off & SD2.0 Fast 54% off until Sep 7, 2026',
    features: [
      { text: 'Remove Watermarks in Downloads', included: true },
      { text: 'Access to all models', included: true },
      { text: 'Access to basic features', included: true },
      { text: 'Access to Canvas', included: true, badge: 'NEW', badgeType: 'green' },
      { text: 'Auto-renewing subscription', included: true },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: 'Most Popular',
    badgeColor: 'teal',
    discount: '49% off',
    discountColor: 'green',
    tagline: 'For consistent creation',
    price: '€59.99',
    period: '/ mese',
    billedText: 'Fatturato mensilmente',
    cta: 'Subscribe Standard Monthly',
    ctaStyle: 'primary',
    subCta: 'Cancel auto-renew anytime',
    totalCredits: 2100,
    baseCredits: 1100,
    monthlyBonus: 450,
    seedanceCredits: 550,
    seedanceTime: 'Up to 26 seconds of 480p Seedance 2.5',
    highlight: 'teal',
    promoText: 'SD2.0 Mini 74% off & SD2.0 Fast 54% off until Sep 7, 2026',
    features: [
      { text: 'Remove Watermarks in Downloads', included: true },
      { text: 'Access to all models', included: true },
      { text: 'Access to all features', included: true },
      { text: 'Full access to Canvas & Canvas Pro', included: true, badge: 'NEW', badgeType: 'green' },
      { text: 'Auto-renewing subscription', included: true },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    discount: '48% off',
    discountColor: 'green',
    tagline: 'For scalable production',
    price: '€124.99',
    period: '/ mese',
    billedText: 'Fatturato mensilmente',
    cta: 'Subscribe Advanced Monthly',
    ctaStyle: 'outline',
    subCta: 'Cancel auto-renew anytime',
    totalCredits: 4400,
    baseCredits: 2400,
    monthlyBonus: 1200,
    seedanceCredits: 800,
    seedanceTime: 'Up to 38 seconds of 480p Seedance 2.5',
    promoText: 'SD2.0 Mini 74% off & SD2.0 Fast 54% off until Sep 7, 2026',
    features: [
      { text: 'Remove Watermarks in Downloads', included: true },
      { text: 'Access to all models', included: true },
      { text: 'Access to all features', included: true },
      { text: 'Full access to Canvas & Canvas Pro', included: true, badge: 'NEW', badgeType: 'green' },
      { text: 'Auto-renewing subscription', included: true },
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    badge: 'Best Value',
    badgeColor: 'gold',
    discount: '50% off',
    discountColor: 'pink',
    tagline: 'For high-end enterprise solutions',
    price: '€299.99',
    period: '/ mese',
    billedText: 'Fatturato mensilmente',
    cta: 'Subscribe Ultra Monthly',
    ctaStyle: 'gold',
    subCta: 'Cancel auto-renew anytime',
    totalCredits: 10500,
    baseCredits: 5600,
    monthlyBonus: 2900,
    seedanceCredits: 2000,
    seedanceTime: 'Up to 1 minute 35 seconds of 480p Seedance 2.5',
    highlight: 'gold',
    promoText: 'SD2.0 Mini 74% off & SD2.0 Fast 54% off until Sep 7, 2026',
    features: [
      { text: 'Remove Watermarks in Downloads', included: true },
      { text: 'Early access to all models', included: true, badge: 'Exclusive', badgeType: 'outline' },
      { text: 'Early access to advanced AI features', included: true, badge: 'Exclusive', badgeType: 'outline' },
      { text: 'Full access to Canvas & Canvas Pro', included: true, badge: 'NEW', badgeType: 'green' },
      { text: 'Lowest cost per credit', included: true },
      { text: 'Auto-renewing subscription', included: true },
    ],
  },
]

interface CreditPack {
  id: string
  credits: number
  price: string
  priceValue: number
  seedanceCredits: number
  seedanceTime: string
  popular?: boolean
}

const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'pack-200',
    credits: 200,
    price: '€6.99',
    priceValue: 6.99,
    seedanceCredits: 30,
    seedanceTime: 'Fino a circa 1.5 secondi',
  },
  {
    id: 'pack-500',
    credits: 500,
    price: '€15.99',
    priceValue: 15.99,
    seedanceCredits: 75,
    seedanceTime: 'Fino a circa 3.5 secondi',
  },
  {
    id: 'pack-1000',
    credits: 1000,
    price: '€29.99',
    priceValue: 29.99,
    seedanceCredits: 150,
    seedanceTime: 'Fino a circa 7 secondi',
    popular: true,
  },
  {
    id: 'pack-2500',
    credits: 2500,
    price: '€69.99',
    priceValue: 69.99,
    seedanceCredits: 375,
    seedanceTime: 'Fino a circa 18 secondi',
  },
  {
    id: 'pack-5000',
    credits: 5000,
    price: '€129.99',
    priceValue: 129.99,
    seedanceCredits: 750,
    seedanceTime: 'Fino a circa 36 secondi',
  },
  {
    id: 'pack-10000',
    credits: 10000,
    price: '€249.99',
    priceValue: 249.99,
    seedanceCredits: 1500,
    seedanceTime: 'Fino a circa 71 secondi',
  },
]

export default function PricingPage() {
  const { t } = useTranslation()
  const { user, openLogin } = useUser()
  const [activeTab, setActiveTab] = useState<'plans' | 'credits'>('plans')
  const [billingPeriod, setBillingPeriod] = useState<'yearly' | 'monthly' | 'business'>('monthly')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null)

  // Quando l'utente fa login, apri checkout se c'era un piano in attesa
  useEffect(() => {
    if (user && pendingPlan) {
      setSelectedPlan(pendingPlan)
      setCheckoutOpen(true)
      setPendingPlan(null)
    }
  }, [user, pendingPlan])

  const handlePlanClick = (plan: Plan) => {
    if (!user) {
      // Salva il piano e apri login
      setPendingPlan(plan)
      openLogin()
    } else {
      // Utente loggato, apri checkout
      setSelectedPlan(plan)
      setCheckoutOpen(true)
    }
  }

  return (
    <>
    <CheckoutModal
      isOpen={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
      plan={selectedPlan}
      userEmail={user?.email || ''}
    />
    <div className="pricing-page-lumina">
      {/* Promo Banner */}
      <div className="pricing-promo-banner">
        <div className="promo-content">
          <span>{t('pricing.joinGetMinutes')}</span>
        </div>
        <div className="promo-badge">
          <img src="https://placehold.co/120x40/1a1a2e/3ECFB4?text=Seedance+2.5" alt="Seedance 2.5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="pricing-tabs">
        <button
          className={`pricing-tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          {t('pricing.plans')}
        </button>
        <button
          className={`pricing-tab ${activeTab === 'credits' ? 'active' : ''}`}
          onClick={() => setActiveTab('credits')}
        >
          {t('pricing.credits')}
        </button>
      </div>

      {/* Billing Toggle */}
      <div className="billing-toggle">
        <button
          className={`billing-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('yearly')}
        >
          {t('pricing.yearly')} <span className="discount-tag red">50% off</span>
        </button>
        <button
          className={`billing-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('monthly')}
        >
          {t('pricing.monthly')} <span className="discount-tag dark">80% CREDITS BONUS</span>
        </button>
        <button
          className={`billing-option ${billingPeriod === 'business' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('business')}
        >
          {t('pricing.business')} <span className="new-tag">New</span>
        </button>
      </div>

      {/* Terms Checkbox */}
      <div className="terms-checkbox">
        <label>
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
          />
          <span>{t('pricing.confirmAgreement')} <a href="#">{t('pricing.customerAgreement')}</a> {t('common.and', 'e')} <a href="#">{t('pricing.specialTerms')}</a></span>
        </label>
      </div>

      {/* Plans Grid */}
      {activeTab === 'plans' && (
        <div className="plans-grid-lumina">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card-lumina ${plan.highlight ? `highlight-${plan.highlight}` : ''}`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div className={`plan-top-badge ${plan.badgeColor}`}>
                  {plan.badge === 'Most Popular' && <span className="star">★</span>}
                  {plan.badge === 'Best Value' && <span className="star">★</span>}
                  {plan.badge === 'Most Popular' ? t('pricing.popular') :
                   plan.badge === 'Best Value' ? t('pricing.bestValue') :
                   plan.badge === 'Trial Experience' ? t('pricing.trialExperience') : plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="plan-header-lumina">
                <span className="plan-name-lumina">{plan.name}</span>
                {plan.discount && (
                  <span className={`plan-discount ${plan.discountColor}`}>{plan.discount}</span>
                )}
              </div>

              <p className="plan-tagline">{plan.tagline}</p>

              {/* Price */}
              <div className="plan-price-lumina">
                <span className="price-amount-lumina">{plan.price}</span>
                <span className="price-period-lumina">{plan.period}</span>
              </div>
              <p className="billed-text">{plan.billedText}</p>

              {/* CTA Button */}
              <button
                className={`plan-cta-lumina ${plan.ctaStyle || ''}`}
                onClick={() => handlePlanClick(plan)}
              >
                {plan.cta}
              </button>
              <p className="sub-cta">{plan.subCta}</p>

              {/* Bonus Section for Trial */}
              {plan.bonusSection && (
                <div className="bonus-section">
                  <div className="bonus-title">{plan.bonusSection.title}</div>
                  <div className="bonus-credits">
                    <span className="credits-icon">●</span>
                    <span className="credits-value">{plan.bonusSection.subtitle}</span>
                  </div>
                  <p className="per-credit">{plan.bonusSection.perCredit}</p>
                  <p className="usage-info">{plan.bonusSection.usage}</p>
                </div>
              )}

              {/* Credits Info */}
              {!plan.bonusSection && (
                <div className="credits-section">
                  <div className="credits-header">
                    {t('pricing.firstMonthCredits')} <span className="info-icon">○</span>
                  </div>
                  <div className="total-credits-value">{plan.totalCredits.toLocaleString()} <span className="info-icon">○</span></div>

                  <div className="credits-breakdown">
                    <div className="credit-row">
                      <span className="credit-icon">●</span>
                      <span className="credit-label">{t('pricing.baseCredits')}</span>
                      <span className="credit-value">{plan.baseCredits.toLocaleString()}</span>
                    </div>
                    <div className="credit-row">
                      <span className="credit-icon bonus">●</span>
                      <span className="credit-label">{t('pricing.monthlyBonus')}</span>
                      <span className="credit-value bonus">{plan.monthlyBonus.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Seedance Section */}
                  {plan.seedanceCredits > 0 && (
                    <div className="seedance-section">
                      <div className="seedance-header">
                        <span className="seedance-name">Seedance 2.5</span>
                        <span className="exclusive-badge">{t('pricing.exclusive')}</span>
                        <span className="limited-badge">{t('pricing.limitedTime')}</span>
                      </div>
                      <div className="seedance-credits">
                        <span className="seedance-icon">●</span>
                        <span className="seedance-value">{plan.seedanceCredits.toLocaleString()}</span>
                        <span className="info-icon">○</span>
                      </div>
                      <p className="seedance-time">{plan.seedanceTime}</p>
                    </div>
                  )}

                  {/* Promo */}
                  {plan.promoText && (
                    <div className="promo-box">
                      <span className="limited-tag">{t('pricing.limitedTime')}</span>
                      <p>{plan.promoText}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              <ul className="plan-features-lumina">
                {plan.features.map((feature, i) => (
                  <li key={i} className={feature.included ? 'included' : 'excluded'}>
                    {feature.included ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                    <span>{feature.text}</span>
                    {feature.badge && (
                      <span className={`feature-badge ${feature.badgeType}`}>{feature.badge}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Credits Grid */}
      {activeTab === 'credits' && (
        <div className="credits-grid-lumina">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.id} className={`credit-pack-card ${pack.popular ? 'popular' : ''}`}>
              {pack.popular && <div className="popular-badge">{t('pricing.popular')}</div>}

              <div className="credit-pack-header">
                <span className="credit-icon-large">●</span>
                <span className="credit-amount">{pack.credits.toLocaleString()}</span>
              </div>

              <div className="bonus-gift-section">
                <div className="bonus-gift-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 12 20 22 4 22 4 12"/>
                    <rect x="2" y="7" width="20" height="5"/>
                    <line x1="12" y1="22" x2="12" y2="7"/>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                  </svg>
                  {t('pricing.bonusGift')}
                </div>
                <div className="seedance-bonus">
                  <div className="seedance-bonus-header">
                    <span className="seedance-name">Seedance 2.5</span>
                    <span className="exclusive-tag">{t('pricing.exclusive')}</span>
                    <span className="limited-tag">{t('pricing.limitedTime')}</span>
                  </div>
                  <div className="seedance-bonus-credits">
                    <span className="seedance-icon">●</span>
                    <span className="seedance-value">{pack.seedanceCredits.toLocaleString()}</span>
                    <span className="info-icon">ⓘ</span>
                  </div>
                  <p className="seedance-time">{pack.seedanceTime}</p>
                </div>
              </div>

              <div className="credit-pack-price">{pack.price}</div>

              <div className="purchase-btn-wrapper">
                <button
                  className="purchase-btn"
                  onClick={() => {
                    if (!user) {
                      openLogin()
                    } else {
                      // Se l'utente non ha un abbonamento attivo, mostra messaggio
                      alert(t('pricing.activateFirst'))
                    }
                  }}
                >
                  {t('pricing.purchase')}
                </button>
                <div className="purchase-tooltip">
                  {t('pricing.activateFirst')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Section */}
      <div className="faq-section-lumina">
        <h2 className="faq-title-lumina">{t('pricing.faq.title')}</h2>
        <p className="faq-subtitle-lumina">{t('pricing.faq.subtitle')}</p>

        <div className="faq-list-lumina">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className={`faq-item-lumina ${expandedFaq === i ? 'expanded' : ''}`}
            >
              <button
                className="faq-question-lumina"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <span>{t(`pricing.faq.q${i}`)}</span>
                <span className="faq-icon">{expandedFaq === i ? '−' : '−'}</span>
              </button>
              {expandedFaq === i && (
                <div className="faq-answer-lumina">{t(`pricing.faq.a${i}`)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
