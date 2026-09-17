import { DoctorProfile } from '../types/doctor';

// High-fidelity clinical portrait for Dr. Julian Vance
export const DEFAULT_DOCTOR_HEADSHOT =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=900&auto=format&fit=crop';

export const DEFAULT_WEBSITE_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="%230369a1"/><path d="M32 15C25.4 15 20 20.4 20 27c0 10.8 12 21.6 12 21.6s12-10.8 12-21.6c0-6.6-5.4-12-12-12z" fill="white"/><path d="M26 27h12M32 21v12" stroke="%230369a1" stroke-width="3.5" stroke-linecap="round"/></svg>';

export const DEFAULT_DOCTOR_DATA: DoctorProfile = {
  name: 'Dr. Julian Vance, MD, FACC',
  title: 'Board-Certified Interventional Cardiologist & Vascular Specialist',
  credentialsBadge: 'Harvard Medical Fellow • 18+ Years Clinical Excellence',
  medicalLicense: 'Medical License NY-ABIM #3829104 • DEA Reg. Active',
  heroHeadline: 'Precision Cardiovascular Care & Restorative Heart Health',
  heroSubheadline:
    'Integrating state-of-the-art diagnostic catheterization, minimally invasive valve repair, and personalized preventive cardiovascular protocols to protect your heart for life.',
  heroCtaLabel: 'Book Consultation',
  heroPhoneCtaLabel: 'Call Office',
  headshotBase64: DEFAULT_DOCTOR_HEADSHOT,
  websiteIconBase64: DEFAULT_WEBSITE_ICON,
  certificateImageBase64: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
  websiteTitle: 'Dr. Julian Vance, MD - Advanced Cardiovascular Practice',
  emergencyNoticeText:
    'If you or a loved one is experiencing severe chest pain, radiating left arm discomfort, acute dyspnea, or loss of consciousness, please call 911 or visit the nearest emergency trauma center immediately.',
  yearsExperience: 18,
  surgeriesPerformed: '5,400+',
  patientSatisfaction: '99.6%',
  publicationsCount: '44',
  consultationFee: '$280',
  bioParagraph1:
    'Dr. Julian Vance is an internationally distinguished interventional cardiologist who has dedicated over 18 years to advancing catheter-based heart interventions and comprehensive preventive cardiology. As former Associate Clinical Director of Interventional Cardiology at Columbia-Presbyterian, Dr. Vance treats complex coronary artery disease, structural heart conditions, and resistant arterial hypertension.',
  bioParagraph2:
    'He completed his Internal Medicine residency at Johns Hopkins and his advanced cardiovascular disease fellowship at Harvard Medical School / Massachusetts General Hospital. Dr. Vance emphasizes a patient-first ethos that unites cutting-edge micro-surgical techniques with empathetic, individualized therapeutic counseling.',
  specialties: [
    'Transcatheter Aortic Valve Replacement (TAVR)',
    'Complex Coronary Angioplasty & Stenting',
    'Preventive Cardiometabolic Therapy',
    'Peripheral Vascular Intervention',
    '3D Echocardiography & CT Angiography',
    'Structural Heart Disease & PFO Closure',
    'Hypertension & Lipid Optimization',
    'Cardiovascular Sports Clearance',
  ],
  education: [
    {
      id: 'edu-1',
      year: '2008 – 2011',
      degree: 'Fellowship in Interventional Cardiology',
      institution: 'Massachusetts General Hospital / Harvard Medical School',
      details: 'Chief Interventional Fellow. Specialized in transcatheter aortic valves and coronary revascularization.',
    },
    {
      id: 'edu-2',
      year: '2005 – 2008',
      degree: 'Internal Medicine Residency',
      institution: 'The Johns Hopkins Hospital',
      details: 'Recipient of the Osler Excellence in Clinical Bedside Teaching Award.',
    },
    {
      id: 'edu-3',
      year: '2001 – 2005',
      degree: 'Doctor of Medicine (M.D.)',
      institution: 'Columbia University Vagelos College of Physicians and Surgeons',
      details: 'Graduated Alpha Omega Alpha (AOA) Honor Medical Society, Magna Cum Laude.',
    },
    {
      id: 'edu-4',
      year: '1997 – 2001',
      degree: 'B.S. in Biomedical Engineering',
      institution: 'Duke University',
      details: 'Summa Cum Laude, Dean’s List with Distinction.',
    },
  ],
  awards: [
    {
      id: 'award-1',
      year: '2024',
      title: 'Top Cardiovascular Specialist of the Year',
      issuer: 'New York Academy of Medicine',
      badge: 'Gold Distinction',
    },
    {
      id: 'award-2',
      year: '2023',
      title: 'Excellence in Catheterization Outcomes Award',
      issuer: 'American College of Cardiology (ACC)',
      badge: 'National Honor',
    },
    {
      id: 'award-3',
      year: '2021',
      title: 'Distinguished Clinical Investigator',
      issuer: 'Society for Cardiovascular Angiography & Interventions (SCAI)',
      badge: 'Peer Recognized',
    },
    {
      id: 'award-4',
      year: '2019',
      title: 'Compassionate Physician Merit Citation',
      issuer: 'Patient Advocacy Council of Greater NY',
      badge: 'Patient Choice',
    },
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Comprehensive Cardiovascular Consultation',
      category: 'Consultation',
      description:
        'In-depth 60-minute diagnostic consultation covering cardiac risk assessment, ECG review, metabolic panel analysis, and personalized risk stratification.',
      duration: '60 Minutes',
      price: '$280',
      keyBenefits: [
        'Resting 12-lead digital ECG included',
        'Direct consultation with Dr. Vance',
        'Same-day tailored treatment trajectory',
        'Coordination with your primary care provider',
      ],
      icon: 'HeartPulse',
    },
    {
      id: 'srv-2',
      title: 'Coronary Angioplasty & Stenting (PCI)',
      category: 'Interventional',
      description:
        'Minimally invasive arterial restoration using bio-resorbable stents and drug-eluting scaffold technology with same-day recovery protocol.',
      duration: '90 – 120 Minutes',
      price: 'Insurance Covered / Tier 1',
      keyBenefits: [
        'Advanced radial artery wrist access',
        'Near-zero incision recovery time',
        'Continuous intravascular ultrasound (IVUS) guidance',
        'Long-term restenosis prevention follow-up',
      ],
      icon: 'Activity',
    },
    {
      id: 'srv-3',
      title: 'TAVR & Structural Heart Repair',
      category: 'Interventional',
      description:
        'Pioneering transcatheter valve replacement for severe aortic stenosis without open-heart sternotomy, enabling rapid return to daily living.',
      duration: 'Procedure Specific',
      price: 'Pre-Authorized Clinical Plan',
      keyBenefits: [
        'Transfemoral catheter technique',
        'Typical 24-48 hour hospital stay',
        'Marked symptomatic relief within days',
        'Comprehensive pre-op 3D CT mapping',
      ],
      icon: 'ShieldCheck',
    },
    {
      id: 'srv-4',
      title: 'High-Resolution 3D Echocardiography',
      category: 'Diagnostic',
      description:
        'Transthoracic ultrasound imaging of ventricular mechanics, valve kinematics, hemodynamics, and cardiac chamber dimensions.',
      duration: '45 Minutes',
      price: '$350',
      keyBenefits: [
        'Non-invasive, zero radiation',
        'Color Doppler blood velocity mapping',
        'Immediate physician interpretation',
        'Comprehensive PDF report sent to patient portal',
      ],
      icon: 'Stethoscope',
    },
    {
      id: 'srv-5',
      title: 'Preventive Cardiometabolic & Lipid Clinic',
      category: 'Preventive',
      description:
        'Targeted intervention for elevated ApoB, Lp(a), familial hypercholesterolemia, and vascular calcium plaque arrest.',
      duration: '45 Minutes',
      price: '$260',
      keyBenefits: [
        'ApoB & advanced lipoprotein sub-fractionation',
        'Coronary Calcium Score counseling',
        'Nutritional & pharmacological synergy',
        'Quarterly digital biomarker tracking',
      ],
      icon: 'LineChart',
    },
    {
      id: 'srv-6',
      title: 'Athletic Cardiac Screening & Clearance',
      category: 'Specialized',
      description:
        'Performance cardiopulmonary exercise testing (CPET), VO2 max evaluation, and sudden cardiac arrest prevention for competitive & recreational athletes.',
      duration: '60 Minutes',
      price: '$395',
      keyBenefits: [
        'Graded treadmill stress testing with continuous ECG',
        'Lactate threshold & VO2 max analysis',
        'Official clinical clearance documentation',
        'Cardiovascular optimization recommendations',
      ],
      icon: 'Zap',
    },
  ],
  consultationHours: [
    { day: 'Monday', hours: '08:00 AM – 05:00 PM', status: 'Open' },
    { day: 'Tuesday', hours: '08:00 AM – 05:00 PM', status: 'Open' },
    { day: 'Wednesday', hours: '07:30 AM – 01:00 PM', status: 'Surgery Hours' },
    { day: 'Thursday', hours: '08:00 AM – 05:00 PM', status: 'Open' },
    { day: 'Friday', hours: '08:00 AM – 03:30 PM', status: 'Open' },
    { day: 'Saturday', hours: '09:00 AM – 01:00 PM', status: 'By Appointment' },
    { day: 'Sunday', hours: 'Emergency On-Call Only', status: 'Closed' },
  ],
  clinicInfo: {
    name: 'Vance Cardiovascular Institute & Heart Center',
    address: '845 Fifth Avenue',
    suite: 'Suite 1200 (12th Floor)',
    cityStateZip: 'New York, NY 10065',
    phone: '+1 (212) 555-0194',
    emergencyPhone: '+1 (212) 555-0911',
    email: 'appointments@vanceheart.com',
    parkingInfo: 'Valet parking available at building entrance. Accessible via 5th Ave & 66th St.',
  },
  gallery: [
    {
      id: 'gal-1',
      title: 'Advanced Hybrid Catheterization Lab',
      caption: 'Equipped with bi-plane fluoroscopy and real-time hemodynamic monitoring.',
      imageBase64: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
      category: 'Equipment',
    },
    {
      id: 'gal-2',
      title: 'Private Patient Consultation Suite',
      caption: 'Designed with acoustic privacy, natural light, and serene clinical amenities.',
      imageBase64: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
      category: 'Clinic',
    },
    {
      id: 'gal-3',
      title: 'Non-Invasive Diagnostic Lab',
      caption: 'State-of-the-art GE Vivid E95 4D ultrasound echocardiography systems.',
      imageBase64: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
      category: 'Equipment',
    },
    {
      id: 'gal-4',
      title: 'Clinical Reception & Patient Lounge',
      caption: 'Uncompromising comfort, quiet work stations, and hospitality-grade amenities.',
      imageBase64: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop',
      category: 'Clinic',
    },
  ],
  testimonials: [
    {
      id: 't-1',
      patientName: 'Eleanor Sterling, 67',
      condition: 'Aortic Valve Stenosis (TAVR Procedure)',
      rating: 5,
      comment:
        'Dr. Vance gave me my life back. Before seeing him, walking up five stairs felt impossible. He thoroughly explained the TAVR procedure, dispelling all my fears. Three days post-procedure, I walked out of the hospital with zero chest tightness. His entire team is world-class.',
      date: 'May 14, 2025',
      verified: true,
    },
    {
      id: 't-2',
      patientName: 'Marcus Bennett, 52',
      condition: 'Coronary Stenting & Lipid Protocol',
      rating: 5,
      comment:
        'After an unexpected abnormal stress test, Dr. Vance identified a 90% LAD blockage and successfully placed a stent through my wrist with incredible precision. His follow-up preventive clinic transformed my diet and lipid profile. Outstanding bedside manner.',
      date: 'April 02, 2025',
      verified: true,
    },
    {
      id: 't-3',
      patientName: 'Dr. Rebecca Chen, MD',
      condition: 'Professional Colleague Referral',
      rating: 5,
      comment:
        'As an internal medicine physician myself, Dr. Julian Vance is the first specialist I refer my complex cardiology patients to. His clinical judgment is unimpeachable, his surgical dexterity is revered, and he truly listens to patients.',
      date: 'March 18, 2025',
      verified: true,
    },
  ],
  visibility: {
    hero: true,
    about: true,
    services: true,
    schedule: true,
    gallery: true,
    testimonials: true,
    booking: true,
    contact: true,
  },
  sectionOrder: [
    'hero',
    'about',
    'services',
    'section-wellness-bulletin',
    'schedule',
    'gallery',
    'testimonials',
  ],
  // Section Titles, Badges, and Subtitles (All 100% Editable)
  servicesBadge: 'Specialized Procedures & Clinical Programs',
  servicesTitle: 'Evidence-Based Cardiovascular Care',
  servicesSubtitle:
    'From routine preventive screening to complex catheter-based structural revascularization, every protocol is tailored to your unique clinical anatomy.',
  scheduleBadge: 'Consultation Schedule & Facility Location',
  scheduleTitle: 'Visit Our Manhattan Practice',
  scheduleSubtitle:
    'Conveniently located on Upper Fifth Avenue with dedicated valet parking and immediate subway accessibility.',
  scheduleHoursTitle: 'Clinical Consultation Hours',
  galleryBadge: 'Facility Tour & Technological Infrastructure',
  galleryTitle: 'Our Heart Center & Clinical Suites',
  gallerySubtitle:
    'Tour our Fifth Avenue clinical practice, diagnostic catheterization laboratories, and private consultation environments.',
  testimonialsBadge: 'Verified Clinical Outcomes & Patient Advocacy',
  testimonialsTitle: 'Patient Voices & Clinical Stories',
  testimonialsSubtitle:
    'Real experiences from patients who underwent cardiac catheterization, valve repair, and cardiovascular risk reversal with Dr. Vance.',
  aboutBadge: 'Physician Profile & Clinical Philosophy',
  aboutTitle: 'Distinguished Expertise in Cardiovascular Medicine',
  aboutSubtitle:
    'Combining rigorous academic fellowship training at Harvard and Johns Hopkins with compassionate, continuous patient advocacy.',
  aboutPhilosophyTitle: 'The Vance Practice Philosophy',
  aboutPhilosophyQuote:
    '“Every heartbeat tells an intricate physiological story. Our role as physicians is not merely to perform interventions, but to educate, listen, and partner with each patient to construct a resilient, lifelong cardiovascular foundation.”',
  // Hero Stats
  heroStat1Value: '5,400+',
  heroStat1Label: 'Procedures Completed',
  heroStat2Value: '99.6%',
  heroStat2Label: 'Patient Satisfaction',
  heroStat3Value: '18+',
  heroStat3Label: 'Years Experience',
  heroStat4Value: '44',
  heroStat4Label: 'Peer Publications',
  // Footer Texts
  footerCopyright: '© 2025 Vance Cardiovascular Institute. All rights reserved.',
  footerDisclaimer:
    'The medical information on this website is for educational purposes only and is not intended to replace direct consultation with a qualified healthcare provider.',
  footerEmergencyText:
    'Immediate Emergency: In the event of acute chest tightness or acute distress, call 911 immediately.',
  customSections: [
    {
      id: 'section-wellness-bulletin',
      title: 'Clinical Advisory & Patient Longevity Bulletin',
      subtitle:
        'Evidence-based cardiovascular recommendations, seasonal health advisories, and direct digital triage tools.',
      position: 'after-services',
      backgroundColor: 'slate',
      textColor: 'dark',
      paddingY: 'medium',
      containerWidth: 'wide',
      headerAlign: 'center',
      isVisible: true,
      order: 1,
      elements: [
        {
          id: 'el-badge-1',
          type: 'badge',
          align: 'center',
          badgeText: 'Spring 2025 Cardiovascular Advisory',
          badgeColor: 'sky',
          badgeIcon: 'Sparkles',
        },
        {
          id: 'el-heading-1',
          type: 'heading',
          align: 'center',
          headingText: 'Early Detection & Coronary Calcium Scoring',
          headingLevel: 'h3',
          headingColor: '#0f172a',
        },
        {
          id: 'el-text-1',
          type: 'text',
          align: 'center',
          textContent:
            'A low-dose computed tomography (CAC) scan takes less than 10 minutes and can reveal hidden arterial calcification years before symptoms arise. Recommended for patients aged 40+ with familial cardiac histories.',
          textSize: 'base',
          textColor: '#475569',
        },
        {
          id: 'el-alert-1',
          type: 'alert',
          align: 'center',
          alertTitle: 'Fasting Lipid Testing Protocol',
          alertMessage:
            'Patients scheduled for comprehensive morning lab panels should maintain a 12-hour water-only fast prior to blood draw.',
          alertVariant: 'info',
        },
        {
          id: 'el-btn-1',
          type: 'button',
          align: 'center',
          buttonLabel: 'Schedule Calcium CT Scan',
          buttonLink: '#book',
          buttonIcon: 'CalendarCheck',
          buttonVariant: 'primary',
          buttonSize: 'md',
        },
        {
          id: 'el-html-1',
          type: 'html',
          align: 'center',
          customHtml:
            '<div style="text-align:center; margin-top: 10px;"><button style="background: linear-gradient(135deg, #0284c7, #0369a1); color: white; border: none; padding: 10px 22px; border-radius: 9999px; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(2,132,199,0.25); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform=\'scale(1.04)\'" onmouseout="this.style.transform=\'scale(1)\'" onclick="alert(\'Direct Physician Referral: Please ask your primary doctor to fax records to (212) 555-0199\')">✨ Direct Physician Referral Portal (Custom HTML)</button></div>',
        },
      ],
    },
  ],
  adminPasscode: 'doctor2025',
  lastUpdated: new Date().toISOString(),
};
