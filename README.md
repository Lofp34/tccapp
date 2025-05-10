# Mon Journal Émotionnel

Une application web pour explorer et enregistrer ses états émotionnels à travers une interface conversationnelle, basée sur les principes de la Thérapie Comportementale et Cognitive (TCC).

## Fonctionnalités

- Interface de chat interactive
- Analyse des conversations par l'IA (Google Gemini)
- Synthèse structurée selon les principes TCC
- Journal personnel des synthèses
- Authentification des utilisateurs
- Stockage sécurisé des données

## Configuration

1. Créer un projet Firebase
2. Activer les services suivants :
   - Firebase Authentication
   - Firebase Hosting
   - Firebase Functions
   - Firestore Database
3. Obtenir une clé API Google Gemini
4. Configurer les variables d'environnement :
   - GEMINI_API_KEY

## Installation

```bash
# Installer les dépendances
npm install

# Installer Firebase CLI globalement
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser le projet
firebase init
```

## Déploiement

```bash
# Déployer l'application
firebase deploy
```

## Structure du Projet

```
.
├── public/                 # Fichiers statiques
│   ├── index.html         # Page principale
│   ├── firebase-config.js # Configuration Firebase
│   └── ...
├── src/
│   └── functions/         # Cloud Functions
│       └── index.js       # Fonction d'analyse Gemini
├── firebase.json          # Configuration Firebase
└── .firebaserc           # ID du projet Firebase
```

## Sécurité

- Les règles Firestore sont configurées pour que les utilisateurs ne puissent accéder qu'à leurs propres données
- L'authentification est requise pour accéder aux fonctionnalités principales
- Les clés API sont stockées de manière sécurisée dans les variables d'environnement

## Licence

ISC 