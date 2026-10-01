import type { Dictionary } from "./ro";

export const en: Dictionary = {
  meta: {
    title: "DeratPro | Rodent control, pest control and disinfection",
    description:
      "Professional treatments for homes, offices and commercial spaces, with approved products and a written guarantee.",
  },
  common: {
    phone: "0722 000 000",
    phoneHref: "tel:+40722000000",
    email: "contact@deratpro.ro",
    skipToContent: "Skip to content",
  },
  header: {
    nav: [
      { label: "Services", href: "#servicii" },
      { label: "Why us", href: "#de-ce-noi" },
      { label: "How it works", href: "#cum-functioneaza" },
      { label: "Contact", href: "#contact" },
    ],
    navLabel: "Main navigation",
    cta: "Get a quote",
    languageLabel: "Site language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "Rodents · Insects · Disinfection",
    titleLine1: "Your home or business,",
    titleLine2: "pest-free.",
    titleEmphasis: "Guaranteed.",
    subline:
      "Professional treatments for homes, offices and commercial spaces, with approved products and a written guarantee.",
    primaryCta: "Get a free quote",
    secondaryCta: "Call now",
    rating: "4.9/5 from 300+ reviews",
    ratingLabel: "Rated 4.9 out of 5",
    license: "Licensed pest control operator",
    scrollHint: "Explore our services",
  },
  stats: {
    items: [
      { value: "10", suffix: "+", label: "years of experience" },
      { value: "2,500", suffix: "+", label: "jobs completed" },
      { value: "24", suffix: "h", label: "response time" },
      { value: "6 months", label: "written guarantee" },
    ],
    certificationsLabel: "Certifications and approvals",
    certifications: ["DSP approved", "MoH-approved biocides", "ISO 9001", "HACCP"],
  },
  services: {
    eyebrow: "Services",
    title: "Everything you need for a clean, safe space",
    intro: "Professional treatments tailored to every space, from apartments to warehouses and restaurants.",
    cta: "Request a quote",
    items: [
      {
        title: "Rodent control",
        description: "We remove mice and rats from homes, warehouses and restaurants, safely and discreetly.",
        features: ["Secured bait stations", "Regular monitoring", "Safe for children and pets"],
      },
      {
        title: "Pest control",
        description: "Effective treatments against crawling and flying insects, indoors and outdoors.",
        features: ["Cockroaches, bed bugs, ants", "Mosquitoes, flies, wasps", "No lingering odour"],
      },
      {
        title: "Disinfection",
        description: "Professional fogging disinfection for spaces that are clean and safe by health standards.",
        features: [
          "Kills viruses, bacteria and fungi",
          "Ideal for hospitality and clinics",
          "Ministry of Health approved products",
        ],
      },
    ],
    audienceLabel: "We work for:",
    audiences: ["Homes & apartments", "Offices", "Hospitality", "Warehouses & industry"],
  },
  whyUs: {
    eyebrow: "Why us",
    title: "Why clients choose DeratPro",
    intro: "We work clean, fast and fully documented, and the result is guaranteed in writing.",
    guarantee: {
      value: "6 months",
      title: "Written guarantee",
      text: "If pests come back during the guarantee period, we return and redo the treatment at no cost. Plus a free follow-up inspection within 14 days.",
      pill: "Included with every job",
    },
    fast: {
      title: "Fast response",
      text: "We reach you within 24 hours, and on the same day for emergencies, weekends included.",
      pill: "Emergencies 24/7",
    },
    items: [
      {
        title: "Approved products",
        text: "We only use approved biocides that are safe for your family and pets.",
      },
      {
        title: "Licensed technicians",
        text: "Trained, certified pest control technicians with professional equipment.",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "Simple, in 3 steps",
    intro: "From the first call to a pest-free space, you always know what comes next.",
    steps: [
      {
        title: "You call us",
        text: "Call us or fill in the form. A specialist will get back to you as soon as possible.",
      },
      {
        title: "Assessment",
        text: "We visit on site, identify the problem and give you a clear quote with no hidden costs.",
      },
      {
        title: "Treatment",
        text: "We apply the right treatment and leave you recommendations, the paperwork and a written guarantee.",
      },
    ],
    note: "Average time from call to treatment: under 24 hours",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get a free quote",
    intro: "Leave us your details and we'll call you back as soon as possible.",
    form: {
      title: "Send us a request",
      name: { label: "Name", placeholder: "Ion Popescu" },
      phone: { label: "Phone", placeholder: "07xx xxx xxx" },
      message: { label: "Message", placeholder: "Briefly describe the problem and the type of space…" },
      submit: "Send request",
      sending: "Sending…",
      privacy: "Your details are only used to contact you.",
      errors: {
        name: "Enter your name (at least 2 characters).",
        phone: "Enter a valid phone number.",
        message: "Your message must be at least 10 characters long.",
      },
      success: {
        title: "Thank you!",
        text: "We've received your request. We'll get in touch as soon as possible.",
        again: "Send another request",
      },
    },
    info: {
      title: "Prefer to talk directly?",
      phoneLabel: "Phone",
      emailLabel: "Email",
      hoursLabel: "Opening hours",
      hours: "Mon–Fri 08:00–20:00 · Sat 09:00–14:00",
      emergencies: "Emergencies 24/7",
      areaLabel: "Service area",
      area: "Bucharest and Ilfov",
    },
  },
  footer: {
    tagline: "Professional rodent control, pest control and disinfection services.",
    badges: ["DSP approved", "ISO 9001", "HACCP"],
    servicesTitle: "Services",
    companyTitle: "Company",
    contactTitle: "Contact",
    copyright: "© 2026 DeratPro.",
    credit: "Made with love by Tudor",
    creditHref: "https://github.com/tudor555/deratpro-landing-page",
    legal: "Licensed pest control operator · Approved biocides",
  },
  floatingCall: {
    label: "Call now at 0722 000 000",
  },
};
