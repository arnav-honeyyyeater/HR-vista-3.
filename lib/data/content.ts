/**
 * HR VISTA 3.0 — single content source for the site.
 *
 * Sources:
 *  - "HR 3.0.pdf" — the 12-page HR VISTA 3.0 brochure (49 MB). All brochure
 *    copy is transcribed verbatim from the PDF text layer (verified page by page).
 *  - christuniversitylavasa.blogspot.com/2025/03/hr-vista-2025.html — official
 *    recap of HR VISTA 1.0 (Feb 21–22, 2025).
 *  - hrvista.live — HR VISTA 2.0 official site (theme, dates, guests, panels).
 *  - Public LinkedIn posts (attributed) — attendee quotes from HR VISTA 2.0.
 *
 * Rules followed: no invented people, no invented numbers, no invented bios.
 * Every fact not present in the brochure carries a `// src:` comment.
 */

export interface StoryEntry {
  year: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Partner {
  name: string;
  role: string;
}

export interface Panel {
  title: string;
  description: string;
}

export interface PastEdition {
  edition: string;
  dates: string;
  venue: string;
  theme: string;
  notes: string;
}

export interface SignatureMoment {
  title: string;
  description: string;
}

export interface Organiser {
  name: string;
  role: string;
}

export interface AudienceGroup {
  heading: string;
  items: string[];
}

export interface GetInvolvedCard {
  title: string;
  description: string;
}

export interface Review {
  quote: string;
  author: string;
  role: string;
  event: string;
}

export interface FooterContent {
  cta: string;
  taglines: string[];
  contacts: string[];
  credits: string;
}

export interface Content {
  hero: {
    headline: string;
    theme: string;
    dates: string;
    venue: string;
    presenter: string;
    institution: string;
  };
  intro: {
    heading: string;
    subheading: string;
    body: string;
    closingLine: string;
  };
  atAGlance: {
    stats: StatItem[];
    locationNote: string;
    dates: string;
  };
  aboutChrist: {
    heading: string;
    body: string[];
  };
  story: {
    heading: string;
    subheading: string;
    entries: StoryEntry[];
  };
  corporateEcosystem: {
    heading: string;
    subheading: string;
    expectedParticipants: string;
    companies: string[];
    industries: string[];
    disclaimer: string;
  };
  people: {
    heading: string;
    subheading: string;
    delegateProfile: string[];
  };
  whatAwaits: Panel[];
  whyMumbai: {
    heading: string;
    subheading: string;
    body: string;
    points: string[];
  };
  cpcg: {
    heading: string;
    subheading: string;
    body: string;
    opportunities: string[];
  };
  whyHrVista: {
    heading: string;
    audiences: { heading: string; description: string }[];
  };
  stats: StatItem[];
  partners: Partner[];
  statement: string;
  pastEditions: PastEdition[];
  signatureMoments: SignatureMoment[];
  organisers: Organiser[];
  whoIsInTheRoom: AudienceGroup[];
  getInvolved: GetInvolvedCard[];
  reviews: Review[];
  footer: FooterContent;
}

export const content: Content = {
  hero: {
    headline: "THE FUTURE OF WORK. THE PEOPLE WHO SHAPE IT.",
    theme: "The Future of Work — The People Who Shape It",
    dates: "21–22 November 2026",
    venue: "Mumbai | BKC | Jio Grounds",
    presenter: "Presented by the Centre for Placement and Career Guidance",
    institution: "CHRIST (Deemed to be University), Pune Lavasa Campus",
  },

  intro: {
    heading: "WELCOME TO HR VISTA 3.0 — WHERE INDIA'S HR COMMUNITY COMES TOGETHER",
    subheading: "HR VISTA 3.0 is the flagship Human Resources conclave of CHRIST (Deemed to be University), Pune Lavasa Campus, bringing together the people shaping the future of work.",
    body: "Following the momentum of HR VISTA 2.0, the third edition is envisioned on a significantly larger scale — bringing together 500+ HR professionals, business leaders, industry experts and corporate representatives for two days of conversations, perspectives, connections and ideas. From evolving workplace cultures and AI-led transformation to leadership, talent, employee experience and the changing nature of work, HR VISTA 3.0 creates a platform for meaningful dialogue between academia and industry.",
    closingLine: "Two days. One ecosystem. A future of work in focus.",
  },

  atAGlance: {
    stats: [
      { value: "500+", label: "HR PROFESSIONALS & CORPORATE LEADERS" },
      { value: "2 DAYS", label: "OF CONVERSATIONS, INSIGHTS & NETWORKING" },
      { value: "50+", label: "LEADING ORGANISATIONS & INDUSTRY REPRESENTATION" },
      { value: "1 PLATFORM", label: "CONNECTING ACADEMIA & INDUSTRY" },
    ],
    locationNote: "MUMBAI — INDIA'S CORPORATE & BUSINESS HUB",
    dates: "21–22 NOVEMBER 2026",
  },

  aboutChrist: {
    heading: "ABOUT CHRIST UNIVERSITY",
    body: [
      "Nestled in the serene hills of Lavasa, the campus represents transformative education, blending academic rigour with experiential learning. Established in 2014, it is known as the “Analytical Hub” of CHRIST University, offering programmes that integrate analytical expertise with traditional disciplines.",
      "Surrounded by natural beauty, the campus fosters holistic student growth through expert faculty, modern facilities, and a strong culture of diversity and collaboration. It offers Undergraduate, Postgraduate, and Doctoral programmes across Management, Law, Commerce, Arts, and Science, with specialisations in Business Analytics, Financial Analytics, and Data Science.",
      "Beyond academics, the campus provides an ideal setting for leadership development, corporate retreats, and hands-on experiential learning.",
    ],
  },

  story: {
    heading: "THE HR VISTA JOURNEY",
    subheading: "FROM A CAMPUS INITIATIVE TO A CORPORATE HR PLATFORM",
    entries: [
      {
        year: "THE VISION",
        title: "A platform for the HR community",
        description:
          "Where the HR community meets the evolving world of work.",
      },
      {
        year: "HR VISTA 2.0",
        title: "Strengthening the vision",
        description:
          "Industry engagement and expert perspectives on the future of HR.",
      },
      {
        year: "HR VISTA 3.0",
        title: "Bigger. Broader. More connected.",
        description:
          "Mumbai — a cross-section of India's HR ecosystem, from enterprises to emerging leaders.",
      },
    ],
  },

  corporateEcosystem: {
    heading: "THE CORPORATE ECOSYSTEM — WHERE INDUSTRY LEADERS MEET",
    subheading: "HR VISTA 3.0 is designed to create meaningful interaction across industries and functions.",
    expectedParticipants:
      "The event is expected to feature participation from professionals and organisations including: Rolls-Royce | Deloitte | Infosys | EY | HDFC Bank | Accenture and several other leading organisations across India's corporate ecosystem.",
    companies: ["Rolls-Royce", "Deloitte", "Infosys", "EY", "HDFC Bank", "Accenture"],
    industries: [
      "Technology & IT",
      "Banking & Financial Services",
      "Consulting",
      "Engineering & Manufacturing",
      "Professional Services",
      "Consumer & Lifestyle",
      "Business & Corporate Services",
    ],
    disclaimer: "Corporate participation and organisational representation are subject to confirmation.",
  },

  people: {
    heading: "THE PEOPLE OF HR VISTA — 500 VOICES. ONE HR ECOSYSTEM.",
    subheading:
      "HR VISTA 3.0 brings together professionals across the HR and business landscape, creating opportunities to exchange ideas across experience levels and industries.",
    delegateProfile: [
      "CHROs & Chief People Officers",
      "HR Directors & Vice Presidents",
      "Senior HR Leaders",
      "Talent & Acquisition Leaders",
      "Learning & Development Professionals",
      "Organisational Development Leaders",
      "Employee Experience Professionals",
      "HR Business Partners",
      "People Analytics & HR Tech Professionals",
      "Business & Functional Leaders",
      "Academicians & Management Professionals",
      "Emerging HR Professionals",
    ],
  },

  whatAwaits: [
    {
      title: "KEYNOTE CONVERSATIONS",
      description: "Senior industry leaders on the future of work.",
    },
    {
      title: "LEADERSHIP PANELS",
      description: "Multi-industry conversations on complex HR challenges.",
    },
    {
      title: "INDUSTRY INTERACTIONS",
      description: "Engagement beyond the stage — for professionals, students and organisations.",
    },
    {
      title: "NETWORKING",
      description: "Meaningful connections across industries and functions.",
    },
    {
      title: "KNOWLEDGE EXCHANGE",
      description: "Ideas participants can take back to their organisations.",
    },
  ],

  whyMumbai: {
    heading: "WHY MUMBAI? — THE HEART OF INDIA'S CORPORATE ECOSYSTEM",
    subheading: "MUMBAI × HR VISTA 3.0",
    body: "Mumbai is more than the venue for HR VISTA 3.0. It is one of India's most influential centres for business, finance, media, technology and corporate leadership — making it a natural setting for a national HR gathering. And at the heart of Mumbai's corporate district lies Bandra Kurla Complex, a destination that brings together leading organisations, institutions and business communities.",
    points: [
      "Business Capital",
      "Corporate Leadership",
      "Global Organisations",
      "Talent & Innovation",
      "Networking & Opportunity",
    ],
  },

  cpcg: {
    heading: "CENTRE FOR PLACEMENT AND CAREER GUIDANCE — CONNECTING STUDENTS WITH THE WORLD OF WORK",
    subheading: "",
    body: "CHRIST, Pune Lavasa Campus works towards building meaningful bridges between students, academia and industry. Through corporate interactions, career initiatives, industry engagements, professional development programmes and placement-oriented activities, CPCG seeks to prepare students for the evolving world of work. HR VISTA represents this commitment at scale. From classroom to corporate boardroom — by bringing senior HR and business professionals together with the student community, CPCG creates opportunities for:",
    opportunities: [
      "Industry Exposure",
      "Career Awareness",
      "Professional Networking",
      "Knowledge Exchange",
      "Leadership Development",
      "Corporate Engagement",
    ],
  },

  whyHrVista: {
    heading: "WHY HR VISTA 3.0?",
    audiences: [
      {
        heading: "FOR CORPORATE LEADERS",
        description: "Share perspectives, engage with the next generation of talent and contribute to conversations shaping the future of work.",
      },
      {
        heading: "FOR HR PROFESSIONALS",
        description: "Explore emerging people practices, exchange industry perspectives and build meaningful professional connections.",
      },
      {
        heading: "FOR ORGANISATIONS",
        description: "Strengthen employer visibility, connect with a diverse talent ecosystem and engage with an audience of HR and business professionals.",
      },
      {
        heading: "FOR STUDENTS",
        description: "Gain direct exposure to senior professionals, understand industry expectations and experience the evolving world of Human Resources beyond the classroom.",
      },
      {
        heading: "FOR ACADEMIA",
        description: "Create stronger bridges between management education, research and contemporary industry practices.",
      },
    ],
  },

  // Brochure "AT A GLANCE" figures — src: HR 3.0.pdf, page 2.
  stats: [
    { value: "500+", label: "HR professionals & corporate leaders expected" }, // src: HR 3.0.pdf p.2
    { value: "2", label: "Days of conversations, insights & networking" }, // src: HR 3.0.pdf p.2
    { value: "50+", label: "Leading organisations & industry representation" }, // src: HR 3.0.pdf p.2
    { value: "3", label: "Editions of HR VISTA (1.0 → 2.0 → 3.0)" }, // src: HR 3.0.pdf p.4 journey narrative; editions confirmed by hrvista.live + christuniversitylavasa.blogspot.com
  ],

  partners: [
    { name: "CHRIST (Deemed to be University), Pune Lavasa Campus", role: "Host & presenting institution" }, // src: HR 3.0.pdf cover
    { name: "Centre for Placement and Career Guidance (CPCG)", role: "Presenter / organising centre" }, // src: HR 3.0.pdf cover + p.9
    { name: "BeingHR", role: "Conclave partner (HR VISTA 1.0 & 2.0)" }, // src: christuniversitylavasa.blogspot.com/2025/03/hr-vista-2025.html; hrvista.live
    { name: "Ghatsfield Foundation", role: "Partner (HR VISTA 1.0)" }, // src: christuniversitylavasa.blogspot.com/2025/03/hr-vista-2025.html
    // NOTE: HR 3.0.pdf names NO 3.0 sponsors/partners beyond CHRIST + CPCG.
    // 3.0 sponsor logos do not appear anywhere in the brochure.
  ],

  // Big line for the media strip — src: HR 3.0.pdf p.1 (welcome page).
  statement: "Two days. One ecosystem. A future of work in focus.",

  pastEditions: [
    {
      edition: "HR VISTA 1.0",
      dates: "21–22 February 2025",
      venue: "CHRIST (Deemed to be University), Pune Lavasa Campus",
      theme: "Work Reimagined: HR for the Future",
      // Delegate count (~47–50) + partner line from the official recap.
      notes: "With BeingHR and the Ghatsfield Foundation; around 50 HR delegates. Keynotes by Sharad Gangal, Yogesh Patgaonkar, Abhijit Puri, Moushumi D. and Dr. Robin Banerjee — plus a trek, 1:1 mentorship sessions and an awards ceremony.",
    },
    {
      edition: "HR VISTA 2.0",
      dates: "15–16 November 2025",
      venue: "CHRIST (Deemed to be University), Pune Lavasa Campus",
      theme: "Human Future — Redefining Leadership in the Post-AI World",
      notes: "Chief Guest Unmesh Pawar; Guest of Honour Arshad Fakhri. Four panels and two round tables, organised with BeingHR — plus cultural performances, a DJ night and a Sahyadri trek.", // src: hrvista.live; linkedin.com/posts/unmeshpawar (keynote recap); linkedin.com/posts/mandar-arankalle-48094a23 (DJ night, trek, cultural event)
    },
  ],

  // HR VISTA 2.0 signature moments as reported by attendees (the 3.0 brochure
  // describes 3.0's format only — keynote conversations, leadership panels,
  // industry interactions, networking, knowledge exchange — see whatAwaits).
  signatureMoments: [
    {
      title: "Awards Night",
      description: "HR professionals recognised as changemakers in their organisations. (1.0 edition; “HR Leader Of The Year” awarded at 2.0.)", // src: christuniversitylavasa.blogspot.com/2025/03/hr-vista-2025.html; linkedin.com/posts/mandar-arankalle-48094a23 (comments)
    },
    {
      title: "DJ Night",
      description: "Student dance and singing performances, then a DJ night. (HR VISTA 2.0)", // src: linkedin.com/posts/mandar-arankalle-48094a23
    },
    {
      title: "Sahyadri Trek",
      description: "Day 2 began with a trek. (2.0; 1.0 delegates trekked to Ekaant Viewpoint.)", // src: linkedin.com/posts/mandar-arankalle-48094a23; christuniversitylavasa.blogspot.com/2025/03/hr-vista-2025.html
    },
    {
      title: "Panel Discussions",
      description: "High-engagement HR panels across the day — transformation, work architecture and leadership in a post-AI world.", // src: linkedin.com/posts/mandar-arankalle-48094a23; hrvista.live
    },
  ],

  // ONLY names that appear in the brochure or official event sources.
  // The HR 3.0.pdf brochure itself names NO individual convenors — it credits
  // the Centre for Placement and Career Guidance (CPCG) institutionally.
  organisers: [
    { name: "Centre for Placement and Career Guidance (CPCG)", role: "Organising centre — CHRIST (Deemed to be University), Pune Lavasa Campus" }, // src: HR 3.0.pdf cover + p.9
    { name: "Prof. Shankar Iyer", role: "Head, Centre for Placements & Career Guidance, CHRIST University, Lavasa" }, // src: christuniversitylavasa.blogspot.com/2025/03/hr-vista-2025.html; hrvista.live
    { name: "Fr. Lijo Thomas", role: "Dean & Director, Christ (Deemed to be University) Pune Lavasa Campus" }, // src: hrvista.live
    { name: "Fr. Justin P Varghese", role: "Academic Coordinator, Christ (Deemed to be University) Pune Lavasa Campus" }, // src: hrvista.live
  ],

  whoIsInTheRoom: [
    {
      heading: "HR Leaders",
      items: [
        "CHROs & Chief People Officers",
        "HR Directors & Vice Presidents",
        "Senior HR Leaders",
        "HR Business Partners",
        "People Analytics & HR Tech Professionals",
      ],
    },
    {
      heading: "Academicians",
      items: [
        "Academicians & Management Professionals",
        "Faculty — CHRIST (Deemed to be University), Pune Lavasa Campus",
      ],
    },
    {
      heading: "Students",
      items: [
        "Emerging HR Professionals",
        "Management, Law, Commerce, Arts & Science students — CHRIST Lavasa",
      ],
    },
    {
      heading: "Partners",
      items: [
        "50+ leading organisations across India's corporate ecosystem",
        "Business & Functional Leaders",
        "Talent & Acquisition, L&D, OD and Employee Experience leaders",
      ],
    },
  ],

  getInvolved: [
    {
      title: "FOR CORPORATE LEADERS",
      description: "Share perspectives and contribute to conversations shaping the future of work.", // src: HR 3.0.pdf p.10
    },
    {
      title: "FOR ORGANISATIONS",
      description: "Strengthen employer visibility with an audience of HR and business professionals.", // src: HR 3.0.pdf p.10
    },
    {
      title: "FOR HR PROFESSIONALS, STUDENTS & ACADEMIA",
      description: "Explore emerging people practices; bridge management education and industry.", // src: HR 3.0.pdf p.10
    },
  ],

  // Real, attributed quotes only — from public LinkedIn posts about HR VISTA 2.0.
  reviews: [
    {
      quote:
        "If technology can now do what took us ten years to learn in ten minutes, what is our job as leaders? … Technology makes us efficient. Leaders make work meaningful.",
      author: "Unmesh Pawar",
      role: "Former Chief People Officer – South Asia, Dentsu; Chief Guest, HR VISTA 2.0",
      event: "HR VISTA 2.0 keynote (Day 1, 15 Nov 2025)", // src: linkedin.com/posts/unmeshpawar_hrvista2-chrosummit-leadershipsummit-activity-7396793127161958400-yrxv
    },
    {
      quote:
        "What a wonderful two days HR Event … The energy level and enthusiasm of the students was so high during the two days event.",
      author: "Mandar Arankalle",
      role: "HR professional (delegate)",
      event: "HR VISTA 2.0, 15–16 Nov 2025", // src: linkedin.com/posts/mandar-arankalle-48094a23_what-a-wonderful-activity-7396850548727164928
    },
    {
      quote:
        "HR Vista 2.0 — What a Phenomenal Experience! … Professionals from Pune, Mumbai, and across India came together, and the energy was absolutely electric. … The sessions? Mind-blowing.",
      author: "Rohit Kalamkar",
      role: "Director – HR, SA Technologies (panelist)",
      event: "HR VISTA 2.0, 15–16 Nov 2025", // src: linkedin.com/posts/rohitkalamkar_hrvista-hrleaders-christuniversity-activity-7396966322154315777-xrff
    },
  ],

  footer: {
    cta: "Be part of HR VISTA 3.0 — where India's HR community comes together.",
    taglines: [
      "A gathering of people shaping organisations.",
      "A platform for ideas shaping workplaces.",
      "A conversation about the future of work.",
    ],
    contacts: [
      "21–22 November 2026 | Mumbai | BKC | Jio Grounds",
      "CHRIST (Deemed to be University), Pune Lavasa Campus",
      "Centre for Placement and Career Guidance (CPCG)",
      // NOTE: brochure lists no email/phone/social handles — add when supplied by the client.
    ],
    credits: "HR VISTA 3.0 — Presented by the Centre for Placement and Career Guidance, CHRIST (Deemed to be University), Pune Lavasa Campus.",
  },
};
