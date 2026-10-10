"""Framtidsposten: deterministic fictional postage stamps. Standard library only."""
import argparse
import hashlib
import random
import sys

PLACES = ("Månens baksida", "Glömda onsdagen", "Norr om norr", "Havet under sängen",
          "Den sjunde dörren", "Rymdens väntrum", "Sista hållplatsen", "Mellanrummet")
MOTIFS = ("◇", "✳", "○", "△", "☽", "✦", "◎", "□")
MESSAGES = ("ANKOMMER IGÅR", "RETUR TILL DRÖMMEN", "EJ TILL SALU",
            "POSTSTÄMPLAD I MORGON", "MOTTAGAREN ÄR EN GÅTA", "FÖRSENAD I TIDEN")
WIDTH = 27
HEIGHT = 9


def generate(seed: str) -> dict:
    """Return repeatable stamp data; no network or ambient randomness."""
    if not isinstance(seed, str) or not seed.strip():
        raise ValueError("Fröet måste innehålla text.")
    if len(seed) > 200:
        raise ValueError("Fröet får vara högst 200 tecken.")
    digest = hashlib.sha256(seed.encode("utf-8")).digest()
    rng = random.Random(int.from_bytes(digest, "big"))
    place = rng.choice(PLACES)
    motif = rng.choice(MOTIFS)
    message = rng.choice(MESSAGES)
    value = rng.randint(1, 99)
    stars = {(rng.randrange(WIDTH), rng.randrange(HEIGHT)) for _ in range(32)}
    grid = [[" " for _ in range(WIDTH)] for _ in range(HEIGHT)]
    for x, y in stars:
        grid[y][x] = "·"
    for y in range(2, HEIGHT - 1, 3):
        for x in range(3, WIDTH - 2, 6):
            grid[y][x] = motif
    return {"seed": seed, "place": place, "motif": motif, "message": message,
            "value": value, "sky": ["".join(row) for row in grid]}


def render(stamp: dict) -> str:
    """A fixed-width Unicode postcard, with perforated edges."""
    def row(text):
        if len(text) > WIDTH:
            text = text[:WIDTH - 1] + "…"
        return "│ " + text.center(WIDTH) + " │"

    out = ["  " + "┌" + "┄" * (WIDTH + 2) + "┐",
           row("FRAMTIDSPOSTEN  /  " + str(stamp["value"]) + " ÖRE"),
           row(stamp["place"].upper()), "  ├" + "─" * (WIDTH + 2) + "┤"]
    out.extend(row(line) for line in stamp["sky"])
    out.extend(["  ├" + "─" * (WIDTH + 2) + "┤", row(stamp["message"]),
                "  └" + "┄" * (WIDTH + 2) + "┘"])
    return "\n".join(out)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Tryck ett frimärke från en omöjlig plats.")
    parser.add_argument("fro", help="Textfrö: samma text ger samma frimärke")
    parser.add_argument("--antal", type=int, default=1, help="Antal märken, 1–20")
    args = parser.parse_args(argv)
    if not 1 <= args.antal <= 20:
        parser.error("--antal måste vara mellan 1 och 20")
    try:
        for index in range(args.antal):
            seed = args.fro if args.antal == 1 else f"{args.fro}:{index + 1}"
            print(render(generate(seed)))
            if index < args.antal - 1:
                print()
    except ValueError as exc:
        parser.error(str(exc))
    return 0


if __name__ == "__main__":
    sys.exit(main())
