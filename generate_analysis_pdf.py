#!/usr/bin/env python3
"""
LUMIERE AI - Analisi Costi e Ricavi
Genera un report PDF con l'analisi finanziaria della piattaforma
"""

from fpdf import FPDF
from datetime import datetime

class AnalysisPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(62, 207, 180)  # Lumiere teal color
        self.cell(0, 10, 'LUMIERE AI', 0, 0, 'L')
        self.set_text_color(128, 128, 128)
        self.set_font('Helvetica', '', 10)
        self.cell(0, 10, f'Report generato: {datetime.now().strftime("%d/%m/%Y")}', 0, 1, 'R')
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
        self.set_draw_color(62, 207, 180)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(50, 50, 50)
        self.cell(0, 8, title, 0, 1, 'L')
        self.ln(2)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(60, 60, 60)
        self.multi_cell(0, 6, text)
        self.ln(3)

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

        # Data
        self.set_font('Helvetica', '', 9)
        self.set_text_color(60, 60, 60)
        fill = False
        for row in data:
            if fill:
                self.set_fill_color(245, 245, 245)
            else:
                self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                align = 'R' if i > 0 and any(c.isdigit() for c in str(cell)) else 'L'
                self.cell(col_widths[i], 7, str(cell), 1, 0, align, True)
            self.ln()
            fill = not fill
        self.ln(5)

def create_pdf():
    pdf = AnalysisPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    # Title
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 15, 'Analisi Costi e Ricavi', 0, 1, 'C')
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, 'Piattaforma AI per Generazione Video e Immagini', 0, 1, 'C')
    pdf.ln(10)

    # 1. Overview Abbonamenti
    pdf.chapter_title('1. Piano Abbonamenti')
    pdf.body_text('LUMIERE AI offre 5 piani di abbonamento con prezzi in EUR, ottimizzati per massimizzare i margini mantenendo la competitivita sul mercato.')

    subscription_headers = ['Piano', 'Prezzo', 'Credits', 'Costo/Credit', 'Target']
    subscription_data = [
        ['Trial', '2,49 EUR/3gg', '100', '0,0249 EUR', 'Nuovi utenti'],
        ['Basic', '24,99 EUR/mese', '500', '0,0500 EUR', 'Uso occasionale'],
        ['Standard', '59,99 EUR/mese', '2.000', '0,0300 EUR', 'Creatori regolari'],
        ['Advanced', '124,99 EUR/mese', '5.000', '0,0246 EUR', 'Professionisti'],
        ['Ultra', '299,99 EUR/mese', '10.500', '0,0286 EUR', 'Enterprise'],
    ]
    pdf.add_table(subscription_headers, subscription_data, [30, 40, 30, 35, 55])

    # 2. Costi API Video
    pdf.chapter_title('2. Costi API - Generazione Video')
    pdf.body_text('Sistema di routing intelligente per ottimizzare i costi in base alla durata del video e formato richiesto.')

    pdf.section_title('MiniMax Hailuo H3 (Video <= 10s)')
    video_minimax = [
        ['Parametro', 'Valore'],
        ['Costo API', '~0,21 USD/video (5s)'],
        ['Costo in EUR', '~0,19 EUR/video'],
        ['Credits richiesti', '20 credits'],
        ['Ricavo', '0,40-1,00 EUR'],
        ['Margine', '52-81%'],
    ]
    pdf.add_table(['Parametro', 'Valore'], video_minimax, [80, 110])

    pdf.section_title('Grok/xAI Aurora (Video 10-15s)')
    video_grok = [
        ['Costo API', '~0,10 USD/secondo'],
        ['Costo 10s', '~1,00 USD (0,92 EUR)'],
        ['Credits richiesti', '60 credits'],
        ['Ricavo', '1,20-3,00 EUR'],
        ['Margine', '23-69%'],
    ]
    pdf.add_table(['Parametro', 'Valore'], video_grok, [80, 110])

    pdf.section_title('BytePlus/Seedance (Video 15-30s)')
    video_byteplus = [
        ['Costo API', '~0,08-0,12 USD/secondo'],
        ['Costo 30s', '~2,40-3,60 USD (2,21-3,31 EUR)'],
        ['Credits richiesti', '120 credits'],
        ['Ricavo', '2,40-6,00 EUR'],
        ['Margine', '8-55%'],
    ]
    pdf.add_table(['Parametro', 'Valore'], video_byteplus, [80, 110])

    # New page for images
    pdf.add_page()

    # 3. Costi API Immagini
    pdf.chapter_title('3. Costi API - Generazione Immagini')
    pdf.body_text('Diversi modelli disponibili con costi e qualita variabili. MiniMax offre il miglior rapporto qualita/prezzo.')

    image_headers = ['Modello', 'Costo API', 'Costo EUR', 'Credits', 'Margine']
    image_data = [
        ['MiniMax image-01', '0,02 USD', '0,018 EUR', '5', '93-97%'],
        ['GPT-image-2', '0,04-0,08 USD', '0,037-0,074 EUR', '10', '85-93%'],
        ['Seedream 5.0 Pro', '0,06 USD', '0,055 EUR', '10', '82-91%'],
        ['Seedream 5.0 Lite', '0,03 USD', '0,028 EUR', '5', '72-89%'],
        ['Nano Banana Pro 2', '0,05 USD', '0,046 EUR', '8', '77-90%'],
    ]
    pdf.add_table(image_headers, image_data, [45, 35, 35, 30, 45])

    # 4. Analisi Margini per Piano
    pdf.chapter_title('4. Analisi Margini per Piano')
    pdf.body_text('Stima dei margini basata su un utilizzo tipico del 70% dei credits disponibili.')

    margin_headers = ['Piano', 'Ricavo', 'Costo Stimato*', 'Margine Lordo', '%']
    margin_data = [
        ['Trial', '2,49 EUR', '~0,50 EUR', '1,99 EUR', '80%'],
        ['Basic', '24,99 EUR', '~4,00 EUR', '20,99 EUR', '84%'],
        ['Standard', '59,99 EUR', '~12,00 EUR', '47,99 EUR', '80%'],
        ['Advanced', '124,99 EUR', '~28,00 EUR', '94,99 EUR', '77%'],
        ['Ultra', '299,99 EUR', '~90,00 EUR', '309,00 EUR', '77%'],
    ]
    pdf.add_table(margin_headers, margin_data, [35, 35, 40, 40, 40])
    pdf.set_font('Helvetica', 'I', 8)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 5, '*Costo stimato basato su mix tipico: 60% immagini, 30% video brevi, 10% video lunghi', 0, 1)
    pdf.ln(5)

    # 5. Routing Intelligente
    pdf.chapter_title('5. Sistema di Routing Intelligente')
    pdf.body_text('Il sistema seleziona automaticamente il provider API piu conveniente in base ai parametri della richiesta:')

    routing_data = [
        ['Video <= 10s (no 21:9)', 'MiniMax H3', 'Costo piu basso'],
        ['Video 10-15s (no 21:9)', 'Grok Aurora', 'Include audio'],
        ['Video > 15s o 21:9', 'BytePlus', 'Massima qualita'],
        ['Immagini standard', 'MiniMax', 'Best value'],
        ['Immagini premium', 'Seedream Pro', 'Alta qualita'],
    ]
    pdf.add_table(['Condizione', 'Provider', 'Motivazione'], routing_data, [60, 45, 85])

    # New page for projections
    pdf.add_page()

    # 6. Proiezioni Revenue
    pdf.chapter_title('6. Proiezioni di Fatturato')
    pdf.body_text('Scenari di fatturato mensile basati su diverse distribuzioni di abbonati.')

    pdf.section_title('Scenario Conservativo (100 abbonati)')
    scenario1 = [
        ['Trial (30%)', '30', '74,70 EUR'],
        ['Basic (35%)', '35', '874,65 EUR'],
        ['Standard (20%)', '20', '1.199,80 EUR'],
        ['Advanced (10%)', '10', '1.229,90 EUR'],
        ['Ultra (5%)', '5', '1.995,00 EUR'],
        ['TOTALE', '100', '5.374,05 EUR'],
    ]
    pdf.add_table(['Piano', 'Utenti', 'Revenue'], scenario1, [60, 40, 90])

    pdf.section_title('Scenario Medio (500 abbonati)')
    scenario2 = [
        ['Trial (25%)', '125', '311,25 EUR'],
        ['Basic (30%)', '150', '3.748,50 EUR'],
        ['Standard (25%)', '125', '7.498,75 EUR'],
        ['Advanced (12%)', '60', '7.379,40 EUR'],
        ['Ultra (8%)', '40', '15.960,00 EUR'],
        ['TOTALE', '500', '34.897,90 EUR'],
    ]
    pdf.add_table(['Piano', 'Utenti', 'Revenue'], scenario2, [60, 40, 90])

    pdf.section_title('Scenario Ottimistico (2000 abbonati)')
    scenario3 = [
        ['Trial (20%)', '400', '996,00 EUR'],
        ['Basic (25%)', '500', '12.495,00 EUR'],
        ['Standard (28%)', '560', '33.594,40 EUR'],
        ['Advanced (15%)', '300', '36.897,00 EUR'],
        ['Ultra (12%)', '240', '95.760,00 EUR'],
        ['TOTALE', '2000', '179.742,40 EUR'],
    ]
    pdf.add_table(['Piano', 'Utenti', 'Revenue'], scenario3, [60, 40, 90])

    # 7. Conclusioni
    pdf.add_page()
    pdf.chapter_title('7. Conclusioni e Raccomandazioni')

    pdf.section_title('Punti di Forza')
    pdf.body_text('- Margini elevati (77-84%) grazie all\'ottimizzazione dei costi API\n- Sistema di routing intelligente che minimizza i costi\n- MiniMax come provider principale offre il miglior rapporto qualita/prezzo\n- Prezzi competitivi rispetto alla concorrenza (es. Lumina, Runway)')

    pdf.section_title('Aree di Attenzione')
    pdf.body_text('- Monitorare i costi API per video lunghi (>15s) dove i margini sono piu bassi\n- Considerare limiti giornalieri per piano Trial per prevenire abusi\n- Valutare partnership con provider per sconti volume')

    pdf.section_title('Prossimi Passi')
    pdf.body_text('1. Implementare analytics per tracciare utilizzo reale per piano\n2. A/B test sui prezzi per ottimizzare conversioni\n3. Aggiungere piano annuale con sconto 20% per migliorare retention\n4. Valutare tier Enterprise con prezzi custom')

    # Save PDF
    output_path = '/Users/gianni/Desktop/lumiere-ai/LUMIERE_AI_Analisi_Costi_Ricavi.pdf'
    pdf.output(output_path)
    print(f'PDF generato: {output_path}')
    return output_path

if __name__ == '__main__':
    create_pdf()
