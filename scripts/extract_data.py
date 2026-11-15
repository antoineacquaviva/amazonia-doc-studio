import re, json, pathlib

html_path = pathlib.Path("index.html")
text = html_path.read_text(encoding="utf-8")

# 1. Nettoyer les balises LaTeX résiduelles ($p=1$ -> p=1)
text_clean = re.sub(r"\$([^\$]+)\$", r"\1", text)
html_path.write_text(text_clean, encoding="utf-8")

# 2. Extraire le bloc JSON de données si besoin ou initialiser data/
data_dir = pathlib.Path("data")
data_dir.mkdir(exist_ok=True)
print("index.html nettoyé des balises $LaTeX$ et dossier data/ prêt !")