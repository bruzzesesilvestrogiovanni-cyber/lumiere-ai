#!/usr/bin/env python3
"""
LUMIERE AI - Report Costi e Ricavi
Genera un PDF dettagliato con analisi finanziaria completa
"""

from fpdf import FPDF
from datetime import datetime

class PDFReport(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(62, 207, 180)  # #3ECFB4
        self.cell(0, 10, 'LUMIERE AI', 0, 0, 'L')
        self.set_text_color(128, 128, 128)
        self.set_font('Helvetica', '', 9)
        self.cell(0, 10, f'Report Finanziario - {datetime.now().strftime("%d/%m/%Y")}', 0, 1, 'R')
        self.line(10, 18, 200, 18)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(30, 30, 30)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(2)

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(62, 207, 180)
        self.cell(0, 8, title, 0, 1, 'L')
        self.ln(1)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, text)
        self.ln(2)

    def add_table(self, headers, data, col_widths=None):
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)

        # Header
        self.set_font('Helvetica', 'B', 9)
        self.set_fill_color(62, 207, 180)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, 1, 0, 'C', True)
        self.ln()

        # Data rows
        self.set_font('Helvetica', '', 9)
        self.set_text_color(50, 50, 50)
        fill = False
        for row in data:
            if fill:
                self.set_fill_color(245, 245, 245)
            else:
                self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 7, str(cell), 1, 0, 'C', True)
            self.ln()
            fill = not fill
        self.ln(3)

def generate_report():
    pdf = PDFReport()
    pdf.alias_nb_pages()

    # ==================== PAGINA 1: COPERTINA ====================
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(62, 207, 180)
    pdf.cell(0, 15, 'LUMIERE AI', 0, 1, 'C')
    pdf.set_font('Helvetica', '', 16)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, 'Analisi Costi e Ricavi', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 12)
    pdf.cell(0, 8, 'Piattaforma di Generazione AI per Video e Immagini', 0, 1, 'C')
    pdf.ln(30)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(128, 128, 128)
    pdf.cell(0, 8, f'Documento generato il {datetime.now().strftime("%d %B %Y")}', 0, 1, 'C')
    pdf.cell(0, 8, 'Versione 2.0 - Dati verificati Settembre 2026', 0, 1, 'C')

    # ==================== PAGINA 2: INDICE ====================
    pdf.add_page()
    pdf.chapter_title('INDICE')
    pdf.ln(5)
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    indice = [
        ('1. Executive Summary', 3),
        ('2. Costi Infrastruttura (Hosting)', 4),
        ('3. Costi API - Generazione Video', 5),
        ('4. Costi API - Generazione Immagini', 6),
        ('5. Piani Tariffari', 7),
        ('6. Analisi Margini per Piano', 8),
        ('7. Costi Fissi Mensili Totali', 10),
        ('8. Proiezioni Break-Even', 11),
        ('9. Conclusioni e Raccomandazioni', 12),
    ]
    for item, page in indice:
        pdf.cell(0, 8, f'{item} {"." * 50} {page}', 0, 1)

    # ==================== PAGINA 3: EXECUTIVE SUMMARY ====================
    pdf.add_page()
    pdf.chapter_title('1. EXECUTIVE SUMMARY')

    pdf.body_text(
        'LUMIERE AI e una piattaforma SaaS per la generazione di contenuti multimediali '
        '(video e immagini) tramite intelligenza artificiale. Il modello di business si basa '
        'su abbonamenti mensili con sistema a crediti prepagati.'
    )

    pdf.section_title('Punti Chiave')
    pdf.body_text(
        '- Costi fissi mensili stimati: 95-195 EUR/mese\n'
        '- Costi variabili: dipendono dal consumo API degli utenti\n'
        '- Break-even stimato: 4-8 utenti paganti (piano Standard)\n'
        '- Margine lordo target: 25-50% al 70% di utilizzo crediti\n'
        '- Struttura ottimizzata per break-even al 95% di utilizzo'
    )

    pdf.section_title('Stack Tecnologico')
    pdf.add_table(
        ['Layer', 'Tecnologia', 'Provider'],
        [
            ['Frontend', 'React 18 + Vite + TypeScript', 'Vercel'],
            ['Backend', 'FastAPI + SQLAlchemy', 'Railway'],
            ['Database', 'PostgreSQL', 'Neon / Supabase'],
            ['Storage', 'Object Storage S3-compatible', 'Cloudflare R2'],
            ['Pagamenti', 'Stripe', 'Stripe'],
            ['AI Video', 'MiniMax H3, Grok, BytePlus', 'Multi-provider'],
            ['AI Immagini', 'MiniMax, Seedream, GPT', 'Multi-provider'],
        ],
        [35, 80, 75]
    )

    # ==================== PAGINA 4: COSTI INFRASTRUTTURA ====================
    pdf.add_page()
    pdf.chapter_title('2. COSTI INFRASTRUTTURA (HOSTING)')

    pdf.section_title('2.1 Frontend - Vercel')
    pdf.body_text('Vercel offre hosting ottimizzato per React/Next.js con CDN globale.')
    pdf.add_table(
        ['Piano', 'Prezzo/mese', 'Caratteristiche'],
        [
            ['Hobby (Free)', 'EUR 0', 'Uso personale, 100GB bandwidth'],
            ['Pro', 'EUR 20/membro', 'Team, analytics, 1TB bandwidth'],
            ['Enterprise', 'Custom', 'SLA, supporto dedicato'],
        ],
        [50, 40, 100]
    )
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(62, 207, 180)
    pdf.cell(0, 8, 'Raccomandato: Pro - EUR 20/mese', 0, 1)
    pdf.ln(3)

    pdf.section_title('2.2 Backend - Railway')
    pdf.body_text('Railway offre hosting PaaS per backend con scaling automatico.')
    pdf.add_table(
        ['Piano', 'Prezzo/mese', 'Caratteristiche'],
        [
            ['Hobby', 'EUR 5 + usage', '512MB RAM, 1 vCPU, 5GB storage'],
            ['Pro', 'EUR 20 + usage', '8GB RAM, 8 vCPU, 100GB storage'],
            ['Enterprise', 'Custom', 'Risorse dedicate'],
        ],
        [50, 40, 100]
    )
    pdf.body_text('Usage stimato per FastAPI con traffico moderato: EUR 10-30/mese')
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(62, 207, 180)
    pdf.cell(0, 8, 'Raccomandato: Pro - EUR 20 + EUR 15 usage = EUR 35/mese', 0, 1)
    pdf.ln(3)

    pdf.section_title('2.3 Database - Neon PostgreSQL')
    pdf.body_text('Neon offre PostgreSQL serverless con scaling automatico.')
    pdf.add_table(
        ['Piano', 'Prezzo/mese', 'Caratteristiche'],
        [
            ['Free', 'EUR 0', '0.5GB storage, 1 progetto'],
            ['Launch', 'EUR 19', '10GB storage, branching'],
            ['Scale', 'EUR 69', '50GB storage, autoscaling'],
        ],
        [50, 40, 100]
    )
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(62, 207, 180)
    pdf.cell(0, 8, 'Raccomandato: Launch - EUR 19/mese', 0, 1)
    pdf.ln(3)

    pdf.section_title('2.4 Storage - Cloudflare R2')
    pdf.body_text('R2 offre storage S3-compatible senza egress fees.')
    pdf.add_table(
        ['Risorsa', 'Prezzo', 'Note'],
        [
            ['Storage', 'EUR 0.015/GB/mese', 'Primi 10GB gratuiti'],
            ['Operazioni Class A', 'EUR 4.50/milione', 'PUT, POST, LIST'],
            ['Operazioni Class B', 'EUR 0.36/milione', 'GET, HEAD'],
            ['Egress', 'EUR 0', 'Gratuito (vantaggio vs S3)'],
        ],
        [60, 50, 80]
    )
    pdf.body_text('Stima per 100GB storage + 500k operazioni/mese: EUR 5-15/mese')
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(62, 207, 180)
    pdf.cell(0, 8, 'Costo stimato: EUR 10/mese', 0, 1)

    # ==================== PAGINA 5: COSTI API VIDEO ====================
    pdf.add_page()
    pdf.chapter_title('3. COSTI API - GENERAZIONE VIDEO')

    pdf.body_text(
        'Il sistema Smart Router seleziona automaticamente il provider piu conveniente '
        'in base a durata, risoluzione e formato richiesti.'
    )

    pdf.section_title('3.1 MiniMax Hailuo H3')
    pdf.body_text('Provider principale per video brevi (fino a 10 secondi). Miglior rapporto qualita/prezzo.')
    pdf.add_table(
        ['Risoluzione', 'Costo/secondo', 'Video 5s', 'Video 10s'],
        [
            ['768p', 'EUR 0.074', 'EUR 0.37', 'EUR 0.74'],
            ['2K (1080p)', 'EUR 0.120', 'EUR 0.60', 'EUR 1.20'],
        ],
        [45, 45, 50, 50]
    )

    pdf.section_title('3.2 Grok/xAI Imagine Video 1.5')
    pdf.body_text('Provider per video 10-15 secondi. Include generazione audio gratuita.')
    pdf.add_table(
        ['Risoluzione', 'Costo/secondo', 'Video 10s', 'Video 15s'],
        [
            ['480p', 'EUR 0.074', 'EUR 0.74', 'EUR 1.11'],
            ['720p', 'EUR 0.129', 'EUR 1.29', 'EUR 1.94'],
            ['1080p', 'EUR 0.230', 'EUR 2.30', 'EUR 3.45'],
        ],
        [45, 45, 50, 50]
    )

    pdf.section_title('3.3 BytePlus Seedance 2.5')
    pdf.body_text('Provider per video lunghi (15-30 secondi) e formato cinema 21:9.')
    pdf.add_table(
        ['Risoluzione', 'Costo/secondo', 'Video 20s', 'Video 30s'],
        [
            ['480p', 'EUR 0.092', 'EUR 1.84', 'EUR 2.76'],
            ['720p', 'EUR 0.212', 'EUR 4.24', 'EUR 6.36'],
        ],
        [45, 45, 50, 50]
    )

    pdf.section_title('3.4 Smart Routing Logic')
    pdf.body_text(
        'Durata <= 10s AND formato != 21:9 -> MiniMax H3 (piu economico)\n'
        'Durata 10-15s AND formato != 21:9 -> Grok API (include audio)\n'
        'Durata > 15s OR formato = 21:9 -> BytePlus (video lunghi/cinema)'
    )

    # ==================== PAGINA 6: COSTI API IMMAGINI ====================
    pdf.add_page()
    pdf.chapter_title('4. COSTI API - GENERAZIONE IMMAGINI')

    pdf.section_title('4.1 Listino Prezzi per Modello')
    pdf.add_table(
        ['Modello AI', 'Costo/immagine (EUR)', 'Crediti Lumiere', 'Note'],
        [
            ['MiniMax image-01', '0.018', '4', 'Miglior rapporto'],
            ['Seedream 5.0 Lite', '0.032', '4', 'Economico'],
            ['Seedream 4.5', '0.035', '4', 'Bilanciato'],
            ['Seedream 5.0 Pro', '0.041', '9', 'Alta qualita'],
            ['Nano Banana Pro', '0.050', '12', 'Stilizzato (Beta)'],
            ['Nano Banana 2', '0.080', '24', 'Creativo (Beta)'],
            ['GPT Image 2', '0.040-0.110', '30', 'OpenAI (token-based)'],
        ],
        [50, 45, 40, 55]
    )

    pdf.section_title('4.2 Costo Medio Stimato')
    pdf.body_text(
        'Basato sul mix di utilizzo previsto:\n'
        '- 60% Seedream Lite/4.5 (EUR 0.032)\n'
        '- 25% Seedream Pro (EUR 0.041)\n'
        '- 10% MiniMax (EUR 0.018)\n'
        '- 5% GPT/Nano (EUR 0.070)\n\n'
        'Costo medio ponderato: EUR 0.034/immagine'
    )

    pdf.section_title('4.3 Smart Routing Immagini')
    pdf.body_text(
        'Il sistema indirizza gli utenti verso modelli piu economici con promozioni:\n'
        '- "74% off SD2.0 Mini" per utenti Free\n'
        '- "54% off SD2.0 Fast" per tutti\n'
        '- Default: Seedream 5.0 Pro (miglior bilancio qualita/margine)'
    )

    # ==================== PAGINA 7: PIANI TARIFFARI ====================
    pdf.add_page()
    pdf.chapter_title('5. PIANI TARIFFARI')

    pdf.section_title('5.1 Struttura Abbonamenti')
    pdf.add_table(
        ['Piano', 'Prezzo', 'Crediti', 'Watermark', 'Target'],
        [
            ['Free', 'Gratis', '84', 'SI', 'Test piattaforma'],
            ['Trial', 'EUR 2.49 (3gg)', '85', 'NO', 'Nuovi utenti'],
            ['Basic', 'EUR 24.99/mese', '900', 'NO', 'Uso personale'],
            ['Standard', 'EUR 59.99/mese', '2,100', 'NO', 'Creatori'],
            ['Advanced', 'EUR 124.99/mese', '4,400', 'NO', 'Professionisti'],
            ['Ultra', 'EUR 299.99/mese', '10,500', 'NO', 'Aziende'],
        ],
        [35, 45, 30, 30, 50]
    )

    pdf.section_title('5.2 Dettaglio Crediti per Piano')
    pdf.add_table(
        ['Piano', 'Crediti Base', 'Bonus Mensile', 'Seedance 2.5', 'Totale'],
        [
            ['Free', '84', '-', '-', '84'],
            ['Trial', '50', '+35', '-', '85'],
            ['Basic', '540', '+215', '+145', '900'],
            ['Standard', '1,100', '+450', '+550', '2,100'],
            ['Advanced', '2,400', '+1,200', '+800', '4,400'],
            ['Ultra', '5,600', '+2,900', '+2,000', '10,500'],
        ],
        [35, 35, 40, 40, 40]
    )

    pdf.section_title('5.3 Pacchetti Crediti Aggiuntivi')
    pdf.add_table(
        ['Crediti', 'Prezzo', 'EUR/100 crediti', 'Seedance Bonus'],
        [
            ['200', 'EUR 6.99', 'EUR 3.50', '+30'],
            ['500', 'EUR 15.99', 'EUR 3.20', '+75'],
            ['1,000', 'EUR 29.99', 'EUR 3.00', '+150'],
            ['2,500', 'EUR 69.99', 'EUR 2.80', '+375'],
            ['5,000', 'EUR 129.99', 'EUR 2.60', '+750'],
            ['10,000', 'EUR 249.99', 'EUR 2.50', '+1,500'],
        ],
        [40, 45, 50, 55]
    )

    # ==================== PAGINA 8-9: ANALISI MARGINI ====================
    pdf.add_page()
    pdf.chapter_title('6. ANALISI MARGINI PER PIANO')

    pdf.section_title('6.1 Metodologia di Calcolo')
    pdf.body_text(
        'Mix di utilizzo ipotizzato:\n'
        '- 70% immagini (costo medio EUR 0.034 = ~2 crediti)\n'
        '- 25% video brevi 5s (costo medio EUR 0.50 = ~10 crediti)\n'
        '- 5% video lunghi/Seedance (costo medio EUR 2.00 = ~21 crediti/sec)\n\n'
        'Costo medio per credito: EUR 0.0294'
    )

    pdf.section_title('6.2 Piano Trial (EUR 2.49 - 85 crediti)')
    pdf.add_table(
        ['Utilizzo', 'Crediti Usati', 'Costo API', 'Margine', '%'],
        [
            ['50%', '43', 'EUR 1.26', 'EUR 1.23', '49%'],
            ['70%', '60', 'EUR 1.76', 'EUR 0.73', '29%'],
            ['95%', '81', 'EUR 2.38', 'EUR 0.11', '4%'],
            ['100%', '85', 'EUR 2.50', '-EUR 0.01', '~0%'],
        ],
        [35, 40, 40, 40, 35]
    )

    pdf.section_title('6.3 Piano Basic (EUR 24.99 - 900 crediti)')
    pdf.add_table(
        ['Utilizzo', 'Crediti Usati', 'Costo API', 'Margine', '%'],
        [
            ['50%', '450', 'EUR 13.23', 'EUR 11.76', '47%'],
            ['70%', '630', 'EUR 18.52', 'EUR 6.47', '26%'],
            ['95%', '855', 'EUR 25.14', '-EUR 0.15', '~0%'],
            ['100%', '900', 'EUR 26.46', '-EUR 1.47', '-6%'],
        ],
        [35, 40, 40, 40, 35]
    )

    pdf.section_title('6.4 Piano Standard (EUR 59.99 - 2,100 crediti)')
    pdf.add_table(
        ['Utilizzo', 'Crediti Usati', 'Costo API', 'Margine', '%'],
        [
            ['50%', '1,050', 'EUR 30.87', 'EUR 29.12', '49%'],
            ['70%', '1,470', 'EUR 43.22', 'EUR 16.77', '28%'],
            ['95%', '1,995', 'EUR 58.65', 'EUR 1.34', '2%'],
            ['100%', '2,100', 'EUR 61.74', '-EUR 1.75', '-3%'],
        ],
        [35, 40, 40, 40, 35]
    )

    pdf.add_page()
    pdf.section_title('6.5 Piano Advanced (EUR 124.99 - 4,400 crediti)')
    pdf.add_table(
        ['Utilizzo', 'Crediti Usati', 'Costo API', 'Margine', '%'],
        [
            ['50%', '2,200', 'EUR 64.68', 'EUR 60.31', '48%'],
            ['70%', '3,080', 'EUR 90.55', 'EUR 34.44', '28%'],
            ['95%', '4,180', 'EUR 122.89', 'EUR 2.10', '2%'],
            ['100%', '4,400', 'EUR 129.36', '-EUR 4.37', '-3%'],
        ],
        [35, 40, 40, 40, 35]
    )

    pdf.section_title('6.6 Piano Ultra (EUR 299.99 - 10,500 crediti)')
    pdf.add_table(
        ['Utilizzo', 'Crediti Usati', 'Costo API', 'Margine', '%'],
        [
            ['50%', '5,250', 'EUR 154.35', 'EUR 145.64', '49%'],
            ['70%', '7,350', 'EUR 216.09', 'EUR 83.90', '28%'],
            ['95%', '9,975', 'EUR 293.27', 'EUR 6.72', '2%'],
            ['100%', '10,500', 'EUR 308.70', '-EUR 8.71', '-3%'],
        ],
        [35, 40, 40, 40, 35]
    )

    pdf.section_title('6.7 Riepilogo Break-Even per Piano')
    pdf.add_table(
        ['Piano', 'Prezzo', 'Crediti', 'Break-Even', 'Margine 70%'],
        [
            ['Trial', 'EUR 2.49', '85', '~95%', '29%'],
            ['Basic', 'EUR 24.99', '900', '~95%', '26%'],
            ['Standard', 'EUR 59.99', '2,100', '~95%', '28%'],
            ['Advanced', 'EUR 124.99', '4,400', '~95%', '28%'],
            ['Ultra', 'EUR 299.99', '10,500', '~95%', '28%'],
        ],
        [40, 40, 35, 40, 35]
    )

    # ==================== PAGINA 10: COSTI FISSI TOTALI ====================
    pdf.add_page()
    pdf.chapter_title('7. COSTI FISSI MENSILI TOTALI')

    pdf.section_title('7.1 Infrastruttura')
    pdf.add_table(
        ['Servizio', 'Provider', 'Piano', 'Costo/mese'],
        [
            ['Frontend Hosting', 'Vercel', 'Pro', 'EUR 20'],
            ['Backend Hosting', 'Railway', 'Pro + usage', 'EUR 35'],
            ['Database', 'Neon', 'Launch', 'EUR 19'],
            ['Object Storage', 'Cloudflare R2', 'Pay-as-you-go', 'EUR 10'],
            ['SUBTOTALE INFRASTRUTTURA', '', '', 'EUR 84'],
        ],
        [55, 45, 45, 45]
    )

    pdf.section_title('7.2 Servizi Aggiuntivi')
    pdf.add_table(
        ['Servizio', 'Provider', 'Piano', 'Costo/mese'],
        [
            ['Dominio (.com)', 'Cloudflare/Namecheap', 'Annuale', 'EUR 1.25'],
            ['SSL Certificate', 'Cloudflare/Vercel', 'Incluso', 'EUR 0'],
            ['Email Transazionali', 'Resend', 'Free tier', 'EUR 0'],
            ['Error Monitoring', 'Sentry', 'Team', 'EUR 26'],
            ['Analytics', 'Google Analytics', 'Free', 'EUR 0'],
            ['SUBTOTALE SERVIZI', '', '', 'EUR 27'],
        ],
        [55, 45, 45, 45]
    )

    pdf.section_title('7.3 Costi Transazionali (Stripe)')
    pdf.body_text(
        'Commissioni Stripe per pagamenti:\n'
        '- Europa: 1.4% + EUR 0.25 per transazione\n'
        '- Non-Europa: 2.9% + EUR 0.25 per transazione\n\n'
        'Esempio su abbonamento Standard (EUR 59.99):\n'
        '- Commissione: EUR 0.84 + EUR 0.25 = EUR 1.09 (1.8%)\n'
        '- Netto incassato: EUR 58.90'
    )

    pdf.section_title('7.4 Riepilogo Costi Fissi')
    pdf.add_table(
        ['Categoria', 'Minimo', 'Raccomandato', 'Premium'],
        [
            ['Infrastruttura', 'EUR 50', 'EUR 84', 'EUR 150'],
            ['Servizi', 'EUR 0', 'EUR 27', 'EUR 50'],
            ['TOTALE MENSILE', 'EUR 50', 'EUR 111', 'EUR 200'],
        ],
        [55, 45, 45, 45]
    )

    # ==================== PAGINA 11: BREAK-EVEN ====================
    pdf.add_page()
    pdf.chapter_title('8. PROIEZIONI BREAK-EVEN')

    pdf.section_title('8.1 Copertura Costi Fissi')
    pdf.body_text(
        'Costi fissi mensili raccomandati: EUR 111\n'
        'Margine medio per utente (70% utilizzo): 27%\n\n'
        'Calcolo utenti necessari per coprire costi fissi:'
    )

    pdf.add_table(
        ['Piano', 'Prezzo', 'Margine 70%', 'Utenti per Break-Even'],
        [
            ['Basic', 'EUR 24.99', 'EUR 6.47', '18 utenti'],
            ['Standard', 'EUR 59.99', 'EUR 16.77', '7 utenti'],
            ['Advanced', 'EUR 124.99', 'EUR 34.44', '4 utenti'],
            ['Ultra', 'EUR 299.99', 'EUR 83.90', '2 utenti'],
        ],
        [45, 45, 50, 50]
    )

    pdf.section_title('8.2 Scenario Mix Utenti Realistico')
    pdf.body_text(
        'Distribuzione tipica utenti SaaS:\n'
        '- 50% Basic\n'
        '- 30% Standard\n'
        '- 15% Advanced\n'
        '- 5% Ultra'
    )

    pdf.add_table(
        ['Utenti Totali', 'Basic (50%)', 'Standard (30%)', 'Advanced (15%)', 'Ultra (5%)', 'Margine Totale'],
        [
            ['10', '5 x EUR 6.47', '3 x EUR 16.77', '1 x EUR 34.44', '1 x EUR 83.90', 'EUR 200'],
            ['20', '10 x EUR 6.47', '6 x EUR 16.77', '3 x EUR 34.44', '1 x EUR 83.90', 'EUR 352'],
            ['50', '25 x EUR 6.47', '15 x EUR 16.77', '7 x EUR 34.44', '3 x EUR 83.90', 'EUR 908'],
            ['100', '50 x EUR 6.47', '30 x EUR 16.77', '15 x EUR 34.44', '5 x EUR 83.90', 'EUR 1,859'],
        ],
        [30, 32, 32, 32, 32, 32]
    )

    pdf.section_title('8.3 Punto di Pareggio')
    pdf.body_text(
        'Con il mix utenti sopra indicato:\n'
        '- Margine medio per utente: EUR 20/mese\n'
        '- Costi fissi: EUR 111/mese\n'
        '- Break-even: 6 utenti paganti\n\n'
        'Con 10 utenti paganti: profitto netto EUR 89/mese\n'
        'Con 50 utenti paganti: profitto netto EUR 797/mese\n'
        'Con 100 utenti paganti: profitto netto EUR 1,748/mese'
    )

    # ==================== PAGINA 12: CONCLUSIONI ====================
    pdf.add_page()
    pdf.chapter_title('9. CONCLUSIONI E RACCOMANDAZIONI')

    pdf.section_title('9.1 Punti di Forza del Modello')
    pdf.body_text(
        '1. Smart Routing ottimizza automaticamente i costi API\n'
        '2. Crediti Seedance separati limitano il consumo su modelli costosi\n'
        '3. Break-even raggiungibile con pochi utenti (6-10)\n'
        '4. Margini positivi al 70% di utilizzo (26-29%)\n'
        '5. Struttura scalabile con costi variabili proporzionali'
    )

    pdf.section_title('9.2 Rischi e Mitigazioni')
    pdf.add_table(
        ['Rischio', 'Probabilita', 'Impatto', 'Mitigazione'],
        [
            ['Utilizzo >95%', 'Bassa', 'Medio', 'Limiti Seedance, promozioni su modelli economici'],
            ['Aumento prezzi API', 'Media', 'Alto', 'Multi-provider, contratti annuali'],
            ['Churn elevato', 'Media', 'Alto', 'Programma referral, engagement'],
            ['Frodi/abuse', 'Bassa', 'Medio', 'Rate limiting, CAPTCHA, monitoring'],
        ],
        [45, 30, 30, 85]
    )

    pdf.section_title('9.3 Raccomandazioni')
    pdf.body_text(
        '1. PRIORITA ALTA:\n'
        '   - Implementare monitoring utilizzo crediti per utente\n'
        '   - Attivare alert per utenti con utilizzo >90%\n'
        '   - Testare tutti i provider API prima del lancio\n\n'
        '2. PRIORITA MEDIA:\n'
        '   - Negoziare sconti volume con MiniMax e BytePlus\n'
        '   - Implementare cache per richieste duplicate\n'
        '   - A/B test su pricing pacchetti crediti\n\n'
        '3. PRIORITA BASSA:\n'
        '   - Esplorare API alternative (Runway, Stability)\n'
        '   - Considerare piano Enterprise custom\n'
        '   - Valutare modello pay-per-generation senza abbonamento'
    )

    pdf.section_title('9.4 Metriche da Monitorare')
    pdf.body_text(
        '- MRR (Monthly Recurring Revenue)\n'
        '- ARPU (Average Revenue Per User)\n'
        '- Utilizzo medio crediti per piano\n'
        '- Costo medio per generazione\n'
        '- Churn rate mensile\n'
        '- LTV (Lifetime Value) per piano\n'
        '- CAC (Customer Acquisition Cost)'
    )

    pdf.ln(10)
    pdf.set_font('Helvetica', 'I', 9)
    pdf.set_text_color(128, 128, 128)
    pdf.multi_cell(0, 5,
        'Disclaimer: Questa analisi si basa su stime e proiezioni. I risultati effettivi '
        'dipendono dal comportamento degli utenti, dalle variazioni dei prezzi API e dalle '
        'condizioni di mercato. Si consiglia di rivedere periodicamente questi dati con '
        'metriche reali post-lancio.'
    )

    # Salva il PDF
    output_path = '/Users/gianni/Desktop/lumiere-ai/LUMIERE_AI_Costi_Ricavi.pdf'
    pdf.output(output_path)
    return output_path

if __name__ == '__main__':
    path = generate_report()
    print(f'PDF generato: {path}')
