// -------------------------------------------------------------------------
    // 1. MÉTADONNÉES DES 6 PEUPLES & MATRICE 6x5 DES 30 TUILES DE LISIÈRE
    // -------------------------------------------------------------------------
    const PEUPLES = {
      M: { code: 'M', nom: 'Mammifères', famille: 'Animal Sauvage (Gardien)', badge: 'bg-amber-100 text-amber-900 border-amber-300', icon: '🐆' },
      R: { code: 'R', nom: 'Reptiles', famille: 'Animal Sauvage (Gardien)', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: '🐍' },
      O: { code: 'O', nom: 'Oiseaux', famille: 'Animal Sauvage (Gardien)', badge: 'bg-sky-100 text-sky-900 border-sky-300', icon: '🦜' },
      H: { code: 'H', nom: 'Humains', famille: 'Onirique (Rêve)', badge: 'bg-rose-100 text-rose-900 border-rose-300', icon: '🏹' },
      E: { code: 'E', nom: 'Entités Magiques', famille: 'Onirique (Rêve)', badge: 'bg-purple-100 text-purple-900 border-purple-300', icon: '✨' },
      I: { code: 'I', nom: 'Insectes', famille: 'Symbiotique (Croissance)', badge: 'bg-lime-100 text-lime-900 border-lime-300', icon: '🐜' }
    };

    // Matrice exacte § 2.3 : pour toute paire de voisins (X, Y), renvoie les deux tuiles présentes sur leur lisière
    const MATRICE_PAIRES = {
      'M_R': ['G1', 'G2'], 'R_M': ['G2', 'G1'],
      'M_O': ['G3', 'G4'], 'O_M': ['G4', 'G3'],
      'R_O': ['G5', 'G6'], 'O_R': ['G6', 'G5'],
      'M_H': ['G7', 'R3'], 'H_M': ['R3', 'G7'],
      'M_E': ['G8', 'R7'], 'E_M': ['R7', 'G8'],
      'R_H': ['G9', 'R4'], 'H_R': ['R4', 'G9'],
      'R_E': ['G10', 'R8'], 'E_R': ['R8', 'G10'],
      'O_H': ['G11', 'R5'], 'H_O': ['R5', 'G11'],
      'O_E': ['G12', 'R9'], 'E_O': ['R9', 'G12'],
      'M_I': ['G13', 'M1'], 'I_M': ['M1', 'G13'],
      'R_I': ['G14', 'M2'], 'I_R': ['M2', 'G14'],
      'O_I': ['G15', 'M3'], 'I_O': ['M3', 'G15'],
      'H_E': ['R1', 'R2'], 'E_H': ['R2', 'R1'],
      'H_I': ['R6', 'M4'], 'I_H': ['M4', 'R6'],
      'E_I': ['R10', 'M5'], 'I_E': ['M5', 'R10']
    };

    // -------------------------------------------------------------------------
    // 2. LES 10 AXES DU CHÂSSIS (PRODUIT CARTÉSIEN = 128 CONFIGURATIONS)
    // -------------------------------------------------------------------------
    const CHASSIS_AXES_SPEC = [
      {
        key: 'P_Max',
        num: 1,
        label: '1. Topologie & Dotation Seuil Imprimé',
        defaultVal: 4,
        options: [
          { val: 4, text: 'P4_2233 : 4 parcelles [2,2,3,3] (10N Arbres · Standard)' },
          { val: 5, text: 'P5_22233 : 5 parcelles [2,2,2,3,3] (12N Arbres)' }
        ]
      },
      {
        key: 'Regle_Ouverture_Reve_Multiple',
        num: 2,
        label: '2. Ouverture multiple d’un Rêve (3.2)',
        defaultVal: 'UNIQUE_PAR_TOUR',
        options: [
          { val: 'UNIQUE_PAR_TOUR', text: 'Unique par tour (1 ouverture max/tour)' },
          { val: 'PAR_DE_M_DESIGNE', text: 'Cumulatif (1 ouverture par dé M désigné)' }
        ]
      },
      {
        key: 'Offset_Seuil_Parade',
        num: 3,
        label: '3. Décalage du Seuil de Parade',
        defaultVal: 0,
        options: [
          { val: 0, text: 'Offset 0 (Défense ≥ Seuil Imprimé modifié)' },
          { val: 1, text: 'Offset +1 (Exige +1 Défenseur de plus)' }
        ]
      },
      {
        key: 'Mise_En_Place_Tactiques',
        num: 4,
        label: '4. Mise en place Piste des Tactiques',
        defaultVal: 'ORDRE_FIXE_T1_T6',
        options: [
          { val: 'ORDRE_FIXE_T1_T6', text: 'Ordre croissant fixe T1 à T6 (Standard)' },
          { val: 'ALEATOIRE', text: 'Tirage aléatoire au départ' }
        ]
      },
      {
        key: 'Declenchement_Fin_De_Piste',
        num: 5,
        label: '5. Entrée en Siège T4',
        defaultVal: 'ARRIVEE_DERNIERE_PARCELLE',
        options: [
          { val: 'ARRIVEE_DERNIERE_PARCELLE', text: 'Dès présence sur la dernière parcelle intacte' },
          { val: 'DEPASSEMENT_DERNIERE_PARCELLE', text: 'Par dépassement de la dernière parcelle' }
        ]
      },
      {
        key: 'Role_Abatteuse_Fin_De_Piste',
        num: 6,
        label: '6. Rôle de l’Abatteuse en Siège T4',
        defaultVal: 'STANDARD_COUPE_ARBRE',
        options: [
          { val: 'STANDARD_COUPE_ARBRE', text: 'Standard (Coupe uniquement les Arbres)' },
          { val: 'ARRACHE_1_SOUCHE_SI_SANS_ARBRE', text: 'Arrache 1 Souche s’il n’y a plus d’Arbre' }
        ]
      },
      {
        key: 'Synergie_Binome_Machines',
        num: 7,
        label: '7. Puissance du binôme de machines',
        defaultVal: 'INDIVIDUELLE',
        options: [
          { val: 'INDIVIDUELLE', text: 'Individuelle (Propre à chaque machine)' },
          { val: 'MUTUALISATION_PUISSANCE_MEME_PARCELLE', text: 'Mutualisée sur une même parcelle' }
        ]
      }
    ];

    // -------------------------------------------------------------------------
    // 3. CATALOGUE COMPLET DES 32 EMPLACEMENTS ET 116 PROFILS (v5.2)
    // -------------------------------------------------------------------------
    const CATALOGUE_TUILES = {
      // ==================== 15 GARDIENS (G1 à G15) ====================
      G1: {
        id: 'G1', famille: 'GARDIEN', couple: ['M', 'R'], origine: 'M', nomBase: 'Le Bond du Jaguar',
        profils: {
          A: {
            nom: 'Le Bond du Jaguar', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'MOD_PUISSANCE', tags: ['SURCHAUFFE'], requires_options: {},
            texte: '<strong>Face 1 :</strong> Retournez 1 jeton Puissance rouge d’une machine sur sa face bleue <em>Surchauffe</em>.<br><strong>Face 2 :</strong> Retournez jusqu’à 2 jetons rouges en bleus <em>Surchauffe</em> (répartis librement entre des machines).',
            temoin: 'En Face 2, permet de retourner au plus 2 jetons rouges au total, répartis librement entre une ou deux machines.'
          },
          B: {
            nom: 'Le Bond du Jaguar', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE / LOI 5',
            primitive: 'MOD_SEUIL + MOD_PUISSANCE', tags: ['SURCHAUFFE', 'PARADE_AUTO'], requires_options: {},
            texte: '<strong>Face 1 :</strong> Réduisez de -2 le Seuil de Parade d’une machine portant au moins 1 jeton Puissance (rouge ou bleu) pour le reste du tour.<br><strong>Face 2 (Loi 5) :</strong> Dès qu’une machine porte ≥ 2 jetons bleus (<em>Surchauffe</em>) au moment de frapper, défaussez 2 bleus pour <strong>parer automatiquement ses frappes encore à résoudre</strong> (et, en 5.3, la faire reculer d’1 parcelle au lieu de son avancée si elle n’est pas en siège).',
            temoin: 'Prioritaire sur le test de Piège : consomme automatiquement 2 bleus avant la frappe et laisse un éventuel Piège non engagé.'
          }
        }
      },
      G2: {
        id: 'G2', famille: 'GARDIEN', couple: ['R', 'M'], origine: 'R', nomBase: 'L’Étreinte de l’Anaconda',
        profils: {
          A: {
            nom: 'L’Étreinte de l’Anaconda', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (MACHINE)', tags: ['RECUL'], requires_options: {},
            texte: '<strong>Face 1 :</strong> Faites reculer d’1 parcelle (p → p-1) une machine non en siège située sur une parcelle avec un Défenseur.<br><strong>Face 2 :</strong> Faites reculer d’1 parcelle n’importe quelle machine non en siège.',
            temoin: 'Saute les Routes Forestières. Ne modifie pas les cibles déjà programmées en 3.2.'
          },
          B: {
            nom: 'L’Étreinte de l’Anaconda', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_MACHINE_PAREE_SANS_ELAN)', tags: ['PARADE_TOTALE'], requires_options: {},
            texte: '<strong>Face 1 (Loi 5.3) :</strong> Une machine dont toutes les frappes sont parées <strong>n’avance pas</strong> sur T3/T6.<br><strong>Face 2 (Loi 5.3) :</strong> Une machine dont toutes les frappes sont parées <strong>n’avance pas ET ne gagne pas de Puissance</strong> sur T3 à T6.',
            temoin: 'Une frappe amortie (Amortisseur) ou annulée sur Route ne compte pas comme parée pour cette loi.'
          },
          C: {
            nom: 'La fuite sous les feuilles', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (INSECTE TOUS)', tags: ['INSECTES', 'MOBILITE'], requires_options: {},
            texte: 'Vous pouvez déplacer <strong>tous les Insectes</strong> d’une parcelle vers la prochaine parcelle non rasée du même rayon, côté bordure ou côté cœur.',
            temoin: '3 Insectes en p=1, Route en p=2, Nid en p=3 : les 3 arrivent ensemble en p=3 sans allumer la case 6. Indisponible si un Insecte de la pile est déjà engagé pour le retrait 5.3.'
          }
        }
      },
      G3: {
        id: 'G3', famille: 'GARDIEN', couple: ['M', 'O'], origine: 'M', nomBase: 'La Voltige de l’Atèle',
        profils: {
          A: {
            nom: 'La Voltige de l’Atèle', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (DEFENSEUR)', tags: ['MOBILITE', 'ARMEMENT'], requires_options: {},
            texte: 'Déplacez 1 Défenseur (y compris un constructeur resté en bordure de lisière en 3.1) vers une parcelle Forêt intacte adjacente.',
            temoin: 'Un constructeur en bordure peut rejoindre p=1 d’un rayon bordant sa lisière.'
          },
          B: {
            nom: 'La Voltige de l’Atèle', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 4.1 -> 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_FURTIVITE_GLISSE_EN_FORET_ETAPE_5)', tags: ['FURTIVITE', 'ARMEMENT', 'MOBILITE'], requires_options: {},
            texte: '<strong>Loi 4.1 :</strong> Une fois par tour, après l’action d’un binôme sur l’une des lisières de M ou O, 1 de ses Défenseurs glisse gratuitement sur une parcelle Forêt intacte en face pour l’Étape 5.',
            temoin: 'Idéal pour agir en Furtivité en 4.1 puis armer un Piège Embuscade en Forêt à l’Étape 5.'
          },
          C: {
            nom: 'Le passage des singes-lianes', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (TRAVERSEE M<->O)', tags: ['MOBILITE', 'ARMEMENT'], requires_options: {},
            texte: 'Vous pouvez faire passer un Défenseur du rayon des Mammifères à celui des Oiseaux, ou inversement, à la même profondeur. Les deux parcelles doivent être non rasées.',
            temoin: 'Une Parade chez M ouvre G3 C : un Défenseur ayant paré traverse chez O à même profondeur. La première Parade reste acquise.'
          },
          D: {
            nom: 'Les sentinelles des lianes', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (FURTIVITE -> PARCELLE_PIEGEE)', tags: ['ARMEMENT', 'FURTIVITE'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez déplacer un Défenseur d’une case Furtivité vers une parcelle piégée des Mammifères ou des Oiseaux qui lui fait face.',
            temoin: 'Un binôme a agi en Furtivité face à M p=2 piégée : à l’ouverture, 1 Défenseur rejoint M p=2 pour armer l’Embuscade.'
          },
          E: {
            nom: 'Le repli de l’Atèle', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (PARCELLE_PIEGEE -> ADJACENTE)', tags: ['EVACUATION', 'REDEPLOIEMENT'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Vous pouvez déplacer un Défenseur d’une parcelle piégée des Mammifères ou des Oiseaux vers la parcelle non rasée suivante ou précédente du même rayon.',
            temoin: 'Laisse l’Amortisseur contenir seul la frappe en p=2 et envoie le Défenseur sauver p=3.'
          }
        }
      },
      G4: {
        id: 'G4', famille: 'GARDIEN', couple: ['O', 'M'], origine: 'O', nomBase: 'Le Cri d’Alarme de l’Ara',
        profils: {
          A: {
            nom: 'Le Cri d’Alarme de l’Ara', cycle: 'SACRIFICE_ONESHOT', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE / SACRIFICE 3.2',
            primitive: 'MOD_SEUIL / DEPLACEMENT', tags: ['REDEPLOIEMENT'], requires_options: {},
            texte: '<strong>Face 1 (Ouverture) :</strong> Réduisez de -1 le Seuil de Parade sur une parcelle des rayons O ou M pour le reste du tour.<br><strong>Sacrifice (en 3.2 après révélation) :</strong> Déplacez jusqu’à 2 Défenseurs vers des parcelles ciblées (renvoyez G4 sur sa Face 1 en lisière ; il libère sa case).',
            temoin: 'Le retour en lisière recompte immédiatement le seuil du Réveil de la Forêt.'
          },
          B: {
            nom: 'Le Cri d’Alarme de l’Ara', cycle: 'SACRIFICE_ONESHOT', cablage: [1,2,3,4,5,6], fenetre: 'LOI 2.1 / SACRIFICE DÉBUT 2',
            primitive: 'MOD_LOI_DU_COEUR + PARTAGE_INFO', tags: ['INFORMATION', 'PORTÉE'], requires_options: {},
            texte: '<strong>Face 1 (Loi 2.1) :</strong> Le peuple d’origine (O) et son voisin (M) posent leur 1er Défenseur à portée globale.<br><strong>Sacrifice (Début Étape 2) :</strong> Tous les mini-paravents sont ouverts <strong>avant</strong> de placer les Défenseurs ce tour-ci (renvoyez G4 en lisière).',
            temoin: 'Permet un tour de coordination parfaite à information ouverte.'
          }
        }
      },
      G5: {
        id: 'G5', famille: 'GARDIEN', couple: ['R', 'O'], origine: 'R', nomBase: 'L’Affût de la Matamata',
        profils: {
          A: {
            nom: 'L’Affût de la Matamata', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE (LOI TEMP 5)',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SOUCHES_REDUISENT_SEUIL)', tags: ['SOUCHES'], requires_options: {},
            texte: '<strong>Face 1 :</strong> Choisissez 1 parcelle ciblée contenant au moins 1 Souche : réduisez de <strong>−1</strong> son Seuil de Parade pour ce tour.<br><strong>Face 2 :</strong> Choisissez jusqu’à 2 parcelles ciblées contenant chacune au moins 1 Souche : réduisez de <strong>−1</strong> leur Seuil de Parade pour ce tour.',
            temoin: 'Lecture dynamique à chaque frappe : si une Abatteuse crée 2 Souches en 5.1, elles valent aussi 0 contre le Bulldozer en 5.2.'
          },
          B: {
            nom: 'L’Affût de la Matamata', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SOUCHES_REDUISENT_SEUIL)', tags: ['SOUCHES'], requires_options: {},
            texte: '<strong>Face 1 (Loi 5) :</strong> Sur les rayons R et O, toute parcelle contenant au moins 1 Souche voit son Seuil de Parade réduit de <strong>−1</strong>.<br><strong>Face 2 (Loi 5) :</strong> Sur tout le plateau, toute parcelle contenant au moins 1 Souche voit son Seuil de Parade réduit de <strong>−1</strong>.',
            temoin: 'Les Souches restent sur la parcelle, seul leur poids dans le calcul du Seuil est ramené à 0.'
          },
          C: {
            nom: 'Le Perchoir du caïman', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SOUTIEN_MACHINE_VERS_DEVANT)', tags: ['SOUTIEN', 'ARMEMENT'], requires_options: {},
            texte: '<strong>Loi 5 :</strong> Sur les rayons des Reptiles et des Oiseaux, quand une machine frappe devant elle, chaque Défenseur situé sur la parcelle de la machine apporte aussi +1 point de Défense à la parcelle frappée.',
            temoin: 'Ce point de soutien à distance suffit à armer un Piège Embuscade sur la parcelle devant la machine, même si celle-ci est vide de pion.'
          }
        }
      },
      G6: {
        id: 'G6', famille: 'GARDIEN', couple: ['O', 'R'], origine: 'O', nomBase: 'L’Œil Double du Toucan',
        profils: {
          A: {
            nom: 'L’Œil Double du Toucan', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE (3.2)',
            primitive: 'PERMUTATION_PISTE (LECTURE_DE_M)', tags: ['LECTURE_DE'], requires_options: {},
            texte: 'En 3.2, décalez de -1 ou +1 rang la lecture du dé M d’un joueur sur la Piste des Tactiques.',
            temoin: 'Si ouvert avant 3.2, prépare le décalage pour la révélation du tour courant.'
          },
          B: {
            nom: 'L’Œil Double du Toucan', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 1.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_DE_M_CHOIX_MIN_MAX)', tags: ['LECTURE_DE'], requires_options: {},
            texte: '<strong>Loi 1.3 :</strong> Le peuple d’origine (O) et son voisin (R) peuvent retenir le plus grand de leurs deux dés (M = max(D1, D2)) derrière leur paravent.',
            temoin: 'Permet d’aller chercher volontairement les Rêves insérés aux rangs 5 et 6.'
          },
          C: {
            nom: 'Le Vol en ciseaux', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (ECHANGE_ATOMIQUE)', tags: ['FURTIVITE', 'INSECTES', 'ARMEMENT'], requires_options: {},
            texte: 'Vous pouvez échanger simultanément 1 Défenseur d’une parcelle des Oiseaux ou des Reptiles avec 1 Insecte de la case Furtivité qui lui fait face sur leur lisière commune.',
            temoin: 'Avant 4.1, permet de réunir 2 Défenseurs en Furtivité pour agir sans dépenser l’Insecte.'
          }
        }
      },
      G7: {
        id: 'G7', famille: 'GARDIEN', couple: ['M', 'H'], origine: 'M', nomBase: 'Le Barrage du Capybara',
        profils: {
          A: {
            nom: 'Le Barrage du Capybara', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE', 'SOUCHES'], requires_options: {},
            texte: 'Posez 1 Piège sur une parcelle non rasée contenant au moins 1 Souche et aucun Piège, même occupée par une machine ou ciblée (déclenche la case 2).',
            temoin: 'Fonctionne sur toute la roue dès qu’une Souche est présente.'
          },
          B: {
            nom: 'Le Barrage du Capybara', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 4.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_PIEGE_SOUS_MACHINE_OU_CIBLE)', tags: ['POSE', 'FURTIVITE'], requires_options: {},
            texte: '<strong>Loi 4.1 :</strong> Les binômes en Furtivité peuvent poser un Piège <strong>même sur une parcelle occupée par une machine</strong> (et ce Piège s’arme immédiatement si au moins 1 Défenseur du binôme glisse dessus ou soutient la parcelle).',
            temoin: 'Fait sauter le verrou majeur du minage en Furtivité.'
          },
          C: {
            nom: 'La Loutre géante', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_DEFENSEURS_APRES_PREMIER_DOUBLES)', tags: ['PARADE_CLASSIQUE'], requires_options: {},
            texte: '<strong>Loi 5 :</strong> Sur les rayons des Mammifères et des Humains, chaque Défenseur physiquement présent après le premier apporte <strong>2 points de Défense</strong> (D + max(0, D−1)).',
            temoin: '2 Défenseurs valent 3 points de Défense, épargnant les Insectes locaux.'
          },
          D: {
            nom: 'Le barrage habité du Capybara', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE', 'ARMEMENT'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez poser 1 Piège sur une parcelle des Mammifères ou des Humains contenant au moins 1 Défenseur ou 1 Insecte (même avec machine ou ciblage, sans exiger de Souche).',
            temoin: 'Pose un Piège immédiatement armé par la présence locale (un soutien distant seul ne suffit pas pour la pose).'
          },
          E: {
            nom: 'Les abattis mobiles du Capybara', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (PIEGE)', tags: ['RECYCLAGE', 'CIBLAGE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Vous pouvez déplacer 1 Piège non engagé d’une parcelle des Mammifères ou des Humains vers la parcelle non rasée suivante ou précédente du même rayon, si celle-ci est ciblée et sans Piège.',
            temoin: 'Permet de réaffecter un Amortisseur préparé vers une parcelle ciblée (sans allumer la case 2).'
          }
        }
      },
      G8: {
        id: 'G8', famille: 'GARDIEN', couple: ['M', 'E'], origine: 'M', nomBase: 'Le Sillage du Boto',
        profils: {
          A: {
            nom: 'Le Sillage du Boto', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE (3.2)',
            primitive: 'DEPLACEMENT (CIBLAGE)', tags: ['CIBLAGE'], requires_options: {},
            texte: 'En 3.2, décalez l’ensemble des cibles d’une machine non en siège d’1 parcelle dans le même sens le long de son rayon, sans déplacer la machine.',
            temoin: 'Le Bulldozer conserve sa coupe et son terrassement normaux sur la nouvelle cible.'
          },
          B: {
            nom: 'Le Sillage du Boto', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_INVERSION_ETAPE_5_1_ET_5_2)', tags: ['ORDRE_MACHINES'], requires_options: {},
            texte: '<strong>Loi 5 :</strong> Sur 1 rayon au choix par tour, résolvez le <strong>Bulldozer (5.2) avant l’Abatteuse (5.1)</strong>. Chaque machine conserve ses effets normaux.',
            temoin: 'Sur 3 Arbres sans Souche : le Bulldozer laisse 2 Arbres (0 Souche), puis l’Abatteuse laisse 0 Arbre et 2 Souches (évite la Route Forestière !).'
          }
        }
      },
      G9: {
        id: 'G9', famille: 'GARDIEN', couple: ['R', 'H'], origine: 'R', nomBase: 'Le Guet du Caïman Noir',
        profils: {
          A: {
            nom: 'Le Guet du Caïman Noir', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (SABOTAGE)', tags: ['SABOTAGE'], requires_options: {},
            texte: '<strong>Face 1 :</strong> Ajoutez 1 carte Sabotage de la réserve à la pile mise de côté (déclenche la case 3).<br><strong>Face 2 :</strong> Ajoutez 2 cartes Sabotage à la pile mise de côté.',
            temoin: 'Génère du Sabotage pur en réaction à n’importe quel Déclencheur.'
          },
          B: {
            nom: 'Le Guet du Caïman Noir', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'LOI 4.1 / LOI 3.2',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SABOTAGE_SUR_MACHINE_ACTIVE)', tags: ['SABOTAGE', 'FURTIVITE'], requires_options: {},
            texte: '<strong>Face 1 (Loi 4.1) :</strong> Un binôme peut saboter face à une parcelle même si une machine y est active ce tour-ci ou en <strong>siège (T4)</strong> (la machine reste en siège).<br><strong>Face 2 (Loi 3.2) :</strong> Tout Sabotage révélé en 3.2 rejoint la pile mise de côté pour être remélangé en 6.3 (sans déclencher la case 3).',
            temoin: 'Transforme le paquet Machine en moteur de Sabotage permanent.'
          },
          C: {
            nom: 'La Peau de boue', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_ROUGES_IGNORES_DEVANT)', tags: ['PARADE_CLASSIQUE'], requires_options: {},
            texte: '<strong>Loi 5 :</strong> Sur les rayons des Reptiles et des Humains, ignorez tous les jetons Puissance rouges d’une machine quand elle frappe la parcelle située devant elle.',
            temoin: 'Une machine T6 avec 2 rouges et 1 bleu frappant devant elle sur base 3 a un seuil de 3 + 0 - 1 - 2 = 1.'
          }
        }
      },
      G10: {
        id: 'G10', famille: 'GARDIEN', couple: ['R', 'E'], origine: 'R', nomBase: 'La Brume de la Dendrobate',
        profils: {
          A: {
            nom: 'La Brume de la Dendrobate', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE (6.1)',
            primitive: 'MOD_APPRENTISSAGE', tags: ['APPRENTISSAGE'], requires_options: {},
            texte: 'En 6.1 ce tour-ci, retirez 1 jeton Apprentissage à la tuile Tactique de votre choix.',
            temoin: 'Si ouvert plus tôt dans le tour, l’effet est mémorisé jusqu’à l’Étape 6.1.'
          },
          B: {
            nom: 'La Brume de la Dendrobate', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5.3',
            primitive: 'MOD_LOI_DU_COEUR + MOD_PUISSANCE', tags: ['DECLENCHEMENT_EFFECTIF', 'SURCHAUFFE'], requires_options: {},
            texte: '<strong>Loi 5.3 :</strong> Chaque Piège déclenché à l’Étape 5 retire 1 jeton Puissance rouge (ou retourne 1 rouge en bleu) sur chaque machine contre laquelle il s’est effectivement déclenché (en la parant ou en l’amortissant).',
            temoin: 'S’applique une fois par couple Piège–machine avant les gains rouges de 5.3.'
          },
          C: {
            nom: 'La Rainette géante', cycle: 'SIMPLE_CONTINU', cablage: [6], fenetre: 'OUVERTURE (CASE 6)',
            primitive: 'CREATION_ENTITE (SABOTAGE) avec coût', tags: ['CONVERSION', 'SABOTAGE', 'INSECTES'], requires_options: {},
            texte: '<em>(Câblage obligatoire sur 6. Insecte)</em> À l’ouverture, vous pouvez défausser 1 Insecte d’une parcelle Forêt pour gagner 1 carte Sabotage (déclenche la case 3).',
            temoin: 'En 4.2, l’Insecte tout juste produit par un Nid peut immédiatement payer ce coût.'
          },
          D: {
            nom: 'Les éclaireurs de la Dendrobate', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI APRÈS PARADE PIÈGE',
            primitive: 'MOD_LOI_DU_COEUR (LOI_EMBUSCADE_CREE_SENTINELLE)', tags: ['ARMEMENT', 'REACTION', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: '<strong>Loi :</strong> Une fois par tour, après une Parade par un Piège sur les rayons des Reptiles ou des Entités, vous pouvez créer 1 Insecte sur une <strong>autre</strong> parcelle piégée de ces deux rayons (allume la case 6).',
            temoin: 'Une première Embuscade réussie crée la sentinelle qui arme immédiatement une seconde Embuscade.'
          },
          E: {
            nom: 'Le tribut de la Dendrobate', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI APRÈS AMORTISSEMENT',
            primitive: 'MOD_LOI_DU_COEUR (LOI_AMORTISSEMENT_GAGNE_SABOTAGE)', tags: ['AMORTISSEMENT', 'SABOTAGE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: '<strong>Loi :</strong> Une fois par tour, après une frappe effectivement amortie par un Piège sur les rayons des Reptiles ou des Entités, vous pouvez gagner 1 carte Sabotage (allume la case 3).',
            temoin: 'Convertit l’amortissement partiel en ralentissement futur du paquet Machine.'
          }
        }
      },
      G11: {
        id: 'G11', famille: 'GARDIEN', couple: ['O', 'H'], origine: 'O', nomBase: 'La Piquée de la Harpie',
        profils: {
          A: {
            nom: 'La Piquée de la Harpie', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'MOD_SEUIL', tags: ['PARADE_CLASSIQUE'], requires_options: {},
            texte: '<strong>Face 1 :</strong> Réduisez de -1 le Seuil de Parade sur une parcelle (-2 s’il s’y trouve ≥ 2 Défenseurs).<br><strong>Face 2 :</strong> Parez automatiquement 1 attaque sur une parcelle contenant ≥ 2 Défenseurs.',
            temoin: 'L’auto-parade de Face 2 est prioritaire sur un Piège et le laisse non engagé.'
          },
          B: {
            nom: 'La Piquée de la Harpie', cycle: 'DOUBLE_FACE_UPGRADE', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SOUTIEN_LISIERE_DEFENSE)', tags: ['SOUTIEN', 'ARMEMENT', 'FURTIVITE'], requires_options: {},
            texte: '<strong>Face 1 (Loi 5) :</strong> Tout Défenseur isolé sur une case Furtivité ajoute +1 en Défense aux deux parcelles Forêt en face (même profondeur p).<br><strong>Face 2 (Loi 5) :</strong> S’applique aussi aux constructeurs restés en bordure de lisière (vers p=1).',
            temoin: 'Fournit un soutien à distance capable d’armer les Pièges Embuscade en face.'
          },
          C: {
            nom: 'L’Oiseau indicateur', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 2.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_DEFENSEUR_1_CASE_INSECTE)', tags: ['FURTIVITE', 'INSECTES'], requires_options: {},
            texte: '<strong>Loi 2.1 :</strong> Tout Peuple autour de la table peut poser son Premier Défenseur sur une case Furtivité de la lisière Oiseaux–Humains qui contient déjà au moins 1 Insecte.',
            temoin: 'Offre un point d’ancrage global en Furtivité dès la sous-phase 2.1.'
          },
          D: {
            nom: 'La veille de la Harpie', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_FURTIVITE_ARME_PIEGES)', tags: ['SOUTIEN', 'ARMEMENT', 'FURTIVITE'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: '<strong>Loi 5 :</strong> Chaque case Furtivité contenant au moins 1 Défenseur (isolé ou en binôme) fournit au total 1 point de Défense aux parcelles <strong>piégées</strong> des Oiseaux ou des Humains qui lui font face.',
            temoin: 'Permet à un binôme de travailler en Furtivité en 4.1 tout en armant à distance les Pièges en face à l’Étape 5.'
          },
          E: {
            nom: 'Les abris abandonnés de la Harpie', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE', 'PARCELLE_VIDE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Vous pouvez poser 1 Piège sur une parcelle ciblée des Oiseaux ou des Humains ne contenant ni Défenseur, ni Insecte, ni Piège (déclenche la case 2).',
            temoin: 'Pose un Amortisseur d’urgence sur une parcelle déserte, y compris en cascade pendant l’Étape 5.'
          }
        }
      },
      G12: {
        id: 'G12', famille: 'GARDIEN', couple: ['O', 'E'], origine: 'O', nomBase: 'Le Chant de l’Ibijau',
        profils: {
          A: {
            nom: 'Le Chant de l’Ibijau', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'PERMUTATION_PISTE (REVE)', tags: ['AVANCEE_REVE'], requires_options: {},
            texte: 'Échangez une tuile Rêve de la Piste des Tactiques avec sa voisine de gauche (r → r-1, sans ouvrir son Slot ni allumer la case 5).',
            temoin: 'Vérifie immédiatement le Sommeil du Contremaître si le Rêve atteint le Rang 1.'
          },
          B: {
            nom: 'Le Chant de l’Ibijau', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'PARTAGE_INFO_ETAT_GARDIEN', tags: ['RESONANCE'], requires_options: {},
            texte: 'Retournez gratuitement un autre Gardien évolutif en jeu sur sa Face 2 (ou ouvrez immédiatement le Slot d’un autre Gardien encore disponible ce tour-ci).',
            temoin: 'Ne peut pas retourner gratuitement le cycle nourri de G14 C, mais peut ouvrir son Slot.'
          },
          C: {
            nom: 'Le Vautour-Roi', cycle: 'SIMPLE_CONTINU', cablage: [2], fenetre: 'OUVERTURE (CASE 2)',
            primitive: 'PERMUTATION_PISTE (REVE) avec coût', tags: ['CONVERSION', 'AVANCEE_REVE'], requires_options: {},
            texte: '<em>(Câblage obligatoire sur 2. Piégeage)</em> À l’ouverture, vous pouvez retirer 1 Piège non engagé de la forêt pour faire avancer d’1 rang vers la gauche le Rêve le plus à gauche.',
            temoin: 'Peut consommer le Piège tout juste posé en 4.1 pour déclencher le Sommeil avant même l’Étape 5.'
          }
        }
      },
      G13: {
        id: 'G13', famille: 'GARDIEN', couple: ['M', 'I'], origine: 'M', nomBase: 'La Brèche du Tamanoir',
        profils: {
          A: {
            nom: 'La Brèche du Tamanoir', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (INSECTE)', tags: ['INSECTES', 'ARMEMENT'], requires_options: {},
            texte: 'Posez 1 jeton Insecte sur une parcelle intacte ou une case Furtivité contenant au moins 1 Défenseur (déclenche la case 6).',
            temoin: 'Peut compléter un binôme furtif avant 4.1 ou renforcer une Parade en 5.'
          },
          B: {
            nom: 'La Brèche du Tamanoir', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 3.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_CONSTRUCTION_HYBRIDE_INSECTE)', tags: ['INSECTES', 'CONSTRUCTION'], requires_options: {},
            texte: '<strong>Loi 3.1 :</strong> Vous pouvez construire une tuile en lisière avec <code>1 Défenseur + 1 Insecte</code> (pris sur une case Furtivité de cette même lisière et défaussé) au lieu de 2 Défenseurs.',
            temoin: 'Accélère considérablement la mise en jeu des Tuiles de Synergie.'
          }
        }
      },
      G14: {
        id: 'G14', famille: 'GARDIEN', couple: ['R', 'I'], origine: 'R', nomBase: 'L’Écaille du Téju',
        profils: {
          A: {
            nom: 'L’Écaille du Téju', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (PIEGE) avec coût', tags: ['CONVERSION', 'POSE', 'INSECTES'], requires_options: {},
            texte: 'Défaussez 1 Insecte non engagé d’une parcelle pour poser 1 Piège sur cette parcelle ou une parcelle intacte adjacente (déclenche la case 2).',
            temoin: 'Attention en mode Embuscade : ne pas défausser le dernier Insecte qui devait armer ce Piège !'
          },
          B: {
            nom: 'L’Écaille du Téju', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI DE CONTACT',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NID_INDESTRUCTIBLE_AU_CONTACT)', tags: ['CONTACT', 'NID'], requires_options: {},
            texte: '<strong>Loi de contact :</strong> Les Nids de Croissance (M) de toute la roue et leurs Insectes sont préservés lorsqu’une machine entre ou recule sur leur parcelle.',
            temoin: 'Protège contre tout contact (3.2, 5.2, 5.3), mais pas contre la transformation en Route Forestière.'
          },
          C: {
            nom: 'Le ventre plein', cycle: 'DOUBLE_FACE_CYCLE', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (CYCLE NOURRI)', tags: ['POSE', 'INSECTES'], requires_options: {},
            texte: '<strong>Face 1 (À jeun) :</strong> Défaussez 1 Insecte d’une parcelle du rayon des Reptiles pour retourner ce Gardien sur <em>Rassasié</em>.<br><strong>Face 2 (Rassasié) :</strong> Posez 1 Piège sur une parcelle des Reptiles sans machine, sans Piège et sans ciblage révélé, puis retournez-le sur <em>À jeun</em> (allume la case 2).',
            temoin: 'Cycle fermé à 2 temps : le retournement sur À jeun est acquis avant la cascade de la case 2.'
          },
          D: {
            nom: 'Les porteurs du Téju', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (INSECTE)', tags: ['ARMEMENT', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez déplacer 1 Insecte non engagé d’une parcelle des Reptiles ou des Insectes vers une autre parcelle piégée du <strong>même rayon</strong>, à toute distance.',
            temoin: 'Envoie une sentinelle armer un Piège en bout de rayon sans consommer le jeton.'
          },
          E: {
            nom: 'La mue du Téju', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'CREATION_ENTITE (2 INSECTES) avec coût', tags: ['CONVERSION', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Vous pouvez retirer 1 Piège non engagé d’une parcelle des Reptiles ou des Insectes pour y créer <strong>2 Insectes</strong> (allume une fois la case 6).',
            temoin: 'Convertit un Amortisseur inutilisé en force de Parade classique ou de migration.'
          }
        }
      },
      G15: {
        id: 'G15', famille: 'GARDIEN', couple: ['O', 'I'], origine: 'O', nomBase: 'L’Envol du Batará Suiveur',
        profils: {
          A: {
            nom: 'L’Envol du Batará Suiveur', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'OUVERTURE',
            primitive: 'DEPLACEMENT (MIGRATION DIRECTE)', tags: ['INSECTES', 'MIGRATION'], requires_options: {},
            texte: 'Faites migrer immédiatement 1 Insecte non engagé (depuis n’importe quelle parcelle) vers une piste globale (<code>Bug</code> ou <code>Colonie</code>).',
            temoin: 'Permet de coloniser le Cerveau ou les Gardiens sans attendre d’être en p=4.'
          },
          B: {
            nom: 'L’Envol du Batará Suiveur', cycle: 'SIMPLE_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 4.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_AILES_ESSAIM_2_CRANS)', tags: ['INSECTES', 'MOBILITE'], requires_options: {},
            texte: '<strong>Loi 4.3 :</strong> Tous les Insectes sur la roue peuvent se déplacer de <strong>2 crans</strong> au lieu d’1 à l’Étape 4.3.',
            temoin: 'Un Insecte peut traverser une lisière puis entrer sur la forêt voisine dans le même mouvement.'
          }
        }
      },

      // ==================== 10 RÊVES (R1 à R10) ====================
      R1: {
        id: 'R1', famille: 'REVE', couple: ['H', 'E'], origine: 'H', nomBase: 'Le Tambour des Deux Mondes',
        profils: {
          A: {
            nom: 'Le Tambour des Deux Mondes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'PERMUTATION_PISTE (TACTIQUE)', tags: ['CERVEAU'], requires_options: {},
            texte: 'À l’ouverture en 3.2, avant l’avancée de ce Rêve, échangez deux tuiles Tactique adjacentes sur la piste centrale.',
            temoin: 'Permet de repousser T6 vers la droite pour qu’elle soit éjectée par le prochain Rêve.'
          },
          B: {
            nom: 'Le Tambour des Deux Mondes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 3.2',
            primitive: 'MOD_LOI_DU_COEUR (LOI_REVE_DOUBLE_AVANCEE)', tags: ['AVANCEE_REVE'], requires_options: {},
            texte: '<strong>Loi 3.2 :</strong> Lorsqu’il s’ouvre en 3.2, ce Rêve avance de <strong>2 rangs</strong> vers la gauche (r → r-2) au lieu d’1.',
            temoin: 'Menace d’arrêt anticipé fulgurant par Sommeil du Contremaître.'
          },
          C: {
            nom: 'La Part rendue à la forêt', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'PERMUTATION_PISTE avec offrande', tags: ['CONVERSION', 'AVANCEE_REVE'], requires_options: {},
            texte: 'À chaque ouverture en 3.2, vous pouvez rendre 1 Gardien de la piste à sa lisière (sur sa Face 1) pour faire avancer ce Rêve de <strong>2 rangs</strong> au lieu d’1.',
            temoin: 'Le retour est un coût : il ne déclenche pas le pouvoir de sacrifice du Gardien rendu.'
          }
        }
      },
      R2: {
        id: 'R2', famille: 'REVE', couple: ['E', 'H'], origine: 'E', nomBase: 'Le Voile de l’Oubli',
        profils: {
          A: {
            nom: 'Le Voile de l’Oubli', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2 -> 6.1',
            primitive: 'MOD_APPRENTISSAGE (-2)', tags: ['APPRENTISSAGE'], requires_options: {},
            texte: 'En 6.1 ce tour-ci, retirez jusqu’à 2 jetons Apprentissage sur la Piste des Tactiques.',
            temoin: 'Idéal pour provoquer une égalité en tête à l’Étape 6.2.'
          },
          B: {
            nom: 'Le Voile de l’Oubli', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 6.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_PARADE_ANNULE_APPRENTISSAGE)', tags: ['PARADE_TOTALE', 'APPRENTISSAGE'], requires_options: {},
            texte: '<strong>Loi 6.1 :</strong> Une machine dont toutes les frappes sont parées ce tour-ci ne rapporte <strong>aucun jeton Apprentissage</strong> (même via son gain de Puissance T4/T5/T6).',
            temoin: 'Attention : une frappe amortie sans Parade ne satisfait pas cette condition.'
          }
        }
      },
      R3: {
        id: 'R3', famille: 'REVE', couple: ['H', 'M'], origine: 'H', nomBase: 'La Danse des Esprits-Fauves',
        profils: {
          A: {
            nom: 'La Danse des Esprits-Fauves', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'DEPLACEMENT (2 DEFENSEURS)', tags: ['REDEPLOIEMENT', 'ARMEMENT'], requires_options: {},
            texte: 'À l’ouverture en 3.2, déplacez jusqu’à 2 Défenseurs (y compris des constructeurs restés en lisière en 3.1) vers des parcelles Forêt intactes.',
            temoin: 'Recycle immédiatement les bâtisseurs après la révélation des cibles.'
          },
          B: {
            nom: 'La Danse des Esprits-Fauves', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 3.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_CONSTRUCTEURS_REJOIGNENT_FORET)', tags: ['CONSTRUCTION', 'MOBILITE'], requires_options: {},
            texte: '<strong>Loi 3.1 :</strong> Lors d’une construction (G ou R), libérez <strong>1 seul des deux Défenseurs constructeurs</strong> vers une parcelle p=1 adjacente non rasée (ou <strong>les 2 constructeurs à N=3 joueurs</strong>).',
            temoin: 'Prend effet dès la construction de R3 B pour ses propres bâtisseurs.'
          }
        }
      },
      R4: {
        id: 'R4', famille: 'REVE', couple: ['H', 'R'], origine: 'H', nomBase: 'Le Sommeil de la Pierre-Serpent',
        profils: {
          A: {
            nom: 'Le Sommeil de la Pierre-Serpent', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'MOD_PUISSANCE (SURCHAUFFE)', tags: ['SURCHAUFFE'], requires_options: {},
            texte: 'À l’ouverture en 3.2, retournez 1 jeton Puissance rouge d’une machine sur sa face bleue <em>Surchauffe</em>.',
            temoin: 'Réduit de 2 le seuil brut de la machine dès ce tour.'
          },
          B: {
            nom: 'Le Sommeil de la Pierre-Serpent', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 3.2',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SABOTAGE_PERSISTANT_DANS_PIOCHE)', tags: ['SABOTAGE', 'FURTIVITE'], requires_options: {},
            texte: '<strong>Loi 3.2 :</strong> Si au moins 1 Défenseur est sur une case Furtivité, chaque carte Sabotage révélée en 3.2 rejoint la pile mise de côté pour être remélangée en 6.3 (sans déclencher la case 3).',
            temoin: 'Maintient la dilution du paquet Machine tour après tour.'
          },
          C: {
            nom: 'Le Rêve de la seconde rive', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE'], requires_options: {},
            texte: 'Face à une Route Forestière de l’autre rayon sur la lisière Humains–Reptiles, vous pouvez poser 1 Piège sur la parcelle non rasée en face (même ne portant que des Souches, ciblée ou avec machine).',
            temoin: 'Transforme une Route subie sur une rive en protection pour l’autre rive.'
          },
          D: {
            nom: 'Le guetteur de pierre', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'DEPLACEMENT + CREATION_ENTITE (GROUPE)', tags: ['POSE', 'ARMEMENT', 'FURTIVITE'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez déplacer 1 Défenseur d’une case Furtivité vers une parcelle non rasée sans Piège des Humains ou des Reptiles qui lui fait face, et y poser 1 Piège (groupe atomique, allume la case 2).',
            temoin: 'Fournit simultanément le Piège et son Défenseur d’armement avant les cascades de la case 2.'
          },
          E: {
            nom: 'Le reflet de l’abri', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'DEPLACEMENT (PIEGE TRAVERSEE)', tags: ['RECYCLAGE', 'TRAVERSEE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Vous pouvez transférer 1 Piège non engagé directement entre les rayons des Humains et des Reptiles, à la même profondeur, vers une parcelle ciblée sans Piège.',
            temoin: 'Déplace l’Amortisseur vers la rive réellement menacée sans créer de nouvel événement 2.'
          }
        }
      },
      R5: {
        id: 'R5', famille: 'REVE', couple: ['H', 'O'], origine: 'H', nomBase: 'La Vision des Plumes Claires',
        profils: {
          A: {
            nom: 'La Vision des Plumes Claires', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'PARTAGE_INFO_ETAT_GARDIEN (REACTIVER_GARDIEN)', tags: ['RESONANCE'], requires_options: {},
            texte: 'À l’ouverture en 3.2, ouvrez immédiatement un Gardien disponible sur la Piste des Gardiens.',
            temoin: 'Allume aussi le Déclencheur 4 en résonance après l’effet du Gardien.'
          },
          B: {
            nom: 'La Vision des Plumes Claires', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 1.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_DE_M_CHOIX_MIN_MAX)', tags: ['LECTURE_DE'], requires_options: {},
            texte: '<strong>Loi 1.3 :</strong> Le peuple d’origine de ce Rêve (H) peut retenir le plus grand de ses deux dés (M = max(D1, D2)) derrière son paravent.',
            temoin: 'Permet aux Humains de cibler délibérément les Rêves en fin de piste.'
          },
          C: {
            nom: 'Le Rêve du nid vide', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE', 'PARCELLE_VIDE'], requires_options: {},
            texte: 'Vous pouvez poser 1 Piège sur une parcelle ciblée des Humains ou des Oiseaux qui ne contient ni Défenseur, ni Insecte, ni Piège (allume la case 2).',
            temoin: 'En Embuscade, il faudra amener 1 point de Défense avant la frappe ; en Amortisseur, il agira seul.'
          },
          D: {
            nom: 'Le rêve du veilleur', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE (INSECTE)', tags: ['ARMEMENT', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez créer 1 Insecte sur une parcelle piégée des Humains ou des Oiseaux (allume la case 6).',
            temoin: 'Arme un Piège déjà en place (attention à ne pas faire partir cet Insecte en 4.3 sans relève).'
          },
          E: {
            nom: 'Les deux refuges sans veilleur', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE (2 PIEGES) avec coût', tags: ['POSE', 'PARCELLE_VIDE', 'CONVERSION'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Vous pouvez défausser 1 Insecte d’une parcelle des Humains ou des Oiseaux pour poser jusqu’à <strong>2 Pièges</strong> sur deux autres parcelles ciblées de ces rayons ne contenant ni Défenseur ni Insecte.',
            temoin: 'Couvre deux cibles désertes d’un coup en échange d’un Insecte.'
          }
        }
      },
      R6: {
        id: 'R6', famille: 'REVE', couple: ['H', 'I'], origine: 'H', nomBase: 'Le Miel des Ancêtres',
        profils: {
          A: {
            nom: 'Le Miel des Ancêtres', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE (INSECTE)', tags: ['INSECTES'], requires_options: {},
            texte: 'Posez 1 Insecte de la réserve sur une parcelle intacte d’un rayon de cette paire (H ou I, déclenche la case 6).',
            temoin: 'Fournit un Insecte dès l’Étape 3.2 avant l’action des binômes en 4.1.'
          },
          B: {
            nom: 'Le Miel des Ancêtres', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'PARTAGE_INFO_ETAT_GARDIEN (ACTIVER_NID)', tags: ['INSECTES', 'NID'], requires_options: {},
            texte: 'Activez immédiatement la production d’Insectes d’1 Nid en jeu (même sans Défenseur dessus, allume la case 6).',
            temoin: 'Cette production isolée laisse l’activation normale de 4.2 disponible.'
          },
          C: {
            nom: 'La Terra Preta', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI REPOUSSE FINALE',
            primitive: 'MOD_LOI_DU_COEUR (LOI_REPOUSSE_DEUX_SOUCHES)', tags: ['SOUCHES', 'REPOUSSE_FINALE'], requires_options: {},
            texte: '<strong>Loi de Repousse finale :</strong> À la fin de la partie, sur chaque parcelle des Humains ou des Insectes, retournez jusqu’à <strong>2 Souches</strong> en Arbres debout (au lieu d’1).',
            temoin: 'Une parcelle H avec 3 Souches rend 2 Arbres debout au décompte final.'
          },
          D: {
            nom: 'Les chemins du veilleur', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 4.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NIDS_DESSERVENT_PIEGES)', tags: ['ARMEMENT', 'RESEAU', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: '<strong>Loi 4.3 :</strong> En 4.3, chaque Insecte quittant un Nid situé chez les Humains ou les Insectes peut utiliser 1 cran pour rejoindre directement une parcelle piégée du même rayon, à toute distance.',
            temoin: 'Transforme tout Nid H/I en répartiteur direct de sentinelles vers les Pièges.'
          },
          E: {
            nom: 'L’offrande des abattis', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'PERMUTATION_PISTE avec coût', tags: ['CONVERSION', 'AVANCEE_REVE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'À l’ouverture en 3.2, vous pouvez retirer 1 Piège non engagé d’une parcelle des Humains ou des Insectes pour faire avancer ce Rêve d’<strong>1 rang supplémentaire</strong> vers la gauche.',
            temoin: 'Sacrifie un Amortisseur pour accélérer la fin de partie par Sommeil.'
          }
        }
      },
      R7: {
        id: 'R7', famille: 'REVE', couple: ['E', 'M'], origine: 'E', nomBase: 'L’Ombre du Maître des Bois',
        profils: {
          A: {
            nom: 'L’Ombre du Maître des Bois', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'DEPLACEMENT (MACHINE)', tags: ['RECUL'], requires_options: {},
            texte: 'Faites reculer d’1 parcelle vers l’extérieur (p → p-1) une machine non en siège située sur les rayons E ou M.',
            temoin: 'Retarde l’entrée en siège T4 sur E et M.'
          },
          B: {
            nom: 'L’Ombre du Maître des Bois', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5 / 5.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_ENDIGUEMENT_SIEGE_T4)', tags: ['SIEGE_T4'], requires_options: {},
            texte: '<strong>Loi 5.3 (Endiguement du Siège) :</strong> Les machines en <strong>siège (T4)</strong> sur les rayons E et M et leurs rayons voisins immédiats ne gagnent plus de jeton Puissance rouge en 5.3 et subissent -1 à leur Seuil de Parade.',
            temoin: 'Neutralise l’escalade d’un siège T4 sans le déverrouiller.'
          },
          C: {
            nom: 'Le bras mort du fleuve', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 4.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_PASSAGE_DIRECT_INSECTES)', tags: ['INSECTES', 'MOBILITE', 'ARMEMENT'], requires_options: {},
            texte: '<strong>Loi 4.3 :</strong> En 4.3, un Insecte peut utiliser son déplacement (1 cran) pour traverser directement entre les rayons des Entités et des Mammifères à la même profondeur.',
            temoin: 'Court-circuite la case Furtivité intermédiaire entre E et M.'
          }
        }
      },
      R8: {
        id: 'R8', famille: 'REVE', couple: ['E', 'R'], origine: 'E', nomBase: 'Le Mirage du Fleuve-Miroir',
        profils: {
          A: {
            nom: 'Le Mirage du Fleuve-Miroir', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE'], requires_options: {},
            texte: 'Posez 1 Piège sur une parcelle intacte sans Piège des rayons E ou R, même occupée par une machine ou ciblée (déclenche la case 2).',
            temoin: 'Pose un Piège directement sur une cible révélée en 3.2.'
          },
          B: {
            nom: 'Le Mirage du Fleuve-Miroir', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI TERRASSEMENT',
            primitive: 'MOD_LOI_DU_COEUR (LOI_DERNIERE_SOUCHE_INDESTRUCTIBLE)', tags: ['SOUCHES'], requires_options: {},
            texte: '<strong>Loi de terrassement (Sanctuarisation) :</strong> Sur les rayons E et R, les Bulldozers laissent <strong>1 Souche</strong> lors du terrassement <strong>uniquement si au moins 1 Défenseur ou 1 Insecte est présent sur la parcelle</strong>.',
            temoin: 'Empêche définitivement la création de Routes Forestières par les Bulldozers sur E et R !'
          },
          C: {
            nom: 'Le Mapinguari', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 3.2 ANNULATION',
            primitive: 'MOD_LOI_DU_COEUR (LOI_REVE_ANNULE_MACHINE_RECULE)', tags: ['RECUL'], requires_options: {},
            texte: '<strong>Loi 3.2 :</strong> Chaque machine dont ce Rêve annule l’attaque en 3.2 recule immédiatement d’1 parcelle vers la bordure, si elle le peut.',
            temoin: 'S’applique à chaque machine annulée par R8 C, quel que soit le mode d’ouverture des Rêves.'
          },
          D: {
            nom: 'L’appel des berges gardées', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'DEPLACEMENT + MOD_PUISSANCE', tags: ['ARMEMENT', 'SURCHAUFFE'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez transférer 1 Défenseur d’une parcelle des Entités ou des Reptiles vers une autre parcelle piégée de ces deux rayons ; puis retourner 1 jeton rouge en bleu sur une machine qui cible la destination.',
            temoin: 'Arme une Embuscade tout en infligeant Surchauffe à la machine menaçante.'
          },
          E: {
            nom: 'Le rêve des racines intactes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI REPOUSSE FINALE',
            primitive: 'MOD_LOI_DU_COEUR (LOI_REPOUSSE_TOUTES_SOUCHES_SANS_ARBRE)', tags: ['SOUCHES', 'REPOUSSE_FINALE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: '<strong>Loi de Repousse finale :</strong> À la Repousse finale, sur chaque parcelle des Entités ou des Reptiles ne portant <strong>aucun Arbre debout</strong>, retournez <strong>toutes les Souches</strong> en Arbres debout.',
            temoin: 'Une parcelle E à 0 Arbre et 3 Souches sauvées par Amortisseur redonne 3 Arbres en fin de partie !'
          }
        }
      },
      R9: {
        id: 'R9', famille: 'REVE', couple: ['E', 'O'], origine: 'E', nomBase: 'L’Écho des Voix Célestes',
        profils: {
          A: {
            nom: 'L’Écho des Voix Célestes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'MOD_SEUIL (-2 RAYON)', tags: ['PARADE_CLASSIQUE'], requires_options: {},
            texte: 'Réduisez de -2 le Seuil de Parade sur toutes les parcelles d’un rayon au choix pour ce tour.',
            temoin: 'Sécurise tout un rayon soumis à une double frappe.'
          },
          B: {
            nom: 'L’Écho des Voix Célestes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 6.2',
            primitive: 'MOD_LOI_DU_COEUR (LOI_EGALITE_FAIT_AVANCER_REVE)', tags: ['AVANCEE_REVE', 'APPRENTISSAGE'], requires_options: {},
            texte: '<strong>Loi 6.2 :</strong> En cas d’égalité en tête de l’Apprentissage à l’Étape 6.2 (y compris égalité à 0), c’est ce Rêve qui avance d’1 rang vers la gauche (r → r-1).',
            temoin: 'Un blocage par la Cigale (Bug C) d’un vainqueur unique ne constitue pas une égalité.'
          }
        }
      },
      R10: {
        id: 'R10', famille: 'REVE', couple: ['E', 'I'], origine: 'E', nomBase: 'La Nuée des Songes',
        profils: {
          A: {
            nom: 'La Nuée des Songes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'MOD_SEUIL (SCALING INSECTES)', tags: ['INSECTES', 'PARADE_CLASSIQUE'], requires_options: {},
            texte: 'Réduisez le Seuil de Parade d’une machine de -1 par Insecte présent sur son rayon (<code>NB_INSECTES_RAYON</code>).',
            temoin: 'Calculé au moment de la résolution de l’ouverture.'
          },
          B: {
            nom: 'La Nuée des Songes', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'PERMUTATION_PISTE avec coût', tags: ['CONVERSION', 'INSECTES', 'AVANCEE_REVE'], requires_options: {},
            texte: '<strong>Conversion 3.2 :</strong> À l’ouverture de ce Rêve, vous pouvez défausser 1 Insecte non engagé du plateau pour le faire avancer d’1 rang supplémentaire vers la gauche.',
            temoin: 'Convertit l’essaim en victoire par Sommeil.'
          },
          D: {
            nom: 'La relève des lucioles', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '3.2',
            primitive: 'CREATION_ENTITE + DEPLACEMENT (GROUPE)', tags: ['POSE', 'REDEPLOIEMENT', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Vous pouvez poser 1 Piège sur une parcelle sans Piège des Entités ou des Insectes contenant 1 Défenseur et 1 Insecte, puis déplacer cet Insecte vers une autre parcelle du même rayon, à toute distance (groupe atomique).',
            temoin: 'Le Défenseur reste pour armer le nouveau Piège tandis que l’Insecte est redéployé ailleurs.'
          },
          E: {
            nom: 'La leçon retenue par la forêt', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 6.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_AMORTISSEMENT_REDUIT_APPRENTISSAGE_DEGATS)', tags: ['AMORTISSEMENT', 'APPRENTISSAGE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: '<strong>Loi 6.1 :</strong> Une fois par tour, choisissez une machine ayant subi au moins un amortissement effectif sur une parcelle des Entités ou des Insectes : annulez 1 de ses jetons d’Apprentissage <strong>de dégâts</strong> (avant Puissance et bleus).',
            temoin: 'Compense le fait qu’une frappe amortie laisse passer 1 dégât d’Arbre.'
          }
        }
      },

      // ==================== 5 NIDS DE CROISSANCE (M1 à M5) ====================
      M1: {
        id: 'M1', famille: 'CROISSANCE', couple: ['I', 'M'], origine: 'I', nomBase: 'La Fourmilière Coupe-Feuilles',
        profils: {
          A: {
            nom: 'La Fourmilière Coupe-Feuilles', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'DEPLACEMENT (DEFENSEUR)', tags: ['MOBILITE', 'ARMEMENT'], requires_options: {},
            texte: 'Après production en 4.2, déplacez 1 Défenseur présent sur ce Nid vers n’importe quelle autre parcelle Forêt intacte du plateau.',
            temoin: 'Le Défenseur active le Nid en 4.2 puis rejoint n’importe quel front pour l’Étape 5.'
          },
          B: {
            nom: 'La Fourmilière Coupe-Feuilles', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_CARAPACES_EPARGNE_INSECTE)', tags: ['PARADE_CLASSIQUE', 'INSECTES'], requires_options: {},
            texte: '<strong>Loi 5.3 (Carapaces) :</strong> Sur ce Nid, si un Défenseur a contribué à la Parade, épargnez 1 des Insectes qui devaient être retirés en 5.3 (1 fois/tour).',
            temoin: 'Maintient la masse critique d’Insectes sur le Nid.'
          },
          C: {
            nom: 'La piste des fourmis légionnaires', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'DEPLACEMENT (INSECTE RAYON)', tags: ['INSECTES', 'MOBILITE', 'ARMEMENT'], requires_options: {},
            texte: 'Après sa production en 4.2, vous pouvez déplacer 1 Insecte de ce Nid vers toute autre parcelle non rasée de son rayon.',
            temoin: 'Un Insecte envoyé en p=4 en 4.2 peut ensuite migrer vers une piste globale dès 4.3 du même tour !'
          },
          D: {
            nom: 'Les fourmis sentinelles', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'DEPLACEMENT (2 INSECTES -> PIEGES)', tags: ['ARMEMENT', 'DISPERSION', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Après production en 4.2, vous pouvez envoyer jusqu’à <strong>2 Insectes</strong> de ce Nid vers des parcelles piégées de son rayon, à toute distance (1 Insecte max par destination).',
            temoin: 'Arme deux Embuscades distinctes sur le rayon tout en laissant le mouvement 4.3 disponible.'
          },
          E: {
            nom: 'L’exode des fourmis', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'DEPLACEMENT (TOUS INSECTES)', tags: ['EVACUATION', 'ESSAIM', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Après production en 4.2, si la parcelle de ce Nid porte un Piège, vous pouvez déplacer <strong>tous ses Insectes disponibles</strong> vers la parcelle non rasée suivante ou précédente de son rayon.',
            temoin: 'Évacue tout l’essaim tout en laissant l’Amortisseur protéger la parcelle du Nid.'
          }
        }
      },
      M2: {
        id: 'M2', famille: 'CROISSANCE', couple: ['I', 'R'], origine: 'I', nomBase: 'La Termitière à Glu',
        profils: {
          A: {
            nom: 'La Termitière à Glu', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'MOD_PUISSANCE (SURCHAUFFE)', tags: ['SURCHAUFFE'], requires_options: {},
            texte: 'Après production en 4.2, retournez 1 jeton Puissance rouge d’une machine de ce rayon (ou d’un rayon voisin) sur sa face bleue <em>Surchauffe</em>.',
            temoin: 'Source récurrente de Surchauffe à chaque tour.'
          },
          B: {
            nom: 'La Termitière à Glu', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 4.1',
            primitive: 'MOD_LOI_DU_COEUR (LOI_INSECTE_FURTIF_PERMANENT)', tags: ['FURTIVITE', 'INSECTES'], requires_options: {},
            texte: '<strong>Loi 4.1 :</strong> Sur les deux lisières qui bordent ce rayon, lorsqu’un binôme est formé par <code>1 Défenseur + 1 Insecte</code>, l’Insecte n’est pas défaussé.',
            temoin: 'Économie majeure d’Insectes en Furtivité.'
          },
          C: {
            nom: 'La souche creuse', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI CONTACT MACHINE',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NID_CONTACT_SOUCHE)', tags: ['CONTACT', 'SOUCHES', 'NID'], requires_options: {},
            texte: '<strong>Loi de contact :</strong> Quand une machine entre sur cette parcelle, ce Nid et ses Insectes survivent au contact si la parcelle porte au moins <strong>1 Souche</strong> à cet instant.',
            temoin: 'Une Abatteuse T3 qui crée 2 Souches devant elle permet au Nid de survivre à son avancée en 5.3.'
          },
          D: {
            nom: 'La termitière gardée', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI CONTACT MACHINE',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NID_CONTACT_PIEGE_GARDE)', tags: ['CONTACT', 'PRESENCE', 'NID'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: '<strong>Loi de contact :</strong> Quand une machine entre sur ce Nid, le Nid et ses Insectes survivent au contact si sa parcelle contient 1 Piège ET au moins 1 Défenseur ou 1 Insecte.',
            temoin: 'Attention : si le Piège s’est déclenché et a été retiré en 5.3 avant l’avancée, il ne protège plus au contact.'
          },
          E: {
            nom: 'La termitière sous les abattis', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI CONTACT MACHINE',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NID_CONTACT_PIEGE)', tags: ['CONTACT', 'AMORTISSEMENT', 'NID'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: '<strong>Loi de contact :</strong> Quand une machine entre sur ce Nid, le Nid et ses Insectes survivent au contact si sa parcelle porte 1 Piège, même sans Défenseur ni Insecte.',
            temoin: 'Protège un Nid déserté lors d’un recul en 3.2 ou d’une avancée sur un Piège non déclenché.'
          }
        }
      },
      M3: {
        id: 'M3', famille: 'CROISSANCE', couple: ['I', 'O'], origine: 'I', nomBase: 'La Branche des Guêpes Cazadores',
        profils: {
          A: {
            nom: 'La Branche des Guêpes Cazadores', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'DEPLACEMENT (2 INSECTES)', tags: ['INSECTES', 'MOBILITE'], requires_options: {},
            texte: 'Après production en 4.2, déplacez immédiatement d’1 cran jusqu’à 2 Insectes présents sur ce Nid (avant l’Étape 4.3).',
            temoin: 'Donne une portée effective de 2 crans aux Insectes produits.'
          },
          B: {
            nom: 'La Branche des Guêpes Cazadores', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 4.2',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NID_AUTONOME)', tags: ['NID', 'INSECTES'], requires_options: {},
            texte: '<strong>Loi 4.2 (Pouponnière) :</strong> Ce Nid s’active aussi sans Défenseur en 4.2 s’il contient déjà au moins 2 Insectes au début de l’étape (1 activation max/tour).',
            temoin: 'Génère +2 Insectes chaque tour en autonomie complète.'
          },
          C: {
            nom: 'Le Scarabée Hercule', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5',
            primitive: 'MOD_LOI_DU_COEUR (LOI_INSECTES_DEFENSE_DOUBLE)', tags: ['PARADE_CLASSIQUE', 'INSECTES'], requires_options: {},
            texte: '<strong>Loi 5 :</strong> Sur la parcelle de ce Nid, chaque Insecte physiquement présent apporte <strong>2 points de Défense</strong> (retrait en 5.3 arrondi au supérieur du manque).',
            temoin: '1 Défenseur + 2 Insectes parent un seuil de 4 en ne consommant que 2 Insectes.'
          },
          D: {
            nom: 'Les guêpes aux aguets', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'CREATION_ENTITE (PIEGE)', tags: ['POSE', 'ARMEMENT'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: 'Après production en 4.2, si ce Nid contient au moins 1 Insecte et aucun Piège, vous pouvez poser 1 Piège sur sa parcelle (allume la case 2).',
            temoin: 'Auto-piège le Nid qui est immédiatement armé par sa propre production d’Insectes.'
          },
          E: {
            nom: 'Les guêpes bâtisseuses d’abris', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'CREATION_ENTITE (PIEGE) avec coût', tags: ['POSE', 'CONVERSION'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Après production en 4.2, vous pouvez défausser 1 Insecte de ce Nid pour poser 1 Piège sur une <strong>autre</strong> parcelle non rasée sans Piège de son rayon (allume la case 2).',
            temoin: 'Convertit 1 Insecte produit en Amortisseur projeté à distance sur le rayon.'
          }
        }
      },
      M4: {
        id: 'M4', famille: 'CROISSANCE', couple: ['I', 'H'], origine: 'I', nomBase: 'La Ruche des Mélipones',
        profils: {
          A: {
            nom: 'La Ruche des Mélipones', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'CREATION_ENTITE (SABOTAGE) avec coût', tags: ['CONVERSION', 'SABOTAGE', 'INSECTES'], requires_options: {},
            texte: 'Après production en 4.2, défaussez 1 Insecte de ce Nid pour ajouter 1 carte Sabotage à la pile mise de côté (déclenche la case 3).',
            temoin: 'Transforme la production du Nid en cartes Sabotage.'
          },
          B: {
            nom: 'La Ruche des Mélipones', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_PIEGE_GLISSE_VERS_CENTRE)', tags: ['DECLENCHEMENT_EFFECTIF', 'PERSISTANCE'], requires_options: {},
            texte: '<strong>Loi 5.3 :</strong> Sur ce rayon, chaque Piège effectivement déclenché en Étape 5 glisse en 5.3 sur la prochaine parcelle intacte vers le centre (p+1, si elle est sans Piège, sans déclencher la case 2).',
            temoin: 'Résolu du cœur vers la bordure ; un Piège non déclenché reste sur place.'
          },
          D: {
            nom: 'Les mélipones convoyeurs', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5.3 RÉCUPÉRATION',
            primitive: 'MOD_LOI_DU_COEUR (LOI_CONVOI_PIEGE_INSECTE)', tags: ['PERSISTANCE', 'ARMEMENT', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: '<strong>Loi 5.3 :</strong> Une fois par tour, vous pouvez faire glisser ensemble 1 Piège engagé de ce rayon ET 1 Insecte disponible de sa parcelle vers la prochaine parcelle non rasée côté cœur, si elle est sans Piège.',
            temoin: 'Convoie à la fois le Piège et sa sentinelle d’armement pour le tour suivant.'
          },
          E: {
            nom: 'Les mélipones des refuges mobiles', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5.3 RÉCUPÉRATION',
            primitive: 'MOD_LOI_DU_COEUR (LOI_REFUGE_PIEGE_REPLACE)', tags: ['PERSISTANCE', 'PARCELLE_VIDE'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: '<strong>Loi 5.3 :</strong> Une fois par tour, vous pouvez replacer 1 Piège engagé de ce rayon sur une autre parcelle non rasée du même rayon, sans Piège, Défenseur ni Insecte.',
            temoin: 'Recycle un Amortisseur déclenché vers n’importe quelle parcelle déserte du rayon (même côté bordure).'
          }
        }
      },
      M5: {
        id: 'M5', famille: 'CROISSANCE', couple: ['I', 'E'], origine: 'I', nomBase: 'La Clairière du Jardin du Diable',
        profils: {
          A: {
            nom: 'La Clairière du Jardin du Diable', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'CREATION_ENTITE (SANCTUAIRE_SOUCHE) avec coût', tags: ['SOUCHES', 'CONVERSION'], requires_options: {},
            texte: 'Après production en 4.2, vous pouvez défausser 1 Insecte de ce Nid : jusqu’à la fin du tour, les Bulldozers laissent toujours 1 Souche sur cette parcelle lors du terrassement, s’il y en a (<code>SANCTUAIRE_SOUCHE</code>).',
            temoin: 'Peut être payé même à 0 Souche actuelle ; persiste jusqu’à la fin du tour même si le Nid est détruit.'
          },
          B: {
            nom: 'La Clairière du Jardin du Diable', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 4.3',
            primitive: 'MOD_LOI_DU_COEUR (LOI_TUNNEL_MIGRATION_DIRECTE)', tags: ['INSECTES', 'MIGRATION'], requires_options: {},
            texte: '<strong>Loi 4.3 (Tunnel du cœur) :</strong> Une fois par tour, défaussez 1 Insecte de ce Nid pour en faire migrer un autre directement du Nid vers une piste globale.',
            temoin: 'Permet de migrer depuis p=1 sans traverser tout le rayon.'
          },
          C: {
            nom: 'Le Figuier étrangleur', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI TERRASSEMENT BULLDOZER',
            primitive: 'MOD_LOI_DU_COEUR (LOI_SOUCHES_PROTEGEES_PAR_NID)', tags: ['SOUCHES', 'NID'], requires_options: {},
            texte: '<strong>Loi de terrassement :</strong> Sur la parcelle de ce Nid, les Bulldozers coupent normalement jusqu’à 1 Arbre mais <strong>ne terrassent aucune Souche</strong>.',
            temoin: 'Avec un Piège Amortisseur présent, M5 C rend l’Amortisseur redondant contre le Bulldozer (le Piège ne s’engage pas).'
          },
          D: {
            nom: 'Le jardin des relèveuses', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: 'LOI 5.3 PRÉ-RETRAIT',
            primitive: 'MOD_LOI_DU_COEUR (LOI_NID_RELEVE_APRES_EMBUSCADE)', tags: ['RENOUVELLEMENT', 'INSECTES'],
            requires_options: { Regle_Resolution_Piege: ['EXIGE_PRESENCE_LOCALE'] },
            texte: '<strong>Loi 5.3 :</strong> Si un Piège a paré au moins une frappe sur la parcelle de ce Nid pendant qu’il était actif ce tour-ci, créez-y 1 Insecte avant le retrait des Pièges (allume la case 6).',
            temoin: 'Récompense chaque Embuscade réussie sur le Nid par un nouvel Insecte en 5.3.'
          },
          E: {
            nom: 'Le jardin des abattis réemployés', cycle: 'SIMPLE_CONTINU', cablage: null, fenetre: '4.2 APRÈS PRODUCTION',
            primitive: 'DEPLACEMENT (PIEGE <-> NID)', tags: ['RECYCLAGE', 'NID'],
            requires_options: { Regle_Resolution_Piege: ['AMORTISSEUR_SANS_PARADE'] },
            texte: 'Après production en 4.2, vous pouvez déplacer 1 Piège non engagé de ce rayon : soit depuis une autre parcelle vers ce Nid, soit depuis ce Nid vers toute autre parcelle non rasée sans Piège de son rayon.',
            temoin: 'Permet de rapatrier ou redistribuer un Amortisseur autour du Nid à chaque tour.'
          }
        }
      },

      // ==================== 2 SLOTS DE MIGRATION CENTRALE ====================
      SLOT_BUG_CERVEAU: {
        id: 'SLOT_BUG_CERVEAU', famille: 'MIGRATION', couple: ['I', '*'], origine: 'I', nomBase: 'Slot Migration : Bug du Cerveau',
        profils: {
          A: {
            nom: 'Court-circuit d’Apprentissage (Standard)', cycle: 'CONSOMME_ONESHOT', cablage: [1,2,3,4,5,6], fenetre: 'HOOK 6.1',
            primitive: 'MOD_APPRENTISSAGE (-1)', tags: ['MIGRATION', 'APPRENTISSAGE'], requires_options: {},
            texte: 'En 6.1, après les gains et déductions de Surchauffe, défaussez automatiquement l’Insecte pour retirer -1 jeton Apprentissage à la Tactique qui occupe ce rang (s’il y en a).',
            temoin: 'S’il n’y a aucun jeton Apprentissage sur ce rang, l’Insecte est conservé sur place.'
          },
          B: {
            nom: 'Déviation Synaptique (Contrôle 3.2)', cycle: 'CONSOMME_ONESHOT', cablage: [1,2,3,4,5,6], fenetre: 'HOOK 3.2',
            primitive: 'PERMUTATION_PISTE (LECTURE_DE_M)', tags: ['MIGRATION', 'LECTURE_DE'], requires_options: {},
            texte: 'Lorsqu’un joueur obtient ce rang avec son dé M en 3.2, il peut défausser l’Insecte pour décaler la lecture de son dé M d’1 rang (M-1 ou M+1).',
            temoin: 'Permet de dévier une lecture vers un Rêve voisin.'
          },
          C: {
            nom: 'La Cigale dans l’engrenage', cycle: 'PASSIF_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'LOI 6.2',
            primitive: 'MOD_LOI_DU_COEUR (LOI_BUG_BLOQUE_AVANCEE_APPRENTISSAGE)', tags: ['MIGRATION', 'APPRENTISSAGE'], requires_options: {},
            texte: '<strong>Loi 6.2 :</strong> Une Tactique qui occupe un rang portant au moins 1 Insecte ne peut pas avancer par Apprentissage en 6.2. L’Insecte reste sur son numéro de rang.',
            temoin: 'Si l’unique Tactique en tête est bloquée, aucune autre n’avance à sa place et aucun effet d’égalité ne s’ouvre.'
          }
        }
      },
      SLOT_COLONISATION_GARDIENS: {
        id: 'SLOT_COLONISATION_GARDIENS', famille: 'MIGRATION', couple: ['I', '*'], origine: 'I', nomBase: 'Slot Migration : Colonisation des Gardiens',
        profils: {
          A: {
            nom: 'Carburant Symbiotique (Standard)', cycle: 'CONSOMME_ONESHOT', cablage: [1,2,3,4,5,6], fenetre: 'HOOK 4.3 FIN',
            primitive: 'PARTAGE_INFO_ETAT_GARDIEN (REACTIVER_GARDIEN)', tags: ['MIGRATION', 'RESONANCE'], requires_options: {},
            texte: 'À la fin de chaque Étape 4.3, vous pouvez défausser l’Insecte pour ouvrir immédiatement le Gardien disponible de cette case (marquez son ouverture normalement).',
            temoin: 'Examiné des cases 1 à 6 à chaque tour, même sans nouvelle migration.'
          },
          B: {
            nom: 'Essaim Gardien (Seuil du Réveil)', cycle: 'PASSIF_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'PASSIF CONTINU',
            primitive: 'MOD_LOI_DU_COEUR (SEUIL_REVEIL)', tags: ['MIGRATION', 'REVEIL'], requires_options: {},
            texte: '<strong>Passif continu :</strong> Si la case Déclencheur ne contient pas de tuile Gardien, <strong>2 Insectes colonisateurs</strong> présents sur cette case comptent comme 1 Gardien actif pour le seuil du <em>Réveil de la Forêt</em>.',
            temoin: 'Rend la victoire par Réveil accessible même quand la table comporte moins de N tuiles Gardien.'
          },
          C: {
            nom: 'Les Lucioles', cycle: 'PASSIF_CONTINU', cablage: [1,2,3,4,5,6], fenetre: 'HOOK 4.3 FIN',
            primitive: 'PARTAGE_INFO_ETAT_GARDIEN (AUTO)', tags: ['MIGRATION', 'RESONANCE'], requires_options: {},
            texte: 'À la fin de chaque Étape 4.3, chaque case occupée par au moins 1 Insecte ouvre automatiquement son Gardien disponible. <strong>L’Insecte reste sur sa case.</strong>',
            temoin: 'Assure une ouverture automatique récurrente chaque tour tant que le Gardien n’a pas encore été utilisé.'
          }
        }
      }
    };

    // -------------------------------------------------------------------------
    // 4. JOURNAL STRUCTURÉ DES ÉVOLUTIONS (v4.3 -> v4.9 -> v5.0 -> v5.1 -> v5.2)
    // -------------------------------------------------------------------------
    const VERSION_CHANGELOG = [
      {
        version: 'v5.2',
        date: 'Version en vigueur',
        titre: 'Deux options exclusives de Pièges (Embuscade Assistée vs Amortisseur), 30 nouveaux profils D/E & Système de Tags',
        resume: 'Suppression définitive de l’auto-parade inconditionnelle des Pièges au profit de l’Axe 10 du châssis (portant l’espace de test à 128 configurations) et ajout de 30 profils dédiés (15 D + 15 E), portant le catalogue à 116 profils.',
        deltas: [
          {
            domaine: 'Mécanique des Pièges (Étape 5 · Axe 10)',
            avant: 'v4.3 à v5.1 : Un jeton Piège sur une parcelle parait automatiquement et inconditionnellement toutes les frappes ciblant cette parcelle, même sans aucun Défenseur ni Insecte.',
            apres: 'v5.2 : Deux options exclusives sur l’Axe 10 :\n• Option par défaut EXIGE_PRESENCE_LOCALE (Embuscade Assistée) : le Piège pare automatiquement si et seulement si la parcelle dispose d’au moins 1 point de Défense à l’instant de la frappe (pion local ou soutien autorisé).\n• Option AMORTISSEUR_SANS_PARADE (Amortisseur de Dégâts) : aucune Parade, mais réduit la coupe effective de l’Abatteuse de -1 et ramène le terrassement du Bulldozer à 0 Souche (sans besoin de présence).'
          },
          {
            domaine: 'Engagement & Persistance des Pièges (5.3)',
            avant: 'v5.1 : Tout Piège sur une parcelle ciblée se déclenchait.',
            apres: 'v5.2 : Un Piège ne devient engagé (PIEGE_ENGAGE = true) et n’est retiré/glissé en 5.3 que s’il a effectivement agi (Parade sous Embuscade, ou réduction réelle de dégâts sous Amortisseur). Un Piège non armé ou redondant avec M5 C / R8 B reste non engagé sur sa parcelle.'
          },
          {
            domaine: 'Extension de la Bibliothèque : +30 Profils (D & E)',
            avant: 'v5.1 : 86 profils au total (64 A/B + 22 C).',
            apres: 'v5.2 : 116 profils au total sur les 32 mêmes emplacements : ajout de 15 profils D (G3, G7, G10, G11, G14, R4, R5, R6, R8, R10, M1 à M5) liés à l’Embuscade et 15 profils E liés à l’Amortisseur, avec validation stricte requires_options et 5 modules N=3 clés en main.'
          }
        ]
      },
      {
        version: 'v5.1',
        date: 'Consolidation offensive & simplifications',
        titre: 'Puissance de frappe des Machines renforcée & 11 arbitrages de simplification',
        resume: 'Augmentation de la létalité des machines non parées pour créer des états intermédiaires de Souches et suppression des conditions superflues sur 11 tuiles.',
        deltas: [
          {
            domaine: 'Frappe de l’Abatteuse & du Bulldozer (5.1 & 5.2)',
            avant: 'v4.3 à v5.0 : L’Abatteuse coupait 1 seul Arbre en Souche ; le Bulldozer retirait uniquement les Souches déjà présentes (frappait à vide sur 3 Arbres debout).',
            apres: 'v5.1+ : L’Abatteuse coupe jusqu’à 2 Arbres debout par parcelle frappée. Le Bulldozer coupe jusqu’à 1 Arbre debout en Souche PUIS terrasse toutes les Souches non protégées (y compris celle qu’il vient de créer), avec une seule vérification de Parade avant la coupe.'
          },
          {
            domaine: 'Cible rasée avant résolution (5.1 / 5.2)',
            avant: 'Question ouverte en cas d’inversion G8 B ou de frappes multiples.',
            apres: 'v5.1+ : Toute frappe dont la parcelle cible a été rasée (Route Forestière) avant sa résolution est annulée sans report.'
          },
          {
            domaine: 'Simplification de 11 profils (G5 A, G7 A, G8 A/B, R8 B, M5 A/C, G3 C, R4 C)',
            avant: 'Seuils mémorisés ou restrictions d’arbres debout.',
            apres: 'Lecture dynamique des Souches pour G5 A (valent 0), pose sous machine autorisée pour G7 A, R8 B laisse toujours 1 Souche sans condition de quantité initiale, M5 C coupe 1 Arbre mais terrasse 0 Souche.'
          }
        ]
      },
      {
        version: 'v5.0',
        date: 'Enrichissement asymétrique',
        titre: 'Ajout de la Bibliothèque complémentaire des 22 Profils C & Conventions de résolution',
        resume: 'Création d’un 3e profil expérimental (Profil C) sur 20 tuiles de lisière et les 2 slots de migration (La Cigale et Les Lucioles), avec câblages dédiés (G10 C sur case 6, G12 C sur case 2) et cycle nourri (G14 C).',
        deltas: [
          {
            domaine: 'Bibliothèque C (22 nouveaux profils)',
            avant: 'v4.9 : Uniquement Profil A (Flux) et Profil B (Loi) par emplacement (64 profils).',
            apres: 'v5.0+ : Ajout de 22 profils C explorant les traversées directes (G3 C, R7 C), les soutiens depuis les machines (G5 C), la Terra Preta en repousse finale (R6 C), le cycle À jeun/Rassasié (G14 C), la Cigale (Bug C) et les Lucioles (Colonie C).'
          }
        ]
      },
      {
        version: 'v4.9',
        date: 'Architecture formelle consolidée (depuis v4.3)',
        titre: 'Du Socle Didactique v4.3 à l’Architecture Siège T4, Surchauffe Rouge/Bleu & Routes Forestières',
        resume: 'Structuration complète du matériel (mini-paravents, jetons Puissance double-face Rouge/Bleu, Routes Forestières, Siège T4 irréversible et grammaire à 8 primitives).',
        deltas: [
          {
            domaine: 'Secret & Matériel individuel (Étape 1 & 2)',
            avant: 'v4.3 : Gobelet opaque + carte Tactique « leurre » posée face cachée en cas de Sabotage ou Rêve.',
            apres: 'v4.9+ : Plateau personnel à Mini-Paravent reproduisant les 6 rangs (le dé M y est posé en secret ; l’emplacement Tactique reste simplement vide sur Sabotage ou Rêve). Jetons 1er Défenseur (1 face) et 2e Défenseur (2 faces réflexion/définitif) différenciés.'
          },
          {
            domaine: 'Jetons Puissance Double-Face : Rouge (+1) / Bleu Surchauffe (-1)',
            avant: 'v4.3 : Jetons Puissance simples (+1 au seuil).',
            apres: 'v4.9+ : Jetons double-face : Rouge (+1 Seuil) au recto, Bleu Surchauffe (-1 Seuil en Étape 5 ET -1 Apprentissage en 6.1) au verso. Retourner un rouge en bleu abaisse de 2 le seuil brut.'
          },
          {
            domaine: 'Routes Forestières & Siège Irréversible en T4 (1.1, 5.2, 5.3)',
            avant: 'v4.3 : Pas de règle de saut de parcelle rasée ni de verrouillage en bout de piste.',
            apres: 'v4.9+ : Une parcelle sans arbre ni souche reçoit une tuile Route Forestière (sautée par machines et insectes). Toute machine sur la dernière parcelle non rasée de son rayon entre irréversiblement en Siège (T4 automatique hors pioche à chaque tour).'
          },
          {
            domaine: 'Deux Slots de Migration Centrale (4.3)',
            avant: 'v4.3 : Migration uniquement vers la Piste des Tactiques (Bug du Cerveau).',
            apres: 'v4.9+ : Choix en fin de rayon entre SLOT_BUG_CERVEAU (Piste des Tactiques) et SLOT_COLONISATION_GARDIENS (Piste des Gardiens).'
          }
        ]
      }
    ];

    // -------------------------------------------------------------------------

// --- ÉPURATION CONSOLIDÉE v5.3 : 100 PROFILS & CHANGELOG v5.3 ---
Object.keys(CATALOGUE_TUILES).forEach(function(tId) {
  if (CATALOGUE_TUILES[tId].profils && CATALOGUE_TUILES[tId].profils.E) {
    delete CATALOGUE_TUILES[tId].profils.E;
  }
});
if (CATALOGUE_TUILES.SLOT_COLONISATION_GARDIENS && CATALOGUE_TUILES.SLOT_COLONISATION_GARDIENS.profils.B) {
  delete CATALOGUE_TUILES.SLOT_COLONISATION_GARDIENS.profils.B;
}

VERSION_CHANGELOG.unshift({
  version: 'v5.3',
  date: 'Version consolidée en vigueur',
  titre: 'Seuil Imprimé Fixe (P4_2233 / P5_22233), Fin de partie unique en 5.3, Embuscade unique (100 profils) & Zéro Dette d’Insectes',
  resume: 'Épuration cognitive majeure : le Seuil de Parade lit un Seuil Imprimé fixe par parcelle (sans jamais compter Arbres ni Souches). Suppression de l’Amortisseur et des 15 profils E (100 profils), vérification unique de fin de partie en fin de 5.3, pose furtive 4.1 autorisée sur parcelle ciblée, verrouillage des Insectes/Pièges sur parcelles ciblées en Étape 5, et bonus constructeur à N=3.',
  deltas: [
    {
      domaine: '1. Topologie & Formule du Seuil Imprimé',
      avant: 'v5.2 : P_Max (3,4,5) × Arbres (2,3) ; Seuil = Arbres + Souches + Rouges - Bleus + Mod_Tactique.',
      apres: 'v5.3 : P4_2233 (10N arbres, seuils [2,2,3,3]) ou P5_22233 (12N arbres, seuils [2,2,2,3,3]). Seuil = max(1, Seuil_Imprimé(p) + Rouges − Bleus + Mod_Tactique + Mod_Tuiles).'
    },
    {
      domaine: '2. Vérification Unique de Fin de Partie (Fin de 5.3)',
      avant: 'v5.2 : Arrêts immédiats en 3.1, 3.2 et 4.x ; Réveil passif à N Gardiens.',
      apres: 'v5.3 : Vérification unique en fin de 5.3 : 1) Sommeil (Rêve au Rang 1), 2) Réveil par Synchronisation Active (min(N, Gardiens dispo) avec min 3, ou 5 à 6J, portent leur marqueur utilisé ce tour), 3) Fin du Tour 8 → Repousse Finale directe sans Étape 6.'
    },
    {
      domaine: '3. Embuscade Unique, Furtivité 4.1 & Verrouillage Étape 5',
      avant: 'v5.2 : 2 options de Pièges (+15 profils E), pose 4.1 interdite sur parcelle ciblée, suivi de dette INSECTES_ENGAGES.',
      apres: 'v5.3 : Embuscade Assistée unique (retrait des 15 profils E). Pose 4.1 autorisée sur parcelle ciblée tant qu’aucune machine n’y est présente. En Étape 5, Insectes et Pièges sur parcelles ciblées verrouillés jusqu’en fin de 5.3.'
    },
    {
      domaine: '4. Bonus N=3 & Ajustements Tuiles (G5, G7 B, R3 B, R8 B, Colonie)',
      avant: 'v5.2 : 2 constructeurs bloqués en lisière à 3J ; Colonisation B actif.',
      apres: 'v5.3 : À N=3, 1 des 2 constructeurs (G ou R) rejoint gratuitement p=1 en 3.1. Retrait de Colonisation B. Ajustements de G5 A/B (−1 Seuil si ≥ 1 Souche), G7 B (pose sous machine), R3 B (1 constructeur libéré, 2 à N=3) et R8 B (exige Défenseur ou Insecte présent).'
    }
  ]
});
