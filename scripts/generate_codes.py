"""Génère les codes du Pack Pro.

- js/codes.js : les empreintes SHA-256 (publiées, inoffensives)
- codes_prives.txt : les codes en clair (JAMAIS committé — .gitignore)

Usage : python scripts/generate_codes.py [nombre]
Relancer le script AJOUTE de nouveaux codes sans invalider les anciens.
"""
import hashlib
import json
import re
import secrets
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CODES_JS = ROOT / "js" / "codes.js"
PRIVATE = ROOT / "codes_prives.txt"
ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"  # sans caractères ambigus (I/L/O/0/1)


def new_code() -> str:
    part = lambda: "".join(secrets.choice(ALPHABET) for _ in range(4))
    return f"CVPRO-{part()}-{part()}"


def main() -> None:
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 100

    existing_hashes: list[str] = []
    if CODES_JS.exists():
        match = re.search(r"\[(.*?)\]", CODES_JS.read_text(encoding="utf-8"), re.S)
        if match:
            existing_hashes = json.loads("[" + match.group(1) + "]")

    codes = [new_code() for _ in range(count)]
    hashes = existing_hashes + [hashlib.sha256(c.encode()).hexdigest() for c in codes]

    CODES_JS.write_text(
        "// Empreintes SHA-256 des codes Pack Pro (les codes en clair ne sont pas publiés).\n"
        "window.CVFUTE_CODE_HASHES = " + json.dumps(hashes, indent=2) + ";\n",
        encoding="utf-8",
    )
    with PRIVATE.open("a", encoding="utf-8") as f:
        f.write("\n".join(codes) + "\n")

    print(f"{count} codes ajoutés. Total : {len(hashes)}.")
    print(f"Codes en clair : {PRIVATE} (à garder secret, jamais dans git)")


if __name__ == "__main__":
    main()
