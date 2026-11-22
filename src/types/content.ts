export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  defaultWhatsappMessage: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  operatingHours: string;
  serviceArea: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  links: NavLink[];
  ctaButton: {
    label: string;
    href: string;
  };
}

export interface HomeHero {
  badge: string;
  title1: string;
  title2: string;
  title3Accent: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  bgImage: string;
  bottomQuoteLines: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HomeAbout {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  bottomQuoteLines: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface HomeServices {
  badge: string;
  heading: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface HomeCoverage {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  mapImage: string;
  sideImage: string;
  sideQuoteLines: string[];
}

export interface GalleryItem {
  name: string;
  image: string;
}

export interface HomeGallery {
  badge: string;
  heading: string;
  subtitle: string;
  items: GalleryItem[];
}

export interface HomeComfort {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  features: string[];
  image: string;
  quoteText: string;
}

export interface HomeReviews {
  badge: string;
  heading: string;
  elfsightAppId: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface HomeHowItWorks {
  badge: string;
  heading: string;
  steps: StepItem[];
}

export interface ZoneItem {
  id: number;
  name: string;
  areasHeadline: string;
  description: string;
}

export interface AreaItem {
  id: string;
  name: string;
  zoneId: number;
  popular?: boolean;
}

export interface ZoneRateItem {
  fixedUpTo5km: number;
  perKm: number;
}

export interface PricingConfig {
  heading: string;
  subheading: string;
  badge: string;
  /** Zone rate card: fixed fare to fixedTierMaxKm, then the zone rate per km. */
  zoneRates?: Record<string, ZoneRateItem>;
  fixedTierMaxKm?: number;
  quotedBeyondKm?: number;
  waitingFeePerHour?: number;
  /** Legacy floor, superseded by the zone rate card. */
  minimumFare: number;
  perExtraPetFee: number;
  maxPets: number;
  notes: string[];
  zones: ZoneItem[];
  areas: AreaItem[];
  ratesPerKm: Record<string, number>;
  distancesKm: Record<string, number>;
  areaDistances?: Record<string, number>;
}

export interface FAQItem {
  id: number;
  number: string;
  question: string;
  answer: string;
  /** Optional sub-section inside one FAQ list (e.g. obedience add-on). */
  group?: string;
}

export interface HighlightItem {
  title: string;
  subtitle: string;
  icon?: string;
}

export interface PetTransportContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    heroImage: string;
  };
  highlights: HighlightItem[];
  comfortFeatures: string[];
  pricingConfig: PricingConfig;
  faqs: FAQItem[];
}

export interface DogWalkingPlan {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  unit: string;
  features: string[];
  popular?: boolean;
  waText: string;
}

export interface DogWalkingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    heroImage: string;
  };
  highlights: HighlightItem[];
  pricingPlans: DogWalkingPlan[];
  faqs: FAQItem[];
}

export interface PetSittingServiceItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  unit: string;
  features: string[];
  popular?: boolean;
  waText: string;
}

export interface PetSittingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    heroImage: string;
  };
  highlights: HighlightItem[];
  services: PetSittingServiceItem[];
  faqs: FAQItem[];
}

export interface MetricItem {
  label: string;
  value: string;
  description: string;
}

export interface SpotlightStory {
  id: string;
  title: string;
  petName: string;
  ownerName: string;
  quote: string;
  story: string;
  image: string;
  rating: number;
}

export interface StoryItem {
  id: string;
  title: string;
  petName: string;
  ownerName: string;
  category: "adventures" | "vet" | "relocation" | "daily" | string;
  categoryLabel: string;
  location: string;
  date: string;
  image: string;
  imageAlt?: string;
  excerpt: string;
  fullStory: string;
  quote: string;
  rating: number;
}

export interface StoriesContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    heroImage: string;
  };
  highlights: HighlightItem[];
  metrics: MetricItem[];
  spotlightStory: SpotlightStory;
  storiesList: StoryItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  status: "active" | "inactive" | "out_of_stock";
  stock: number;
}

export interface FooterConfig {
  brandDescription: string;
  quickLinks: NavLink[];
  socialLinks: {
    platform: string;
    url: string;
    label: string;
  }[];
  copyrightText: string;
}

export interface AppContent {
  site: SiteConfig;
  navigation: NavigationConfig;
  home: {
    hero: HomeHero;
    features: FeatureItem[];
    about: HomeAbout;
    services: HomeServices;
    coverage: HomeCoverage;
    gallery: HomeGallery;
    comfort: HomeComfort;
    reviews: HomeReviews;
    howItWorks: HomeHowItWorks;
  };
  servicesPages: {
    petTransport: PetTransportContent;
    dogWalking: DogWalkingContent;
    petSitting: PetSittingContent;
  };
  stories: StoriesContent;
  products: ProductItem[];
  footer: FooterConfig;
}

