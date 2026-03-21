import { getEtherealProvider, EtherealProvider } from './etherealProvider';

// Email provider configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'mailersend';
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || 'noreply@pagineazzurre.it';
const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME || 'Pagine Azzurre';
const APP_URL = process.env.NEXTAUTH_URL || 'https://pagineazzurre.it';

// MailerSend API setup
const MAILERSEND_TOKEN = process.env.MAILTRAP_API_KEY || '';
const MAILERSEND_API_URL = 'https://api.mailersend.com/v1/email';

// ============================================
// MODERN EMAIL TEMPLATE SYSTEM
// ============================================

// Brand colors
const colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#dbeafe',
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  border: '#e5e7eb',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
};

/**
 * Create a styled CTA button for emails
 */
function emailButton(text: string, url: string, color: string = colors.primary): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px auto;">
      <tr>
        <td style="border-radius: 8px; background-color: ${color};">
          <a href="${url}" target="_blank" style="
            display: inline-block;
            padding: 14px 32px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
          ">${text}</a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Create a divider line
 */
function emailDivider(): string {
  return `<hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;">`;
}

/**
 * Create an info/alert box
 */
function emailInfoBox(content: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info'): string {
  const boxColors = {
    info: { bg: colors.primaryLight, border: colors.primary, icon: 'ℹ️' },
    success: { bg: colors.successLight, border: colors.success, icon: '✓' },
    warning: { bg: colors.warningLight, border: colors.warning, icon: '⚠️' },
    danger: { bg: colors.dangerLight, border: colors.danger, icon: '⚠️' },
  };
  const { bg, border, icon } = boxColors[type];

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 16px 0;">
      <tr>
        <td style="
          background-color: ${bg};
          border-left: 4px solid ${border};
          padding: 16px;
          border-radius: 0 8px 8px 0;
        ">
          <span style="font-size: 16px; margin-right: 8px;">${icon}</span>
          <span style="color: ${colors.text}; font-size: 14px;">${content}</span>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Create an order details table
 */
function emailOrderTable(items: string, total: number, address?: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="
      margin: 20px 0;
      border: 1px solid ${colors.border};
      border-radius: 8px;
      overflow: hidden;
    ">
      <tr>
        <td style="background-color: ${colors.backgroundSecondary}; padding: 12px 16px; border-bottom: 1px solid ${colors.border};">
          <strong style="color: ${colors.text}; font-size: 14px;">Dettagli Ordine</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="color: ${colors.textSecondary}; font-size: 13px; padding-bottom: 8px;">Prodotti:</td>
            </tr>
            <tr>
              <td style="color: ${colors.text}; font-size: 14px; padding-bottom: 16px;">${items}</td>
            </tr>
            ${address ? `
            <tr>
              <td style="color: ${colors.textSecondary}; font-size: 13px; padding-bottom: 8px;">Indirizzo:</td>
            </tr>
            <tr>
              <td style="color: ${colors.text}; font-size: 14px; padding-bottom: 16px;">${address}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="border-top: 1px solid ${colors.border}; padding-top: 16px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="color: ${colors.text}; font-size: 16px; font-weight: 600;">Totale:</td>
                    <td style="color: ${colors.primary}; font-size: 18px; font-weight: 700; text-align: right;">${total} VLZ</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Base email template wrapper
 */
function createEmailTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Pagine Azzurre</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: ${colors.backgroundSecondary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}

  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${colors.backgroundSecondary};">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="
              background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
              background-color: ${colors.primary};
              padding: 32px 40px;
              border-radius: 16px 16px 0 0;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: -0.5px;
              ">Pagine Azzurre</h1>
              <p style="
                margin: 8px 0 0 0;
                color: rgba(255, 255, 255, 0.85);
                font-size: 14px;
                font-weight: 400;
              ">Il marketplace della comunità italiana</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="
              background-color: ${colors.background};
              padding: 40px;
              border-left: 1px solid ${colors.border};
              border-right: 1px solid ${colors.border};
            ">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: ${colors.backgroundSecondary};
              padding: 32px 40px;
              border-radius: 0 0 16px 16px;
              border: 1px solid ${colors.border};
              border-top: none;
              text-align: center;
            ">
              <p style="margin: 0 0 16px 0; color: ${colors.textSecondary}; font-size: 13px; line-height: 1.6;">
                Questa email è stata inviata da Pagine Azzurre.<br>
                Se hai domande, contattaci a <a href="mailto:support@pagineazzurre.it" style="color: ${colors.primary}; text-decoration: none;">support@pagineazzurre.it</a>
              </p>
              <p style="margin: 0; color: ${colors.textMuted}; font-size: 12px;">
                © ${new Date().getFullYear()} Pagine Azzurre. Tutti i diritti riservati.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

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

  // Use MailerSend for production
  if (!MAILERSEND_TOKEN) {
    console.log(`[MOCK EMAIL] To: ${to}`);
    console.log(`[MOCK EMAIL] Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Body: ${text.substring(0, 100)}...`);
    return;
  }

  const response = await fetch(MAILERSEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MAILERSEND_TOKEN}`,
    },
    body: JSON.stringify({
      from: { email: SENDER_EMAIL, name: SENDER_NAME },
      to: [{ email: to }],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MailerSend error (${response.status}): ${error}`);
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

  const content = `
    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700;">
      Benvenuto su Pagine Azzurre!
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${username}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      Grazie per esserti registrato! Per completare la registrazione e attivare il tuo account,
      clicca sul pulsante qui sotto:
    </p>

    ${emailButton('Verifica il mio Account', verificationLink)}

    ${isNewsletter ? emailInfoBox('Ti sei iscritto anche alla nostra newsletter! Riceverai aggiornamenti sulle novità.', 'success') : ''}

    ${emailDivider()}

    <p style="margin: 0; color: ${colors.textMuted}; font-size: 13px; line-height: 1.6;">
      Se non hai richiesto questa registrazione, puoi ignorare questa email in sicurezza.<br>
      Il link di verifica scadrà tra 24 ore.
    </p>
  `;

  const html = createEmailTemplate(content, `${username}, verifica il tuo account su Pagine Azzurre`);
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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.successLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 32px;
      ">✓</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Account Verificato!
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${username}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      Il tuo account è stato verificato con successo! Ora puoi accedere a tutti i servizi
      di Pagine Azzurre e iniziare a esplorare il marketplace.
    </p>

    ${emailInfoBox('Hai ricevuto <strong>100 VLZ</strong> come bonus di benvenuto!', 'success')}

    ${isNewsletter ? `
      <p style="margin: 24px 0 0 0; color: ${colors.textSecondary}; font-size: 14px; line-height: 1.6;">
        Sei iscritto alla nostra newsletter e riceverai aggiornamenti esclusivi sulle novità!
      </p>
    ` : ''}

    ${emailButton('Esplora Pagine Azzurre', APP_URL, colors.success)}
  `;

  const html = createEmailTemplate(content, `${username}, il tuo account è stato verificato!`);
  const text = `Account Verificato! Ciao ${username}, il tuo account è stato verificato con successo. Hai ricevuto 100 VLZ come bonus di benvenuto!`;

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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.warningLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 28px;
      ">🔐</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Recupero Password
    </h2>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      Hai richiesto di reimpostare la password del tuo account. Clicca sul pulsante
      qui sotto per creare una nuova password:
    </p>

    ${emailButton('Reimposta Password', recoveryLink, colors.warning)}

    ${emailInfoBox('Questo link scadrà tra 1 ora per motivi di sicurezza.', 'warning')}

    ${emailDivider()}

    <p style="margin: 0; color: ${colors.textMuted}; font-size: 13px; line-height: 1.6;">
      Se non hai richiesto il recupero della password, puoi ignorare questa email
      in sicurezza. Il tuo account rimarrà protetto.
    </p>
  `;

  const html = createEmailTemplate(content, 'Reimposta la tua password su Pagine Azzurre');
  const text = `Recupero Password - Clicca qui per reimpostare: ${recoveryLink}`;

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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.successLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 28px;
      ">🔒</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Password Modificata
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${username}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      La tua password è stata modificata con successo. Se hai effettuato tu questa modifica,
      non è necessaria alcuna azione.
    </p>

    ${emailInfoBox('La tua password è stata aggiornata con successo.', 'success')}

    ${emailDivider()}

    ${emailInfoBox('Se non hai effettuato questa modifica, contattaci immediatamente a <a href="mailto:support@pagineazzurre.it" style="color: ' + colors.danger + ';">support@pagineazzurre.it</a>', 'danger')}
  `;

  const html = createEmailTemplate(content, `${username}, la tua password è stata modificata`);
  const text = `Ciao ${username}, la tua password è stata modificata con successo. Se non hai effettuato questa modifica, contattaci immediatamente.`;

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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.primaryLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 28px;
      ">📬</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Iscrizione Confermata!
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${displayName}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      Grazie per esserti iscritto alla nostra newsletter! Da oggi riceverai:
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: ${colors.success}; font-size: 18px; margin-right: 12px;">✓</span>
          <span style="color: ${colors.text}; font-size: 14px;">Aggiornamenti sulle novità del marketplace</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: ${colors.success}; font-size: 18px; margin-right: 12px;">✓</span>
          <span style="color: ${colors.text}; font-size: 14px;">Offerte e promozioni esclusive</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: ${colors.success}; font-size: 18px; margin-right: 12px;">✓</span>
          <span style="color: ${colors.text}; font-size: 14px;">Consigli e suggerimenti dalla comunità</span>
        </td>
      </tr>
    </table>

    ${emailButton('Visita Pagine Azzurre', APP_URL)}
  `;

  const html = createEmailTemplate(content, `${displayName}, benvenuto nella newsletter di Pagine Azzurre!`);
  const text = `Grazie per esserti iscritto alla newsletter di Pagine Azzurre! Riceverai aggiornamenti, offerte e promozioni.`;

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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.successLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 28px;
      ">🛒</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Nuovo Ordine Ricevuto!
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${data.offererName}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      Hai ricevuto un nuovo ordine da <strong>${data.buyerName}</strong>!
    </p>

    ${emailOrderTable(data.orderItems, data.totalPrice, data.shippingAddress)}

    ${emailButton('Gestisci Ordine', `${APP_URL}/profile`, colors.success)}

    ${emailDivider()}

    <p style="margin: 0; color: ${colors.textMuted}; font-size: 13px; line-height: 1.6;">
      Accedi al tuo account per confermare e gestire l'ordine.
    </p>
  `;

  const html = createEmailTemplate(content, `${data.offererName}, hai un nuovo ordine da ${data.buyerName}!`);
  const text = `Nuovo ordine ricevuto da ${data.buyerName}. Prodotti: ${data.orderItems}. Totale: ${data.totalPrice} VLZ`;

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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.primaryLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 28px;
      ">📦</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Ordine Confermato!
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${data.buyerName}</strong>,
    </p>

    <p style="margin: 0 0 8px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      Grazie per il tuo acquisto! Il tuo ordine è stato confermato.
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 14px;">
      Venditore: <strong style="color: ${colors.text};">${data.offererName}</strong>
    </p>

    ${emailOrderTable(data.orderItems, data.totalPrice, data.shippingAddress)}

    ${emailInfoBox('Il venditore è stato notificato e ti contatterà presto per la spedizione.', 'info')}

    ${emailButton('Visualizza i miei Ordini', `${APP_URL}/profile`)}
  `;

  const html = createEmailTemplate(content, `${data.buyerName}, il tuo ordine è confermato!`);
  const text = `Ordine confermato. Venditore: ${data.offererName}. Prodotti: ${data.orderItems}. Totale: ${data.totalPrice} VLZ`;

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

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        display: inline-block;
        width: 64px;
        height: 64px;
        background-color: ${colors.primaryLight};
        border-radius: 50%;
        line-height: 64px;
        font-size: 28px;
      ">💬</div>
    </div>

    <h2 style="margin: 0 0 24px 0; color: ${colors.text}; font-size: 24px; font-weight: 700; text-align: center;">
      Nuovo Messaggio
    </h2>

    <p style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px; line-height: 1.6;">
      Ciao <strong>${offererName}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; color: ${colors.textSecondary}; font-size: 15px; line-height: 1.6;">
      <strong>${buyerName}</strong> ti ha inviato un messaggio riguardo all'ordine:
    </p>

    <p style="margin: 0 0 16px 0; color: ${colors.textSecondary}; font-size: 14px;">
      <strong>Prodotti:</strong> ${orderItems}
    </p>

    <!-- Message Quote -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
      <tr>
        <td style="
          background-color: ${colors.backgroundSecondary};
          border-left: 4px solid ${colors.primary};
          padding: 20px;
          border-radius: 0 8px 8px 0;
        ">
          <p style="margin: 0 0 8px 0; color: ${colors.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            Messaggio da ${buyerName}
          </p>
          <p style="margin: 0; color: ${colors.text}; font-size: 15px; line-height: 1.6; font-style: italic;">
            "${emailBody}"
          </p>
        </td>
      </tr>
    </table>

    ${emailButton('Rispondi su Pagine Azzurre', `${APP_URL}/profile`)}
  `;

  const html = createEmailTemplate(content, `${buyerName} ti ha inviato un messaggio riguardo al tuo ordine`);
  const text = `Messaggio da ${buyerName} riguardo all'ordine: ${orderItems}. "${emailBody}"`;

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
