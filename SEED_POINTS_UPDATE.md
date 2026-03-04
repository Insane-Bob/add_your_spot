# Comment Mettre à Jour SEED_POINTS

## Procédure

1. **Ouvrir l'application** dans le navigateur
2. **Ajouter des nouveaux points** via la modal (cliquer sur la carte)
3. **Ouvrir la console** (F12 → onglet Console)
4. **Un array JSON sera affiché** avec tous les points (seed + nouveaux)
5. **Copier l'array JSON** complet
6. **Aller dans le code** `src/components/MapView.vue`
7. **Remplacer le tableau SEED_POINTS** par le nouvel array copié

## Exemple

Si vous voyez dans la console:
```javascript
[
  { id: 1, lat: 47.8095, lng: 13.0550, category: 'sun', title: 'Salzburg Cathedral Square', author: 'Alexandra', description: '...' },
  { id: 2, lat: 47.8147, lng: 13.0461, category: 'tree', title: 'Kapuzinerberg Forest Trail', author: 'Phillippa', description: '...' },
  ...
  { id: 20, lat: 47.8330, lng: 13.0650, category: 'skate', title: 'Hallwang Training Ground', author: 'Phillippa', description: '...' },
  { id: 1738521600000, lat: 47.8200, lng: 13.0400, category: 'sun', title: 'Mon nouveau point', author: 'Alexandra', description: '...' }
]
```

Vous **copiez tout** et **remplacez** la constante `SEED_POINTS` dans MapView.vue.

## Avantages

✅ **Base de données propre** : Les points sont dans le code source
✅ **Pas de dépendance** : Fonctionne hors-ligne
✅ **Facile à synchroniser** : Simple copier-coller
✅ **Versionnable** : Git peut tracker les changements

## Notes

- Les nouveaux points auront un `id` basé sur `Date.now()` (timestamp)
- Vous pouvez modifier les IDs pour qu'ils soient séquentiels (21, 22, 23...) si vous préférez
- La sauvegarde localStorage est un backup temporaire pendant le développement

