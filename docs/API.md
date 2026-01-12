# API — MTLVibes (mini doc)

Base URL: `http://localhost:3000`

Conventions de reponse:
- Liste: `{ items: [...] }`
- Element unique: `{ item: {...} }`
- Erreur: `{ error: "message" }`

## Auth (JWT)
Register:
```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"secret123","role":"USER"}'
```

Login:
```bash
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"secret123"}'
```

`/me` (token requis):
```bash
TOKEN="COPIE_LE_TOKEN_ICI"
curl -s http://localhost:3000/api/v1/me \
  -H "Authorization: Bearer $TOKEN"
```

## Public (visiteur)
Ping public:
```bash
curl -s http://localhost:3000/api/v1/public/ping
```

## Artistes
Liste (public):
```bash
curl -s http://localhost:3000/api/v1/artists
```

Details (public):
```bash
curl -s http://localhost:3000/api/v1/artists/<artistId>
```

Creation (ARTIST/ADMIN):
```bash
TOKEN="TOKEN_ARTIST_OU_ADMIN"
curl -s -X POST http://localhost:3000/api/v1/artists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"stageName":"MTL Artist","bio":"Bio courte","city":"Montreal","photoUrl":""}'
```

Mise a jour (ARTIST proprietaire ou ADMIN):
```bash
TOKEN="TOKEN_ARTIST_OU_ADMIN"
curl -s -X PUT http://localhost:3000/api/v1/artists/<artistId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"bio":"Nouvelle bio","city":"Montreal"}'
```

Suppression (ADMIN):
```bash
TOKEN="TOKEN_ADMIN"
curl -i -X DELETE http://localhost:3000/api/v1/artists/<artistId> \
  -H "Authorization: Bearer $TOKEN"
```

## Morceaux (Tracks)
Liste (public):
```bash
curl -s "http://localhost:3000/api/v1/tracks?artistId=<artistId>"
```

Details (public):
```bash
curl -s http://localhost:3000/api/v1/tracks/<trackId>
```

Creation (ARTIST/ADMIN):
```bash
TOKEN="TOKEN_ARTIST_OU_ADMIN"
curl -s -X POST http://localhost:3000/api/v1/tracks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"First Track","durationSec":180,"genre":"rap","artistId":"<artistId>","audioUrl":"","coverUrl":""}'
```

Mise a jour (ARTIST proprietaire ou ADMIN):
```bash
TOKEN="TOKEN_ARTIST_OU_ADMIN"
curl -s -X PUT http://localhost:3000/api/v1/tracks/<trackId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Updated Track","genre":"pop"}'
```

Suppression (ADMIN):
```bash
TOKEN="TOKEN_ADMIN"
curl -i -X DELETE http://localhost:3000/api/v1/tracks/<trackId> \
  -H "Authorization: Bearer $TOKEN"
```

Lecture (mock, token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -s -X POST http://localhost:3000/api/v1/tracks/<trackId>/play \
  -H "Authorization: Bearer $TOKEN"
```

## Historique d'ecoute
Lister l'historique (token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -s http://localhost:3000/api/v1/history \
  -H "Authorization: Bearer $TOKEN"
```

Vider l'historique (token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -i -X DELETE http://localhost:3000/api/v1/history \
  -H "Authorization: Bearer $TOKEN"
```

## Favoris (Artistes)
Ajouter un artiste en favori (token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -s -X POST http://localhost:3000/api/v1/favorites/artists/<artistId> \
  -H "Authorization: Bearer $TOKEN"
```

Lister les favoris (token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -s http://localhost:3000/api/v1/favorites/artists \
  -H "Authorization: Bearer $TOKEN"
```

Lister sans enrichissement artiste (option):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -s "http://localhost:3000/api/v1/favorites/artists?withArtists=false" \
  -H "Authorization: Bearer $TOKEN"
```

Retirer un favori (token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -i -X DELETE http://localhost:3000/api/v1/favorites/artists/<artistId> \
  -H "Authorization: Bearer $TOKEN"
```

## Evenements
Liste (public, APPROVED uniquement):
```bash
curl -s http://localhost:3000/api/v1/events
```

Details (public):
```bash
curl -s http://localhost:3000/api/v1/events/<eventId>
```

Creation (ARTIST/ADMIN):
```bash
TOKEN="TOKEN_ARTIST_OU_ADMIN"
curl -s -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Showcase","city":"Montreal","startAt":"2030-01-01T20:00:00Z","artistId":"<artistId>","tags":["rap"]}'
```

Update (owner ARTIST ou ADMIN):
```bash
TOKEN="TOKEN_ARTIST_OU_ADMIN"
curl -s -X PUT http://localhost:3000/api/v1/events/<eventId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Updated Title"}'
```

Approve (ADMIN):
```bash
TOKEN="TOKEN_ADMIN"
curl -s -X PATCH http://localhost:3000/api/v1/admin/events/<eventId>/approve \
  -H "Authorization: Bearer $TOKEN"
```

Reject (ADMIN):
```bash
TOKEN="TOKEN_ADMIN"
curl -s -X PATCH http://localhost:3000/api/v1/admin/events/<eventId>/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"reason":"Invalid content"}'
```

Delete (ADMIN):
```bash
TOKEN="TOKEN_ADMIN"
curl -i -X DELETE http://localhost:3000/api/v1/events/<eventId> \
  -H "Authorization: Bearer $TOKEN"
```

## External / IA (optionnel)
Artistes externes:
```bash
curl -s http://localhost:3000/api/v1/external-artists
```

Recommandations (token requis):
```bash
TOKEN="TOKEN_USER_OU_ARTIST_OU_ADMIN"
curl -s http://localhost:3000/api/v1/recommendations \
  -H "Authorization: Bearer $TOKEN"
```

## API Gateway (proxy simple)
Proxy vers discovery-service:
```bash
curl -s http://localhost:3000/api/v1/gateway/discovery/external-artists
```

Proxy vers ia-service:
```bash
curl -s "http://localhost:3000/api/v1/gateway/ia/recommendations?userId=demo"
```
