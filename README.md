# LUMIERE AI

Piattaforma professionale per la generazione di immagini e video con intelligenza artificiale.

---

## Stack Tecnologico

| Layer | Tecnologia | Provider (Prod) | Costo/mese |
|-------|------------|-----------------|------------|
| **Frontend** | React 18 + Vite + TypeScript | Cloudflare Pages | **€0 (FREE)** |
| **Backend** | FastAPI + SQLAlchemy | Render | **€0 (FREE)** |
| **Database** | PostgreSQL | Neon | **€0 (FREE)** |
| **Storage** | Object Storage S3-compatible | Cloudflare R2 | €0-10 |
| **Pagamenti** | Stripe | Stripe | 1.4% + €0.25 |
| **AI Video** | MiniMax H3 + Grok API + BytePlus API | Multi-provider | Variabile |
| **AI Immagini** | Seedream (default) + OpenAI GPT Image 2 | Multi-provider | Variabile |
| **Monitoring** | Error tracking + Analytics | Sentry + GA | €0-26 |

**Costi fissi iniziali**: **€0/mese** (tutti i servizi su Free Tier!)

---

## 🚀 DEPLOYMENT LIVE (v5.0 - Settembre 2026)

### URL di Produzione

| Servizio | URL | Stato |
|----------|-----|-------|
| **Frontend** | https://lumiere-ai.pages.dev | ✅ LIVE |
| **Backend** | https://lumiere-ai-6t4u.onrender.com | ✅ LIVE |
| **Database** | Neon PostgreSQL (Frankfurt) | ✅ Connesso |
| **Repository** | github.com/silvestrobruzzese-ui/lumiere-ai | ✅ Attivo |

### Funzionalità Online

- ✅ **Registrazione utenti** - Email + Password
- ✅ **Login** - JWT authentication
- ✅ **Database** - PostgreSQL su Neon
- ✅ **Frontend** - React su Cloudflare Pages
- ✅ **Backend API** - FastAPI su Render
- ⏳ **Google OAuth** - Da implementare
- ⏳ **Generazione AI** - In attesa API keys
- ⏳ **Pagamenti Stripe** - Da configurare

---

## Funzionalità Implementate

### Frontend
- [x] Home — Dashboard principale
- [x] Video Generation — Durata 4-30s, risoluzione 480p/720p/1080p, 7 aspect ratio
- [x] Image Generation — 7 modelli AI con prezzi differenziati (3-30 crediti), default Seedream 5.0 Lite
- [x] Pricing — 5 piani identici a Lumina (Trial, Basic, Standard, Advanced, Ultra)
- [x] Credits — Pacchetti crediti aggiuntivi (500-50000 crediti)
- [x] Login Modal — Email, Google OAuth (mock), IAM sub-account
- [x] Checkout Modal — Form pagamento con validazione
- [x] Header — Help, Language (EN/IT/ES/DE), Gift dropdown, User menu
- [x] Sidebar — Navigazione collassabile, Affiliate program, Social links
- [x] Badge Watermark — Indicatore per utenti Free/Trial (cliccabile → pricing)
- [x] Agent/Audio/Chat/AI Apps — Pagine placeholder

### Backend
- [x] Autenticazione — Registrazione, Login, JWT tokens
- [x] User Model — Email, password, credits, plan, plan_expires_at, trial_used
- [x] Generation Model — Storico generazioni con parametri
- [x] Smart Video Router — Selezione automatica API (Grok ≤15s, BytePlus >15s)
- [x] Smart Image Router — Prezzi per modello AI (Seedream, GPT, Nano Banana)
- [x] Watermark Service — Aggiunge "LUMIERE AI" per utenti Free/Trial
- [x] Calcolo crediti dinamico allineato con Lumina

---

## Smart Routing System

Il sistema sceglie automaticamente l'API migliore per **massimizzare i margini**. L'utente non vede quale AI viene usata.

```
┌─────────────────────────────────────────────────────────┐
│  UTENTE SELEZIONA:                                      │
│  • Durata: 5s / 10s / 15s / 20s / 25s / 30s            │
│  • Qualità: 480p / 720p / 1080p                        │
│  • Formato: 1:1 / 16:9 / 9:16 / 4:3 / 3:4 / 21:9       │
├─────────────────────────────────────────────────────────┤
│  SISTEMA DECIDE (ottimizzato per costi):                │
│                                                         │
│  IF durata ≤ 10s AND formato ≠ 21:9                    │
│     → MINIMAX H3 (più economico, €0.01-0.08/sec)       │
│                                                         │
│  IF durata 10-15s AND formato ≠ 21:9                   │
│     → GROK API (include audio gratis)                  │
│                                                         │
│  IF durata > 15s OR formato = 21:9                     │
│     → BYTEPLUS API (video lunghi, cinema)              │
└─────────────────────────────────────────────────────────┘
```

### Costi API Video (EUR) - Verificati Settembre 2026

| API | 480p | 720p | 1080p | Note |
|-----|------|------|-------|------|
| **MiniMax H3** | €0.074/sec | €0.074/sec | €0.120/sec | Più economico ≤10s |
| **Grok** | €0.074/sec | €0.129/sec | €0.230/sec | Include audio |
| **BytePlus Seedance** | €0.092/sec | €0.212/sec | - | Video lunghi |

*Fonti: platform.minimax.io, docs.x.ai, genrates.com*

### Costi API Immagini (EUR) - Verificati Settembre 2026

| API | Costo/img | Crediti | Note |
|-----|-----------|---------|------|
| MiniMax image-01 | €0.018 | 3 | Più economico |
| **Seedream 5.0 Lite** | **€0.024** | **4** | **DEFAULT** |
| Seedream 4.5 | €0.024 | 4 | Alternativa |
| Seedream 5.0 Pro | €0.041 | 9 | Alta qualità |
| Nano Banana Pro | €0.04 | 12 | Premium |
| Nano Banana 2 | €0.08 | 24 | Ultra premium |
| **Grok Aurora** | **€0.065** | **30** | **TOP (solo Trial)** |

*Fonti: byteplus.com, platform.minimax.io, x.ai*

---

## Tabella Crediti Video (allineati con Lumina)

| Durata | 480p | 720p | 1080p* | API Usata |
|--------|------|------|--------|-----------|
| 4s | **84** | 184 | 300 | Grok |
| 5s | 105 | 230 | 375 | Grok |
| 10s | 210 | 460 | 752 | Grok |
| 15s | 315 | 690 | 1128 | Grok |
| 20s | 420 | 920 | 1504 | BytePlus |
| 25s | 525 | 1150 | 1880 | BytePlus |
| 30s | 630 | 1380 | 2257 | BytePlus |

*1080p ha prezzo scontato (come su Lumina)

**Nota:** 84 crediti = crediti di benvenuto, sufficienti per 1 video 4s 480p

---

## Struttura Progetto

```
lumiere-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── config.py               # Environment settings
│   │   ├── db.py                   # SQLAlchemy database
│   │   ├── models.py               # User, Generation models (+ has_watermark)
│   │   ├── auth.py                 # JWT authentication
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── auth.py             # POST /api/auth/*
│   │   │   ├── video.py            # POST /api/generate/video (+ watermark tracking)
│   │   │   ├── image.py            # POST /api/generate/image (+ watermark auto)
│   │   │   ├── credits.py          # GET /api/credits
│   │   │   └── generations.py      # GET /api/generations
│   │   └── services/
│   │       ├── grok_api.py         # xAI Grok Imagine Video
│   │       ├── byteplus_api.py     # BytePlus Seedance
│   │       ├── stability_api.py    # Stability AI per immagini
│   │       ├── video_router.py     # Smart API routing video
│   │       ├── image_router.py     # Smart API routing immagini
│   │       └── watermark.py        # Watermark "LUMIERE AI" per Free/Trial
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Main app + routes
    │   ├── styles.css              # Global styles (+ watermark badge)
    │   ├── context/
    │   │   └── UserContext.tsx     # Auth state + hasWatermark
    │   ├── components/
    │   │   ├── Header.tsx          # Top navigation
    │   │   ├── Sidebar.tsx         # Side navigation
    │   │   ├── LoginModal.tsx      # Auth modal
    │   │   ├── CheckoutModal.tsx   # Payment modal
    │   │   ├── ModelSelector.tsx   # Selezione modello AI (+ credits)
    │   │   └── ...
    │   └── pages/
    │       ├── VideoPage.tsx       # Video generation (+ watermark badge)
    │       ├── ImagePage.tsx       # Image generation (+ watermark badge)
    │       ├── PricingPage.tsx     # Plans + Credits (5 piani Lumina)
    │       └── ...
    ├── index.html
    └── package.json
```

---

## Avvio Sviluppo

### Backend
```bash
cd lumiere-ai/backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Configura le API key
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd lumiere-ai/frontend
npm install
npm run dev                    # http://localhost:5173
```

---

## Configurazione Ambiente

Crea `backend/.env`:

```env
# ══════════════════════════════════════════
# DATABASE
# ══════════════════════════════════════════
DATABASE_URL=sqlite:///./lumiere.db
# Produzione: postgresql://user:pass@host:5432/lumiere

# ══════════════════════════════════════════
# SECURITY
# ══════════════════════════════════════════
JWT_SECRET=cambia-questa-chiave-segreta-in-produzione
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# ══════════════════════════════════════════
# AI GENERATION APIs
# ══════════════════════════════════════════
# Grok/xAI - Video ≤15s (economico, audio incluso)
# https://x.ai/api
GROK_API_KEY=xai-your-api-key

# BytePlus - Video >15s, formato 21:9 cinema
# https://console.byteplus.com
BYTEPLUS_ACCESS_KEY=your-access-key
BYTEPLUS_SECRET_KEY=your-secret-key

# ══════════════════════════════════════════
# PAYMENTS
# ══════════════════════════════════════════
# https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ══════════════════════════════════════════
# STORAGE (per video/immagini generati)
# ══════════════════════════════════════════
# AWS_ACCESS_KEY_ID=xxx
# AWS_SECRET_ACCESS_KEY=xxx
# AWS_S3_BUCKET=lumiere-ai-assets

# ══════════════════════════════════════════
# CACHE (opzionale)
# ══════════════════════════════════════════
# REDIS_URL=redis://localhost:6379
```

---

## API Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrazione utente |
| `POST` | `/api/auth/login` | Login, ritorna JWT |
| `GET` | `/api/auth/me` | Info utente corrente |
| `POST` | `/api/generate/video` | Avvia generazione video |
| `GET` | `/api/generate/video/status/{id}` | Polling stato generazione |
| `GET` | `/api/generate/video/credits` | Calcola crediti senza generare |
| `GET` | `/api/health` | Health check |

---

## 🚀 PROSSIMI STEP

### Step 1: Ottenere API Keys (PRIORITÀ)

| Servizio | Per cosa | URL | Variabile Render |
|----------|----------|-----|------------------|
| **Stripe** | Pagamenti | stripe.com | `STRIPE_SECRET_KEY` |
| **OpenAI** | GPT Image 2 | platform.openai.com | `OPENAI_API_KEY` |
| **Stability AI** | Seedream (default img) | platform.stability.ai | `STABILITY_API_KEY` |
| **MiniMax** | Hailuo video ≤10s | minimaxi.com | `MINIMAX_API_KEY` |
| **xAI** | Grok Aurora video 10-15s | x.ai | `GROK_API_KEY` |
| **BytePlus** | Seedance video >15s | console.byteplus.com | `BYTEPLUS_ACCESS_KEY`, `BYTEPLUS_SECRET_KEY` |

### Step 2: Configurare Variabili su Render

Vai su **Render Dashboard** → **lumiere-ai** → **Environment** e aggiungi:

```
# Già configurate ✅
DATABASE_URL=postgresql://...

# Da aggiungere ⏳
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OPENAI_API_KEY=sk-xxx
STABILITY_API_KEY=sk-xxx
MINIMAX_API_KEY=xxx
GROK_API_KEY=xai-xxx
BYTEPLUS_ACCESS_KEY=xxx
BYTEPLUS_SECRET_KEY=xxx
```

### Step 3: Completare Sviluppo
| Task | Descrizione | Stato |
|------|-------------|-------|
| Generazione Immagini | Collegare API Stability AI / OpenAI | ⏳ Da fare |
| Generazione Video | Collegare API MiniMax / Grok / BytePlus | ⏳ Da fare |
| Google OAuth | Implementare login con Google | ⏳ Da fare |
| Stripe Checkout | Collegare checkout a Stripe | ⏳ Da fare |
| Storage R2 | Salvare immagini/video generati | ⏳ Da fare |

### Step 3: Configurare Stripe Products
```
Su Stripe Dashboard > Products, crea:

1. Trial Plan
   - Price: €2.49 one-time
   - Metadata: credits=85, plan=trial

2. Basic Plan
   - Price: €24.99/month recurring
   - Metadata: credits=900, plan=basic

3. Standard Plan
   - Price: €59.99/month recurring
   - Metadata: credits=2100, plan=standard

4. Advanced Plan
   - Price: €124.99/month recurring
   - Metadata: credits=4400, plan=advanced

5. Ultra Plan
   - Price: €299.99/month recurring
   - Metadata: credits=10500, plan=ultra
```

### Step 4: Implementare Webhook Stripe
Creare endpoint `POST /api/stripe/webhook` che:
- Riceve eventi da Stripe
- Su `checkout.session.completed`: assegna crediti all'utente
- Su `invoice.paid`: rinnova crediti mensili
- Su `customer.subscription.deleted`: downgrade a free

### Step 5: Storage per Video Generati
```
Opzione A: AWS S3
- Crea bucket "lumiere-ai-assets"
- Configura CORS per il frontend
- Usa presigned URLs per upload/download

Opzione B: Cloudflare R2 (più economico)
- Stesso workflow di S3
- Compatibile con SDK AWS
```

### Step 6: Deploy
```
Frontend (Vercel):
1. npm run build
2. vercel deploy
3. Configura dominio

Backend (Railway):
1. Connetti repo GitHub
2. Aggiungi variabili ambiente
3. Deploy automatico su push

Database (Supabase/Neon):
1. Crea progetto PostgreSQL
2. Copia connection string
3. Aggiorna DATABASE_URL
```

---

## 📋 TODO Completo

### Fase 1: Fondamentali (Prima del lancio)
- [ ] Ottenere `GROK_API_KEY` da xAI
- [ ] Ottenere `BYTEPLUS_ACCESS_KEY` e `BYTEPLUS_SECRET_KEY`
- [ ] Creare account Stripe e prodotti
- [ ] Implementare webhook Stripe
- [ ] Configurare storage S3/R2
- [ ] Testare flusso completo: registrazione → pagamento → generazione → download

### Fase 2: Funzionalità Core
- [ ] Smart routing per generazione immagini
- [ ] Google OAuth reale (non mock)
- [ ] Email di conferma registrazione
- [ ] Email ricevuta pagamento
- [ ] Notifica "video pronto" (email o push)
- [ ] Galleria utente con storico
- [ ] Download video generati

### Fase 3: Database e Sicurezza
- [ ] Migrare da SQLite a PostgreSQL
- [ ] Implementare rate limiting
- [ ] Aggiungere CAPTCHA su registrazione
- [ ] Validazione input avanzata
- [ ] Logging errori (Sentry)

### Fase 4: Deploy Produzione
- [ ] Deploy frontend su Vercel
- [ ] Deploy backend su Railway/Render
- [ ] Configurare dominio `lumiere-ai.com`
- [ ] SSL/HTTPS
- [ ] Monitoraggio uptime

### Fase 5: Post-Lancio
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] A/B testing pricing
- [ ] Programma referral funzionante
- [ ] Support chat (Crisp, Intercom)
- [ ] FAQ e documentazione utente

---

## Piani Tariffari (Allineati con Lumina)

### Riepilogo Piani (Ottimizzati per 95% Break-Even)

| Piano | Prezzo | Crediti | Watermark | Target |
|-------|--------|---------|-----------|--------|
| **Free** | Gratis | 84 | **SI** | Test piattaforma |
| **Trial** | €2.49 / 3 giorni | 85 | NO | Nuovi utenti |
| **Basic** | €24.99 / mese | 900 | NO | Uso personale |
| **Standard** | €59.99 / mese | 2,100 | NO | Creatori |
| **Advanced** | €124.99 / mese | 4,400 | NO | Professionisti |
| **Ultra** | €299.99 / mese | 10,500 | NO | Aziende |

### Dettaglio Crediti per Piano

| Piano | Crediti Totali | Base | Bonus Mensile | Seedance 2.5 |
|-------|----------------|------|---------------|--------------|
| Free | 84 | 84 | - | - |
| Trial | 85 | 50 | +35 | - |
| Basic | 900 | 540 | 215 | 145 |
| Standard | 2,100 | 1,100 | 450 | 550 |
| Advanced | 4,400 | 2,400 | 1,200 | 800 |
| Ultra | 10,500 | 5,600 | 2,900 | 2,000 |

### Dettaglio Piani

#### Free (Registrazione)
- **Prezzo**: Gratis
- **Crediti**: 84 (una tantum alla registrazione)
- **Watermark**: SI (su immagini e video)
- **Caratteristiche**:
  - Accesso a tutti i modelli
  - Accesso alle funzionalità base
  - Con watermark "LUMIERE AI"

#### Trial (€2.49 / 3 giorni) - Specchietto per le Allodole
- **Prezzo**: €2.49 (pagamento una tantum, NON RINNOVABILE)
- **Durata**: 3 giorni
- **Crediti Totali**: 85
- **Modello ESCLUSIVO**: SOLO Grok Aurora (30 crediti/immagine) - qualità TOP fotorealismo
- **Immagini possibili**: ~2 immagini premium (85 ÷ 30 = 2.8)
- **Watermark**: NO
- **Caratteristiche**:
  - **SOLO modello Grok Aurora** (altri modelli bloccati)
  - Qualità TOP: skin texture, lighting, dettagli iper-realistici
  - Senza watermark
  - **ONE-TIME ONLY**: non può essere riacquistato
  - Dopo il Trial deve scegliere un piano mensile
- **Strategia Business**: L'utente vede la qualità massima possibile, ma può fare solo 2-3 immagini. Resta "con la voglia" e passa a un piano mensile per avere più crediti e accesso a tutti i modelli.

#### Basic (€24.99 / mese)
- **Prezzo**: €24.99/mese (fatturato mensilmente)
- **Crediti Primo Mese**: 900 totali
  - Base: 540
  - Bonus mensile: 215
  - Seedance 2.5 Exclusive: 145 (fino a 7 sec 480p)
- **Watermark**: NO
- **Caratteristiche**:
  - Rimuovi watermark dai download
  - Accesso a tutti i modelli
  - Accesso alle funzionalità base
  - Accesso a Canvas
  - Abbonamento auto-rinnovante

#### Standard (€59.99 / mese) - Most Popular
- **Prezzo**: €59.99/mese (fatturato mensilmente)
- **Sconto**: 49% off
- **Crediti Primo Mese**: 2,100 totali
  - Base: 1,100
  - Bonus mensile: 450
  - Seedance 2.5 Exclusive: 550 (fino a 26 sec 480p)
- **Watermark**: NO
- **Caratteristiche**:
  - Rimuovi watermark dai download
  - Accesso a tutti i modelli
  - Accesso a TUTTE le funzionalità
  - Accesso completo a Canvas & Canvas Pro
  - Abbonamento auto-rinnovante

#### Advanced (€124.99 / mese)
- **Prezzo**: €124.99/mese (fatturato mensilmente)
- **Sconto**: 48% off
- **Crediti Primo Mese**: 4,400 totali
  - Base: 2,400
  - Bonus mensile: 1,200
  - Seedance 2.5 Exclusive: 800 (fino a 38 sec 480p)
- **Watermark**: NO
- **Caratteristiche**:
  - Rimuovi watermark dai download
  - Accesso a tutti i modelli
  - Accesso a TUTTE le funzionalità
  - Accesso completo a Canvas & Canvas Pro
  - Abbonamento auto-rinnovante

#### Ultra (€299.99 / mese) - Best Value
- **Prezzo**: €299.99/mese (fatturato mensilmente)
- **Sconto**: 50% off
- **Crediti Primo Mese**: 10,500 totali
  - Base: 5,600
  - Bonus mensile: 2,900
  - Seedance 2.5 Exclusive: 2,000 (fino a 1 min 35 sec 480p)
- **Watermark**: NO
- **Caratteristiche**:
  - Rimuovi watermark dai download
  - Accesso anticipato a tutti i modelli (Exclusive)
  - Accesso anticipato a funzionalità AI avanzate (Exclusive)
  - Accesso completo a Canvas & Canvas Pro
  - Costo per credito più basso
  - Abbonamento auto-rinnovante

### Pacchetti Crediti Aggiuntivi

| Crediti | Prezzo | Seedance 2.5 Bonus | Tempo Video |
|---------|--------|-------------------|-------------|
| 200 | €6.99 | 30 | ~1.5 sec |
| 500 | €15.99 | 75 | ~3.5 sec |
| 1,000 | €29.99 | 150 | ~7 sec |
| 2,500 | €69.99 | 375 | ~18 sec |
| 5,000 | €129.99 | 750 | ~36 sec |
| 10,000 | €249.99 | 1,500 | ~71 sec |

**Nota**: I pacchetti crediti richiedono un abbonamento attivo per l'acquisto.

---

## 🎁 Crediti di Benvenuto

Alla registrazione ogni utente riceve **84 crediti gratuiti** per testare la piattaforma.

### Cosa puoi fare con 84 crediti (prezzi Lumina)

| Contenuto | Costo | Quantità possibile |
|-----------|-------|-------------------|
| **Video 4s 480p** | 84 crediti | **1 video** |
| **Immagine Seedream 5.0 Lite** | 4 crediti | **21 immagini** |
| **Immagine Seedream 5.0 Pro** | 9 crediti | **9 immagini** |
| **Immagine GPT Image 2** | 30 crediti | **2 immagini** |

#### Tabella Crediti Immagini per Modello AI

| Modello | Crediti | Note |
|---------|---------|------|
| MiniMax image-01 | 3 | Più economico |
| **Seedream 5.0 Lite** | **4** | **DEFAULT** |
| Seedream 4.5 | 4 | Alternativa |
| Seedream 5.0 Pro | 9 | Alta qualità |
| Nano Banana Pro | 12 | Premium |
| Nano Banana 2 | 24 | Ultra premium |
| **Grok Aurora** | **30** | **Solo Trial - TOP fotorealismo** |

L'utente può scegliere:
- **1 video** di 4 secondi a 480p (usa tutti gli 84 crediti)
- **OPPURE 21 immagini** con Seedream 5.0 Lite (usa 84 crediti)
- **OPPURE 9 immagini** con Seedream 5.0 Pro (usa 81 crediti)

### Comportamento

```
┌─────────────────────────────────────────────────────────┐
│  UTENTE REGISTRATO (84 crediti)                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OPZIONE A: Crea 1 video                                │
│  → Video 4s 480p = 84 crediti                           │
│  → Crediti rimanenti: 0                                 │
│  → Prossimo click → Modal abbonamento                   │
│                                                         │
│  OPZIONE B: Crea 21 immagini (Seedream Lite)            │
│  → 21 × Immagine Lite = 84 crediti                      │
│  → Crediti rimanenti: 0                                 │
│  → Prossima immagine → Modal abbonamento                │
│                                                         │
│  OPZIONE C: Crea 9 immagini (Seedream Pro)              │
│  → 9 × Immagine Pro = 81 crediti                        │
│  → Crediti rimanenti: 3                                 │
│  → 10ª immagine → Modal abbonamento                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  SE SELEZIONA MODELLO PIÙ COSTOSO:                      │
│  → GPT Image 2 = 30 crediti                             │
│  → Con 84 crediti può creare solo 2 immagini            │
│                                                         │
│  SE AUMENTA RISOLUZIONE/DURATA VIDEO:                   │
│  → Video 4s 720p = 184 crediti (ha solo 84)             │
│  → Click "Genera" → Modal abbonamento immediato         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🤝 Programma Referral

LUMIERE AI offre un programma referral per premiare gli utenti che invitano amici a usare i nostri **generatori AI Video e Immagini**.

### Tool Sponsorizzabili

Il programma referral è attivo **esclusivamente** per:
- **AI Video Generator** - lumiere-ai.com/video?ref=CODICE
- **AI Image Generator** - lumiere-ai.com/image?ref=CODICE

> **Nota**: Canvas, Audio e altri tool non fanno parte del programma referral.

### Struttura Premi

| Evento | Tu Ricevi | L'Amico Riceve |
|--------|-----------|----------------|
| **L'amico si registra** | +50 credits | +50 credits |
| **L'amico si abbona (1° volta)** | +100 credits | - |
| **L'amico rinnova abbonamento** | 10% del piano in credits | - |

### Premio Ricorrente (10%)

Ogni volta che un amico invitato rinnova il proprio abbonamento, ricevi il 10% del valore del piano in crediti:

| Piano Amico | Prezzo | Tu Ricevi (10%) |
|-------------|--------|-----------------|
| Basic | €24.99/mese | ~2.5 credits/mese |
| Standard | €59.99/mese | ~6 credits/mese |
| Advanced | €124.99/mese | ~12.5 credits/mese |
| Ultra | €299.99/mese | ~30 credits/mese |

**Nota**: I premi ricorrenti vengono accreditati mensilmente finché l'amico rimane abbonato.

### Come Funziona

1. **Condividi il tuo link** - Vai alla pagina Referral e copia il link per Video AI o Image AI
2. **L'amico si registra** - Quando qualcuno usa il tuo link, entrambi ricevete 50 credits
3. **L'amico si abbona** - Guadagni 100 credits extra al primo abbonamento
4. **Premi ricorrenti** - Continui a guadagnare il 10% ad ogni rinnovo, per sempre!

### Accesso al Programma

- **Header**: Clicca sull'icona regalo → "Invita amici, ottieni crediti"
- **Sidebar**: Clicca su "Affiliati" nel menu laterale
- **Home page**: Sezione "Guadagna Crediti con Video e Immagini AI"
- **URL diretto**: `/referral`

### Dashboard Referral

La pagina referral mostra:
- Link referral per AI Video Generator e AI Image Generator
- Pulsanti di condivisione social (WhatsApp, Twitter, Facebook, LinkedIn, Email)
- Statistiche: click, registrazioni, abbonamenti, crediti guadagnati
- Crediti in sospeso (pagati al ciclo successivo)

### Termini

- I crediti vengono accreditati entro 24 ore
- L'auto-referral non è consentito
- I premi sono soggetti ai Termini di Servizio
- Il programma è valido solo per Video AI e Image AI

---

## 📝 Stato Sviluppo

**Riferimento Lumina:** https://ai.byteplus.com/lumina/en/model/video?mode=video
**Account Lumina:** brugia69@gmail.com

### Completato ✅
- [x] Crediti video allineati con Lumina (4s-30s × 480p/720p/1080p)
- [x] Crediti immagini per modello AI (4-30 crediti)
- [x] Piani abbonamento identici a Lumina (Trial, Basic, Standard, Advanced, Ultra)
- [x] Sistema watermark per utenti Free/Trial
- [x] UI completa (VideoPage, ImagePage, PricingPage)
- [x] Crediti di benvenuto: 84

### In Corso 🔄
- [ ] Calcolo margini di profitto con API reali
- [ ] Integrazione API generazione (Stability AI, etc.)

---

## 💰 Analisi Costi e Ricavi (v2.1 - Verificata)

> **IMPORTANTE**: Questa analisi è basata sui dati reali della piattaforma e sui listini API ufficiali verificati a Settembre 2026.

### 🏗️ Costi Infrastruttura Hosting

#### Frontend - Vercel

| Piano | Prezzo/mese | Caratteristiche |
|-------|-------------|-----------------|
| Hobby (Free) | €0 | Uso personale, 100GB bandwidth |
| **Pro** | **€20/membro** | Team, analytics, 1TB bandwidth |
| Enterprise | Custom | SLA, supporto dedicato |

**Raccomandato**: Pro - €20/mese

#### Backend - Railway

| Piano | Prezzo/mese | Caratteristiche |
|-------|-------------|-----------------|
| Hobby | €5 + usage | 512MB RAM, 1 vCPU, 5GB storage |
| **Pro** | **€20 + usage** | 8GB RAM, 8 vCPU, 100GB storage |
| Enterprise | Custom | Risorse dedicate |

**Usage stimato**: €10-15/mese per FastAPI con traffico moderato
**Raccomandato**: Pro - €35/mese (€20 base + €15 usage)

#### Database - Neon PostgreSQL

| Piano | Prezzo/mese | Caratteristiche |
|-------|-------------|-----------------|
| Free | €0 | 0.5GB storage, 1 progetto |
| **Launch** | **€19** | 10GB storage, branching |
| Scale | €69 | 50GB storage, autoscaling |

**Raccomandato**: Launch - €19/mese

#### Storage - Cloudflare R2

| Risorsa | Prezzo | Note |
|---------|--------|------|
| Storage | €0.015/GB/mese | Primi 10GB gratuiti |
| Operazioni Class A | €4.50/milione | PUT, POST, LIST |
| Operazioni Class B | €0.36/milione | GET, HEAD |
| **Egress** | **€0** | Gratuito (vantaggio vs S3) |

**Stima**: €10/mese per 100GB storage + 500k operazioni

#### Servizi Aggiuntivi

| Servizio | Provider | Piano | Costo/mese |
|----------|----------|-------|------------|
| Dominio (.com) | Cloudflare | Annuale | €1.25 |
| SSL Certificate | Cloudflare/Vercel | Incluso | €0 |
| Email Transazionali | Resend | Free tier | €0 |
| Error Monitoring | Sentry | Team | €26 |
| Analytics | Google Analytics | Free | €0 |

#### Commissioni Stripe

| Zona | Commissione | Esempio (€59.99) |
|------|-------------|------------------|
| Europa | 1.4% + €0.25 | €1.09 (1.8%) |
| Non-Europa | 2.9% + €0.25 | €1.99 (3.3%) |

### 📊 Riepilogo Costi Fissi Mensili

| Categoria | Minimo | Raccomandato | Premium |
|-----------|--------|--------------|---------|
| **Infrastruttura** | | | |
| Frontend (Vercel) | €0 | €20 | €40 |
| Backend (Railway) | €15 | €35 | €70 |
| Database (Neon) | €0 | €19 | €69 |
| Storage (R2) | €5 | €10 | €30 |
| **Servizi** | | | |
| Dominio | €1 | €1 | €1 |
| Monitoring (Sentry) | €0 | €26 | €26 |
| Email (Resend) | €0 | €0 | €20 |
| **TOTALE** | **€21** | **€111** | **€256** |

### 🎯 Proiezioni Break-Even

#### Copertura Costi Fissi (€111/mese)

| Piano | Prezzo | Margine 100% | Utenti per Break-Even |
|-------|--------|--------------|----------------------|
| Basic | €24.99 | €19.83 | **6 utenti** |
| Standard | €59.99 | €47.96 | **3 utenti** |
| Advanced | €124.99 | €99.78 | **2 utenti** |
| Ultra | €299.99 | €239.82 | **1 utente** |

#### Scenario Mix Utenti Realistico

Distribuzione tipica: 50% Basic, 30% Standard, 15% Advanced, 5% Ultra

| Utenti Totali | Margine Totale | Profitto Netto |
|---------------|----------------|----------------|
| 3 | ~€150 | ~€39/mese |
| 5 | ~€250 | ~€139/mese |
| 10 | ~€500 | ~€389/mese |
| 20 | ~€1.000 | ~€889/mese |
| 50 | ~€2.500 | ~€2.389/mese |
| 100 | ~€5.000 | ~€4.889/mese |

**Break-Even**: ~3 utenti paganti con mix standard

---

### Costi API Verificati (Fonti Ufficiali)

#### Video - MiniMax Hailuo H3
*Fonte: platform.minimax.io*

| Risoluzione | Costo/Secondo | Video 5s | EUR |
|-------------|---------------|----------|-----|
| 768p | $0.08/sec | $0.40 | €0.37 |
| 2K | $0.13/sec | $0.65 | €0.60 |

#### Video - Grok/xAI Imagine Video 1.5
*Fonte: docs.x.ai*

| Risoluzione | Costo/Secondo | Video 10s | EUR |
|-------------|---------------|-----------|-----|
| 480p | $0.08/sec | $0.80 | €0.74 |
| 720p | $0.14/sec | $1.40 | €1.29 |
| 1080p | $0.25/sec | $2.50 | €2.30 |

#### Video - BytePlus Seedance 2.5
*Fonte: genrates.com/providers/byteplus*

| Risoluzione | Costo/Secondo | Video 30s | EUR |
|-------------|---------------|-----------|-----|
| 480p | $0.10/sec | $3.00 | €2.76 |
| 720p | $0.23/sec | $6.90 | €6.35 |

#### Immagini
*Fonti: byteplus.com, platform.minimax.io, OpenAI*

| Modello | Costo USD | Costo EUR | Note |
|---------|-----------|-----------|------|
| MiniMax image-01 | $0.02 | €0.018 | Miglior rapporto |
| Seedream 5.0 Pro | $0.045 | €0.041 | Alta qualità |
| Seedream 5.0 Lite | $0.035 | €0.032 | Economico |
| GPT-image-2 | $0.04-0.12 | €0.04-0.11 | Token-based |

### Conversione Credits (Valori Effettivi)

| Tipo | Credits | Costo API | Costo/Credito |
|------|---------|-----------|---------------|
| Immagine MiniMax | 3 | €0.018 | €0.006 |
| **Immagine Seedream Lite (DEFAULT)** | **4** | **€0.024** | **€0.006** |
| Immagine Seedream Pro | 9 | €0.041 | €0.00456 |
| Immagine Grok Aurora (Trial) | 30 | €0.065 | €0.00217 |
| Video 5s 480p (MiniMax) | 105 | €0.37 | €0.00352 |
| Video 5s 720p (Grok) | 230 | €0.645 | €0.0028 |
| Video 20s 480p (BytePlus) | 420 | €1.84 | €0.00438 |
| Video 30s 480p (BytePlus) | 630 | €2.76 | €0.00438 |

**Costo medio ponderato**: €0.005/credito (con Seedream Lite default)

### ✅ Analisi Margini per Piano (v4.0 - Ottimizzata)

> **MARGINI VERIFICATI**: Calcolo basato sul costo reale per credito con Seedream 5.0 Lite come default.

#### Calcolo Costo Reale per Credito

**Immagini (Seedream 5.0 Lite - DEFAULT):**
- Costo API: €0.024 / 4 crediti = **€0.006/credito**

**Immagini (Grok Aurora - Solo Trial):**
- Costo API: €0.065 / 30 crediti = €0.00217/credito

**Video 5s 480p (MiniMax - auto-routing):**
- Costo API: 5 × €0.074 = €0.37
- Crediti: 105
- Costo: €0.00352/credito

**Video 20s 480p (BytePlus - auto-routing):**
- Costo API: 20 × €0.092 = €1.84
- Crediti: 420
- Costo: €0.00438/credito

**Costo medio ponderato (70% img Seedream Lite, 25% video brevi, 5% video lunghi):**
- **€0.005/credito** (migliorato rispetto a v3.0)

#### Trial (85 credits, €2.49) - SOLO Grok Aurora

| Utilizzo | Credits Usati | Costo API | Margine | % |
|----------|---------------|-----------|---------|---|
| 50% | 43 | €0.09 | €2.40 | **96%** |
| 70% | 60 | €0.13 | €2.36 | **95%** |
| 100% | 85 | €0.18 | €2.31 | **93%** |

*Nota: Trial usa solo Grok Aurora (€0.00217/credito)*

#### Basic (900 credits, €24.99)

| Utilizzo | Credits Usati | Costo API | Margine | % |
|----------|---------------|-----------|---------|---|
| 50% | 450 | €2.25 | €22.74 | **91%** |
| 70% | 630 | €3.15 | €21.84 | **87%** |
| 100% | 900 | €4.50 | €20.49 | **82%** |

#### Standard (2.100 credits, €59.99)

| Utilizzo | Credits Usati | Costo API | Margine | % |
|----------|---------------|-----------|---------|---|
| 50% | 1.050 | €5.25 | €54.74 | **91%** |
| 70% | 1.470 | €7.35 | €52.64 | **88%** |
| 100% | 2.100 | €10.50 | €49.49 | **82%** |

#### Advanced (4.400 credits, €124.99)

| Utilizzo | Credits Usati | Costo API | Margine | % |
|----------|---------------|-----------|---------|---|
| 50% | 2.200 | €11.00 | €113.99 | **91%** |
| 70% | 3.080 | €15.40 | €109.59 | **88%** |
| 100% | 4.400 | €22.00 | €102.99 | **82%** |

#### Ultra (10.500 credits, €299.99)

| Utilizzo | Credits Usati | Costo API | Margine | % |
|----------|---------------|-----------|---------|---|
| 50% | 5.250 | €26.25 | €273.74 | **91%** |
| 70% | 7.350 | €36.75 | €263.24 | **88%** |
| 100% | 10.500 | €52.50 | €247.49 | **82%** |

### Riepilogo Margini (100% Utilizzo)

| Piano | Prezzo | Credits | Costo API | Margine | % |
|-------|--------|---------|-----------|---------|---|
| Trial | €2.49 | 85 | €0.18 | €2.31 | **93%** |
| Basic | €24.99 | 900 | €4.50 | €20.49 | **82%** |
| Standard | €59.99 | 2.100 | €10.50 | €49.49 | **82%** |
| Advanced | €124.99 | 4.400 | €22.00 | €102.99 | **82%** |
| Ultra | €299.99 | 10.500 | €52.50 | €247.49 | **82%** |

### Conclusioni

#### ✅ Margini Eccellenti (v4.0 Ottimizzata)

1. **Margine 82% al 100% utilizzo**: Anche se l'utente usa tutti i crediti, il margine rimane >80%
2. **Margine 87-88% al 70% utilizzo**: Scenario realistico con margini ancora più alti
3. **Margine 91% al 50% utilizzo**: Utenti occasionali generano margini elevatissimi
4. **Trial al 93%**: Il modello Grok Aurora è molto efficiente (€0.00217/credito)
5. **Zero rischio di perdita**: Nessun piano va in negativo, nemmeno al 100% di utilizzo

#### 📊 Profitto per Piano (100% utilizzo)

| Piano | Profitto Lordo | Profitto Annuale (per utente) |
|-------|----------------|-------------------------------|
| Trial | €2.31 | €2.31 (one-time) |
| Basic | €20.49 | €245.88 |
| Standard | €49.49 | €593.88 |
| Advanced | €102.99 | €1.235.88 |
| Ultra | €247.49 | €2.969.88 |

#### 📋 Note

- Costo medio per credito: **€0.005** (ottimizzato con Seedream Lite default)
- Mix utilizzo: 70% immagini, 25% video brevi, 5% video lunghi
- **Trial**: Solo Grok Aurora (30 crediti/img) = ~2-3 immagini TOP quality
- **Altri piani**: Seedream 5.0 Lite default (4 crediti/img), utente può scegliere modelli premium

---

## 🛠️ Prossimi Step Tecnici

### FASE 1: API Integration (Priorità Alta)

#### 1.1 Scegliere API Immagini
```
Opzioni:
A) Stability AI (consigliato)
   - Registra: https://platform.stability.ai
   - Ottieni API key
   - Costo: ~$0.002-0.006/immagine

B) Replicate (alternativa)
   - Registra: https://replicate.com
   - Supporta molti modelli
   - Pay-per-use
```

#### 1.2 Scegliere API Video
```
Opzioni:
A) Runway (qualità top)
   - Registra: https://runwayml.com
   - Gen-3 Alpha/Turbo
   - ~$0.05/secondo

B) Stability AI Video
   - Stable Video Diffusion
   - Più economico

C) BytePlus (come Lumina)
   - https://console.byteplus.com
   - Seedance models
```

#### 1.3 Implementare Servizi Backend
```python
# File da creare/modificare:
backend/app/services/
├── stability_api.py     # API Stability AI per immagini
├── runway_api.py        # API Runway per video
├── image_router.py      # Smart routing immagini ✅ (da collegare)
└── video_router.py      # Smart routing video ✅ (da collegare)
```

### FASE 2: Pagamenti Stripe

#### 2.1 Setup Stripe
```bash
# 1. Crea account Stripe
https://dashboard.stripe.com/register

# 2. Ottieni API keys
Dashboard > Developers > API keys

# 3. Aggiungi a .env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### 2.2 Creare Prodotti Stripe
```
Dashboard > Products > Add product

Trial:
- Name: "Trial - 3 Days"
- Price: $0.99 (one-time)
- Metadata: plan=trial, credits=299

Basic:
- Name: "Basic Monthly"
- Price: $9/month (recurring)
- Metadata: plan=basic, credits=1510

Standard:
- Name: "Standard Monthly"
- Price: $29/month (recurring)
- Metadata: plan=standard, credits=5700

Advanced:
- Name: "Advanced Monthly"
- Price: $49/month (recurring)
- Metadata: plan=advanced, credits=9400

Ultra:
- Name: "Ultra Monthly"
- Price: $239/month (recurring)
- Metadata: plan=ultra, credits=48000
```

#### 2.3 Implementare Webhook
```python
# backend/app/routers/stripe.py
POST /api/stripe/webhook

Eventi da gestire:
- checkout.session.completed → Assegna crediti
- invoice.paid → Rinnova crediti mensili
- customer.subscription.deleted → Downgrade a free
- customer.subscription.updated → Cambio piano
```

### FASE 3: Storage & Download

#### 3.1 Setup Cloudflare R2 (consigliato)
```bash
# Più economico di S3, compatibile S3

1. Crea account Cloudflare
2. Dashboard > R2 > Create bucket
3. Nome: lumiere-ai-assets
4. Ottieni Access Key ID e Secret
5. Aggiungi a .env:
   R2_ACCESS_KEY_ID=xxx
   R2_SECRET_ACCESS_KEY=xxx
   R2_BUCKET=lumiere-ai-assets
   R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
```

#### 3.2 Implementare Upload/Download
```python
# backend/app/services/storage.py
- upload_image(image_base64) → URL
- upload_video(video_data) → URL
- generate_download_url(path) → Presigned URL
```

### FASE 4: Deploy

#### 4.1 Frontend (Vercel)
```bash
cd frontend
npm run build
npx vercel --prod

# Configura dominio: lumiere-ai.com
```

#### 4.2 Backend (Railway)
```bash
# 1. Connetti repo GitHub
# 2. Aggiungi variabili ambiente
# 3. Deploy automatico
```

#### 4.3 Database (Neon/Supabase)
```bash
# PostgreSQL managed
# Copia connection string in DATABASE_URL
```

---

## 📋 Checklist Completa

### Pre-Lancio
- [ ] **API Keys**
  - [ ] Stability AI API key
  - [ ] Runway/BytePlus API key
  - [ ] Stripe API keys
  - [ ] Cloudflare R2 credentials

- [ ] **Backend**
  - [ ] Collegare API immagini reali
  - [ ] Collegare API video reali
  - [ ] Implementare Stripe checkout
  - [ ] Implementare Stripe webhook
  - [ ] Implementare storage R2
  - [ ] Implementare download con watermark per free/trial

- [ ] **Frontend**
  - [ ] Collegare checkout a Stripe
  - [ ] Mostrare storico generazioni
  - [ ] Implementare download reale
  - [ ] Google OAuth reale

- [ ] **Test**
  - [ ] Flow completo: registrazione → generazione → watermark
  - [ ] Flow pagamento: checkout → crediti assegnati
  - [ ] Flow abbonamento: rinnovo automatico

### Post-Lancio
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] Monitoring (Sentry per errori)
- [ ] Email transazionali (conferma, ricevute)
- [ ] Support chat (Crisp/Intercom)

---

## Licenza

Proprietario - Tutti i diritti riservati

---

**LUMIERE AI** — Illumina la tua creatività con l'intelligenza artificiale.

---

## 📜 Changelog

### v5.0 - 13 Settembre 2026
- ✅ **Deploy LIVE** su Cloudflare Pages + Render + Neon
- ✅ **Costo €0/mese** - Tutti i servizi su Free Tier
- ✅ **Registrazione/Login funzionante** con JWT
- ✅ **Database PostgreSQL** connesso
- 🔄 **Prossimo**: Configurare API keys per generazione AI

### v4.1 - 12 Settembre 2026
- Ottimizzazione costi: Cloudflare Pages invece di Vercel
- Analisi margini: 82% al 100% utilizzo

### v4.0 - 11 Settembre 2026
- Seedream 5.0 Lite come default
- Smart routing video (MiniMax/Grok/BytePlus)

---

*Ultimo aggiornamento: 13 Settembre 2026*
*Deployment: v5.0 - LIVE (€0/mese startup cost)*
