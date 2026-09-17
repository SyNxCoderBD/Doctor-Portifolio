export interface EducationItem {
  id: string;
  year: string;
  degree: string;
  institution: string;
  details: string;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  issuer: string;
  badge?: string;
}

export interface MedicalService {
  id: string;
  title: string;
  category: 'Interventional' | 'Diagnostic' | 'Preventive' | 'Consultation' | 'Specialized' | string;
  description: string;
  duration: string;
  price: string;
  keyBenefits: string[];
  icon: string;
  imageBase64?: string;
}

export interface ConsultationHour {
  day: string;
  hours: string;
  status: 'Open' | 'Closed' | 'By Appointment' | 'Surgery Hours' | string;
}

export interface ClinicInfo {
  name: string;
  address: string;
  suite: string;
  cityStateZip: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  parkingInfo: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageBase64: string;
  category: 'Clinic' | 'Equipment' | 'Awards' | 'Procedures' | 'Facility' | string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  condition: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export type PatientTestimonial = Testimonial;

export type ElementType =
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'card'
  | 'html'
  | 'divider'
  | 'alert'
  | 'badge';

export interface SectionElement {
  id: string;
  type: ElementType;
  align: 'left' | 'center' | 'right';
  // Heading props
  headingText?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4';
  headingColor?: string;
  // Text / Paragraph props
  textContent?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  // Button props
  buttonLabel?: string;
  buttonLink?: string;
  buttonIcon?: string;
  buttonVariant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'emerald'
    | 'amber'
    | 'custom';
  buttonCustomBg?: string;
  buttonCustomTextColor?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  openInNewTab?: boolean;
  // Image props
  imageBase64?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  imageRounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  imageLinkUrl?: string;
  // Card / Feature block props
  cardTitle?: string;
  cardDescription?: string;
  cardIcon?: string;
  cardBadge?: string;
  cardLink?: string;
  // Raw Custom HTML / Button Code
  customHtml?: string;
  // Divider / Spacing
  dividerStyle?: 'line' | 'dots' | 'space';
  dividerHeight?: number; // in px
  // Alert / Notice
  alertTitle?: string;
  alertMessage?: string;
  alertVariant?: 'info' | 'success' | 'warning' | 'emergency';
  // Badge props
  badgeText?: string;
  badgeColor?: 'sky' | 'emerald' | 'rose' | 'amber' | 'indigo' | 'purple' | 'slate';
  badgeIcon?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  subtitle?: string;
  position:
    | 'after-hero'
    | 'after-about'
    | 'after-services'
    | 'after-schedule'
    | 'after-gallery'
    | 'after-testimonials'
    | 'before-footer';
  backgroundColor: 'white' | 'slate' | 'sky' | 'dark' | 'custom';
  customBgHex?: string;
  textColor?: 'dark' | 'light';
  paddingY: 'none' | 'small' | 'medium' | 'large';
  containerWidth: 'narrow' | 'normal' | 'wide' | 'full';
  headerAlign: 'left' | 'center' | 'right';
  elements: SectionElement[];
  isVisible: boolean;
  order: number;
}

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  schedule: boolean;
  gallery: boolean;
  testimonials: boolean;
  booking: boolean;
  contact: boolean;
}

export interface DoctorProfile {
  id?: string;
  name: string;
  title: string;
  credentialsBadge: string;
  medicalLicense: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel: string;
  heroPhoneCtaLabel: string;
  headshotBase64: string;
  websiteIconBase64: string;
  certificateImageBase64?: string;
  websiteTitle: string;
  emergencyNoticeText: string;
  yearsExperience: number;
  surgeriesPerformed: string;
  patientSatisfaction: string;
  publicationsCount: string;
  consultationFee: string;
  bioParagraph1: string;
  bioParagraph2: string;
  specialties: string[];
  education: EducationItem[];
  awards: AwardItem[];
  services: MedicalService[];
  consultationHours: ConsultationHour[];
  clinicInfo: ClinicInfo;
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  visibility: SectionVisibility;
  sectionOrder?: string[];
  // Section Titles, Badges and Subtitles (All Editable)
  servicesBadge?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  scheduleBadge?: string;
  scheduleTitle?: string;
  scheduleSubtitle?: string;
  scheduleHoursTitle?: string;
  galleryBadge?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  testimonialsBadge?: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  aboutBadge?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutPhilosophyTitle?: string;
  aboutPhilosophyQuote?: string;
  // Hero Stats Customization
  heroStat1Value?: string;
  heroStat1Label?: string;
  heroStat2Value?: string;
  heroStat2Label?: string;
  heroStat3Value?: string;
  heroStat3Label?: string;
  heroStat4Value?: string;
  heroStat4Label?: string;
  // Footer Texts
  footerCopyright?: string;
  footerDisclaimer?: string;
  footerEmergencyText?: string;
  // Section Alignments
  heroAlign?: 'left' | 'center' | 'right' | 'justify';
  aboutAlign?: 'left' | 'center' | 'right' | 'justify';
  servicesAlign?: 'left' | 'center' | 'right' | 'justify';
  scheduleAlign?: 'left' | 'center' | 'right' | 'justify';
  galleryAlign?: 'left' | 'center' | 'right' | 'justify';
  testimonialsAlign?: 'left' | 'center' | 'right' | 'justify';
  customSections?: CustomSection[];
  adminPasscode: string;
  lastUpdated?: string;
}

export interface AppointmentRecord {
  id?: string;
  patientName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceId: string;
  serviceTitle?: string;
  isFirstVisit: boolean;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
