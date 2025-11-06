// Sanitize HTML to prevent XSS attacks in email templates
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

let msgPreRegistration = ( recipient, uuidLink, isNewsletterRegistred ) => {
  let now = new Date()
  let hrs = now.getHours()
  let msg

  let moment = 'Salve'

  if(hrs < 12) moment = 'Buongiorno'
  if(hrs === 12) moment = 'Buon pomeriggio'
  if(hrs >= 13) moment = 'Buona sera'

  // Sanitize inputs to prevent injection attacks
  const safeRecipient = escapeHtml(recipient);
  const safeUuidLink = escapeHtml(uuidLink);

  if( isNewsletterRegistred ) {
    msg = {
      to: safeRecipient,
      from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
      subject: `Pagine Azzurre: Verifica della registrazione`,
      html: `<p>${moment},</p>\
        <p>Conferma la registrazione alle pagineazzurre.net e alla sua newsletter cliccando il seguente link.</p></br>\
        <a href="https://www.pagineazzurre.net/verification/${safeUuidLink}" target="_blank">Link per verificare l'inscrizione</a></br></br>\
        <p>Grazie per aver scelto le pagineazzurre.net</p>\
      `
    }
  } else {
    msg = {
      to: safeRecipient,
      from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
      subject: `Pagine Azzurre: Verifica della registrazione`,
      html: `<p>${moment},</p>\
        <p>Conferma la registrazione alle pagineazzurre.net cliccando il seguente link.</p></br>\
        <a href="https://www.pagineazzurre.net/verification/${safeUuidLink}" target="_blank">Link per verificare l'inscrizione</a></br></br>\
        <p>Grazie per aver scelto le pagineazzurre.net</p>\
      `
    }
  }

  return msg

}

let msgRegistration = (recipient, username, isNewsletterRegistred) => {
  let now = new Date()
  let hrs = now.getHours()
  let msg

  let moment = 'Salve'

  if(hrs < 12) moment = 'Buongiorno'
  if(hrs === 12) moment = 'Buon pomeriggio'
  if(hrs >= 13) moment = 'Buona sera'

  // Sanitize inputs to prevent injection attacks
  const safeRecipient = escapeHtml(recipient);
  const safeUsername = escapeHtml(username);

  if (isNewsletterRegistred === true) {
    msg = {
      to: safeRecipient,
      from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
      subject: `${safeUsername}, Benvenuto nelle Pagine Azzurre.`,
      html: `<p>${moment} ${safeUsername},</p></br>\
        <p>Benvenuta/o con noi nelle PAGINE AZZURRE. Ti sei registrato con successo.</br>\
        Aderisci e usufruisci della convenzione: VALorizza le AZioni che COncordi.</br>\
        Ora puoi partecipare con le tue proposte, inserisci le cose che vuoi mettere</br>\
        in scambio e hai piacere ti siano richieste. Esponi  richieste di cose e servizi</br>\
        che cerchi, e avresti piacere di trovare. Ti auguriamo Buoni scambi.</br>\
        Dove c\'è scambio c\'è vita, ancor meglio se con meno Euro.</br>\
        Ricordati di riconoscere un minimo di ringraziamento in VAL nello scambio di volontari</br>\
        doni e servizi senza euro.</p></br>\n\
        I Cittadini Volontari (NOI VOI) ti ringraziano della registrazione e collaborazione.</br>\n\
        </br>\n\
        Ti ricordiamo che sei inscrito alla nostra newsletter. </br>\n\
        NB: Questa è versione beta delle pagine azzurre, pensata per essere visualizzata e implementata</br>\n\
        per avere dagli amici e collaboratori suggerimenti e osservazioni su i bachi (Bugs! 🐛).</br>\n\
        Se questa email ti è arrivata per sbaglio, facci una segnalazione rispondendo</br>\n\
        al mittente, cosi da cancellare la tua email dal nostro database.</br>\n\
      `
      }
    } else {
      msg = {
        to: safeRecipient,
        from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
        subject: `${safeUsername}, Benvenuto nelle Pagine Azzurre.`,
        html: `<p>${moment} ${safeUsername},</p></br>\
        <p>Benvenuta/o con noi nelle PAGINE AZZURRE. Ti sei registrato con successo.</br>\
        Aderisci e usufruisci della convenzione: VALorizza le AZioni che COncordi.</br>\
        Ora puoi partecipare con le tue proposte, inserisci le cose che vuoi mettere</br>\
        in scambio e hai piacere ti siano richieste. Esponi  richieste di cose e servizi</br>\
        che cerchi, e avresti piacere di trovare. Ti auguriamo Buoni scambi.</br>\
        Dove c\'è scambio c\'è vita, ancor meglio se con meno Euro.</br>\
        Ricordati di riconoscere un minimo di ringraziamento in VAL nello scambio di volontari</br>\
        doni e servizi senza euro.</p></br>\n\
        I Cittadini Volontari (NOI VOI) ti ringraziano della registrazione e collaborazione.</br>\n\
        </br>\n\
        NB: Questa è versione beta delle pagine azzurre, pensata per essere visualizzata e implementata</br>\n\
        per avere dagli amici e collaboratori suggerimenti e osservazioni su i bachi (Bugs! 🐛).</br>\n\
        Se questa email ti è arrivata per sbaglio, facci una segnalazione rispondendo</br>\n\
        al mittente, cosi da cancellare la tua email dal nostro database.</br>\n\
        `
      }
    }
    msg.bcc = "ilbancodeivolontari@libero.it"
    return msg 
  }

let msgPasswordRecovery = (recipient, hash) => {
  // Sanitize inputs to prevent injection attacks
  const safeRecipient = escapeHtml(recipient);
  const safeHash = escapeHtml(hash);

  let msg = {
    to: safeRecipient,
    from: 'iscrizioni.pagineazzurre@cittadini-volontari.it',
    subject: 'Pagine Azzurre: Richiesta cambio Password',
    text: `Hai chiesto un recupero/cambio di password? Per confermare clicca il seguente link https://www.pagineazzurre.net/password-recovery/${safeHash} . Se la domanda di recupero/cambio password non fosse stata da te richiesta, ignora questa email e non rispondere.
    .`,
    html: `<p>Hai chiesto un cambio di password?  Per confermare clicca il seguente <a href="https://www.pagineazzurre.net/password-recovery/${safeHash}" target="_blank"}>Link</a> . In caso la richiesta cambio password no sia stata solicitata ignorare questo email.</p>`
  }
  return msg
}

let msgPasswordReplaced = (recipient, name) => {
  let now = new Date()
  let hrs = now.getHours()

  let moment = 'Salve'

  if(hrs < 12) moment = 'Buongiorno'
  if(hrs === 12) moment = 'Buon pomeriggio'
  if(hrs >= 13) moment = 'Buona sera'

  // Sanitize inputs to prevent injection attacks
  const safeRecipient = escapeHtml(recipient);
  const safeName = escapeHtml(name);

  let msg = {
    to: safeRecipient,
    from: 'iscrizioni.pagineazzurre@cittadini-volontari.it',
    subject: 'Pagine Azzurre: Password cambiata con successo',
    text: `Il cambio password e avvenuto con successo`,
    html: `<p>${moment} ${safeName}, il cambio password è avvenuto con successo.</p>`
  }
  return msg
}

let msgOrderNotificationToOfferer = (offerer, orderdetails, buyer) => {
  // Sanitize all user inputs to prevent injection attacks
  const safeOffererEmail = escapeHtml(offerer.email);
  const safeOffererUsername = escapeHtml(offerer.username);
  const safeBuyerUsername = escapeHtml(buyer[0].username);
  const safeBuyerEmail = escapeHtml(buyer[0].email);
  const safeBuyerPhone = escapeHtml(buyer[0].phone);
  const safeOrderName = escapeHtml(orderdetails.orderItems[0].name);
  const safeProductId = escapeHtml(String(orderdetails.orderItems[0].product));
  const safeOrderId = escapeHtml(String(orderdetails._id));
  const safeShippingPhone = escapeHtml(orderdetails.shippingAddress.phone);

  let msg = {
    to: safeOffererEmail,
    from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
    subject: "Pagine Azzurre Notificazione d\'Ordine al offerente",
    html: `<p>Buongiorno ${safeOffererUsername},</p><br><p><strong>Hai un nuovo ordine nelle pagine azzurre</strong></p><br><p>Nome annuncio:
           ${safeOrderName}</p><p>Product ID:
           ${safeProductId}</p><p>Order id:
           ${safeOrderId}</p><p>Quantità:
           ${orderdetails.orderItems[0].qty}</p><p>Prezzo in Val: ☯
           ${orderdetails.orderItems[0].priceVal}</p><p>Prezzo in Euro: €
           ${orderdetails.orderItems[0].priceEuro}</p><br><p><strong>Informazione del compratore</strong></p><br><p>Username:
           ${safeBuyerUsername}</p><p>Email:
           ${safeBuyerEmail}</p><p>Telefono:
           ${ safeShippingPhone !== buyer[0].email && orderdetails.shippingAddress.phone !== '' ? safeShippingPhone : safeBuyerPhone !== buyer[0].email ? safeBuyerPhone : 'Non Disponibile'}</p>`
  }
  return msg
}

let msgOrderNotificationToBuyer = (buyer, orderdetails, offerer) => {
  // Sanitize all user inputs to prevent injection attacks
  const safeBuyerEmail = escapeHtml(buyer[0].email);
  const safeBuyerUsername = escapeHtml(buyer[0].username);
  const safeOffererUsername = escapeHtml(offerer.username);
  const safeOffererEmail = escapeHtml(offerer.email);
  const safeOffererPhone = escapeHtml(offerer.phone);
  const safeOrderName = escapeHtml(orderdetails.orderItems[0].name);
  const safeProductId = escapeHtml(String(orderdetails.orderItems[0].product));
  const safeOrderItemId = escapeHtml(String(orderdetails.orderItems[0]._id));

  let msg = {
    to: safeBuyerEmail,
    from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
    subject: "Pagine Azzurre Notificazione d\'Ordine al compratore",
    html: `<p>Buongiorno ${safeBuyerUsername},</p><br><p><strong>Hai completato un nuovo ordine nelle pagine azzurre</strong></p><br><p>Nome annuncio:
    ${safeOrderName}</p><p>Product ID:
    ${safeProductId}</p><p>Order id:
    ${safeOrderItemId}</p><p>Quantità:
    ${orderdetails.orderItems[0].qty}</p><p>Prezzo in Val: ☯
    ${orderdetails.orderItems[0].priceVal}</p><p>Prezzo in Euro: €
    ${orderdetails.orderItems[0].priceEuro}</p><br><p><strong>Informazione del Offerente</strong></p><br><p>Username:
    ${safeOffererUsername}</p><p>Email:
    ${safeOffererEmail}</p><p>Telefono:
    ${ safeOffererPhone !== offerer.email ? safeOffererPhone : 'Non Disponibile'}</p>`
    // ${orderdetails.shippingAddress.phone !== buyer[0].email && orderdetails.shippingAddress.phone !== '' ? 'Non disponible'}</p>`
  }
  return msg
}

let secondMailToOfferer = (envelop) => {
  // Sanitize all user inputs to prevent injection attacks
  const safeOffererEmail = escapeHtml(envelop.offerer.email);
  const safeOffererName = escapeHtml(envelop.offerer.name);
  const safeBuyer = escapeHtml(envelop.buyer);
  const safeOrderNames = escapeHtml(envelop.orderNames);
  const safeEmailBody = escapeHtml(envelop.emailBody);

  let msg = {
    to: safeOffererEmail,
    from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
    subject: `${safeOffererName}, ${safeBuyer} ti ha scrito un messagio."`,
    html: `<p>Buongiorno ${safeOffererName},</p><br><p>Hai un messagio di ${safeBuyer} relativo alla tua inserzione ${safeOrderNames}</p><br><p>Messagio: ${safeEmailBody}`
  }
  return msg
}

let newsletterWelcome = (email, name) => {
  // Sanitize inputs to prevent injection attacks
  const safeEmail = escapeHtml(email);
  const safeName = escapeHtml(name);

  let msg = {
    to: safeEmail,
    from: "iscrizioni.pagineazzurre@cittadini-volontari.it",
    subject: `${safeName}, ti sei inscrito alla newsletter delle Pagine Azzurre?`,
    html: `<h3>${safeName}, grazie per esserti inscrita/o alla newsletter delle pagine Azzurre</h3>\
    <br>\
    <p>${safeName}, vogliamo tenerti sempre aggiornata/o con le ultime novità.</p>\
    <p>Ti ringraziamo di cuore per il tuo interesse al progetto.</p>\
    <p>Ti chiediamo di confermare clicando <a href="https://www.pagineazzurre.net/newsletter/${safeEmail}" target="_blank">qui</a>.</p>\
    <p>Se hai ricevuto questa email per errore ignòrala.</p>\
    `
  }
  return msg
}

export { msgRegistration,
         msgPreRegistration,
         msgPasswordRecovery,
         msgOrderNotificationToOfferer,
         msgOrderNotificationToBuyer,
         secondMailToOfferer,
         msgPasswordReplaced,
         newsletterWelcome,
        }