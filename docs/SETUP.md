# Setup — MTLVibes (pas-à-pas)

Ce guide correspond au livrable **“Environnement prêt à coder + DevOps Chain + Documentation”**.

## 0) Stack du projet (rappel)
- Mobile : **React Native + Expo**
- UI : **NativeWind (Tailwind RN)**
- Backend : **Node.js + Express**
- Microservice IA : **Python + FastAPI**
- Microservice Découvertes : **Node.js**
- DB : **MongoDB ou MySQL**
- Stockage : **S3** (plus tard / mock pour MVP)

## 1) Installation des outils
### 1.1 Node.js
Installer une version **LTS** (18+).

Vérifier :
```bash
node -v
npm -v
```

### 1.2 Python
Installer Python **3.11+**.

Vérifier :
```bash
python --version
pip --version
```

### 1.3 Git
```bash
git --version
```

## 2) Récupérer le dépôt
```bash
git clone <votre-url-git>
cd mtlvibes
```

## 3) Lancer les services (local)
### 3.1 API principale (Node/Express)
```bash
cd api
cp .env.example .env
npm i
npm run dev
```
Test : http://localhost:3000/health

Notes MongoDB:
- renseigner `MONGO_URL` dans `api/.env`
- exemple local: `mongodb://localhost:27017/mtlvibes`

### 3.2 Microservice Découvertes
```bash
cd ../discovery-service
npm i
npm run dev
```
Test : http://localhost:3001/health  
Endpoint : http://localhost:3001/external-artists

### 3.3 Microservice IA (FastAPI)
```bash
cd ../ia-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```
Test : http://localhost:8001/health  
Endpoint : http://localhost:8001/recommendations?userId=demo

## 4) Lancer l’application mobile (Expo)
```bash
cd ../mobile
npm i
npx expo start
```

## 4.1) Mini doc API
Voir `docs/API.md` pour les exemples `curl` et les endpoints Sprint 2.

## 4.2) Resume des sprints
Voir `docs/SPRINTS.md` pour le recap des livrables.

## 5) Docker (optionnel)
```bash
docker compose up --build
```

### Scripts utilitaires
```bash
./scripts/compose-up.sh
./scripts/compose-down.sh
```

## 6) Vérification “prêt à coder”
- [ ] `api` répond sur `/health`
- [ ] `discovery-service` répond sur `/external-artists`
- [ ] `ia-service` répond sur `/recommendations`
- [ ] Mobile démarre et affiche l’écran Home
