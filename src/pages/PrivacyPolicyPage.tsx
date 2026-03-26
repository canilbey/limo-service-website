import { Container, Typography, Box, List, ListItem, ListItemText, Link as MuiLink } from '@mui/material';
import type { ReactNode } from 'react';
import PublicPageLayout from '../components/layout/PublicPageLayout';
import { brandColors } from '../theme';
import { Link as RouterLink } from 'react-router-dom';
import { SITE_EMAIL, SITE_EMAIL_HREF, SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from '../constants/site';

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout
      title="Privacy Policy"
      metaDescription="Budget Limousine privacy policy: how we collect, use, store, and protect personal information when you use our website and car service."
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.textMuted, mb: 4 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Section title="1. Introduction">
          Budget Limousine (“we”, “us”, or “our”) respects your privacy. This Privacy Policy describes how we collect,
          use, disclose, and safeguard information when you visit our website, submit a booking request, communicate
          with our dispatch team, or use our chauffeur services. By using our services, you agree to this policy.
        </Section>

        <Section title="2. Information we collect">
          <Box>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.85, color: brandColors.textSecondary }}>
              We may collect:
            </Typography>
            <List dense sx={{ color: brandColors.textSecondary, pl: 2, listStyleType: 'disc' }}>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Personal identifiers: name, email address, phone number, billing-related notes you provide." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Trip details: pickup and drop-off locations, dates and times, flight numbers, special instructions." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Optional requests: child seat needs, waiting time preferences, accessibility notes." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Technical data: IP address, browser type, device identifiers, and usage data collected via cookies or similar technologies." />
              </ListItem>
            </List>
          </Box>
        </Section>

        <Section title="3. How we use information">
          We use personal information to schedule and deliver transportation, verify identity when needed, communicate
          about your reservation, improve our website and services, comply with law, detect fraud or abuse, and send
          operational messages (for example, confirmations or updates related to your trip). We do not sell your personal
          information.
        </Section>

        <Section title="4. How we share information">
          We may share information with service providers who assist operations (for example, hosting, email delivery,
          or payment processing), with professional advisers where required, or with law enforcement when legally
          necessary. Chauffeurs receive the minimum trip details required to complete your ride safely and professionally.
        </Section>

        <Section title="5. Your rights and choices">
          Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict certain
          processing of your personal data, or to object to processing. To exercise these rights, contact us using the
          details at the end of this policy. You may unsubscribe from non-essential marketing communications where
          applicable.
        </Section>

        <Section title="6. Data security">
          We implement reasonable administrative, technical, and organizational measures designed to protect personal
          information. No method of transmission over the Internet is completely secure; we encourage you to use
          strong passwords and protect your devices.
        </Section>

        <Section title="7. Data retention">
          We retain personal information only as long as necessary to fulfill the purposes described in this policy,
          resolve disputes, enforce agreements, and comply with legal obligations. Retention periods may vary based on
          record type and regulatory requirements.
        </Section>

        <Section title="8. Cookies and similar technologies">
          We use cookies and similar technologies to operate the website, remember preferences, measure performance, and
          enhance user experience. You can control cookies through your browser settings. For more detail, see our{' '}
          <MuiLink component={RouterLink} to="/cookie-policy" color="primary" fontWeight={600} underline="hover">
            Cookie Policy
          </MuiLink>
          .
        </Section>

        <Section title="9. Third-party links">
          Our website may link to third-party sites. We are not responsible for the privacy practices of those sites.
          Please review their policies before providing information.
        </Section>

        <Section title="10. Children’s privacy">
          Our services are not directed to children under 13, and we do not knowingly collect personal information from
          children. If you believe we have collected information from a child, please contact us so we can delete it.
        </Section>

        <Section title="11. International users">
          If you access our services from outside the United States, your information may be processed in the United
          States where data protection laws may differ from your country.
        </Section>

        <Section title="12. Changes to this policy">
          We may update this Privacy Policy from time to time. The updated version will be posted on this page with a
          revised “Last updated” date. Continued use of our services after changes become effective constitutes acceptance
          of the revised policy.
        </Section>

        <Section title="13. Contact us">
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Questions about this Privacy Policy? Contact Budget Limousine:{' '}
            <Box component="a" href={SITE_PHONE_HREF} sx={{ color: brandColors.primary }}>
              {SITE_PHONE_DISPLAY}
            </Box>
            {' · '}
            <Box component="a" href={SITE_EMAIL_HREF} sx={{ color: brandColors.primary }}>
              {SITE_EMAIL}
            </Box>
          </Typography>
        </Section>
      </Container>
    </PublicPageLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1.1rem' }}>
        {title}
      </Typography>
      {typeof children === 'string' ? (
        <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
}
