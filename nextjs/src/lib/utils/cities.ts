export const citiesList = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli', 'Piceno', 'Asti', 'Avellino',
  'Bari', 'Barletta-Andria-Trani', 'Barletta', 'Andria', 'Trani', 'Belluno', 'Benevento', 'Bergamo', 'Biella',
  'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta', 'Campobasso', 'Caserta', 'Catania',
  'Catanzaro', 'Chieti', 'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara', 'Firenze',
  'Foggia', 'Forlì-Cesena', 'Forlì', 'Cesena', 'Frosinone', 'Genova', 'Gorizia', 'Grosseto', 'Imperia',
  'Isernia', "L'Aquila", 'Spezia', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata',
  'Mantova', 'Massa-Carrara', 'Massa', 'Carrara', 'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza',
  'Monza', 'Brianza', 'Napoli', 'Novara', 'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia',
  'Pesaro e Urbino', 'Pesaro', 'Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone', 'Potenza', 'Prato',
  'Ragusa', 'Ravenna', 'Reggio Calabria', 'Calabria', 'Reggio Emilia', 'Emilia', 'Rieti', 'Rimini', 'Roma', 'Rovigo',
  'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Sardegna', 'Taranto', 'Teramo', 'Terni',
  'Torino', 'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia', 'Verbano-Cusio-Ossola',
  'Verbano', 'Cusio', 'Ossola', 'Vercelli', 'Verona', 'Vibo', 'Valentia', 'Vicenza', 'Viterbo',
];

// Create a Set for O(1) lookup (case-insensitive)
const citiesSet = new Set(citiesList.map(city => city.toLowerCase()));

export function isCity(word: string): boolean {
  return citiesSet.has(word.toLowerCase());
}

export function extractCity(query: string): { city: string | null; cleanQuery: string } {
  const words = query.split(' ');
  let city: string | null = null;

  for (const word of words) {
    if (isCity(word)) {
      city = word.toUpperCase();
      break;
    }
  }

  const cleanQuery = city
    ? query.replace(new RegExp(city, 'i'), '').trim()
    : query;

  return { city, cleanQuery };
}
