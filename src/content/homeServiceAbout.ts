/**
 * SEO-friendly service blurbs shown in the home page About section when ?service=<slug> is present.
 */
export const DEFAULT_ABOUT_HEADING = 'Budget Limousine';

export const DEFAULT_ABOUT_PARAGRAPHS = [
  'Budget Limousine is New Jersey\'s most trusted luxury transportation provider, offering professional, punctual, and personalized chauffeur services across the entire state. From the executive corridors of Jersey City and Fort Lee to the elegant suburbs of Short Hills, Summit, and Westfield, we bring first-class travel within reach of every client.',
  'Whether you need a seamless airport transfer to Newark Liberty (EWR), JFK, LaGuardia (LGA), or Teterboro (TEB), a corporate car for a business meeting in Morristown or Madison, or an elegant vehicle for a wedding in Princeton or Red Bank — our team is ready 24/7. We proudly serve Princeton, Marlboro, Manalapan, Monroe, Belmar, Red Bank, Montclair, Cedar Grove, Wayne, Verona, Oradell, Morristown, Madison, Short Hills, Summit, Westfield, Bridgewater, Ramsey, Mahwah, Ridgewood, Franklin Lakes, Parsippany, Denville, Dover, Jersey City, and Fort Lee — plus surrounding states on request.',
  'Our modern fleet is meticulously maintained and staffed by courteous, professionally trained chauffeurs committed to punctuality and exceptional service. We offer door-to-door transfers, meet & greet at airports, and safe child seating options upon request (additional charges may apply). At Budget Limousine, we don\'t just provide transportation — we deliver A Ride With Class.',
];

export interface ServiceAboutBlock {
  title: string;
  h3: string;
  paragraphs: string[];
}

export const SERVICE_ABOUT_BY_SLUG: Record<string, ServiceAboutBlock> = {
  'airport-transfer': {
    title: 'Airport limo service New Jersey | EWR JFK LGA TEB',
    h3: 'Airport Transfers — On Time, Every Time',
    paragraphs: [
      'Book dependable airport transportation across New Jersey with Budget Limousine. We specialize in timely pickups and drop-offs for Newark Liberty (EWR), John F. Kennedy (JFK), LaGuardia (LGA), and Teterboro (TEB), with flight monitoring so your chauffeur adjusts to real-world delays.',
      'Our chauffeurs provide a polished meet & greet experience, luggage assistance, and door-to-door routing designed to reduce stress before or after your flight. Whether you are traveling for business or leisure, you get a quiet, climate-controlled vehicle and a team focused on punctuality and professionalism.',
      'Serving North Jersey, Central Jersey, and regional connections to New York City and neighboring states, we help frequent flyers, families, and corporate travelers move efficiently — with upfront courtesy, 24/7 availability, and the consistent quality that has made Budget Limousine a trusted NJ name.',
    ],
  },
  'city-tours': {
    title: 'Luxury city tours NJ & NYC | private chauffeur',
    h3: 'City Tours — See More, Stress Less',
    paragraphs: [
      'Explore New Jersey and New York City from the comfort of a private chauffeured SUV. Budget Limousine plans smarter routing, flexible stops, and attentive service so you can enjoy museums, dining, waterfront districts, and scenic drives without parking hassles or crowded transit.',
      'Ideal for visitors, small groups, and locals celebrating a special day, our tours are curated around your schedule — from Hudson River views to Manhattan highlights — always with a professional chauffeur who prioritizes safety, comfort, and local knowledge.',
      'Ask about hourly service for multi-stop itineraries, and relax knowing your vehicle is clean, well-maintained, and operated by a licensed, vetted chauffeur. It is a premium day out with the reliability New Jersey clients expect from Budget Limousine.',
    ],
  },
  'corporate-travel': {
    title: 'Corporate car service New Jersey | executive transport',
    h3: 'Corporate Travel — Executive-Grade Reliability',
    paragraphs: [
      'Impress clients and protect your schedule with executive car service tailored to meetings, roadshows, airport transfers, and intercity appointments. Budget Limousine delivers discreet, punctual transportation with professional chauffeurs trained for business etiquette and efficiency.',
      'We support road warriors across Jersey City, Morristown, Princeton, Short Hills, and regional corridors into NYC and adjacent states. Vehicles are presented in pristine condition, and rides are planned around traffic patterns and tight timelines.',
      'Whether you need a single transfer or recurring travel support, our team focuses on consistency — the same high standard of communication, safety, and comfort that helps busy leaders stay productive on the move.',
    ],
  },
  'special-events': {
    title: 'Wedding & event limo NJ | prom special occasions',
    h3: 'Special Events — Arrive in Style',
    paragraphs: [
      'Make weddings, proms, anniversaries, and milestone celebrations unforgettable with luxury chauffeured transportation from Budget Limousine. We coordinate timing with venues and planners, provide elegant arrivals, and keep your group moving smoothly through photo stops and reception schedules.',
      'From intimate couples to small groups, our fleet offers premium setups for formal attire, comfortable seating, and photo-ready presentation — with chauffeurs who understand the importance of patience, polish, and precision on your big day.',
      'Serving clients throughout New Jersey and nearby states, we help you focus on the moment while we handle routing, staging, and a professional on-site presence that elevates every entrance.',
    ],
  },
  'hourly-hire': {
    title: 'Hourly chauffeur service NJ | as-directed car service',
    h3: 'Hourly Hire — Your Chauffeur On Demand',
    paragraphs: [
      'When your day has multiple stops — client dinners, errands, or flexible evening plans — hourly chauffeur service keeps a dedicated vehicle and driver at your disposal. Budget Limousine offers discreet, as-directed transportation with clear communication and proactive routing.',
      'Perfect for executives, families, and small teams, hourly service eliminates the scramble between appointments. Your chauffeur waits on site, handles luggage, and adjusts as your schedule evolves.',
      'Available 24/7 across New Jersey with coverage into NYC and neighboring regions, hourly hire combines premium vehicles with disciplined time management so you stay productive and comfortable from the first pickup to the final drop-off.',
    ],
  },
};
