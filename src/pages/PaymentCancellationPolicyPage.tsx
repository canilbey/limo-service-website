import { Container, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import PublicPageLayout from '../components/layout/PublicPageLayout';
import { brandColors } from '../theme';
import { SITE_EMAIL, SITE_EMAIL_HREF, SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from '../constants/site';

export default function PaymentCancellationPolicyPage() {
  return (
    <PublicPageLayout
      title="Payment & Cancellation Policy"
      metaDescription="Budget Limousine payment information, surcharges, and cancellation policy for New Jersey chauffeur services."
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
        >
          Payment &amp; Cancellation Policy
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.textMuted, mb: 4 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mb: 3 }}>
          Thank you for choosing Budget Limousine for your journey. We are committed to delivering a safe, comfortable,
          and professional transportation experience. Please review the following information regarding pricing, payments,
          surcharges, and cancellations. For questions, contact us at{' '}
          <a href={SITE_PHONE_HREF} style={{ color: brandColors.primary }}>
            {SITE_PHONE_DISPLAY}
          </a>{' '}
          or{' '}
          <a href={SITE_EMAIL_HREF} style={{ color: brandColors.primary }}>
            {SITE_EMAIL}
          </a>
          .
        </Typography>

        <Divider sx={{ my: 3, borderColor: brandColors.border }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Payment information
          </Typography>
          <List dense sx={{ color: brandColors.textSecondary, pl: 0 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="All quoted prices are based on cash payments unless otherwise agreed in writing." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Tolls and gratuities are not included in estimates provided over the phone or online." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Payments made by credit card are subject to a 3.5% convenience fee." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="No New Jersey sales tax is applicable to transportation services arranged through Budget Limousine." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="We do not accept checks or traveler’s checks under any circumstances." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Toll charges are estimated based on standard cash rates for a round-trip journey and may vary depending on the actual route taken." />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Additional services &amp; surcharges
          </Typography>
          <List dense sx={{ color: brandColors.textSecondary, pl: 0 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Child safety seats (including rear-facing and forward-facing car seats) are available upon request for all age groups at an additional charge of $20.00 each, subject to availability." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="For point-to-point services, a 10-minute grace period applies. Beyond this window, waiting time will be billed per minute at the hourly rate applicable to the reserved vehicle. Hourly rates typically range from $85.00 to $150.00 depending on vehicle type." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="All prices are based on standard traffic conditions. Fares may increase due to heavy traffic, severe weather, or peak holidays (e.g., Thanksgiving, Christmas, New Year’s Eve), and are subject to availability." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Reservations scheduled between 10:45 PM and 4:15 AM may incur a minimum overnight surcharge of $20.00." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Due to regular Friday afternoon traffic congestion, an additional surcharge may apply to New York–bound rides, including trips to or from any New York airport, between 12:00 PM and 7:30 PM." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="A vehicle cleaning fee may be charged in the event of littering, spillage, or excessive mess inside the vehicle. This fee starts at $125.00 and may increase based on the extent of cleaning required." />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            General pricing information
          </Typography>
          <List dense sx={{ color: brandColors.textSecondary, pl: 0 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="All quoted rates apply strictly to one-way service unless a round trip is explicitly quoted. In most cases, round-trip fares are double the one-way rate." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Airport pickups include a 45-minute grace period from the actual flight arrival time, during which no additional waiting fees will be incurred." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Standard airport pickups are conducted curbside. Inside meet-and-greet service, when available, may incur an additional fee plus applicable parking charges for domestic and international arrivals." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="All rates are subject to change without prior notice." />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Cancellation policy &amp; no-shows
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mb: 2 }}>
            Cancellations must be confirmed verbally by phone at least 6 hours prior to the scheduled pickup time. Contact
            us at{' '}
            <a href={SITE_PHONE_HREF} style={{ color: brandColors.primary }}>
              {SITE_PHONE_DISPLAY}
            </a>
            .
          </Typography>
          <List dense sx={{ color: brandColors.textSecondary, pl: 0 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Cancellations made with less than 6 hours’ notice, or failure to appear (no-shows), may be charged the full cost of the scheduled service." />
            </ListItem>
          </List>
        </Box>

        <Typography variant="body2" sx={{ color: brandColors.textMuted, mt: 2 }}>
          This page summarizes common policies. Your confirmation or dispatch communication may include trip-specific terms.
        </Typography>
      </Container>
    </PublicPageLayout>
  );
}
