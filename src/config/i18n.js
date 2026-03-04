// Configuration multilingue (i18n)
export const i18n = {
  de: {
    // Navigation et UI
    addYourSpot: 'Fügen Sie Ihren Ort hinzu',
    selectLanguage: 'Sprache',
    favoriteSpots: 'LIEBLINGSPLATZ',
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',

    // Modal de création
    newSpot: 'Neuer Ort',
    title: 'Titel',
    category: 'Kategorie',
    author: 'Autor',
    description: 'Beschreibung',
    titlePlaceholder: 'Geben Sie einen Titel ein',
    authorPlaceholder: 'Ihr Name',
    descriptionPlaceholder: 'Beschreiben Sie diesen Ort...',

    // Catégories
    categories: {
      animal: 'Tiersichtungen',
      drinking: 'Trinkwasser',
      favorite: 'Lieblingsplatz',
      library: 'Bibliothek',
      meeting: 'Treffpunkt',
      memorial: 'Gedenkstätte',
      mountain: 'Schöner Bergblick',
      pointOfInterest: 'Sehenswürdigkeit',
      publicArt: 'Kunst im öffentlichen Raum',
      toilet: 'Öffentliche WC',
      ruins: 'Ruine',
      skatepark: 'Skate Park',
      stickers: 'Sticker',
      bench: 'Sonnenbank',
      support: 'Hilfestellen',
      tree: 'Bäume'
    }
  },
  en: {
    // Navigation et UI
    addYourSpot: 'Add Your Spot',
    selectLanguage: 'Language',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    favoriteSpots: 'FAVORITE SPOTS',

    // Modal de création
    newSpot: 'New Spot',
    title: 'Title',
    category: 'Category',
    author: 'Author',
    description: 'Description',
    titlePlaceholder: 'Enter a title',
    authorPlaceholder: 'Your name',
    descriptionPlaceholder: 'Describe this spot...',

    // Catégories
    categories: {
      animal: 'Animal Sightings',
      drinking: 'Drinking Water',
      favorite: 'Favorite Spot',
      library: 'Library',
      meeting: 'Meeting Point',
      memorial: 'Memorial Site',
      mountain: 'Nice Mountain View',
      pointOfInterest: 'Point of Interest',
      publicArt: 'Public Art',
      toilet: 'Public Toilet',
      ruins: 'Ruins',
      skatepark: 'Skatepark',
      stickers: 'Stickers',
      bench: 'Sun Bench',
      support: 'Support Services',
      tree: 'Trees'
    }
  }
}

export const getLabel = (key, lang = 'de') => {
  const keys = key.split('.')
  let value = i18n[lang]
  for (const k of keys) {
    value = value[k]
    if (!value) return key
  }
  return value
}

