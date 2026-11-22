"""Упаковывает docs/*.pdf в docs/*.pdf.js, чтобы кнопка «Скачать» работала при открытии через file://.

Запуск из корня проекта: python3 tools/build_doc_blobs.py
"""
import base64
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
for pdf in sorted((root / "docs").glob("*.pdf")):
    key = "docs/" + pdf.name
    data = base64.b64encode(pdf.read_bytes()).decode("ascii")
    out = pdf.with_name(pdf.name + ".js")
    out.write_text(
        "(window.__pdfBlobs=window.__pdfBlobs||{})[" + json.dumps(key) + "]=\"" + data + "\";\n",
        encoding="ascii",
    )
    print(out.relative_to(root))
