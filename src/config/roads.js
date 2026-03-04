// Configuration des routes (road overlay)
export const MAIN_ROADS = new Set([
  'motorway', 'motorway_link', 'trunk', 'trunk_link',
  'primary', 'primary_link'
])

export const SECONDARY_ROADS = new Set([
  'secondary', 'secondary_link', 'tertiary', 'tertiary_link',
  'residential', 'unclassified', 'living_street'
])

export const roadColorForHighway = (highway) => {
  if (MAIN_ROADS.has(highway)) return '#e55626'
  if (SECONDARY_ROADS.has(highway)) return '#564a9d'
  return '#1e1e1e'
}

export const roadWeightForHighway = (highway) => {
  if (MAIN_ROADS.has(highway)) return 4
  if (SECONDARY_ROADS.has(highway)) return 3
  return 1.8
}

export const roadPriority = (highway) => {
  if (MAIN_ROADS.has(highway)) return 2
  if (SECONDARY_ROADS.has(highway)) return 1
  return 0
}

