#!/usr/bin/env python3
"""Generate self-contained PDF and image versions of the portfolio and resume."""

from __future__ import annotations

import math
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUTPUT = PUBLIC / "downloads"

PAGE_W, PAGE_H = A4
INK = HexColor("#242424")
MUTED = HexColor("#6E6E6E")
FAINT = HexColor("#A7A7A7")
BORDER = HexColor("#DDDDDD")
PAPER = HexColor("#FCFCFC")
CARD = HexColor("#FFFFFF")
ACCENT = HexColor("#D85F2B")
ACCENT_SOFT = HexColor("#F9E9E1")


def register_fonts() -> None:
    font_dir = Path("/System/Library/Fonts/Supplemental")
    fonts = {
        "Portfolio": font_dir / "Arial.ttf",
        "Portfolio-Medium": font_dir / "Arial Bold.ttf",
        "Portfolio-Italic": font_dir / "Arial Italic.ttf",
    }
    for name, path in fonts.items():
        if not path.exists():
            raise FileNotFoundError(f"Required font is missing: {path}")
        pdfmetrics.registerFont(TTFont(name, str(path)))


def draw_text(
    canvas: Canvas,
    text: str,
    x: float,
    y: float,
    size: float,
    font: str = "Portfolio",
    color=INK,
) -> None:
    canvas.setFont(font, size)
    canvas.setFillColor(color)
    canvas.drawString(x, y, text)


def wrap_lines(text: str, font: str, size: float, width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if not current or pdfmetrics.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_paragraph(
    canvas: Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    size: float = 10,
    leading: float | None = None,
    font: str = "Portfolio",
    color=MUTED,
    max_lines: int | None = None,
) -> float:
    leading = leading or size * 1.45
    lines = wrap_lines(text, font, size, width)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        final = lines[-1]
        while pdfmetrics.stringWidth(f"{final}...", font, size) > width and final:
            final = final.rsplit(" ", 1)[0]
        lines[-1] = f"{final}..."
    canvas.setFont(font, size)
    canvas.setFillColor(color)
    for line in lines:
        canvas.drawString(x, y, line)
        y -= leading
    return y


def draw_label(canvas: Canvas, text: str, x: float, y: float) -> None:
    draw_text(canvas, text, x, y, 7.5, "Portfolio-Medium", ACCENT)


def draw_rule(canvas: Canvas, x: float, y: float, width: float, color=BORDER) -> None:
    canvas.setStrokeColor(color)
    canvas.setLineWidth(0.6)
    canvas.line(x, y, x + width, y)


def draw_page_base(canvas: Canvas, page_number: int | None = None) -> None:
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    if page_number is not None:
        draw_text(canvas, "CHRISTIAN OBANAKA", 42, 24, 6.5, "Portfolio-Medium", FAINT)
        page = f"{page_number:02d}"
        page_w = pdfmetrics.stringWidth(page, "Portfolio-Medium", 6.5)
        draw_text(canvas, page, PAGE_W - 42 - page_w, 24, 6.5, "Portfolio-Medium", FAINT)


def draw_image_card(
    canvas: Canvas,
    image_path: Path,
    x: float,
    y: float,
    width: float,
    height: float,
    padding: float = 6,
) -> None:
    canvas.setFillColor(CARD)
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.7)
    canvas.roundRect(x, y, width, height, 10, stroke=1, fill=1)
    with Image.open(image_path) as image:
        image_w, image_h = image.size
    inner_w = width - padding * 2
    inner_h = height - padding * 2
    scale = min(inner_w / image_w, inner_h / image_h)
    draw_w = image_w * scale
    draw_h = image_h * scale
    draw_x = x + padding + (inner_w - draw_w) / 2
    draw_y = y + padding + (inner_h - draw_h) / 2
    canvas.drawImage(
        ImageReader(str(image_path)),
        draw_x,
        draw_y,
        draw_w,
        draw_h,
        preserveAspectRatio=True,
        mask="auto",
    )


def draw_circle_avatar(canvas: Canvas, avatar_path: Path, x: float, y: float, size: float) -> None:
    with Image.open(avatar_path).convert("RGBA") as image:
        side = min(image.size)
        left = (image.width - side) // 2
        top = (image.height - side) // 2
        image = image.crop((left, top, left + side, top + side)).resize((512, 512))
        mask = Image.new("L", (512, 512), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, 511, 511), fill=255)
        image.putalpha(mask)
        canvas.drawImage(ImageReader(image), x, y, size, size, mask="auto")


def draw_bullet(
    canvas: Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    size: float = 9,
    leading: float = 12.5,
    color=MUTED,
) -> float:
    canvas.setFillColor(ACCENT)
    canvas.circle(x + 2.2, y + 3.0, 1.6, stroke=0, fill=1)
    return draw_paragraph(canvas, text, x + 12, y, width - 12, size, leading, color=color)


def build_resume(output_path: Path) -> None:
    canvas = Canvas(str(output_path), pagesize=A4, pageCompression=1)
    canvas.setTitle("Christian Obanaka - Resume")
    canvas.setAuthor("Christian Obanaka")
    canvas.setSubject("Software engineering and design engineering resume")
    resume_ink = HexColor("#171717")
    resume_muted = HexColor("#626262")
    resume_faint = HexColor("#969696")
    resume_rule = HexColor("#D8D8D8")
    canvas.setFillColor(HexColor("#FFFFFF"))
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    margin = 48
    content_w = PAGE_W - margin * 2

    def section_heading(title: str, y: float) -> None:
        draw_text(canvas, title, margin, y, 10.2, "Portfolio-Medium", resume_ink)
        title_w = pdfmetrics.stringWidth(title, "Portfolio-Medium", 10.2)
        draw_rule(canvas, margin + title_w + 16, y + 3, content_w - title_w - 16, resume_rule)

    draw_text(canvas, "Christian Obanaka", margin, 782, 28, "Portfolio-Medium", resume_ink)
    draw_text(canvas, "Software engineer · Design engineer · Futures trader", margin, 754, 10.2, color=resume_muted)

    contact_segments = [
        ("christian@godsbattle.net", "mailto:christian@godsbattle.net"),
        ("godsbattle.net", "https://godsbattle.net"),
        (
            "linkedin.com/in/christian-obanaka",
            "https://www.linkedin.com/in/christian-obanaka/",
        ),
        ("Lagos, Nigeria", None),
    ]
    contact_x = margin
    contact_size = 7.5
    contact_separator = "   ·   "
    for index, (label, url) in enumerate(contact_segments):
        draw_text(canvas, label, contact_x, 727, contact_size, color=resume_muted)
        label_w = pdfmetrics.stringWidth(label, "Portfolio", contact_size)
        if url:
            canvas.linkURL(url, (contact_x, 721, contact_x + label_w, 735))
        contact_x += label_w
        if index < len(contact_segments) - 1:
            draw_text(
                canvas,
                contact_separator,
                contact_x,
                727,
                contact_size,
                color=resume_muted,
            )
            contact_x += pdfmetrics.stringWidth(
                contact_separator, "Portfolio", contact_size
            )

    draw_rule(canvas, margin, 707, content_w, resume_rule)
    draw_paragraph(
        canvas,
        "I am a software engineer, design engineer, and futures trader. I combine product design, engineering, and firsthand trader knowledge to build focused financial-product experiences.",
        margin,
        681,
        content_w,
        9.8,
        14.5,
        color=resume_ink,
    )

    section_heading("Experience", 618)
    roles = [
        ("Tradara", "Software Engineer - Full-Time", "Aug 2026 - Present", "Building Tradara's futures terminal and prop-trading infrastructure."),
        ("thePropTrade", "Head of Community - Full-Time", "Nov 2025 - Jul 2026", "Scaled the community and improved day-to-day support for active traders."),
        ("PipFarm", "Community + Affiliate Manager - Full-Time", "Feb 2025 - Nov 2025", "Grew Discord from 5k to 10k members in five months while improving activity and referrals."),
        ("PokerDAO", "Community Manager - Part-Time", "Apr 2022 - Dec 2024", "Grew Discord and Telegram from 3k to 7.5k members while halving support response time."),
    ]
    y = 584
    for company, title, dates, blurb in roles:
        draw_text(canvas, company, margin, y, 10, "Portfolio-Medium", resume_ink)
        company_w = pdfmetrics.stringWidth(company, "Portfolio-Medium", 10)
        draw_text(canvas, title, margin + company_w + 10, y, 9, color=resume_muted)
        date_w = pdfmetrics.stringWidth(dates, "Portfolio", 8)
        draw_text(canvas, dates, PAGE_W - margin - date_w, y, 8, color=resume_faint)
        y = draw_paragraph(canvas, blurb, margin, y - 18, content_w, 8.4, 11.6, color=resume_ink)
        y -= 12

    section_heading("Education", y + 2)
    y -= 27
    education_rows = [
        ("University of Port Harcourt", "Bachelor's degree in Mathematics & Computer Science - Port Harcourt, Nigeria", "2021 - Oct 2025"),
        ("Federal Government College", "Senior Secondary 1-3 - Port Harcourt, Nigeria", "2017 - 2020"),
        ("Wisdom Gate Intl. College", "Junior Secondary 1-3 - Port Harcourt, Nigeria", "2015 - 2017"),
    ]
    for school, qualification, dates in education_rows:
        draw_text(canvas, school, margin, y, 9.2, "Portfolio-Medium", resume_ink)
        date_w = pdfmetrics.stringWidth(dates, "Portfolio", 7.8)
        draw_text(canvas, dates, PAGE_W - margin - date_w, y, 7.8, color=resume_faint)
        draw_text(canvas, qualification, margin, y - 14, 8.2, color=resume_muted)
        y -= 32

    section_heading("Selected project", y + 2)
    y -= 30
    draw_text(canvas, "trackmyprop", margin, y, 10, "Portfolio-Medium", resume_ink)
    draw_text(canvas, "Product direction · UX/UI design · Frontend implementation", margin + 82, y, 8.8, color=resume_muted)
    canvas.linkURL("https://godsbattle.net/work/trackmyprop/", (margin, y - 5, margin + 74, y + 12))
    y = draw_paragraph(
        canvas,
        "A desktop workspace for prop-firm traders managing accounts, rules, trades, journals, costs, and payouts. Built with React, TypeScript, Tailwind CSS, Next.js, and Electron.",
        margin,
        y - 20,
        content_w,
        8.9,
        12.8,
        color=resume_ink,
    )

    section_heading("Capabilities", y - 6)
    y -= 35
    capability_rows = [
        ("Community", "Community strategy, engagement, moderation, partnerships, support operations"),
        ("Design", "Product and interface design, interaction design, prototyping, design systems"),
        ("Engineering", "React, TypeScript, Next.js, Tailwind CSS, Electron, Cloudflare, accessibility"),
        ("Domain", "Trading, prop firms, trader support, community operations, AI-assisted delivery"),
    ]
    label_w = 78
    for label, value in capability_rows:
        draw_text(canvas, label, margin, y, 8.7, "Portfolio-Medium", resume_ink)
        y = draw_paragraph(canvas, value, margin + label_w, y, content_w - label_w, 8.7, 12.2, color=resume_muted)
        y -= 9

    section_heading("Earlier technical work", y - 1)
    draw_paragraph(
        canvas,
        "godsbattle: practical PC-optimization tutorials and technical notes reaching 9,000 YouTube subscribers and 4.5 million views.",
        margin,
        y - 29,
        content_w,
        8.9,
        12.8,
        color=resume_ink,
    )

    draw_rule(canvas, margin, 43, content_w, resume_rule)
    draw_text(canvas, "Software engineering · Design engineering · Trading and fintech", margin, 25, 7.8, color=resume_muted)
    footer = "2026"
    footer_w = pdfmetrics.stringWidth(footer, "Portfolio", 7.8)
    draw_text(canvas, footer, PAGE_W - margin - footer_w, 25, 7.8, color=resume_faint)
    canvas.save()


def build_portfolio(output_path: Path) -> None:
    canvas = Canvas(str(output_path), pagesize=A4, pageCompression=1)
    canvas.setTitle("Christian Obanaka - Design Engineering Portfolio")
    canvas.setAuthor("Christian Obanaka")
    canvas.setSubject("Product design and engineering portfolio")
    margin = 42
    content_w = PAGE_W - margin * 2

    draw_page_base(canvas, 1)
    draw_circle_avatar(canvas, PUBLIC / "avatar.webp", margin, 722, 62)
    draw_text(canvas, "Christian Obanaka", margin + 78, 760, 12, "Portfolio-Medium")
    draw_text(canvas, "Software engineer · Futures trader", margin + 78, 741, 9.5, color=MUTED)
    draw_label(canvas, "PORTFOLIO · 2026", margin, 650)
    draw_text(canvas, "Designing clear products", margin, 586, 34, "Portfolio-Medium")
    draw_text(canvas, "for traders.", margin, 545, 34, "Portfolio-Medium")
    draw_paragraph(
        canvas,
        "Product design, interface systems, and frontend implementation grounded in firsthand trading and prop-firm experience.",
        margin,
        501,
        430,
        13,
        19,
        color=MUTED,
    )
    facts = [
        ("Current role", "Software Engineer · Tradara"),
        ("Independent build", "trackmyprop"),
        ("Specialism", "Trading + fintech products"),
        ("Practice", "Product design + engineering"),
    ]
    y = 357
    for label, value in facts:
        draw_rule(canvas, margin, y + 23, content_w)
        draw_text(canvas, label, margin, y, 8.5, "Portfolio-Medium", FAINT)
        draw_text(canvas, value, margin + 150, y, 11, "Portfolio-Medium", INK)
        y -= 58
    canvas.setFillColor(ACCENT_SOFT)
    canvas.roundRect(margin, 84, content_w, 70, 10, stroke=0, fill=1)
    draw_text(canvas, "CURRENTLY", margin + 18, 127, 7.2, "Portfolio-Medium", ACCENT)
    draw_paragraph(canvas, "Software Engineer at Tradara · Building trackmyprop", margin + 18, 105, content_w - 36, 10, 14, color=INK)
    canvas.showPage()

    draw_page_base(canvas, 2)
    draw_label(canvas, "FEATURED WORK · TRACKMYPROP", margin, 786)
    draw_text(canvas, "One workspace for the", margin, 744, 26, "Portfolio-Medium")
    draw_text(canvas, "operational side of trading.", margin, 711, 26, "Portfolio-Medium")
    draw_paragraph(canvas, "A desktop-first product for traders managing prop-firm accounts, rules, trades, journals, costs, and payouts.", margin, 679, 450, 10.5, 15, color=MUTED)
    draw_image_card(canvas, PUBLIC / "work/trackmyprop/overview.png", margin, 337, content_w, 292)
    facts = [
        ("Role", "Product direction, UX/UI, implementation"),
        ("Platform", "Electron desktop app · macOS + Windows"),
        ("Audience", "Prop-firm and futures traders"),
        ("State", "Private beta · active development"),
    ]
    col_w = (content_w - 22) / 2
    positions = [(margin, 282), (margin + col_w + 22, 282), (margin, 220), (margin + col_w + 22, 220)]
    for (label, value), (x, y) in zip(facts, positions):
        draw_text(canvas, label, x, y, 7.5, "Portfolio-Medium", FAINT)
        draw_paragraph(canvas, value, x, y - 18, col_w, 9.3, 13, color=INK)
    draw_rule(canvas, margin, 176, content_w)
    draw_text(canvas, "The problem", margin, 149, 14, "Portfolio-Medium")
    draw_paragraph(canvas, "Serious prop-firm trading work is fragmented across broker platforms, spreadsheets, notes, calculators, and support conversations. The design challenge is to make that complexity visible without making the product feel complicated.", margin + 118, 151, content_w - 118, 8.8, 12.8, color=MUTED)
    canvas.showPage()

    draw_page_base(canvas, 3)
    draw_label(canvas, "PRODUCT STRUCTURE", margin, 786)
    draw_text(canvas, "Connected workflows,", margin, 744, 26, "Portfolio-Medium")
    draw_text(canvas, "one shared language.", margin, 711, 26, "Portfolio-Medium")
    rows = [
        ("Track", "Portfolio, live connections, accounts, prop-firm journeys, transactions, expenses, and records."),
        ("Journal", "Trade history and review tools connecting executions to daily and longer-term context."),
        ("Tools", "Consistency, payout, challenge, and win-rate calculators plus an economic calendar."),
        ("System", "Navigation, search, reusable data surfaces, shared actions, and connection-status patterns."),
    ]
    y = 662
    for term, description in rows:
        draw_rule(canvas, margin, y + 16, content_w)
        draw_text(canvas, term, margin, y - 5, 10, "Portfolio-Medium")
        draw_paragraph(canvas, description, margin + 104, y - 4, content_w - 104, 8.7, 12, color=MUTED)
        y -= 62
    draw_image_card(canvas, PUBLIC / "work/trackmyprop/journal.png", margin, 142, content_w, 267)
    draw_paragraph(canvas, "The journal links reflection to real trade, day, and month data instead of separating notes from performance context.", margin, 119, content_w, 8.5, 12, color=MUTED)
    canvas.showPage()

    draw_page_base(canvas, 4)
    draw_label(canvas, "INTERFACE DECISIONS", margin, 786)
    draw_text(canvas, "Clarity under pressure.", margin, 744, 26, "Portfolio-Medium")
    decisions = [
        ("Stable desktop hierarchy", "Persistent navigation, tabs, filters, and compact data surfaces support repeated daily use without turning every metric into a promotional card."),
        ("Rules explained as decisions", "Calculators pair results with inputs, thresholds, and next required amounts so traders understand why a status changed."),
        ("One language across workflows", "Reusable account rows, status treatments, money formatting, dialogs, and page actions make unfamiliar tools predictable."),
        ("Safety before optimism", "Connection and trading states use explicit status and failure language; unavailable information is never presented as a guarantee."),
    ]
    y = 684
    for index, (title, body) in enumerate(decisions, start=1):
        canvas.setFillColor(ACCENT_SOFT)
        canvas.circle(margin + 12, y + 4, 12, stroke=0, fill=1)
        number = f"{index:02d}"
        number_w = pdfmetrics.stringWidth(number, "Portfolio-Medium", 6.5)
        draw_text(canvas, number, margin + 12 - number_w / 2, y + 1.7, 6.5, "Portfolio-Medium", ACCENT)
        draw_text(canvas, title, margin + 40, y + 2, 10.2, "Portfolio-Medium")
        draw_paragraph(canvas, body, margin + 200, y + 2, content_w - 200, 8.4, 11.5, color=MUTED)
        y -= 78
    draw_image_card(canvas, PUBLIC / "work/trackmyprop/consistency.png", margin, 126, content_w, 240)
    draw_paragraph(canvas, "The consistency calculator explains the threshold, current score, and exactly what the trader needs next.", margin, 103, content_w, 8.5, 12, color=MUTED)
    canvas.showPage()

    draw_page_base(canvas, 5)
    draw_label(canvas, "DESIGN + ENGINEERING", margin, 786)
    draw_text(canvas, "The interface is the system.", margin, 744, 26, "Portfolio-Medium")
    draw_paragraph(canvas, "trackmyprop uses React, TypeScript, Tailwind CSS, Electron, and reusable accessible foundations. Shared tokens separate page, card, sidebar, overlay, and state layers; reusable patterns cover controls, dialogs, data rows, navigation, and status feedback.", margin, 704, content_w, 10, 14.5, color=MUTED)
    draw_image_card(canvas, PUBLIC / "work/trackmyprop/calendar.png", margin, 389, content_w, 250)
    draw_paragraph(canvas, "A weekly economic calendar keeps event risk beside the trader's other operating tools.", margin, 366, content_w, 8.5, 12, color=MUTED)
    draw_rule(canvas, margin, 327, content_w)
    draw_label(canvas, "DOMAIN EXPERIENCE", margin, 303)
    experience = [
        ("Tradara", "Software Engineer", "2026 - Present"),
        ("thePropTrade", "Head of Community", "2025 - 2026"),
        ("PipFarm", "Community + Affiliate Manager", "2025"),
        ("PokerDAO", "Community Manager", "2022 - 2024"),
    ]
    y = 285
    for company, role, dates in experience:
        draw_text(canvas, company, margin, y, 9.5, "Portfolio-Medium")
        draw_text(canvas, role, margin + 132, y, 8.7, color=MUTED)
        date_w = pdfmetrics.stringWidth(dates, "Portfolio", 8)
        draw_text(canvas, dates, PAGE_W - margin - date_w, y, 8, color=FAINT)
        y -= 24
    canvas.setFillColor(ACCENT_SOFT)
    canvas.roundRect(margin, 80, content_w, 102, 10, stroke=0, fill=1)
    draw_text(canvas, "Let's build a trading product that feels clear.", margin + 18, 144, 15, "Portfolio-Medium")
    draw_text(canvas, "christian@godsbattle.net", margin + 18, 112, 10, "Portfolio-Medium", ACCENT)
    draw_text(
        canvas,
        "godsbattle.net · linkedin.com/in/christian-obanaka",
        margin + 235,
        112,
        8.2,
        color=MUTED,
    )
    canvas.linkURL("mailto:christian@godsbattle.net", (margin + 18, 106, margin + 210, 125))
    canvas.linkURL(
        "https://www.linkedin.com/in/christian-obanaka/",
        (margin + 330, 106, PAGE_W - margin - 14, 125),
    )
    canvas.save()


def render_pdf(pdf_path: Path, output_prefix: Path, dpi: int = 160) -> list[Path]:
    subprocess.run(["pdftoppm", "-png", "-r", str(dpi), str(pdf_path), str(output_prefix)], check=True)
    return sorted(output_prefix.parent.glob(f"{output_prefix.name}-*.png"))


def make_contact_sheet(pages: list[Path], output_path: Path) -> None:
    thumb_w = 560
    gap = 24
    margin = 28
    thumbs: list[Image.Image] = []
    for page in pages:
        with Image.open(page).convert("RGB") as image:
            thumb_h = round(image.height * thumb_w / image.width)
            thumbs.append(image.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS))
    rows = math.ceil(len(thumbs) / 2)
    thumb_h = thumbs[0].height
    sheet = Image.new("RGB", (margin * 2 + thumb_w * 2 + gap, margin * 2 + thumb_h * rows + gap * (rows - 1)), "#E8E8E8")
    for index, thumb in enumerate(thumbs):
        col = index % 2
        row = index // 2
        sheet.paste(thumb, (margin + col * (thumb_w + gap), margin + row * (thumb_h + gap)))
    sheet.save(output_path, optimize=True)


def create_share_pack(files: list[Path], output_path: Path) -> None:
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for file in files:
            archive.write(file, file.name)


def main() -> None:
    register_fonts()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="portfolio-shareables-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        resume_pdf = OUTPUT / "christian-obanaka-resume.pdf"
        portfolio_pdf = OUTPUT / "christian-obanaka-portfolio.pdf"
        build_resume(resume_pdf)
        build_portfolio(portfolio_pdf)
        resume_pages = render_pdf(resume_pdf, temp_dir / "resume")
        portfolio_pages = render_pdf(portfolio_pdf, temp_dir / "portfolio")
        resume_png = OUTPUT / "christian-obanaka-resume.png"
        shutil.copy2(resume_pages[0], resume_png)
        portfolio_pngs: list[Path] = []
        for index, page in enumerate(portfolio_pages, start=1):
            target = OUTPUT / f"christian-obanaka-portfolio-{index:02d}.png"
            shutil.copy2(page, target)
            portfolio_pngs.append(target)
        preview = OUTPUT / "christian-obanaka-portfolio-preview.png"
        make_contact_sheet(portfolio_pages, preview)
        create_share_pack([resume_pdf, resume_png, portfolio_pdf, *portfolio_pngs], OUTPUT / "christian-obanaka-share-pack.zip")
    print(f"Generated shareable files in {OUTPUT}")


if __name__ == "__main__":
    main()
