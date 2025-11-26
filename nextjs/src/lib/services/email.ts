import { MailtrapClient } from 'mailtrap';

const TOKEN = process.env.MAILTRAP_API_KEY!;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || 'noreply@pagineazzurre.it';
const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME || 'Pagine Azzurre';

const mailtrap = new MailtrapClient({ token: TOKEN });

const sender = {
  email: SENDER_EMAIL,
  name: SENDER_NAME,
};

export async function sendVerificationEmail(
  to: string,
  username: string,
  verificationLink: string,
  isNewsletter: boolean
) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_VERIFICATION;

  if (templateUuid) {
    // Use Mailtrap template
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      template_uuid: templateUuid,
      template_variables: {
        user_name: username,
        verification_link: verificationLink,
        newsletter_subscribed: isNewsletter ? 'Sì' : 'No',
      },
    });
  } else {
    // Fallback to plain email
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      subject: 'Verifica il tuo account - Pagine Azzurre',
      html: `
        <h1>Benvenuto su Pagine Azzurre!</h1>
        <p>Ciao ${username},</p>
        <p>Grazie per esserti registrato. Per completare la registrazione, verifica il tuo account cliccando sul link seguente:</p>
        <p><a href="${verificationLink}">Verifica Account</a></p>
        <p>Se non hai richiesto questa registrazione, ignora questa email.</p>
        ${isNewsletter ? '<p>Sei iscritto alla nostra newsletter!</p>' : ''}
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Benvenuto su Pagine Azzurre! Ciao ${username}, verifica il tuo account: ${verificationLink}`,
    });
  }
}

export async function sendWelcomeEmail(
  to: string,
  username: string,
  isNewsletter: boolean
) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_WELCOME;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      template_uuid: templateUuid,
      template_variables: {
        user_name: username,
        newsletter_subscribed: isNewsletter ? 'Sì' : 'No',
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      subject: 'Benvenuto su Pagine Azzurre!',
      html: `
        <h1>Account Verificato!</h1>
        <p>Ciao ${username},</p>
        <p>Il tuo account è stato verificato con successo. Ora puoi accedere a tutti i servizi di Pagine Azzurre.</p>
        ${isNewsletter ? '<p>Sei iscritto alla nostra newsletter e riceverai aggiornamenti sulle novità!</p>' : ''}
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Account Verificato! Ciao ${username}, il tuo account è stato verificato con successo.`,
    });
  }
}

export async function sendPasswordRecoveryEmail(to: string, recoveryLink: string) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_RECOVERY;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      template_uuid: templateUuid,
      template_variables: {
        recovery_link: recoveryLink,
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      subject: 'Recupero Password - Pagine Azzurre',
      html: `
        <h1>Recupero Password</h1>
        <p>Hai richiesto il recupero della password. Clicca sul link seguente per impostare una nuova password:</p>
        <p><a href="${recoveryLink}">Reimposta Password</a></p>
        <p>Se non hai richiesto il recupero password, ignora questa email.</p>
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Recupero Password: ${recoveryLink}`,
    });
  }
}

export async function sendPasswordReplacedEmail(to: string, username: string) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_PASSWORD_CHANGED;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      template_uuid: templateUuid,
      template_variables: {
        user_name: username,
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      subject: 'Password Modificata - Pagine Azzurre',
      html: `
        <h1>Password Modificata</h1>
        <p>Ciao ${username},</p>
        <p>La tua password è stata modificata con successo.</p>
        <p>Se non hai effettuato questa modifica, contattaci immediatamente.</p>
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Ciao ${username}, la tua password è stata modificata con successo.`,
    });
  }
}

export async function sendNewsletterWelcomeEmail(to: string, name?: string) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_NEWSLETTER;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      template_uuid: templateUuid,
      template_variables: {
        user_name: name || 'Utente',
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      subject: 'Iscrizione Newsletter - Pagine Azzurre',
      html: `
        <h1>Iscrizione Newsletter</h1>
        <p>Ciao ${name || 'Utente'},</p>
        <p>Grazie per esserti iscritto alla nostra newsletter!</p>
        <p>Riceverai aggiornamenti sulle novità, offerte e promozioni.</p>
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Grazie per esserti iscritto alla newsletter di Pagine Azzurre!`,
    });
  }
}

// Order notification interfaces
interface OrderNotificationData {
  offererEmail: string;
  offererName: string;
  buyerEmail: string;
  buyerName: string;
  orderItems: string;
  totalPrice: number;
  shippingAddress: string;
}

export async function sendOrderNotificationToOfferer(data: OrderNotificationData) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_ORDER_OFFERER;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: data.offererEmail }],
      template_uuid: templateUuid,
      template_variables: {
        offerer_name: data.offererName,
        buyer_name: data.buyerName,
        order_items: data.orderItems,
        total_price: data.totalPrice.toString(),
        shipping_address: data.shippingAddress,
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: data.offererEmail }],
      subject: 'Nuovo Ordine Ricevuto - Pagine Azzurre',
      html: `
        <h1>Nuovo Ordine Ricevuto!</h1>
        <p>Ciao ${data.offererName},</p>
        <p>Hai ricevuto un nuovo ordine da ${data.buyerName}.</p>
        <h3>Dettagli Ordine:</h3>
        <p><strong>Prodotti:</strong> ${data.orderItems}</p>
        <p><strong>Totale:</strong> ${data.totalPrice} VAL</p>
        <p><strong>Indirizzo di spedizione:</strong> ${data.shippingAddress}</p>
        <p>Accedi al tuo account per gestire l'ordine.</p>
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Nuovo ordine ricevuto da ${data.buyerName}. Prodotti: ${data.orderItems}. Totale: ${data.totalPrice} VAL`,
    });
  }
}

export async function sendOrderNotificationToBuyer(data: OrderNotificationData) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_ORDER_BUYER;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: data.buyerEmail }],
      template_uuid: templateUuid,
      template_variables: {
        buyer_name: data.buyerName,
        offerer_name: data.offererName,
        order_items: data.orderItems,
        total_price: data.totalPrice.toString(),
        shipping_address: data.shippingAddress,
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: data.buyerEmail }],
      subject: 'Conferma Ordine - Pagine Azzurre',
      html: `
        <h1>Ordine Confermato!</h1>
        <p>Ciao ${data.buyerName},</p>
        <p>Il tuo ordine è stato confermato.</p>
        <h3>Dettagli Ordine:</h3>
        <p><strong>Venditore:</strong> ${data.offererName}</p>
        <p><strong>Prodotti:</strong> ${data.orderItems}</p>
        <p><strong>Totale:</strong> ${data.totalPrice} VAL</p>
        <p><strong>Indirizzo di spedizione:</strong> ${data.shippingAddress}</p>
        <p>Grazie per il tuo acquisto!</p>
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Ordine confermato. Venditore: ${data.offererName}. Prodotti: ${data.orderItems}. Totale: ${data.totalPrice} VAL`,
    });
  }
}

export async function sendOrderMailingToOfferer(
  offererEmail: string,
  offererName: string,
  buyerName: string,
  orderItems: string,
  emailBody: string
) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_ORDER_MAILING;

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: offererEmail }],
      template_uuid: templateUuid,
      template_variables: {
        offerer_name: offererName,
        buyer_name: buyerName,
        order_items: orderItems,
        email_body: emailBody,
      },
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: offererEmail }],
      subject: 'Messaggio relativo al tuo ordine - Pagine Azzurre',
      html: `
        <h1>Messaggio dall'acquirente</h1>
        <p>Ciao ${offererName},</p>
        <p>${buyerName} ti ha inviato un messaggio riguardo all'ordine:</p>
        <p><strong>Prodotti:</strong> ${orderItems}</p>
        <hr>
        <p>${emailBody}</p>
        <hr>
        <p>Il team di Pagine Azzurre</p>
      `,
      text: `Messaggio da ${buyerName} riguardo all'ordine: ${orderItems}. ${emailBody}`,
    });
  }
}
