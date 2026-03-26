import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import PublicPageLayout from '../components/layout/PublicPageLayout';
import { brandColors } from '../theme';
import { SITE_EMAIL, SITE_EMAIL_HREF, SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from '../constants/site';

export default function TermsConditionsPage() {
  return (
    <PublicPageLayout
      title="Terms & Conditions"
      metaDescription="Terms, cancellation policy, and additional charges for Budget Limousine car service in New Jersey."
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Terms &amp; Conditions
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.textMuted, mb: 4 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mb: 3 }}>
          These Terms &amp; Conditions (“Terms”) govern your use of Budget Limousine’s website and the provision of
          chauffeured transportation services. By booking or using our services, you agree to these Terms.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            1. Service description
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            We provide private car and limousine services as described at the time of booking. Vehicle class, capacity,
            and included amenities depend on availability and the reservation details you confirm with our team.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            2. Booking confirmation
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            A booking request submitted through the website does not guarantee service until confirmed by Budget
            Limousine. Rates, routing, and vehicle assignment may be finalized during confirmation. You agree to provide
            accurate pickup information, flight details when applicable, and a reachable phone number.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            3. Payments and card processing
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mb: 2 }}>
            Payment terms are communicated at confirmation. Where credit card processing is offered, an industry-standard
            processing surcharge may apply in accordance with the disclosure provided at the time of payment.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            4. Additional charges and optional services
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mb: 1 }}>
            Certain optional items may incur additional fees, including but not limited to:
          </Typography>
          <List dense sx={{ color: brandColors.textSecondary }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Child safety seats, booster seats, or specialty equipment requested for your trip." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Excess waiting time beyond the complimentary window described in your confirmation." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Cleaning or damage fees if the vehicle requires extraordinary sanitation or repair due to passenger actions." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Tolls, parking, and regulatory fees incurred during service, when applicable." />
            </ListItem>
          </List>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mt: 2 }}>
            Specific dollar amounts, where applicable, will be quoted before service or documented on your invoice when
            the charge is event-based (for example, biohazard or heavy-soiling cleaning).
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            5. Cancellation policy
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Cancellations must be submitted with sufficient advance notice to avoid fees. Unless a different written policy
            is attached to your confirmation, we require notice at least six (6) hours prior to the scheduled pickup time.
            Late cancellations or no-shows may be subject to a cancellation charge up to the full estimated trip amount,
            as communicated during confirmation. Special events and peak dates may carry stricter policies disclosed at
            booking.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            6. Passenger conduct and safety
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Smoking is not permitted unless expressly allowed in writing. Passengers must comply with lawful instructions
            from the chauffeur. We may refuse or terminate service for unsafe, unlawful, or abusive behavior without
            refund.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            7. Limitation of liability
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            To the fullest extent permitted by law, Budget Limousine is not liable for indirect, incidental, special,
            consequential, or punitive damages, or for delays caused by factors outside our reasonable control (including
            severe weather, traffic, or third-party airport actions). Our aggregate liability arising from transportation
            services will not exceed the fees paid for the affected booking unless otherwise required by law.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            8. Changes to these Terms
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            We may update these Terms from time to time. The updated Terms will be posted on this page. Material changes
            may require additional notice where required by law. Continued use of our services after changes take effect
            constitutes acceptance.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            9. Contact
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Budget Limousine —{' '}
            <Box component="a" href={SITE_PHONE_HREF} sx={{ color: brandColors.primary }}>
              {SITE_PHONE_DISPLAY}
            </Box>
            {' · '}
            <Box component="a" href={SITE_EMAIL_HREF} sx={{ color: brandColors.primary }}>
              {SITE_EMAIL}
            </Box>
          </Typography>
        </Box>
      </Container>
    </PublicPageLayout>
  );
}
