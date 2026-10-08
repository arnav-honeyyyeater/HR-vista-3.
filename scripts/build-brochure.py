"""Rebuild the downloadable brochure from the supplied page images, without cropping."""
from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

root = Path(__file__).resolve().parents[1]
pages = sorted((root / 'public/brochure').glob('page-*.png'))
assert len(pages) == 12, f'Expected 12 brochure pages, found {len(pages)}'
output = root / 'public/brochure/HR-VISTA-3.0.pdf'
doc = canvas.Canvas(str(output), pageCompression=1)
doc.setTitle('HR VISTA 3.0 - Official Brochure')
doc.setAuthor('CHRIST (Deemed to be University), Pune Lavasa Campus')
for source in pages:
    with Image.open(source) as image:
        width, height = image.size
        page_width = 595.28
        page_height = page_width * height / width
        doc.setPageSize((page_width, page_height))
        doc.drawImage(ImageReader(image), 0, 0, width=page_width, height=page_height)
        doc.showPage()
doc.save()
print(f'Created {output} ({output.stat().st_size:,} bytes; {len(pages)} pages)')
