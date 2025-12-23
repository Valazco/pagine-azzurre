import { MailtrapClient } from 'mailtrap';
import { getEtherealProvider, EtherealProvider } from './etherealProvider';

// Email provider configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'mailtrap'; // 'ethereal' | 'mailtrap'
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || 'noreply@pagineazzurre.it';
const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME || 'Pagine Azzurre';

// Mailtrap setup (for production)
const TOKEN = process.env.MAILTRAP_API_KEY || '';
const mailtrap = TOKEN ? new MailtrapClient({ token: TOKEN }) : null;

const sender = {
  email: SENDER_EMAIL,
  name: SENDER_NAME,
};

// Ethereal provider instance (lazy loaded)
let etherealProvider: EtherealProvider | null = null;

// Last preview URL for development testing
let lastPreviewUrl: string | null = null;

/**
 * Get the last Ethereal preview URL (useful for testing)
 */
export function getLastEmailPreviewUrl(): string | null {
  return lastPreviewUrl;
}

/**
 * Check if using Ethereal provider
 */
export function isUsingEthereal(): boolean {
  return EMAIL_PROVIDER === 'ethereal';
}

/**
 * Send email using the configured provider
 */
async function sendEmailWithProvider(
  to: string,
  subject: string,
  html: string,
  text: string,
  templateUuid?: string,
  templateVariables?: Record<string, string>
): Promise<void> {
  // Use Ethereal for development
  if (EMAIL_PROVIDER === 'ethereal') {
    if (!etherealProvider) {
      const credentials = process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS
        ? { user: process.env.ETHEREAL_USER, pass: process.env.ETHEREAL_PASS }
        : undefined;
      etherealProvider = await getEtherealProvider(credentials);
    }

    const result = await etherealProvider.sendEmail(to, subject, html, text, SENDER_EMAIL, SENDER_NAME);
    if (!result.success) {
      throw new Error(result.error || 'Failed to send email via Ethereal');
    }
    lastPreviewUrl = result.previewUrl || null;
    return;
  }

  // Use Mailtrap for production
  if (!mailtrap) {
    console.log(`[MOCK EMAIL] To: ${to}`);
    console.log(`[MOCK EMAIL] Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Body: ${text.substring(0, 100)}...`);
    return;
  }

  if (templateUuid) {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      template_uuid: templateUuid,
      template_variables: templateVariables,
    });
  } else {
    await mailtrap.send({
      from: sender,
      to: [{ email: to }],
      subject,
      html,
      text,
    });
  }
}

export async function sendVerificationEmail(
  to: string,
  username: string,
  verificationLink: string,
  isNewsletter: boolean
) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_VERIFICATION;
  const subject = 'Verifica il tuo account - Pagine Azzurre';
  const html = `
    <h1>Benvenuto su Pagine Azzurre!</h1>
    <p>Ciao ${username},</p>
    <p>Grazie per esserti registrato. Per completare la registrazione, verifica il tuo account cliccando sul link seguente:</p>
    <p><a href="${verificationLink}">Verifica Account</a></p>
    <p>Se non hai richiesto questa registrazione, ignora questa email.</p>
    ${isNewsletter ? '<p>Sei iscritto alla nostra newsletter!</p>' : ''}
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Benvenuto su Pagine Azzurre! Ciao ${username}, verifica il tuo account: ${verificationLink}`;

  await sendEmailWithProvider(
    to,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? {
      user_name: username,
      verification_link: verificationLink,
      newsletter_subscribed: isNewsletter ? 'Sì' : 'No',
    } : undefined
  );
}

export async function sendWelcomeEmail(
  to: string,
  username: string,
  isNewsletter: boolean
) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_WELCOME;
  const subject = 'Benvenuto su Pagine Azzurre!';
  const html = `
    <h1>Account Verificato!</h1>
    <p>Ciao ${username},</p>
    <p>Il tuo account è stato verificato con successo. Ora puoi accedere a tutti i servizi di Pagine Azzurre.</p>
    ${isNewsletter ? '<p>Sei iscritto alla nostra newsletter e riceverai aggiornamenti sulle novità!</p>' : ''}
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Account Verificato! Ciao ${username}, il tuo account è stato verificato con successo.`;

  await sendEmailWithProvider(
    to,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? {
      user_name: username,
      newsletter_subscribed: isNewsletter ? 'Sì' : 'No',
    } : undefined
  );
}

export async function sendPasswordRecoveryEmail(to: string, recoveryLink: string) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_RECOVERY;
  const subject = 'Recupero Password - Pagine Azzurre';
  const html = `
    <h1>Recupero Password</h1>
    <p>Hai richiesto il recupero della password. Clicca sul link seguente per impostare una nuova password:</p>
    <p><a href="${recoveryLink}">Reimposta Password</a></p>
    <p>Se non hai richiesto il recupero password, ignora questa email.</p>
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Recupero Password: ${recoveryLink}`;

  await sendEmailWithProvider(
    to,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? { recovery_link: recoveryLink } : undefined
  );
}

export async function sendPasswordReplacedEmail(to: string, username: string) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_PASSWORD_CHANGED;
  const subject = 'Password Modificata - Pagine Azzurre';
  const html = `
    <h1>Password Modificata</h1>
    <p>Ciao ${username},</p>
    <p>La tua password è stata modificata con successo.</p>
    <p>Se non hai effettuato questa modifica, contattaci immediatamente.</p>
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Ciao ${username}, la tua password è stata modificata con successo.`;

  await sendEmailWithProvider(
    to,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? { user_name: username } : undefined
  );
}

export async function sendNewsletterWelcomeEmail(to: string, name?: string) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_NEWSLETTER;
  const displayName = name || 'Utente';
  const subject = 'Iscrizione Newsletter - Pagine Azzurre';
  const html = `
    <h1>Iscrizione Newsletter</h1>
    <p>Ciao ${displayName},</p>
    <p>Grazie per esserti iscritto alla nostra newsletter!</p>
    <p>Riceverai aggiornamenti sulle novità, offerte e promozioni.</p>
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Grazie per esserti iscritto alla newsletter di Pagine Azzurre!`;

  await sendEmailWithProvider(
    to,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? { user_name: displayName } : undefined
  );
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
  const subject = 'Nuovo Ordine Ricevuto - Pagine Azzurre';
  const html = `
    <h1>Nuovo Ordine Ricevuto!</h1>
    <p>Ciao ${data.offererName},</p>
    <p>Hai ricevuto un nuovo ordine da ${data.buyerName}.</p>
    <h3>Dettagli Ordine:</h3>
    <p><strong>Prodotti:</strong> ${data.orderItems}</p>
    <p><strong>Totale:</strong> ${data.totalPrice} VAL</p>
    <p><strong>Indirizzo di spedizione:</strong> ${data.shippingAddress}</p>
    <p>Accedi al tuo account per gestire l'ordine.</p>
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Nuovo ordine ricevuto da ${data.buyerName}. Prodotti: ${data.orderItems}. Totale: ${data.totalPrice} VAL`;

  await sendEmailWithProvider(
    data.offererEmail,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? {
      offerer_name: data.offererName,
      buyer_name: data.buyerName,
      order_items: data.orderItems,
      total_price: data.totalPrice.toString(),
      shipping_address: data.shippingAddress,
    } : undefined
  );
}

export async function sendOrderNotificationToBuyer(data: OrderNotificationData) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_ORDER_BUYER;
  const subject = 'Conferma Ordine - Pagine Azzurre';
  const html = `
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
  `;
  const text = `Ordine confermato. Venditore: ${data.offererName}. Prodotti: ${data.orderItems}. Totale: ${data.totalPrice} VAL`;

  await sendEmailWithProvider(
    data.buyerEmail,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? {
      buyer_name: data.buyerName,
      offerer_name: data.offererName,
      order_items: data.orderItems,
      total_price: data.totalPrice.toString(),
      shipping_address: data.shippingAddress,
    } : undefined
  );
}

export async function sendOrderMailingToOfferer(
  offererEmail: string,
  offererName: string,
  buyerName: string,
  orderItems: string,
  emailBody: string
) {
  const templateUuid = process.env.MAILTRAP_TEMPLATE_ORDER_MAILING;
  const subject = 'Messaggio relativo al tuo ordine - Pagine Azzurre';
  const html = `
    <h1>Messaggio dall'acquirente</h1>
    <p>Ciao ${offererName},</p>
    <p>${buyerName} ti ha inviato un messaggio riguardo all'ordine:</p>
    <p><strong>Prodotti:</strong> ${orderItems}</p>
    <hr>
    <p>${emailBody}</p>
    <hr>
    <p>Il team di Pagine Azzurre</p>
  `;
  const text = `Messaggio da ${buyerName} riguardo all'ordine: ${orderItems}. ${emailBody}`;

  await sendEmailWithProvider(
    offererEmail,
    subject,
    html,
    text,
    templateUuid,
    templateUuid ? {
      offerer_name: offererName,
      buyer_name: buyerName,
      order_items: orderItems,
      email_body: emailBody,
    } : undefined
  );
}
