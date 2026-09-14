import os
import subprocess

pdf_file = 'scratch/book.pdf'
out_dir = 'scratch/pages'
os.makedirs(out_dir, exist_ok=True)

print("Starting PDF to JPEG conversion...")
subprocess.run(['pdftoppm', '-jpeg', pdf_file, f'{out_dir}/page'])

print("Starting OCR extraction...")
images = sorted([f for f in os.listdir(out_dir) if f.endswith('.jpg')])

with open('scratch/full_book_ocr.txt', 'w') as f_out:
    for img in images:
        img_path = os.path.join(out_dir, img)
        print(f"Processing {img}...")
        result = subprocess.run(['tesseract', img_path, 'stdout', '-l', 'ben'], capture_output=True, text=True)
        f_out.write(f"\n--- Page {img} ---\n")
        f_out.write(result.stdout)
        
print("Extraction complete! Check scratch/full_book_ocr.txt")
