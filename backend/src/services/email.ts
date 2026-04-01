import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface BookingEmailPayload {
  reference: string;
  tripType: string;
  pickup: string;
  destination: string | null;
  serviceDate: string;
  serviceTime: string;
  hours: number | null;
  vehicleName: string;
  vehiclePrice: number;
  bookingFor: string | null;
  pickupSign: string | null;
  flightNumber: string | null;
  meetingTime: string | null;
  driverNotes: string | null;
  extras: Record<string, unknown>;
  additionalStops: string[];
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  estimatedDistanceMiles: number | null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatExtras(extras: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(extras)) {
    if (typeof v === 'number' && v > 0) {
      lines.push(`${k}: ${v}`);
    }
  }
  return lines.length ? lines.join('<br/>') : 'None';
}

/**
 * Builds nodemailer transport: Gmail OAuth2 via EMAIL_OAUTH2_REFRESH_TOKEN, Gmail App Password
 * via EMAIL_SERVICE=gmail + EMAIL_PASS, or explicit SMTP (EMAIL_HOST / EMAIL_PORT).
 */
function createBookingEmailTransporter(): Transporter | null {
  const emailService = process.env.EMAIL_SERVICE?.trim().toLowerCase();
  const host = process.env.EMAIL_HOST?.trim();
  const portRaw = process.env.EMAIL_PORT?.trim();
  const port = portRaw ? parseInt(portRaw, 10) : 587;
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS ?? '';

  if (emailService === 'gmail') {
    if (!user) {
      console.warn('[email] EMAIL_SERVICE=gmail requires EMAIL_USER.');
      return null;
    }
    const oauthRefresh = process.env.EMAIL_OAUTH2_REFRESH_TOKEN?.trim();
    if (oauthRefresh) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user,
          clientId: process.env.EMAIL_OAUTH2_CLIENT_ID?.trim(),
          clientSecret: process.env.EMAIL_OAUTH2_CLIENT_SECRET?.trim(),
          refreshToken: oauthRefresh,
        },
      });
    }
    if (!pass) {
      console.warn(
        '[email] EMAIL_SERVICE=gmail requires EMAIL_OAUTH2_REFRESH_TOKEN (OAuth2) or EMAIL_PASS (App Password).',
      );
      return null;
    }
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  if (!host || !user) {
    console.warn(
      '[email] sendBookingNotification skipped: set EMAIL_HOST, EMAIL_USER, EMAIL_PASS (or EMAIL_SERVICE=gmail with EMAIL_USER, EMAIL_PASS)',
    );
    return null;
  }

  const secure = port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && !secure ? { requireTLS: true as const } : {}),
  });
}

/**
 * Sends booking notification to operations email when SMTP is configured.
 * If EMAIL_* is missing, logs and returns without throwing.
 */
export async function sendBookingNotification(payload: BookingEmailPayload): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL?.trim() || 'Info@budgetlimonj.com';
  const from = process.env.EMAIL_FROM?.trim() || 'Info@budgetlimonj.com';

  const transporter = createBookingEmailTransporter();
  if (!transporter) {
    return;
  }

  const customerName = `${payload.title} ${payload.firstName} ${payload.lastName}`.trim();
  const stopsHtml =
    payload.additionalStops.length > 0
      ? `<p><strong>Stops:</strong><br/>${payload.additionalStops.map((s) => escapeHtml(s)).join('<br/>')}</p>`
      : '';

  const html = `
<!DOCTYPE html>
<html><body style="font-family: sans-serif; line-height: 1.5; color: #333;">
  <h2>New booking request — ${escapeHtml(payload.reference)}</h2>
  <p><strong>Customer:</strong> ${escapeHtml(customerName)}<br/>
  <strong>Phone:</strong> ${escapeHtml(payload.phone)}<br/>
  <strong>Email:</strong> ${payload.email ? escapeHtml(payload.email) : '—'}</p>
  <p><strong>Trip type:</strong> ${escapeHtml(payload.tripType)}</p>
  <p><strong>Pickup:</strong> ${escapeHtml(payload.pickup)}</p>
  ${payload.destination ? `<p><strong>Destination:</strong> ${escapeHtml(payload.destination)}</p>` : ''}
  ${stopsHtml}
  <p><strong>Date / time:</strong> ${escapeHtml(payload.serviceDate)} ${escapeHtml(payload.serviceTime)}</p>
  ${payload.hours != null ? `<p><strong>Hours:</strong> ${payload.hours}</p>` : ''}
  <p><strong>Vehicle:</strong> ${escapeHtml(payload.vehicleName)} — $${payload.vehiclePrice}</p>
  <p><strong>Pickup sign:</strong> ${payload.pickupSign ? escapeHtml(payload.pickupSign) : '—'}</p>
  <p><strong>Booking for:</strong> ${payload.bookingFor ? escapeHtml(payload.bookingFor) : '—'}</p>
  <p><strong>Flight:</strong> ${payload.flightNumber ? escapeHtml(payload.flightNumber) : '—'}</p>
  <p><strong>Meeting time:</strong> ${payload.meetingTime ? escapeHtml(payload.meetingTime) : '—'}</p>
  <p><strong>Customer notes:</strong> ${payload.driverNotes ? escapeHtml(payload.driverNotes) : '—'}</p>
  <p><strong>Extras:</strong><br/>${formatExtras(payload.extras)}</p>
  <p><strong>Est. distance (mi):</strong> ${payload.estimatedDistanceMiles != null ? String(payload.estimatedDistanceMiles) : '—'}</p>
</body></html>
`.trim();

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `New booking ${payload.reference} — ${customerName}`,
      html,
    });
    if (process.env.NODE_ENV === 'development') {
      console.info('[email] booking notification sent for reference', payload.reference);
    }
  } catch (err) {
    console.error('[email] sendBookingNotification failed:', err);
  }
}
