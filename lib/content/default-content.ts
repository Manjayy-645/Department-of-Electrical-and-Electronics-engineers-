export interface HeroContent {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  description: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  tertiaryCtaText: string
  tertiaryCtaLink: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Status: string
  stat3Label: string
}

export interface AnnouncementContent {
  enabled: boolean
  badge: string
  message: string
  linkText: string
  linkUrl: string
}

export interface MissionCard {
  title: string
  description: string
}

export interface AboutContent {
  badge: string
  pageTitle: string
  pageSubtitle: string
  mission: MissionCard
  vision: MissionCard
  coreValues: MissionCard
  heritageBadge: string
  heritageTitle: string
  heritageParagraphs: string[]
  homeNarrativeBadge: string
  homeNarrativeTitle: string
  homeNarrativeText: string
}

export interface ProgrammeOption {
  pathwayId: string
  pathwayLabel: string
  title: string
  description: string
  courses: { code: string; title: string }[]
  laboratoryFacilities: string
  careerTrajectories: string[]
}

export interface CurriculumYear {
  yearNumber: string
  level: string
  title: string
  description: string
  badge: string
}

export interface ProgrammesContent {
  headerBadge: string
  title: string
  description: string
  degreeType: string
  duration: string
  departmentName: string
  flagshipBadge: string
  flagshipTitle: string
  flagshipDescription: string
  optionA: ProgrammeOption
  optionB: ProgrammeOption
  curriculumProgression: CurriculumYear[]
  metiTitle: string
  metiSubtitle: string
  metiPhone: string
  metiEmail: string
  metiCoordinator: string
}

export interface SiteSettingsContent {
  motto: string
  footerDescription: string
  physicalAddress: string
  contactEmail: string
  phoneNumber: string
  duesAmount: string
  duesAmountNumeric: number
  academicSession: string
  facebookUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
}

export interface StaffMember {
  id: string
  name: string
  title: string
  cadre: 'professor' | 'lecturer' | 'technologist'
  categoryLabel: string
  qualifications: string[]
  specialization: string
  focusArea: 'power' | 'telecom' | 'control' | 'electronics' | 'general'
  email: string
  office: string
  biography?: string
  photo_url?: string
  display_order?: number
}

export interface SiteContentData {
  hero: HeroContent
  announcement: AnnouncementContent
  about: AboutContent
  programmes: ProgrammesContent
  settings: SiteSettingsContent
}

export const DEFAULT_HERO_CONTENT: HeroContent = {
  badge: 'Official Departmental Portal • UniPort',
  title: 'Department of Electrical & Electronics Engineering',
  titleHighlight: 'University of Port Harcourt',
  subtitle: 'Faculty of Engineering • Choba Park Campus',
  description: 'Welcome to the digital gateway for the Department of Electrical & Electronics Engineering. Pioneering technical pedagogy, world-class laboratory research, and engineering the electrified future.',
  primaryCtaText: 'Pay Departmental Dues',
  primaryCtaLink: '/portal/dues',
  secondaryCtaText: 'Programmes Offered',
  secondaryCtaLink: '/programmes',
  tertiaryCtaText: 'Staff & Faculty →',
  tertiaryCtaLink: '/staff',
  stat1Value: '7',
  stat1Label: 'Accredited Engineering Disciplines',
  stat2Value: '4,500+',
  stat2Label: 'Undergraduate & Postgraduates',
  stat3Status: '2025/2026 First Semester Active',
  stat3Label: 'Current Session Status'
}

export const DEFAULT_ANNOUNCEMENT_CONTENT: AnnouncementContent = {
  enabled: true,
  badge: 'Important Notice:',
  message: '2025/2026 Academic Session course registration and departmental dues clearance is now mandatory for all levels.',
  linkText: 'Access Academic Timetable →',
  linkUrl: '/documents'
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  badge: 'Faculty of Engineering • University of Port Harcourt',
  pageTitle: 'About the Department of Electrical & Electronics Engineering',
  pageSubtitle: 'Pioneering engineering education, scientific inquiry, and technological excellence at the University of Port Harcourt. Training visionary leaders who design, build, and optimize the electrified systems of tomorrow.',
  mission: {
    title: 'Our Mission',
    description: 'To foster academic distinction, provide rigorous practical engineering skill-building, conduct impactful scientific research, and produce industry-ready graduates capable of tackling global energy and technological challenges.'
  },
  vision: {
    title: 'Our Vision',
    description: 'To stand as the premier electrical and electronics engineering department in Sub-Saharan Africa, recognized internationally for innovative research, cutting-edge laboratory facilities, and entrepreneurial graduates.'
  },
  coreValues: {
    title: 'Core Values',
    description: 'Academic Rigor, Professional Ethics, Innovation, Inclusivity, and Environmental Sustainability in strict adherence to COREN benchmarks and international IEEE accreditation standards.'
  },
  heritageBadge: 'Departmental Heritage & Accreditation',
  heritageTitle: 'Pioneering Technological Pedagogy at UniPort',
  heritageParagraphs: [
    'Established as one of the cornerstone departments within the Faculty of Engineering at the University of Port Harcourt, the Department of Electrical & Electronics Engineering has trained generations of engineers spearheading Nigeria’s energy, telecommunications, automation, and tech ecosystems.',
    'Our students participate in hands-on robotics workshops, power system simulations, circuit prototyping, hackathons, and industrial mentorship programs designed to augment university curricula with practical competence and technical confidence.',
    'The curriculum is continuously benchmarked against Council for the Regulation of Engineering in Nigeria (COREN) requirements, IEEE educational guidelines, and National Universities Commission (NUC) standards.'
  ],
  homeNarrativeBadge: 'Guiding Principles & Mission',
  homeNarrativeTitle: 'Engineering Rigor, Technical Ingenuity.',
  homeNarrativeText: 'Founded on the Choba campus of the University of Port Harcourt, the Department of Electrical & Electronics Engineering delivers accredited, world-class technical education. We prepare engineers for international industry standards in compliance with COREN, IEEE, and the Nigerian Society of Engineers (NSE).'
}

export const DEFAULT_PROGRAMMES_CONTENT: ProgrammesContent = {
  headerBadge: 'Fully Accredited by COREN & NUC',
  title: 'Academic Programmes Offered',
  description: 'The Department of Electrical & Electronic Engineering at the University of Port Harcourt provides rigorous, industry-aligned engineering education designed to equip graduates with theoretical depth, hands-on laboratory mastery, and global problem-solving capabilities.',
  degreeType: 'B.Eng (Honours)',
  duration: '5 Years Standard',
  departmentName: 'Department of Electrical & Electronic Engineering',
  flagshipBadge: 'Undergraduate Flagship',
  flagshipTitle: 'Bachelor of Engineering (B.Eng.) in Electrical & Electronic Engineering',
  flagshipDescription: 'In the final two years of study (Years 4 and 5), students select one of two specialized professional options, tailoring their expertise to either heavy electrical power infrastructure or cutting-edge digital communications and electronic systems.',
  optionA: {
    pathwayId: 'power',
    pathwayLabel: 'Option Pathway A',
    title: 'Power Systems & Electrical Machines Option',
    description: 'Focuses on the generation, high-voltage transmission, distribution, and utilization of electrical energy, industrial electric drives, transformer architecture, switchgear protection, and modern smart renewable grids.',
    courses: [
      { code: 'EEE 401 / 501', title: 'Power Systems Analysis, Stability & Fault Calculations' },
      { code: 'EEE 403 / 503', title: 'Electrical Machines Design, Induction & Synchronous Systems' },
      { code: 'EEE 505', title: 'High Voltage Engineering, Insulation & Lightning Protection' },
      { code: 'EEE 507', title: 'Switchgear, Protective Relaying & Substation Automation' },
      { code: 'EEE 509', title: 'Power Electronics, Inverters & Renewable Energy Integration' }
    ],
    laboratoryFacilities: 'Electrical Machines Testing Lab (dynamometer motor testing, winding analysis), High Voltage Safety Test Bay, and ETAP / MATLAB Power Flow Simulation Workstations.',
    careerTrajectories: [
      'TCN & Power Grid Operator',
      'DISCO Distribution Engineer',
      'Offshore Power Systems',
      'Renewable Energy Consultant',
      'Substation Design Engineer'
    ]
  },
  optionB: {
    pathwayId: 'telecom',
    pathwayLabel: 'Option Pathway B',
    title: 'Electronics & Telecommunications Option',
    description: 'Focuses on modern cellular and wireless networks (4G/5G/6G), optical fiber communications, digital signal processing (DSP), embedded microcontrollers, IoT devices, robotics, and VLSI circuit architecture.',
    courses: [
      { code: 'EEE 402 / 502', title: 'Advanced Digital Signal Processing (DSP) & Filter Design' },
      { code: 'EEE 404 / 504', title: 'Microwave Engineering, Waveguides & Antennas' },
      { code: 'EEE 506', title: 'Embedded Systems, FPGA Architecture & Microcontroller Interfacing' },
      { code: 'EEE 508', title: 'Optical Fiber Communication & High-Speed Network Systems' },
      { code: 'EEE 510', title: 'Cellular Mobile Communications & Satellite Telemetry' }
    ],
    laboratoryFacilities: 'Embedded Systems Lab (ESP32, ARM Cortex, STM32 development boards), RF & Microwave Vector Network Analyzers, Logic Analyzers, and Circuit CAD PCB fabrication lab.',
    careerTrajectories: [
      'Telecom Infrastructure (MTN/Airtel)',
      'Embedded Firmware Engineer',
      'IoT System Architect',
      'RF & Antenna Specialist',
      'Robotics & Automation Developer'
    ]
  },
  curriculumProgression: [
    {
      yearNumber: '1',
      level: '100L',
      title: 'Foundations',
      description: 'Calculus, University Physics, General Chemistry, Applied Mechanics & Technical Drawing.',
      badge: 'Faculty Common'
    },
    {
      yearNumber: '2',
      level: '200L',
      title: 'Core Principles',
      description: 'Electric Circuit Theory I & II, Basic Electronics, Thermodynamics, Engineering Workshop Practice & SWEP.',
      badge: 'SWEP Training'
    },
    {
      yearNumber: '3',
      level: '300L',
      title: 'Intermediate Systems',
      description: 'Electromagnetic Field Theory, Electrical Machines I, Analogue Electronic Circuits, Microprocessor Systems, Control Theory.',
      badge: 'Mid-Tier Rigor'
    },
    {
      yearNumber: '4',
      level: '400L',
      title: 'Professional Specialization & SIWES',
      description: 'Semester 1: Option Modules (Power or Telecom). Semester 2: 6-Month Intensive Industrial Attachment (SIWES).',
      badge: '6-Mo Industry SIWES'
    },
    {
      yearNumber: '5',
      level: '500L',
      title: 'Advanced Engineering & Capstone',
      description: 'Advanced specialized electives, engineering management, law, and the compulsory individual Capstone B.Eng Design Project.',
      badge: 'Capstone Project'
    }
  ],
  metiTitle: 'METI Postgraduate & Advanced Innovation Pathways',
  metiSubtitle: 'Industry-integrated Master of Science (M.Sc), Master of Engineering (M.Eng), and Doctor of Philosophy (Ph.D) specializations.',
  metiPhone: '+234 803 000 0000',
  metiEmail: 'meti@uniport.edu.ng',
  metiCoordinator: 'Office of the Postgraduate Coordinator'
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsContent = {
  motto: 'Powering Innovation, Engineering the Future',
  footerDescription: 'University of Port Harcourt. Accredited by COREN & NUC. Committed to academic excellence, state-of-the-art laboratory research, sustainable energy breakthroughs, and training world-class engineers.',
  physicalAddress: 'Department of Electrical & Electronics Engineering, Faculty of Engineering Complex, Choba Park, University of Port Harcourt, PMB 5323, Rivers State, Nigeria.',
  contactEmail: 'eee.dept@uniport.edu.ng',
  phoneNumber: '+234 803 123 4567',
  duesAmount: '₦5,000',
  duesAmountNumeric: 5000,
  academicSession: '2025/2026'
}

export const DEFAULT_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Engr. Prof. Emmanuel N. Ekwue',
    title: 'Professor & Head of Department',
    cadre: 'professor',
    categoryLabel: 'Professor',
    qualifications: [
      'Ph.D. Electrical Engineering (Imperial College London, UK)',
      'M.Eng. Power Systems (University of Port Harcourt)',
      'B.Eng. Electrical Engineering (First Class Hons, UNN)',
      'Fellow, Nigerian Society of Engineers (FNSE)',
      'Registered Engineer (COREN)'
    ],
    specialization: 'Power Systems Reliability, Smart Grids & High Voltage Engineering',
    focusArea: 'power',
    email: 'emmanuel.ekwue@uniport.edu.ng',
    office: 'HOD Office, EEE Block Rm 201',
    biography: 'Leading researcher in transient stability and smart grid distributed generation integration with over 25 years of academic and industrial consultancy.',
    display_order: 1
  },
  {
    id: 'staff-2',
    name: 'Engr. Prof. Chibuike K. Agubor',
    title: 'Professor of Telecommunications Engineering',
    cadre: 'professor',
    categoryLabel: 'Professor',
    qualifications: [
      'Ph.D. Telecommunications Engineering (FUTO)',
      'M.Eng. Electronic & Telecom Engineering (UniPort)',
      'B.Eng. Electrical/Electronic Engineering',
      'FNSE, FIEEE, Registered Engineer (COREN)'
    ],
    specialization: 'Wireless Communications, MIMO Systems & 5G/6G Propagation Modeling',
    focusArea: 'telecom',
    email: 'chibuike.agubor@uniport.edu.ng',
    office: 'EEE Faculty Wing Room 305',
    biography: 'Pioneer researcher in 5G microcell propagation analysis and millimeter wave wireless channels for sub-Saharan Africa.',
    display_order: 2
  },
  {
    id: 'staff-3',
    name: 'Engr. Prof. Boniface O. Anyanwu',
    title: 'Professor of Control & Power Systems',
    cadre: 'professor',
    categoryLabel: 'Professor',
    qualifications: [
      'Ph.D. Electrical Power Systems (University of Manchester, UK)',
      'M.Sc. Control Systems (Imperial College London)',
      'B.Eng. Electrical Engineering (UniPort)',
      'FNSE, COREN Registered'
    ],
    specialization: 'Control Systems Design, SCADA & Renewable Energy Grid Interfacing',
    focusArea: 'control',
    email: 'boniface.anyanwu@uniport.edu.ng',
    office: 'Power & Automation Lab, Rm 102',
    biography: 'Specializes in SCADA system architectures, adaptive control algorithms for variable wind and solar energy, and grid security.',
    display_order: 3
  },
  {
    id: 'staff-4',
    name: 'Engr. Dr. (Mrs.) Florence I. Ibitoye',
    title: 'Associate Professor & Reader',
    cadre: 'professor',
    categoryLabel: 'Associate Professor',
    qualifications: [
      'Ph.D. Electronic Engineering (UniPort)',
      'M.Eng. Electronics & Communications (UniPort)',
      'B.Eng. Electrical/Electronic Engineering (Benin)',
      'MNSE, Reg. Engr. (COREN)'
    ],
    specialization: 'Digital Signal Processing (DSP), Biomedical Electronics & Image Recognition',
    focusArea: 'electronics',
    email: 'florence.ibitoye@uniport.edu.ng',
    office: 'EEE Block Room 214',
    biography: 'Mentoring future female engineers and spearheading grant-funded research in edge-computed biomedical diagnostic devices.',
    display_order: 4
  },
  {
    id: 'staff-5',
    name: 'Engr. Dr. Osaki E. Ogu',
    title: 'Senior Lecturer & Departmental Exam Officer',
    cadre: 'lecturer',
    categoryLabel: 'Senior Lecturer',
    qualifications: [
      'Ph.D. Telecommunication Networks (University of Strathclyde, UK)',
      'M.Eng. Electronic Engineering (UniPort)',
      'B.Eng. Electrical/Electronic Engineering (UniPort)',
      'MNSE, Reg. Engr. (COREN)'
    ],
    specialization: 'Optical Fiber Communications, WDM Networks & IoT Protocols',
    focusArea: 'telecom',
    email: 'osaki.ogu@uniport.edu.ng',
    office: 'EEE Block Room 208',
    biography: 'Focuses on non-linear optical transmission, high-capacity wavelength routing, and long-range IoT networks.',
    display_order: 5
  },
  {
    id: 'staff-6',
    name: 'Engr. Dr. Tari E. Alabo',
    title: 'Senior Lecturer & Post-Graduate Coordinator',
    cadre: 'lecturer',
    categoryLabel: 'Senior Lecturer',
    qualifications: [
      'Ph.D. Power Systems Engineering (UniPort)',
      'M.Eng. Electrical Power & Machines (UniPort)',
      'B.Eng. Electrical Engineering (RSU)',
      'MNSE, Reg. Engr. (COREN)'
    ],
    specialization: 'Substation Automation, Microgrids & Power Distribution Economics',
    focusArea: 'power',
    email: 'tari.alabo@uniport.edu.ng',
    office: 'EEE Block Room 210',
    biography: 'Extensive background in Nigerian power sector grid auditing, energy tariff modeling, and microgrid decentralized storage.',
    display_order: 6
  },
  {
    id: 'staff-7',
    name: 'Engr. Dr. Kingsley C. Nwosu',
    title: 'Lecturer I & Departmental Staff Advisor',
    cadre: 'lecturer',
    categoryLabel: 'Lecturer I',
    qualifications: [
      'Ph.D. Electronic & Embedded Systems (Newcastle University, UK)',
      'M.Eng. Electronics (UniPort)',
      'B.Eng. Computer Engineering (UniPort)',
      'MNSE, Reg. Engr. (COREN), IEEE Member'
    ],
    specialization: 'VLSI Design, Embedded Microcontrollers & FPGA Acceleration',
    focusArea: 'electronics',
    email: 'kingsley.nwosu@uniport.edu.ng',
    office: 'Embedded Systems Lab, Rm 105',
    biography: 'Faculty advisor to departmental student robotics and hardware development hub, with active patents in hardware cryptography.',
    display_order: 7
  },
  {
    id: 'staff-8',
    name: 'Engr. Nnamdi E. Amadi',
    title: 'Lecturer II',
    cadre: 'lecturer',
    categoryLabel: 'Lecturer II',
    qualifications: [
      'Ph.D. candidate (Power Electronics, UniPort)',
      'M.Eng. Electrical Power & Machines (UniPort)',
      'B.Eng. Electrical/Electronic Engineering (First Class Hons)',
      'MNSE, Reg. Engr. (COREN)'
    ],
    specialization: 'Power Electronic Converters, Inverter Drives & Electric Mobility',
    focusArea: 'power',
    email: 'nnamdi.amadi@uniport.edu.ng',
    office: 'EEE Block Room 118',
    biography: 'Investigating high-efficiency wide-bandgap (SiC/GaN) switching circuits for solar charge controllers and electric vehicle drives.',
    display_order: 8
  },
  {
    id: 'staff-9',
    name: 'Engr. (Mrs.) Blessing O. Dan-Jumbo',
    title: 'Lecturer II',
    cadre: 'lecturer',
    categoryLabel: 'Lecturer II',
    qualifications: [
      'M.Eng. Telecommunications Engineering (UniPort)',
      'B.Eng. Electrical/Electronic Engineering (UniPort)',
      'MNSE, Reg. Engr. (COREN)'
    ],
    specialization: 'Antenna Design, RF Propagation & Satellite Links',
    focusArea: 'telecom',
    email: 'blessing.danjumbo@uniport.edu.ng',
    office: 'EEE Block Room 119',
    biography: 'Directing lab courses in electromagnetic fields, waveguide propagation, and planar antenna array synthesis.',
    display_order: 9
  },
  {
    id: 'staff-10',
    name: 'Engr. Samuel T. Briggs',
    title: 'Chief Technical Officer (Lab Technologist)',
    cadre: 'technologist',
    categoryLabel: 'Chief Technologist',
    qualifications: [
      'M.Tech. Electrical Power Technology (RSU)',
      'HND Electrical/Electronic Engineering (Federal Poly Nekede)',
      'NIST Member, Full COREN Registered Engineering Technologist'
    ],
    specialization: 'Power Machines Laboratory, Transformer Testing & High-Voltage Safety',
    focusArea: 'power',
    email: 'samuel.briggs@uniport.edu.ng',
    office: 'Electrical Machines Lab, Ground Floor',
    biography: 'Over 20 years supervising undergraduate electrical machines, motor windings, synchronizing panels, and industrial maintenance tests.',
    display_order: 10
  },
  {
    id: 'staff-11',
    name: 'Mr. David E. Wokoma',
    title: 'Principal Technologist',
    cadre: 'technologist',
    categoryLabel: 'Principal Technologist',
    qualifications: [
      'HND Electronics & Telecommunications (Yaba Tech)',
      'PGD Computer Science (UniPort)',
      'COREN Registered Engineering Technologist'
    ],
    specialization: 'Instrumentation, Circuit Simulation & PCB Fabrication Laboratory',
    focusArea: 'electronics',
    email: 'david.wokoma@uniport.edu.ng',
    office: 'Instrumentation Lab, Room 101',
    biography: 'Directs breadboard prototyping, oscilloscope and signal generator calibrations, and multi-layer chemical PCB etching.',
    display_order: 11
  },
  {
    id: 'staff-12',
    name: 'Engr. (Ms.) Patricia O. Okon',
    title: 'Senior Technologist',
    cadre: 'technologist',
    categoryLabel: 'Senior Technologist',
    qualifications: [
      'B.Eng. Electrical/Electronic Engineering (UniPort)',
      'Certified LabVIEW Associate Developer (CLAD)',
      'COREN Registered'
    ],
    specialization: 'Digital Electronics, Microprocessor Interfacing & Software CAD Labs',
    focusArea: 'electronics',
    email: 'patricia.okon@uniport.edu.ng',
    office: 'Digital Systems Lab, Room 103',
    biography: 'Supervises logic analyzer stations, microcontroller dev boards (ESP32/STM32), and circuit synthesis software suites.',
    display_order: 12
  }
]
