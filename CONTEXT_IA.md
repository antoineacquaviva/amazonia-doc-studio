# CONTEXTE PROJET : AMAZONIA DOC STUDIO (v5.2)
- **Dépôt GitHub** : `https://github.com/antoineacquaviva/amazonia-doc-studio`
- **GitHub Pages** : `https://antoineacquaviva.github.io/amazonia-doc-studio/`
- **Jeu** : *Amazonia : Dernier Rempart* (Coopératif asymétrique 3-6 joueurs, 8 tours max).
- **Architecture** :
  - `index.html` : Studio Documentaire (Onglet 1: Livret Didactique dynamique type v4.3, Onglet 2: Explorateur des 116 profils A/B/C/D/E sur 32 emplacements, Onglet 3: Évolutions v4.3->v5.2, Onglet 4: Manifeste JSON pour le simulateur Python `foret-automate-lab`).
  - `data/amazonia_data_v5_2.js` : Source de vérité contenant `PEUPLES` (M,R,O,H,E,I), `CHASSIS_AXES` (10 axes = 2 304 configs dont Axe 10 `Regle_Resolution_Piege`: `EXIGE_PRESENCE_LOCALE` vs `AMORTISSEUR_SANS_PARADE`), `BUNDLES`, `MODULES_N3`, `CHANGELOG` et `CATALOG` (G1..G15, R1..R10, M1..M5 + 2 slots de migration).
- **Méthode de travail** : Ne jamais réécrire tout le fichier monolithique. Travailler par patchs ciblés sur les objets de données ou via des scripts Python dans `scripts/`.
