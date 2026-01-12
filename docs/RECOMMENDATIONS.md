# Recommandations IA — MTLVibes (Sprint 5)

## Objectif
Produire des recommandations explicables a partir:
- historique d'ecoute
- favoris artistes
- catalogue artistes/morceaux

Approche: content-based (pas de ML externe), simple et pedagogique.

## Algorithme (description)
1) Charger le profil utilisateur (history + favorites).
2) Calculer des signaux:
   - artistes favoris
   - nombre d'ecoutes par artiste
   - genres frequents
   - popularite globale (playCount)
3) Assigner un score pour chaque artiste et/ou track:
   - +3 si l'artiste est en favori
   - +2 par ecoute recente de l'artiste dans l'historique (pondere par recence)
   - +1 si le genre est frequent
   - +0.5 * playCount (popularite globale)
4) Trier par score decroissant et garder top 10.
5) Exclure les 20 dernieres ecoutes pour eviter de recommander du "deja vu".
6) Retourner la raison (reason) pour expliquer le score.

## Pseudo-code
```
scores = {}
for fav in favorites:
  scores[artist:fav.artistId] += 3
  reason += "Artiste favori"

for h in history:
  artistId = track[h.trackId].artistId
  scores[artist:artistId] += 2 * recentWeight(h.playedAt)
  reason += "Ecoutes recentes"

topGenres = top3Genres(history)

recentIds = last20TrackIds(history)
for track in tracks:
  if track.id in recentIds: continue
  if track.artistId in favorites: scores[track] += 3
  if track.artistId in listenedArtists: scores[track] += 2 * listenCount[artist]
  if track.genre in topGenres: scores[track] += 1
  scores[track] += 0.5 * track.playCount

sort scores desc
return top 10 with reasons
```

## Pourquoi content-based
- Pas besoin de ML externe (simple, stable, explicable).
- Adapté aux donnees disponibles (history + favoris).
- Facile a justifier en contexte academique.
