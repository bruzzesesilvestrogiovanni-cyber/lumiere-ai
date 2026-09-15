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
| **AI Chat** | NVIDIA NIM LLM | NVIDIA | **€0 (FREE)** |
| **AI Video** | MiniMax H3 + Grok API + BytePlus API | Multi-provider | Pay-as-you-go |
| **AI Immagini** | Stability AI + MiniMax + Grok Aurora | Multi-provider | Pay-as-you-go |
| **Monitoring** | Error tracking + Analytics | Sentry + GA | €0-26 |

**Costi fissi iniziali**: **€0/mese** (tutti i servizi su Free Tier!)

---

## DEPLOYMENT LIVE (v6.1 - Settembre 2026)

### URL di Produzione

| Servizio | URL | Stato |
|----------|-----|-------|
| **Frontend** | https://lumiere-ai.pages.dev | ✅ LIVE |
| **Backend** | https://lumiere-ai-6t4u.onrender.com | ✅ LIVE |
| **Database** | Neon PostgreSQL (Frankfurt) | ✅ Connesso |
| **Repository** | github.com/bruzzesesilvestrogiovanni-cyber/lumiere-ai | ✅ Attivo |

### Dashboard Account

| Servizio | Dashboard | Note |
|----------|-----------|------|
| **Cloudflare Pages** | https://dash.cloudflare.com | Frontend hosting |
| **Render** | https://dashboard.render.com | Backend hosting |
| **Neon** | https://console.neon.tech | Database PostgreSQL |
| **GitHub** | https://github.com/bruzzesesilvestrogiovanni-cyber/lumiere-ai | Repository codice |
| **NVIDIA Build** | https://build.nvidia.com | Chat LLM API |
| **MiniMax** | https://www.minimaxi.com | Video/Image API |
| **Stability AI** | https://platform.stability.ai | Image API |

### Funzionalità Online

- ✅ **Registrazione utenti** - Email + Password
- ✅ **Login** - JWT authentication
- ✅ **Google OAuth** - Login con Google
- ✅ **Database** - PostgreSQL su Neon
- ✅ **Frontend** - React su Cloudflare Pages
- ✅ **Backend API** - FastAPI su Render
- ✅ **AI Chat** - NVIDIA LLM (llama-3.2-11b) GRATUITO
- ✅ **MiniMax API** - Video + Immagini configurato
- ✅ **Stability AI** - Immagini Seedream configurato
- ⏳ **BytePlus API** - In configurazione
- ✅ **Grok/xAI API** - Video (10-15s con audio) + Immagini Aurora
- ⏳ **Pagamenti Stripe** - Da configurare

---

## Variabili Ambiente Render

### Configurate ✅

| Variabile | Servizio | Stato |
|-----------|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL | ✅ |
| `JWT_SECRET` | Auth | ✅ |
| `CORS_ORIGINS` | CORS | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | ✅ |
| `FRONTEND_URL` | OAuth Redirect | ✅ |
| `NVIDIA_API_KEY` | Chat LLM (FREE) | ✅ |
| `MINIMAX_API_KEY` | Video + Immagini | ✅ |
| `STABILITY_API_KEY` | Immagini Seedream | ✅ |
| `GROK_API_KEY` | xAI Grok Video + Aurora | ✅ |

### Da Configurare ⏳

| Variabile | Servizio | Note |
|-----------|----------|------|
| `BYTEPLUS_ACCESS_KEY` | BytePlus Seedance | In registrazione |
| `BYTEPLUS_SECRET_KEY` | BytePlus Seedance | In registrazione |
| `BYTEPLUS_API_KEY` | BytePlus Seedance | In registrazione |
| `STRIPE_SECRET_KEY` | Pagamenti | Da configurare |
| `STRIPE_WEBHOOK_SECRET` | Pagamenti | Da configurare |

---

## API Endpoints

| Metodo | Endpoint | Descrizione | Stato |
|--------|----------|-------------|-------|
| `POST` | `/api/auth/register` | Registrazione utente | ✅ |
| `POST` | `/api/auth/login` | Login, ritorna JWT | ✅ |
| `GET` | `/api/auth/me` | Info utente corrente | ✅ |
| `GET` | `/api/auth/google` | Google OAuth redirect | ✅ |
| `GET` | `/api/auth/google/callback` | Google OAuth callback | ✅ |
| `POST` | `/api/chat` | Chat AI (NVIDIA LLM) | ✅ |
| `GET` | `/api/chat/models` | Modelli chat disponibili | ✅ |
| `POST` | `/api/generate/image` | Genera immagine | ✅ |
| `GET` | `/api/generate/image/credits` | Calcola crediti immagine | ✅ |
| `POST` | `/api/generate/video` | Avvia generazione video | ✅ |
| `GET` | `/api/generate/video/status/{id}` | Polling stato generazione | ✅ |
| `GET` | `/api/generate/video/credits` | Calcola crediti video | ✅ |
| `GET` | `/api/health` | Health check | ✅ |

---

## Modelli AI Disponibili

### Chat (NVIDIA - GRATUITO)

| Modello | ID | Note |
|---------|-----|------|
| **Llama 3.2 11B** | `llama-3.2-11b` | Default, veloce |
| **Llama 3.2 90B** | `llama-3.2-90b` | Più potente |
| **Mistral Large** | `mistral-large` | Alternativa |
| **Gemma 3 12B** | `gemma-3-12b` | Google |

### Immagini (Pay-as-you-go)

| Modello | Crediti | API | Stato |
|---------|---------|-----|-------|
| MiniMax image-01 | 3 | MiniMax | ✅ Configurato |
| **Seedream 5.0 Lite** | **4** | Stability | ✅ **DEFAULT** |
| Seedream 4.5 | 4 | Stability | ✅ Configurato |
| Seedream 5.0 Pro | 9 | Stability | ✅ Configurato |
| Grok Aurora | 30 | xAI | ✅ Configurato |

### Video (Pay-as-you-go)

| Durata | Risoluzione | API | Crediti | Stato |
|--------|-------------|-----|---------|-------|
| ≤10s | 480p-1080p | MiniMax | 84-752 | ✅ Configurato |
| 10-15s | 480p-1080p | Grok | 210-1128 | ✅ Configurato (audio incluso) |
| >15s / 21:9 | 480p-720p | BytePlus | 315-1380 | ⏳ In config |

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

---

## Struttura Progetto

```
lumiere-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── config.py               # Environment settings
│   │   ├── db.py                   # SQLAlchemy database
│   │   ├── models.py               # User, Generation models
│   │   ├── auth.py                 # JWT authentication
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── auth.py             # POST /api/auth/* + Google OAuth
│   │   │   ├── chat.py             # POST /api/chat (NVIDIA LLM)
│   │   │   ├── video.py            # POST /api/generate/video
│   │   │   ├── image.py            # POST /api/generate/image
│   │   │   ├── credits.py          # GET /api/credits
│   │   │   └── generations.py      # GET /api/generations
│   │   └── services/
│   │       ├── nvidia_api.py       # NVIDIA NIM Chat (FREE)
│   │       ├── grok_api.py         # xAI Grok video/images
│   │       ├── byteplus_api.py     # BytePlus Seedance
│   │       ├── minimax_api.py      # MiniMax H3 video/images
│   │       ├── stability_api.py    # Stability AI images
│   │       ├── video_router.py     # Smart API routing video
│   │       ├── image_router.py     # Smart API routing images
│   │       └── watermark.py        # Watermark per Free/Trial
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Main app + routes
    │   ├── api.ts                  # API client
    │   ├── styles.css              # Global styles
    │   ├── context/
    │   │   └── UserContext.tsx     # Auth state + Google OAuth
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── LoginModal.tsx      # Email + Google OAuth
    │   │   └── ...
    │   └── pages/
    │       ├── ChatPage.tsx        # AI Chat (NVIDIA)
    │       ├── VideoPage.tsx
    │       ├── ImagePage.tsx
    │       ├── AIAppsPage.tsx
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

## TODO - Cose da Fare

### 🔴 Priorità Alta (Blockers)

| # | Task | Stato | Note |
|---|------|-------|------|
| 1 | **Completare registrazione BytePlus** | ⏳ In corso | Account business per video lunghi (>15s) e formato 21:9 |
| 2 | **Aggiungere chiavi BytePlus su Render** | ⏳ Attesa | `BYTEPLUS_ACCESS_KEY`, `BYTEPLUS_SECRET_KEY`, `BYTEPLUS_API_KEY` |
| 3 | ~~Riprovare pagamento Grok/xAI~~ | ✅ Fatto | Chiave ottenuta |
| 4 | ~~Aggiungere chiave Grok su Render~~ | ✅ Fatto | `GROK_API_KEY` configurata |
| 5 | **Configurare Stripe** | ⏳ Da fare | Account, API keys, webhook, piani abbonamento |

### 🟡 Priorità Media (Funzionalità)

| # | Task | Stato | Note |
|---|------|-------|------|
| 6 | **Testare generazione immagini** | ⏳ Da fare | MiniMax image-01 + Stability Seedream |
| 7 | **Testare generazione video** | ⏳ Da fare | MiniMax H3 (≤10s) |
| 8 | **Implementare storage R2** | ⏳ Da fare | Cloudflare R2 per salvare/scaricare media generati |
| 9 | **Sistema crediti utente** | ⏳ Da fare | Tracciamento crediti, acquisto pacchetti |
| 10 | **Pagina profilo utente** | ⏳ Da fare | Visualizza crediti, storico generazioni, impostazioni |
| 11 | **Galleria generazioni** | ⏳ Da fare | Storico immagini/video generate dall'utente |

### 🟢 Priorità Bassa (Nice to Have)

| # | Task | Stato | Note |
|---|------|-------|------|
| 12 | **Google Analytics** | ⏳ Da fare | Tracciamento visite e conversioni |
| 13 | **Sentry Error Monitoring** | ⏳ Da fare | Tracciamento errori frontend/backend |
| 14 | **Email transazionali** | ⏳ Da fare | Conferma registrazione, reset password |
| 15 | **Notifiche push** | ⏳ Da fare | Notifica quando video è pronto |
| 16 | **Dark mode** | ⏳ Da fare | Toggle tema chiaro/scuro |
| 17 | **Multi-lingua** | ⏳ Da fare | Italiano + Inglese |

### ✅ Completati

| # | Task | Data | Note |
|---|------|------|------|
| ✅ | Deploy frontend Cloudflare Pages | 13 Set | lumiere-ai.pages.dev |
| ✅ | Deploy backend Render | 13 Set | lumiere-ai-6t4u.onrender.com |
| ✅ | Database PostgreSQL Neon | 13 Set | Frankfurt region |
| ✅ | Autenticazione JWT | 13 Set | Login/Register funzionante |
| ✅ | Google OAuth | 14 Set | Login con Google |
| ✅ | AI Chat NVIDIA LLM | 14 Set | Llama 3.2 gratuito |
| ✅ | MiniMax API configurato | 14 Set | Video + Immagini |
| ✅ | Stability AI configurato | 14 Set | Seedream 5.0 |
| ✅ | Grok/xAI API configurato | 14 Set | Video 10-15s + Aurora |
| ✅ | Landing page con immagini reali | 15 Set | Unsplash stock images |
| ✅ | Banner promo sticky con header | 15 Set | Fixed top navigation |

---

## Prossimo Passo Immediato

```
1. Testare la generazione:
   - POST /api/generate/image con Grok Aurora (TOP quality)
   - POST /api/generate/video con Grok (10-15s con audio)
   - POST /api/generate/image con MiniMax o Stability
   - POST /api/generate/video con MiniMax (≤10s)

2. Dopo i test, attivare pagamento automatico su Grok/xAI
   → Dashboard xAI → Billing → Auto-recharge

3. Completare registrazione BytePlus (business account)
   → Ottenere le 3 chiavi API
   → Aggiungerle su Render Dashboard

4. Se BytePlus ok, testare video lunghi (>15s) e formato 21:9
```

---

## Changelog

### v6.1 - 15 Settembre 2026
- ✅ **Landing page completa** - Immagini reali da Unsplash in tutte le sezioni
- ✅ **Hero Carousel** - 3 slide con immagini AI/video/music
- ✅ **Feature Cards** - Thumbnail con overlay gradient
- ✅ **Canvas Templates** - 5 immagini creative workflow
- ✅ **Showcase Section** - Video preview con play button
- ✅ **Bonus Gallery** - 8 immagini AI-style (4 image + 4 video)
- ✅ **Inspiration Section** - 10 immagini AI art diverse
- ✅ **Banner promo sticky** - Rimane fisso insieme all'header durante lo scroll

### v6.0 - 14 Settembre 2026
- ✅ **AI Chat con NVIDIA LLM** - Gratuito, funzionante
- ✅ **Google OAuth** - Login con Google funzionante
- ✅ **MiniMax API** - Configurato per video e immagini
- ✅ **Stability AI** - Configurato per immagini Seedream
- ✅ **Grok/xAI API** - Video 10-15s (con audio) + Immagini Aurora
- ⏳ **BytePlus** - In registrazione account business

### v5.0 - 13 Settembre 2026
- ✅ **Deploy LIVE** su Cloudflare Pages + Render + Neon
- ✅ **Costo €0/mese** - Tutti i servizi su Free Tier
- ✅ **Registrazione/Login funzionante** con JWT
- ✅ **Database PostgreSQL** connesso
- ✅ **Repository migrato** su nuovo account GitHub

### v4.1 - 12 Settembre 2026
- Ottimizzazione costi: Cloudflare Pages invece di Vercel
- Analisi margini: 82% al 100% utilizzo

---

## Licenza

Proprietario - Tutti i diritti riservati

---

**LUMIERE AI** — Illumina la tua creatività con l'intelligenza artificiale.

---

*Ultimo aggiornamento: 15 Settembre 2026*
*Deployment: v6.1 - LIVE*
