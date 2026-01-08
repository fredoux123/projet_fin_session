# MTLVibes — Starter Kit (Environnement prêt à coder)

Ce dépôt fournit un environnement **prêt à coder** pour le projet **MTLVibes** :
- **Mobile** : React Native + Expo
- **API principale** : Node.js + Express
- **Microservice Découvertes** : Node.js + Express (mock data + API réelle)
- **Microservice IA** : Python + FastAPI (endpoint de recommandation)
- **DevOps** : Git + CI/CD (GitHub Actions) + Docker (optionnel)
- **Documentation** : étapes de configuration

> Stack alignée avec le cahier des charges (RN/Expo, Node/Express, FastAPI, microservices, S3). 

## 1) Prérequis
- Node.js **LTS** (18+ recommandé)
- Python **3.11+**
- Git
- (Optionnel) Docker Desktop

## 2) Démarrage rapide
### A. Lancer l’API + microservices (local)
```bash
# API principale
cd api
cp .env.example .env
npm i
npm run dev
```

```bash
# Microservice Découvertes
cd ../discovery-service
npm i
npm run dev
```

```bash
# Microservice IA
cd ../ia-service
python -m venv .venv
# mac/linux
source .venv/bin/activate
# windows powershell
# .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### B. Lancer le mobile (Expo)
```bash
cd ../mobile
npm i
npx expo start
```

## 3) CI/CD (GitHub Actions)
- Workflow : `.github/workflows/ci.yml`
- Jobs :
  - **api** : install + lint + tests
  - **discovery-service** : install + lint + tests
  - **ia-service** : install + lint + tests

## 4) Documentation
- `docs/SETUP.md` : configuration pas-à-pas
- `docs/PIPELINE.md` : explication CI/CD
- `docs/CONVENTIONS.md` : conventions & structure
- `docs/API.md` : mini doc API + exemples curl

## 5) Variables d’environnement
Voir les fichiers `.env.example` dans chaque service.
