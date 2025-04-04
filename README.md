# Challenge 2025 – Application Communautaire Node.js + MongoDB

## Objectif

Créer une application communautaire permettant de partager des informations, alertes ou bonnes adresses avec :

- 📦 MongoDB (avec collection Time Series)
- 🧭 Carte interactive (Leaflet ou Mapbox)
- ⚙️ API REST en Node.js / Express (MVC)
- 🧪 Tests (Jest + Supertest)
- 🔐 Sécurité de base (connexion, rôles, SSL possible)
- 🐳 Docker (MongoDB local en conteneur)
- 🔄 CI/CD (à intégrer)
- 📁 Projet bien structuré, documenté et esthétique

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (facultatif pour voir les données)

---

## Installation

```bash
git clone git@github.com:toshir-dway/Mongo-Node.git
cd Mongo-Node
npm install
```

## Configuration

### .env

```bash
PORT=3000
MONGO_URI=mongodb://admin:admin@localhost:27017/neighboralert?authSource=admin
```

### .env.test

```bash
MONGO_URI=mongodb://admin:admin@localhost:27017/
```

## Lancer MongoDB avec Docker

### Étapes :

- Ouvre Docker Desktop et assure-toi qu’il est bien lancé
- Tire l’image MongoDB :

```bash
docker pull mongo
```

- Lance le conteneur MongoDB :

```bash
    docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  mongo
```

## Initialisation de la base

Après avoir lancé MongoDB :

```bash
npm run init:db
```

## Démarrer l'application

En production :

```bash
    npm start
```
