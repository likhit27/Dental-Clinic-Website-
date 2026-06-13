export type IconName =
  | 'arrowCircle'
  | 'award'
  | 'check'
  | 'clock'
  | 'document'
  | 'heart'
  | 'info'
  | 'shield'
  | 'star';

export interface NavLink {
  id: string;
  href: string;
  label: string;
  isButton?: boolean;
}

export interface Stat {
  value: string;
  label: string;
}

export interface IconTextItem {
  icon: IconName;
  label: string;
}

export interface Service {
  title: string;
  description: string;
  featured?: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Testimonial {
  initials: string;
  name: string;
  meta: string;
  review: string;
}

export interface Accolade {
  title: string;
  organization: string;
  description: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  featured?: boolean;
  imagePosition?: 'top';
}

export interface ContactCard {
  title: string;
  content: string[];
  link?: {
    href: string;
    label: string;
    external?: boolean;
  };
  note?: string;
}

const whatsappMessage = encodeURIComponent(
  'Hello Mani Dental Clinic, I would like to book an appointment.',
);

const clinicAddress =
  'Mani Dental Clinic, 21, City Station Road, Ground Floor, Toran Bowari, near Surajpole, Udaipur 313001';
const clinicLatitude = 24.57795084318203;
const clinicLongitude = 73.69751956569166;

export const clinicContact = {
  phoneLabel: '+91 99833 99913',
  whatsappUrl: `https://wa.me/919983399913?text=${whatsappMessage}`,
  address: clinicAddress,
  latitude: clinicLatitude,
  longitude: clinicLongitude,
  directionsUrl: 'https://maps.app.goo.gl/DGeam9bUeKhdEgyk8',
  mapEmbedUrl: `https://www.google.com/maps?q=${clinicLatitude},${clinicLongitude}&z=17&output=embed`,
};

export const navLinks: NavLink[] = [
  { id: 'home', href: '#home', label: 'Home' },
  { id: 'about', href: '#about', label: 'About Us' },
  { id: 'services', href: '#services', label: 'Services' },
  { id: 'patient-info', href: '#patient-info', label: 'Patient Info' },
  { id: 'testimonials', href: '#testimonials', label: 'Reviews' },
  { id: 'gallery', href: '#gallery', label: 'Gallery' },
  { id: 'appointment', href: '#appointment', label: 'Book Appointment', isButton: true },
];

export const heroStats: Stat[] = [
  { value: '25+', label: 'Years Experience' },
  { value: '90%', label: 'Referral Rate' },
  { value: '10,000+', label: 'Happy Patients' },
];

export const trustItems: IconTextItem[] = [
  { icon: 'check', label: 'IDA Life Member' },
  { icon: 'check', label: 'Past IDA President Udaipur' },
  { icon: 'check', label: 'Former ADA Member' },
  { icon: 'shield', label: 'Sterile Environment' },
  { icon: 'document', label: 'Digital Health Records' },
];

export const credentials: string[] = [
  'Life Member \u2014 Indian Dental Association',
  'Past President \u2014 IDA Udaipur Branch',
  'Former Member \u2014 American Dental Association',
  'Member \u2014 Medical Practitioners Society, Udaipur',
];

export const clinicValues: Array<IconTextItem & { title: string; description: string }> = [
  {
    icon: 'shield',
    label: 'Ethics First',
    title: 'Ethics First',
    description: 'Honest diagnoses with no unnecessary treatments.',
  },
  {
    icon: 'heart',
    label: 'Compassionate Care',
    title: 'Compassionate Care',
    description: 'Gentle treatments tailored for your comfort.',
  },
  {
    icon: 'arrowCircle',
    label: 'Latest Technology',
    title: 'Latest Technology',
    description: 'Modern equipment for precise, painless procedures.',
  },
  {
    icon: 'clock',
    label: 'Respect Your Time',
    title: 'Respect Your Time',
    description: 'Zero waiting time with prompt appointments.',
  },
];

export const digitalWorkflow = {
  eyebrow: 'Digital workflow',
  title: 'Precision at every step',
  description:
    'Advanced diagnostics and an in-house digital lab help us plan, scan, and deliver treatment with better clarity.',
  tools: ['OPG', 'CBCT', 'Intraoral scanner', 'Digital dental lab'],
};

export const services: Service[] = [
  {
    title: 'Preventive Dentistry',
    description: 'Regular cleanings and comprehensive check-ups to maintain optimal oral health.',
  },
  {
    title: "Children's Dentistry",
    description: 'Gentle, stress-free care to build a positive dental foundation for future.',
  },
  {
    title: 'Root Canal Therapy',
    description: 'Pain-free and effective endodontic treatment to save infected teeth.',
  },
  {
    title: 'Periodontal Therapy',
    description: 'Advanced gum disease treatment and maintenance for healthy gums.',
  },
  {
    title: 'Teeth Whitening',
    description: 'Professional in-clinic whitening for instantly brighter and whiter teeth.',
  },
  {
    title: 'Dentures & Bridges',
    description: 'Comfortable, custom-fitted removable or fixed restorations.',
  },
  {
    title: 'Smile Design & Makeovers',
    description:
      'Transform your smile with a complete aesthetic makeover combining veneers, whitening, contouring, and digital smile design technology tailored to your face and personality.',
    featured: true,
  },
  {
    title: 'Dental Implants',
    description:
      'Restore your smile with permanent, natural-looking dental implants using the latest implant systems and guided surgery protocols.',
    featured: true,
  },
  {
    title: 'Invisible Braces',
    description:
      'Straighten your teeth discreetly with clear aligner therapy \u2014 a comfortable, removable alternative to traditional metal braces.',
    featured: true,
  },
];

export const faqs: Faq[] = [
  {
    question: 'How often should I visit the dentist?',
    answer:
      'We recommend a routine check-up and professional cleaning every 6 months to maintain optimal oral health and catch potential issues early.',
  },
  {
    question: 'Are teeth whitening treatments safe?',
    answer:
      'Yes, professional in-clinic teeth whitening is highly safe and effective. We use clinically approved materials to minimize sensitivity.',
  },
  {
    question: 'Do dental implants hurt?',
    answer:
      'With modern local anesthesia, the placement procedure is virtually painless. Post-operative discomfort is generally mild and easily managed with standard painkillers.',
  },
  {
    question: 'Is root canal therapy painful?',
    answer:
      'Root canal therapy actually relieves the pain caused by an infected tooth. We use advanced techniques to ensure the procedure is comfortable and pain-free.',
  },
  {
    question: 'At what age should a child first visit the dentist?',
    answer:
      'The first visit is recommended by age 1 or when the first tooth erupts. This helps build a friendly relationship and prevents early childhood caries.',
  },
];

export const paymentOptions = [
  '\u{1F4B3} Credit/Debit Cards',
  '\u{1F4F1} Paytm & UPI',
  '\u{1F4C4} Cheques',
  '\u{1F4B5} Cash',
];

export const educationTips = [
  {
    label: 'Brushing',
    text: 'Brush twice daily using a soft-bristled toothbrush and fluoride toothpaste.',
  },
  { label: 'Flossing', text: 'Floss at least once a day to remove plaque between teeth.' },
  { label: 'Hydration', text: 'Drink plenty of water to wash away food particles and bacteria.' },
  {
    label: 'Diet',
    text: 'Limit sugary snacks and acidic beverages to prevent enamel erosion.',
  },
];

export const preparationTips = [
  'Bring any previous dental or medical records.',
  'Arrive 10 minutes early to complete initial paperwork.',
  'Continue taking your regular medications unless advised otherwise.',
  'Inform us of any allergies or pre-existing medical conditions (e.g., Diabetes, Hypertension).',
];

export const technologies = [
  { icon: '\u{1FA7B}', label: 'Digital X-Ray Imaging' },
  { icon: '\u{1F52C}', label: 'State-of-the-Art Sterilisation' },
  { icon: '\u{1F4BB}', label: 'Digital Health Records' },
  { icon: '\u{1F4F2}', label: 'SMS & Email Reminders' },
  { icon: '\u{1F4C5}', label: 'Online Appointment Booking' },
  { icon: '\u{1F6E1}\uFE0F', label: 'Secured Data Storage' },
];

export const testimonials: Testimonial[] = [
  {
    initials: 'AM',
    name: 'Amit Mehra',
    meta: 'Udaipur | Root Canal Therapy',
    review:
      'Dr. Trivedi is exceptionally skilled. I was terrified of getting a root canal, but he made the entire process completely painless. The clinic is spotless and the staff is very welcoming.',
  },
  {
    initials: 'PS',
    name: 'Priya Singh',
    meta: 'Jaipur | Cosmetic Dentistry',
    review:
      "I got my porcelain veneers done here, and I couldn't be happier with my new smile. The attention to aesthetic detail is beyond words. Truly a premium experience from start to finish.",
  },
  {
    initials: 'RS',
    name: 'Rahul Sharma',
    meta: 'Udaipur | Preventive Care',
    review:
      'My family has been visiting Dr. Yogesh for over a decade. He is wonderful with kids and respects your time\u2014no long waiting room hours. You know you are always in safe hands.',
  },
];

export const accolades: Accolade[] = [
  {
    title: 'Life Member',
    organization: 'Indian Dental Association',
    description:
      'Honored with a lifelong membership for continued dedication to Indian dental health standards.',
  },
  {
    title: 'Past President',
    organization: 'IDA Udaipur Branch',
    description:
      'Served as the leading executive for the Udaipur dental association board, guiding local clinics.',
  },
  {
    title: 'Former Member',
    organization: 'American Dental Association',
    description:
      'Engaged with international dental protocols to bring world-class treatments back to India.',
  },
  {
    title: 'Active Member',
    organization: 'Medical Practitioners Society',
    description:
      'A respected member of the local Udaipur Medical Practitioners society governing clinical ethics.',
  },
];

export const galleryItems: GalleryItem[] = [
  {
    src: '/images/gallery/clinic-gallery-03.jpg',
    alt: 'Reception area at Mani Dental Clinic',
    caption: 'Reception Area',
    featured: true,
  },
  {
    src: '/images/gallery/clinic-gallery-06.jpg',
    alt: 'Dental treatment room at Mani Dental Clinic',
    caption: 'Treatment Room',
  },
  {
    src: '/images/gallery/clinic-gallery-08.jpg',
    alt: 'Dental operatory with clinical equipment',
    caption: 'Dental Operatory',
  },
  {
    src: '/images/gallery/clinic-gallery-09.jpg',
    alt: 'Advanced dental equipment inside the clinic',
    caption: 'Clinical Equipment',
  },
  {
    src: '/images/gallery/clinic-gallery-04.jpg',
    alt: 'Clinic waiting and reception space',
    caption: 'Waiting Lounge',
  },
  {
    src: '/images/gallery/clinic-gallery-07.jpg',
    alt: 'Consultation area at Mani Dental Clinic',
    caption: 'Consultation Area',
  },
  {
    src: '/images/gallery/clinic-gallery-05.jpg',
    alt: 'Professional certificates displayed at Mani Dental Clinic',
    caption: 'Credentials Wall',
  },
  {
    src: '/images/gallery/clinic-gallery-01.jpg',
    alt: 'Portrait of Dr. Yogesh Trivedi',
    caption: 'Dr. Yogesh Trivedi',
    imagePosition: 'top',
  },
  {
    src: '/images/gallery/clinic-gallery-02.jpg',
    alt: 'Dr. Yogesh Trivedi in clinical attire',
    caption: 'Clinical Care',
    imagePosition: 'top',
  },
];

export const contactCards: ContactCard[] = [
  {
    title: 'Visit Us',
    content: [
      'Mani Dental Clinic,',
      '21, City Station Road, Ground Floor,',
      'Toran Bowari, near Surajpole,',
      'Udaipur, RJ 313001',
    ],
    link: { href: clinicContact.directionsUrl, label: 'Get Directions \u2192', external: true },
  },
  {
    title: 'Clinic Hours',
    content: ['Mon\u2013Sat: 10:00 AM \u2013 8:00 PM', 'Sunday: Closed'],
    note: 'Please book a prior appointment to avoid inconvenience. Walk-ins subject to availability.',
  },
  {
    title: 'Email Us',
    content: [],
    link: { href: 'mailto:hello@manidental.com', label: 'hello@manidental.com' },
  },
  {
    title: 'Call Us',
    content: [],
    link: { href: clinicContact.whatsappUrl, label: clinicContact.phoneLabel, external: true },
  },
];

export const appointmentTimes = [
  { value: '9am', label: '9:00 AM - 10:00 AM' },
  { value: '10am', label: '10:00 AM - 11:00 AM' },
  { value: '11am', label: '11:00 AM - 12:00 PM' },
  { value: '12pm', label: '12:00 PM - 1:00 PM' },
  { value: '1pm', label: '1:00 PM - 2:00 PM' },
  { value: '2pm', label: '2:00 PM - 3:00 PM' },
  { value: '3pm', label: '3:00 PM - 4:00 PM' },
  { value: '4pm', label: '4:00 PM - 5:00 PM' },
  { value: '5pm', label: '5:00 PM - 6:00 PM' },
];

export const serviceOptions = [
  { value: 'preventive', label: 'Preventive Dentistry' },
  { value: 'childrens', label: "Children's Dentistry" },
  { value: 'cosmetic', label: 'Cosmetic Dentistry' },
  { value: 'implants', label: 'Dental Implants' },
  { value: 'rootcanal', label: 'Root Canal Therapy' },
  { value: 'periodontal', label: 'Periodontal Therapy' },
  { value: 'veneers', label: 'Porcelain Veneers' },
  { value: 'whitening', label: 'Teeth Whitening' },
  { value: 'dentures', label: 'Dentures & Bridges' },
  { value: 'general', label: 'General Consultation' },
];

export const footerServiceLinks = [
  'Preventive Dentistry',
  "Children's Dentistry",
  'Cosmetic Dentistry',
  'Dental Implants',
  'Root Canal Therapy',
];

export const quickLinks = [
  { href: '#about', label: 'About Us' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#patient-info', label: 'FAQ' },
  { href: '#appointment', label: 'Book Appointment' },
  { href: 'https://www.ada.org', label: 'ADA.org', external: true },
  { href: 'https://www.ida.org.in', label: 'IDA India', external: true },
];
