# ASCENT - Architecture Placeholder Website

Un site web placeholder moderne et minimaliste pour cabinets d'architecture avec système de gestion de contenu intégré.

## 🏗️ Vue d'ensemble

ASCENT est une solution complète permettant aux cabinets d'architecture de créer rapidement leur vitrine en ligne. Le design s'inspire des codes visuels contemporains de l'architecture avec des sections modulaires entièrement personnalisables via une interface d'administration.

### Concept design

Le site adopte une approche minimaliste avec :

- **Palette monochrome** : dominance du blanc, gris et noir
- **Typographie épurée** avec hiérarchie claire
- **Grid system** pour l'organisation des projets
- **Espaces généreux** et respiration visuelle
- **Photographies architecturales** haute qualité
- **Interface épurée** sans éléments superflus

## 📱 Sections principales

### Header & Navigation

- Logo/nom du cabinet positionné en haut à gauche
- Navigation horizontale minimaliste
- Adaptable mobile avec menu hamburger

### Section Hero

- Image architecturale pleine largeur
- Titre principal "ASCENT"
- Sous-titre descriptif
- Call-to-action discret

### Galerie de projets

- **Grid responsive** : 3 colonnes desktop, 1-2 colonnes mobile
- Images haute qualité avec overlay au survol
- Catégorisation par type de projet

### Section métriques

- Chiffres clés du cabinet
- Présentation des réalisations
- Statistiques en grands caractères

### Footer / Contact

- Formulaire de contact épuré
- Informations de contact
- Links réseaux sociaux discrets

## 🚀 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **SCSS/Sass** - Préprocesseur CSS pour un styling avancé
- **CSS Modules** pour l'organisation
- **Prisma** - ORM pour la base de données
- **NextAuth.js** - Authentification administrateur
- **Sharp** - Optimisation d'images
- **Gsap** - Animations subtiles

## 📦 Installation

### Prérequis

- Node.js 18.0+
- npm ou yarn
- Base de données PostgreSQL

### Installation

```bash
# Cloner le repository
git clone https://github.com/AurelienAllenic/ascent ./ascent
cd ./ascent

# Installer les dépendances
npm install

# Lancer le développement
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/ascent_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Upload d'images
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Adaptation mobile

- **Navigation** : Menu hamburger avec overlay
- **Galerie** : 1 colonne sur mobile, 2 sur tablette
- **Typographie** : Tailles adaptatives
- **Espacement** : Marges réduites sur petit écran

## 🎯 Fonctionnalités spécifiques

### Galerie de projets

- **Lazy loading** des images
- **Filtres** par catégorie
- **Lightbox** pour vue détaillée
- **Numérotation** automatique des projets

### Optimisations

- **Images optimisées** automatiquement (WebP, AVIF)
- **SEO** intégré avec métadonnées dynamiques
- **Performance** : score Lighthouse > 90
- **Accessibilité** : WCAG 2.1 AA

---

_Architecture web moderne pour cabinets d'architecture contemporains_
