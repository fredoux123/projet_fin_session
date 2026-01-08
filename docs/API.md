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

## External / IA (optionnel)
Artistes externes:
```bash
curl -s http://localhost:3000/api/v1/external-artists
```

Recommandations:
```bash
curl -s "http://localhost:3000/api/v1/recommendations?userId=demo"
```
