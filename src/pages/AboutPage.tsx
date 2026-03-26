import { Container, Typography, Box } from '@mui/material';
import PublicPageLayout from '../components/layout/PublicPageLayout';
import { brandColors } from '../theme';

const SECTIONS = [
  {
    heading: 'Over 15 years of trusted luxury transportation',
    body: [
      'Budget Limousine has spent more than fifteen years refining what premium ground transportation should feel like in New Jersey and the broader Tri-State region. What began as a commitment to punctuality and polished service has grown into a full-service chauffeur operation trusted by executives, families, event planners, and frequent travelers who expect consistency on every mile.',
      'We approach every reservation with the same standards: immaculate vehicles, professionally trained chauffeurs, discreet communication, and routing judgment that respects your time. Whether you are heading to Newark (EWR), JFK, LaGuardia (LGA), or Teterboro (TEB), moving between corporate campuses, or celebrating a milestone evening, our team plans the details so you can stay focused on what matters.',
    ],
  },
  {
    heading: 'Customer satisfaction at the center of every ride',
    body: [
      'Our reputation is built repeat ride by repeat ride. Clients return to Budget Limousine because we listen, follow instructions precisely, and adapt when plans change. From meet & greet airport service to hourly as-directed itineraries, we prioritize courtesy, safety, and clear updates so you never feel uncertain about your chauffeur\'s arrival or route.',
      'We maintain a modern fleet suited to New Jersey\'s executive suburbs, dense urban corridors, and long-distance connections into New York and neighboring states. Each vehicle is inspected and prepared to present a premium experience — quiet cabin, climate comfort, and the small touches that define A Ride With Class.',
    ],
  },
  {
    heading: 'Serving New Jersey and neighboring states',
    body: [
      'Budget Limousine provides door-to-door chauffeur service across New Jersey with dependable coverage for regional travel into New York, Pennsylvania, Connecticut, and Delaware depending on itinerary. Airport transfers, corporate road schedules, weddings, proms, concerts, and private city tours are all part of our daily operations.',
      'If you are comparing limo services for reliability and professionalism, we invite you to book with a team that combines local expertise with hospitality-level care. Tell us your pickup, timing, and vehicle preference — we will handle the rest.',
    ],
  },
];

export default function AboutPage() {
  return (
    <PublicPageLayout
      title="About Us"
      metaDescription="Learn about Budget Limousine — 15+ years of luxury chauffeur service in New Jersey, customer-focused airport transfers, corporate travel, and special events."
    >
      <Container maxWidth="md">
        <Typography
          variant="overline"
          sx={{ color: brandColors.primary, letterSpacing: '0.2em', display: 'block', mb: 2, fontWeight: 600 }}
        >
          About Budget Limousine
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          New Jersey&apos;s Chauffeur Service — Built on Experience and Care
        </Typography>
        <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 5, lineHeight: 1.85 }}>
          Budget Limousine is a customer-first limousine and private car company specializing in airport transportation, executive travel, and special occasions.
          This page summarizes our story, values, and service footprint for clients who want a transparent, SEO-friendly overview before they book.
        </Typography>

        {SECTIONS.map((section) => (
          <Box key={section.heading} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, fontSize: '1.25rem' }}>
              {section.heading}
            </Typography>
            {section.body.map((p) => (
              <Typography key={p.slice(0, 48)} variant="body1" sx={{ color: brandColors.textSecondary, mb: 2, lineHeight: 1.9 }}>
                {p}
              </Typography>
            ))}
          </Box>
        ))}
      </Container>
    </PublicPageLayout>
  );
}
