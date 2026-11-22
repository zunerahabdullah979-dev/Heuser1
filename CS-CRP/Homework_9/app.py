"""
CartoonVerse — Flask Backend
Serves the homepage, game (HW6), portfolio (HW8), and API pages.
Listens on 0.0.0.0 using the PORT env var (Render-compatible).
"""

import os
from flask import Flask, send_from_directory, abort

# ---------------------------------------------------------------------------
# App configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=None)  # we handle static files manually


# ---------------------------------------------------------------------------
# Helper — serve a file from a subfolder
# ---------------------------------------------------------------------------
def _send(folder, filename):
    """Return a file from *folder* (relative to BASE_DIR)."""
    directory = os.path.join(BASE_DIR, folder)
    filepath = os.path.join(directory, filename)
    if not os.path.isfile(filepath):
        abort(404)
    return send_from_directory(directory, filename)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

# ── Homepage ───────────────────────────────────────────────────────────────
@app.route("/")
def home_index():
    return _send("home", "index.html")


@app.route("/home/<path:filename>")
def home_assets(filename):
    return _send("home", filename)


# ── Game (Homework 6) ─────────────────────────────────────────────────────
@app.route("/game")
@app.route("/game/")
def game_index():
    return _send("game", "index.html")


@app.route("/game/<path:filename>")
def game_assets(filename):
    return _send("game", filename)


# ── Portfolio (Homework 8) ─────────────────────────────────────────────────
@app.route("/portfolio")
@app.route("/portfolio/")
def portfolio_index():
    # The portfolio file is named index2.html — try that first, fall back to
    # index.html so it works regardless of which name you use.
    directory = os.path.join(BASE_DIR, "portfolio")
    for name in ("index.html", "index2.html"):
        if os.path.isfile(os.path.join(directory, name)):
            return send_from_directory(directory, name)
    abort(404)


@app.route("/portfolio/<path:filename>")
def portfolio_assets(filename):
    return _send("portfolio", filename)


# ── API (placeholder — built in a later stage) ────────────────────────────
@app.route("/api")
@app.route("/api/")
def api_index():
    directory = os.path.join(BASE_DIR, "api")
    index_path = os.path.join(directory, "index.html")
    if os.path.isfile(index_path):
        return send_from_directory(directory, "index.html")
    return (
        "<h1 style='font-family:sans-serif;text-align:center;margin-top:15vh;'>"
        "🚀 API Explorer — Coming Soon</h1>",
        200,
    )


@app.route("/api/<path:filename>")
def api_assets(filename):
    return _send("api", filename)


# ---------------------------------------------------------------------------
# Custom 404 page
# ---------------------------------------------------------------------------
@app.errorhandler(404)
def page_not_found(_e):
    html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>404 — Lost in the Multiverse</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  min-height:100vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  background:linear-gradient(135deg,#0a0a2e,#1a0533);
  color:#e0e0ff;font-family:'Segoe UI',Tahoma,sans-serif;
  text-align:center;overflow:hidden;
}
.code{font-size:8rem;font-weight:900;
  background:linear-gradient(90deg,#00e5ff,#aa00ff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.msg{font-size:1.4rem;margin:1rem 0 2rem;color:#b0b0d0;}
a{
  display:inline-block;padding:.8rem 2.4rem;border-radius:50px;
  background:linear-gradient(135deg,#00e5ff,#7c4dff);
  color:#fff;text-decoration:none;font-weight:700;font-size:1rem;
  transition:transform .3s,box-shadow .3s;
}
a:hover{transform:scale(1.08);box-shadow:0 0 25px rgba(0,229,255,.5)}
.stars{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1}
.star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;
  animation:twinkle 3s ease-in-out infinite alternate}
@keyframes twinkle{0%{opacity:.2}100%{opacity:1}}
</style>
</head>
<body>
<div class="stars" id="stars404"></div>
<div class="code">404</div>
<p class="msg">You've drifted into an unknown dimension!</p>
<a href="/">← Return to CartoonVerse</a>
<script>
const c=document.getElementById('stars404');
for(let i=0;i<80;i++){const s=document.createElement('div');s.className='star';
s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
s.style.animationDelay=Math.random()*3+'s';c.appendChild(s);}
</script>
</body>
</html>"""
    return html, 404


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
