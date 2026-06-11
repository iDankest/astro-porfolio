// @ts-check
import { Resend } from 'resend';

export const prerender = false;

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL ?? 'dankestmirror@hotmail.es';
const FROM_EMAIL = import.meta.env.FROM_EMAIL ?? 'onboarding@resend.dev';
const FROM_NAME = import.meta.env.FROM_NAME ?? 'Kilian Sánchez';
const AUTO_REPLY_EVENT = import.meta.env.AUTO_REPLY_EVENT ?? 'contact.submitted';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" role="img" aria-label="${escapeHtml(FROM_NAME)}">
  <rect width="56" height="56" rx="12" fill="#0a0a0c"/>
  <text x="28" y="38" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="32" fill="#c8ff00">K</text>
</svg>`.trim();

const buildOwnerEmail = ({ name, email, subject, message, safeSubject, receivedAt }) => `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; color: #0a0a0c; line-height: 1.6;">
  <div style="padding-bottom: 1rem; border-bottom: 1px solid #e5e5e5;">
    ${LOGO_SVG}
  </div>
  <h2 style="margin:1.2rem 0 1rem; font-size: 1.2rem;">Nuevo mensaje desde el portfolio</h2>
  <p style="margin:.4rem 0;"><strong>Nombre:</strong> ${escapeHtml(name)}</p>
  <p style="margin:.4rem 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <p style="margin:.4rem 0;"><strong>Asunto:</strong> ${escapeHtml(safeSubject)}</p>
  <p style="margin:.4rem 0; color: #777; font-size: .9rem;"><strong>Fecha:</strong> ${escapeHtml(receivedAt)}</p>
  <hr style="border:none; border-top:1px solid #e5e5e5; margin:1.2rem 0;" />
  <p style="white-space: pre-wrap; margin: 0; color: #1a1a1a;">${escapeHtml(message)}</p>
  <hr style="border:none; border-top:1px solid #e5e5e5; margin:1.5rem 0 0;" />
  <p style="margin: .8rem 0 0; color: #999; font-size: .8rem;">Enviado desde idankest.dev</p>
</div>`;

export async function POST({ request }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Cuerpo JSON inválido.' });
  }

  const name = (payload?.name ?? '').trim();
  const email = (payload?.email ?? '').trim();
  const subject = (payload?.subject ?? '').trim();
  const message = (payload?.message ?? '').trim();
  const honeypot = (payload?.website ?? '').trim();

  if (honeypot) {
    return json(200, { ok: true });
  }

  if (!name || name.length < 2) {
    return json(400, { ok: false, error: 'El nombre es obligatorio.' });
  }
  if (!isValidEmail(email)) {
    return json(400, { ok: false, error: 'Email no válido.' });
  }
  if (!message || message.length < 10) {
    return json(400, { ok: false, error: 'El mensaje debe tener al menos 10 caracteres.' });
  }
  if (message.length > 5000) {
    return json(400, { ok: false, error: 'El mensaje es demasiado largo (máx. 5000).' });
  }

  if (!resend) {
    console.error('[contact] RESEND_API_KEY no configurada.');
    return json(500, { ok: false, error: 'Servicio de email no configurado.' });
  }

  const safeSubject = subject || `Nuevo mensaje de ${name}`;
  const receivedAt = new Date().toISOString();

  // 1) Email principal al dueño: OBLIGATORIO. Si falla, el envío se considera fallido.
  let ownerRes;
  try {
    ownerRes = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[Portfolio] ${safeSubject}`,
      html: buildOwnerEmail({ name, email, subject, message, safeSubject, receivedAt }),
    });
  } catch (err) {
    console.error('[contact] Owner email threw:', err);
    return json(502, { ok: false, error: 'No se pudo enviar el email.' });
  }

  if (ownerRes.error) {
    console.error('[contact] Owner email error:', ownerRes.error);
    return json(502, { ok: false, error: 'No se pudo enviar el email.' });
  }

  // 2) Disparar evento para que Resend Automation mande el auto-reply al visitante.
  //    Opcional: si la automation no existe o falla, el envío principal sigue siendo válido.
  let automationTriggered = false;
  try {
    const eventRes = await resend.events.send({
      event: AUTO_REPLY_EVENT,
      email,
      payload: {
        name,
        email,
        subject: safeSubject,
        message,
        receivedAt,
        fromName: FROM_NAME,
      },
    });
    if (eventRes.error) {
      console.warn('[contact] Auto-reply event no enviado:', eventRes.error);
    } else {
      automationTriggered = true;
    }
  } catch (err) {
    console.warn('[contact] Auto-reply event threw (ignorado):', err);
  }

  return json(200, { ok: true, automationTriggered });
}
