import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '1d',
    }
  );
};

export const userBecomesOfferer = (user) => {
  // TODO: Use CFvalidator here!
  if (user.name && user.surname && user.birthday && user.birthplace && user.gender && user.cf){
    return true
  }
  return false
}

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Seller Token' });
  }
};
export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin/Seller Token' });
  }
};

export const citiesList = [ "Agrigento", "Alessandria", "Ancona", "Aosta", "Arezzo", "Ascoli",  "Piceno", "Asti", "Avellino", 
                 "Bari", "Barletta-Andria-Trani", "Barletta", "Andria", "Trani", "Belluno", "Benevento", "Bergamo", "Biella",
                 "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Caserta", "Catania",
                 "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze",
                 "Foggia", "Forlì-Cesena", "Forlì", "Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia",
                 "Isernia", "L'Aquila", "Spezia", "Latina",  "Lecce", "Lecco", "Livorno", "Lodi",  "Lucca",  "Macerata",
                 "Mantova", "Massa-Carrara", "Massa", "Carrara", "Matera", "Messina", "Milano", "Modena", "Monza e Brianza",
                 "Monza", "Brianza", "Napoli", "Novara", "Nuoro", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia",
                 "Pesaro e Urbino", "Pesaro", "Urbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato",
                 "Ragusa", "Ravenna", "Reggio Calabria", "Calabria", "Reggio Emilia", "Emilia", "Rieti", "Rimini", "Roma", "Rovigo",
                 "Salerno", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "Sardegna", "Taranto", "Teramo", "Terni",
                 "Torino", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Verbano-Cusio-Ossola",
                 "Verbano", "Cusio", "Ossola", "Vercelli", "Verona", "Vibo", "Valentia", "Vicenza", "Viterbo", 
                 "agrigento", "alessandria", "ancona", "aosta", "arezzo", "ascoli", "piceno", "asti", "avellino", 
                 "bari", "barletta-andria-trani", "barletta", "andria", "trani", "belluno", "benevento", "bergamo", "biella",
                 "bologna", "bolzano", "brescia", "brindisi", "cagliari", "caltanissetta", "campobasso", "caserta", "catania",
                 "catanzaro", "chieti", "como", "cosenza", "cremona", "crotone", "cuneo", "enna", "fermo", "ferrara", "firenze",
                 "foggia", "forlì-Cesena", "forlì", "cesena", "frosinone", "genova", "gorizia", "grosseto", "imperia",
                 "isernia", "l'aquila", "spezia", "latina",  "lecce", "lecco", "livorno", "lodi",  "lucca",  "macerata",
                 "mantova", "massa-Carrara", "massa", "Carrara", "matera", "messina", "milano", "modena", "monza e brianza",
                 "monza", "brianza", "napoli", "novara", "nuoro", "oristano", "padova", "palermo", "parma", "pavia", "perugia",
                 "pesaro e urbino", "pesaro", "urbino", "pescara", "piacenza", "pisa", "pistoia", "pordenone", "potenza", "prato",
                 "ragusa", "ravenna", "reggio calabria", "calabria", "reggio Emilia", "emilia", "rieti", "rimini", "roma", "rovigo",
                 "salerno", "sassari", "savona", "siena", "siracusa", "sondrio", "sardegna", "taranto", "teramo", "terni",
                 "torino", "trapani", "trento", "treviso", "trieste", "udine", "varese", "venezia", "verbano-cusio-ossola",
                 "verbano", "cusio", "ossola", "vercelli", "verona", "vibo", "valentia", "vicenza", "viterbo", "AGRIGENTO" ,
                 "ALESSANDRIA", "ANCONA", "AOSTA", "AREZZO", "ASCOLI", "PICENO", "ASTI", "AVELLINO", "BARI", "BARLETTA-ANDRIA-TRANI",
                 "BARLETTA", "ANDRIA", "TRANI", "BELLUNO", "BENEVENTO", "BERGAMO", "BIELLA", "BOLOGNA", "BOLZANO", "BRESCIA", "BRINDISI",
                 "CAGLIARI", "CALTANISSETTA", "CAMPOBASSO", "CASERTA", "CATANIA", "CATANZARO", "CHIETI", "COMO", "COSENZA", "CREMONA",
                 "CROTONE", "CUNEO", "ENNA", "FERMO", "FERRARA", "FIRENZE", "FOGGIA", "FORLÌ-CESENA", "FORLÌ", "CESENA", "FROSINONE",
                 "GENOVA", "GORIZIA", "GROSSETO", "IMPERIA", "ISERNIA", "L'AQUILA", "SPEZIA", "LATINA", "LECCE", "LECCO", "LIVORNO",
                 "LODI", "LUCCA", "MACERATA", "MANTOVA", "MASSA-CARRARA", "MASSA", "CARRARA", "MATERA", "MESSINA", "MILANO", "MODENA",
                 "MONZA E BRIANZA", "MONZA", "BRIANZA", "NAPOLI", "NOVARA", "NUORO", "ORISTANO", "PADOVA", "PALERMO", "PARMA", "PAVIA",
                 "PERUGIA", "PESARO E URBINO", "PESARO", "URBINO", "PESCARA", "PIACENZA", "PISA", "PISTOIA", "PORDENONE", "POTENZA",
                 "PRATO", "RAGUSA", "RAVENNA", "REGGIO CALABRIA", "CALABRIA", "REGGIO EMILIA", "EMILIA", "RIETI", "RIMINI", "ROMA",
                 "ROVIGO", "SALERNO", "SASSARI", "SAVONA", "SIENA", "SIRACUSA", "SONDRIO", "SARDEGNA", "TARANTO", "TERAMO", "TERNI",
                 "TORINO", "TRAPANI", "TRENTO", "TREVISO", "TRIESTE", "UDINE", "VARESE", "VENEZIA", "VERBANO-CUSIO-OSSOLA", "VERBANO",
                 "CUSIO", "OSSOLA", "VERCELLI", "VERONA", "VIBO", "VALENTIA", "VICENZA", "VITERBO" ]
