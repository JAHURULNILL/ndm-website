#!/usr/bin/env python3
"""Build index.html from index.template.html by inlining the prepared
screenshots (tools/shots.json) as data URIs.

Why: the site's deploy route (the GitHub connector) carries text only,
so the genuine app screenshots travel inside the page itself instead
of as binary asset files. Run tools/make_shots.py first if the
screenshots change, then this.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent


def main():
    shots = json.loads((ROOT / "tools" / "shots.json").read_text())
    html = (ROOT / "index.template.html").read_text()
    css = (ROOT / "styles.css").read_text()
    assert "%%CSS%%" in html, "%%CSS%% placeholder missing from template"
    html = html.replace("%%CSS%%", "<style>\n" + css + "\n</style>")
    for name, shot in shots.items():
        token = f"%%IMG:{name}%%"
        assert token in html, f"placeholder {token} missing from template"
        html = html.replace(token, shot["uri"])
    assert "%%IMG:" not in html, "unreplaced image placeholder remains"
    (ROOT / "index.html").write_text(html)
    print(f"index.html written: {len(html) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
