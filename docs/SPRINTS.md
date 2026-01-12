# Sprints — MTLVibes (resumes)

## Sprint 1 — Auth + roles
- Auth local JWT (register/login)
- Roles: USER, ARTIST, ADMIN
- Middleware: authenticate + requireRole
- Endpoints: /me, /admin/ping, /public/ping
- Tests de roles et acces public

## Sprint 2 — Musique interne
- CRUD Artistes (public + protege, ownership)
- CRUD Morceaux (public + protege, ownership)
- Lecture mock: playCount incremente
- Reponses standardisees { items } / { item }
- Tests publics + roles + ownership
- Doc API + exemples curl

## Sprint 3 — Historique d'ecoute
- Enregistrement auto sur /tracks/:id/play
- GET /history (liste par utilisateur)
- DELETE /history (vider)
- Tests sur lecture + historique

## Sprint 4 — Favoris + Gateway
- Favoris artistes: add/list/remove (auth requis)
- Idempotent + validation artiste
- Tests favoris
- Gateway API simple + tests proxy avec mocks

## Sprint 5 — Recommandations IA (content-based)
- IA FastAPI: POST /recommendations avec scoring explicable
- API Node: GET /api/v1/recommendations (auth) -> IA
- Tests avec mock IA
- Doc algorithme dans docs/RECOMMENDATIONS.md
