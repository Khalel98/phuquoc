#!/usr/bin/env python3
"""Скачивает фото с Wikimedia Commons для мест на Фукуоке.

Запуск: python3 scripts/fetch-images.py   (из корня проекта)
Существующие файлы не перезаписываются. Источники — в places/credits.json.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "places")
UA = "TripScheduleBot/1.0 (educational, non-commercial)"

# (slug, [запросы по приоритету])
QUERIES: list[tuple[str, list[str]]] = [
    ("pqc-airport", ["Phu Quoc International Airport", "Phu Quoc airport"]),
    ("long-beach", ["Long Beach Phu Quoc", "Duong Dong beach Phu Quoc"]),
    ("pho-bowl", ["Pho bo Vietnam bowl", "Pho noodle soup"]),
    ("banh-mi", ["Banh mi sandwich Vietnam", "Banh mi"]),
    ("sunset-beach", ["Phu Quoc sunset", "sunset beach Phu Quoc"]),
    ("night-market", ["Phu Quoc night market", "Dinh Cau night market"]),
    ("seafood-grill", ["Vietnamese grilled seafood", "seafood market Vietnam"]),
    ("breakfast-tropical", ["tropical fruit platter", "Vietnamese breakfast"]),
    ("cable-car", ["Hon Thom cable car", "Phu Quoc cable car"]),
    ("hon-thom", ["Hon Thom island", "Hon Thom Phu Quoc"]),
    ("water-park", ["water park slides", "Aquatopia water park"]),
    ("sunset-town", ["Sunset Town Phu Quoc", "Phu Quoc Sunset Town"]),
    ("kiss-bridge", ["Kiss Bridge Phu Quoc", "Cau Hon Phu Quoc"]),
    ("fireworks", ["fireworks over sea night", "fireworks Vietnam"]),
    ("an-thoi-islands", ["An Thoi archipelago", "An Thoi islands Phu Quoc"]),
    ("snorkeling", ["snorkeling coral reef", "snorkeling tropical"]),
    ("fishing-boats", ["Phu Quoc fishing boats", "An Thoi harbour boats"]),
    ("noodle-soup", ["Vietnamese noodle soup bun", "Bun rieu"]),
    ("massage-spa", ["foot massage Vietnam", "Thai massage", "massage therapist"]),
    ("sao-beach", ["Sao beach Phu Quoc", "Bai Sao Phu Quoc"]),
    ("ho-quoc-pagoda", ["Truc Lam Ho Quoc", "Hộ Quốc Phú Quốc", "Ho Quoc pagoda"]),
    ("prison", ["Phu Quoc prison", "Coconut tree prison Phu Quoc"]),
    ("fish-sauce", ["Phu Quoc fish sauce", "fish sauce barrels Vietnam"]),
    ("pepper-farm", ["pepper plantation", "Piper nigrum plantation", "black pepper vine"]),
    ("ham-ninh", ["Ham Ninh Phu Quoc", "Ham Ninh fishing village"]),
    ("crab-dish", ["Vietnamese crab dish", "steamed crab Vietnam"]),
    ("safari", ["Vinpearl Safari Phu Quoc", "Vinpearl Safari"]),
    ("vinwonders", ["VinWonders Phu Quoc", "Vinpearl Land Phu Quoc"]),
    ("grand-world", ["Grand World Phu Quoc", "Grand World Phu Quoc Venice"]),
    ("starfish", ["starfish beach Phu Quoc", "Rach Vem starfish"]),
    ("dinh-cau", ["Dinh Cau Phu Quoc", "Dinh Cau temple"]),
    ("duong-dong-market", ["Duong Dong market Phu Quoc", "Vietnam market stall"]),
    ("duong-dong-town", ["Duong Dong Phu Quoc", "Duong Dong river"]),
    ("resort-pool", ["resort swimming pool palm trees", "tropical resort pool"]),
    ("vn-coffee", ["Vietnamese coffee phin", "Ca phe sua da"]),
    ("restaurant-vn", ["Vietnamese restaurant table food", "Vietnamese cuisine dishes"]),
    ("hotel", ["Wyndham Grand Phu Quoc", "Bai Dai Phu Quoc beach resort", "Phu Quoc resort"]),
    ("palm-beach", ["Phu Quoc beach palm", "Phu Quoc island beach"]),
]



def curl(url: str, out: str | None = None) -> bytes:
    """curl -4 с повторами (надёжнее urllib в нестабильных сетях)."""
    cmd = ["curl", "-4", "-sSfL", "--retry", "4", "--retry-all-errors", "-m", "40", "-A", UA, url]
    if out:
        cmd += ["-o", out]
    return subprocess.run(cmd, check=True, capture_output=True).stdout


def api(params: dict) -> dict:
    params = {**params, "format": "json"}
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    return json.loads(curl(url).decode())


def find_image(query: str, used: set[str]) -> dict | None:
    data = api(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": f"{query} filetype:bitmap",
            "gsrnamespace": "6",
            "gsrlimit": "12",
            "prop": "imageinfo",
            "iiprop": "url|size|mime|extmetadata",
            "iiurlwidth": "1280",
        }
    )
    pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in pages:
        ii = (p.get("imageinfo") or [{}])[0]
        if ii.get("mime") != "image/jpeg":
            continue
        if ii.get("width", 0) < 900 or ii.get("width", 0) < ii.get("height", 0):
            continue
        if p["title"] in used:
            continue
        meta = ii.get("extmetadata", {})
        return {
            "title": p["title"],
            "thumb": ii.get("thumburl") or ii["url"],
            "page": ii.get("descriptionurl"),
            "license": (meta.get("LicenseShortName") or {}).get("value", ""),
            "author": (meta.get("Artist") or {}).get("value", ""),
        }
    return None


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    credits_path = os.path.join(OUT_DIR, "credits.json")
    credits = json.load(open(credits_path)) if os.path.exists(credits_path) else {}
    used = {c["title"] for c in credits.values()}
    for slug, queries in QUERIES:
        out = os.path.join(OUT_DIR, slug + ".jpg")
        if os.path.exists(out):
            continue
        hit = None
        for q in queries:
            try:
                hit = find_image(q, used)
            except Exception as e:  # noqa: BLE001
                print("ERR search", slug, e, file=sys.stderr)
            if hit:
                break
            time.sleep(0.5)
        if not hit:
            print("MISS", slug)
            continue
        try:
            curl(hit["thumb"], out)
        except Exception as e:  # noqa: BLE001
            print("ERR download", slug, e, file=sys.stderr)
            if os.path.exists(out):
                os.remove(out)
            continue
        used.add(hit["title"])
        credits[slug] = hit
        print("OK  ", slug, "<-", hit["title"])
        time.sleep(0.7)
    json.dump(credits, open(credits_path, "w"), ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
