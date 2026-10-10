// Global site data: brand, contact, navigation and UI strings.
// Every string carries an Arabic (ar) and English (en) form. Arabic is the
// primary language of this site; English is the secondary edition under /en/.

export const brand = {
  name:     { ar: 'فاريوس لخدمات الفعاليات', en: 'VARIOUS for Events Services' },
  shortName:{ ar: 'فاريوس',                   en: 'VARIOUS' },
  tagline:  { ar: 'نصنع تجارب تستحق أن تُروى.', en: 'We build experiences worth telling.' },
  // «شركة», not «مؤسسة» — the registered entity is a company (copy deck G2).
  // The commercial registration number is deliberately not published on the
  // website, by the client's instruction.
  legalName:{
    ar: 'شركة الفعاليات المتنوعة لتنظيم المعارض والمؤتمرات',
    en: 'Various Events Company for Organizing Exhibitions and Conferences',
  },
}

export const contact = {
  phone:       '+966 55 051 1403',
  phoneHref:   '+966550511403',
  // The same number takes WhatsApp. wa.me wants digits only, no plus.
  whatsappHref:'https://wa.me/966550511403',
  email:       'info@variousevent.com',
  // variousevent.com — the deck's VARIOUSEVENTSKSA.COM was a typo (copy deck G3).
  website:     'variousevent.com',
  websiteHref: 'https://variousevent.com',
  address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
  // Handles as given in the copy deck. The LinkedIn and YouTube URL forms
  // (company page, @handle) are the platforms' current defaults.
  social: [
    { id: 'instagram', label: 'Instagram', handle: 'various_events_',    href: 'https://www.instagram.com/various_events_' },
    { id: 'x',         label: 'X',         handle: 'various_event',      href: 'https://x.com/various_event' },
    { id: 'linkedin',  label: 'LinkedIn',  handle: 'various-experience', href: 'https://www.linkedin.com/company/various-experience' },
    { id: 'youtube',   label: 'YouTube',   handle: 'variousevents',      href: 'https://www.youtube.com/@variousevents' },
  ],
}

// The site's information architecture. Each entry is a page; `children` become
// a sub-menu and give the section its own landing page plus real sub-pages, so
// content is distributed rather than stacked onto the homepage.
//
// `path` is the Arabic (root) path; the English edition prefixes it with `en/`.
export const nav = [
  { id: 'home', path: '', ar: 'الرئيسية', en: 'Home' },
  {
    id: 'about', path: 'about', ar: 'من نحن', en: 'About',
    children: [
      { id: 'about-index',  path: 'about',        ar: 'نبذة عن فاريوس',  en: 'Who we are' },
      { id: 'about-vision', path: 'about/vision', ar: 'الرؤية والرسالة', en: 'Vision & mission' },
      { id: 'about-values', path: 'about/values', ar: 'قيمنا',           en: 'Our values' },
    ],
  },
  {
    id: 'services', path: 'services', ar: 'خدماتنا', en: 'Services',
    children: [
      { id: 'services-index',  path: 'services',                   ar: 'خدماتنا',              en: 'Our services' },
      { id: 'services-solutions', path: 'services/solutions',      ar: 'حلولنا',               en: 'Our solutions' },
      { id: 'services-owners', path: 'services/exhibition-owners', ar: 'خدمات أصحاب المعارض', en: 'For exhibition owners' },
    ],
  },
  { id: 'process', path: 'process', ar: 'منهجية العمل', en: 'How we work' },
  {
    id: 'work', path: 'work', ar: 'أعمالنا', en: 'Work',
    // Category entries jump to their heading on the one work page.
    children: [
      { id: 'work-index',       path: 'work',                         ar: 'كل الأعمال',                   en: 'All work' },
      { id: 'work-exhibitions', path: 'work', hash: 'exhibitions',    ar: 'المعارض والأجنحة',             en: 'Exhibitions & pavilions' },
      { id: 'work-conferences', path: 'work', hash: 'conferences',    ar: 'المؤتمرات والاجتماعات',        en: 'Conferences & meetings' },
      { id: 'work-ceremonies',  path: 'work', hash: 'ceremonies',     ar: 'الاحتفالات وفعاليات الشركات',  en: 'Ceremonies & corporate events' },
    ],
  },
  { id: 'clients', path: 'clients', ar: 'عملاؤنا', en: 'Clients' },
  { id: 'contact', path: 'contact', ar: 'تواصل معنا', en: 'Contact' },
]

// Interface strings. Kept out of the templates so both editions stay in step.
// Deliberately a constant rather than new Date().getFullYear(): the deployment
// is verified by checksumming local files against the server, and a year that
// changes with the build date would make every page report as differing on
// 1 January. Update it here.
export const copyrightYear = 2026

export const ui = {
  skipToContent: { ar: 'تخطَّ إلى المحتوى',      en: 'Skip to content' },
  menu:          { ar: 'القائمة',                 en: 'Menu' },
  close:         { ar: 'إغلاق',                   en: 'Close' },
  switchLang:    { ar: 'English',                 en: 'العربية' },
  switchLangFull:{ ar: 'اعرض الموقع بالإنجليزية', en: 'View this site in Arabic' },
  viewProject:   { ar: 'اعرض المشروع',            en: 'View project' },
  allWork:       { ar: 'كل الأعمال',              en: 'All work' },
  nextProject:   { ar: 'المشروع التالي',          en: 'Next project' },
  prevProject:   { ar: 'المشروع السابق',          en: 'Previous project' },
  backToWork:    { ar: 'عودة إلى الأعمال',        en: 'Back to work' },
  client:        { ar: 'العميل',                  en: 'Client' },
  year:          { ar: 'السنة',                   en: 'Year' },
  location:      { ar: 'الموقع',                  en: 'Location' },
  scope:         { ar: 'نطاق العمل',              en: 'Scope' },
  toBeConfirmed: { ar: 'قيد الاعتماد',            en: 'To be confirmed' },
  getInTouch:    { ar: 'لنصنع فعاليتكم القادمة',  en: "Let's build your next event" },
  startConversation: { ar: 'ابدأ الحديث',         en: 'Start a conversation' },
  callUs:        { ar: 'اتصل بنا',                en: 'Call us' },
  emailUs:       { ar: 'راسلنا',                  en: 'Email us' },
  copyright:     { ar: 'جميع الحقوق محفوظة',      en: 'All rights reserved' },
  readMore:      { ar: 'اقرأ المزيد',             en: 'Read more' },
  links:         { ar: 'روابط',                   en: 'Links' },
  explore:       { ar: 'تصفح',                    en: 'Explore' },
  inThisSection: { ar: 'في هذا القسم',            en: 'In this section' },
  openSubmenu:   { ar: 'افتح القائمة الفرعية',    en: 'Open submenu' },
  allServices:   { ar: 'كل الخدمات',              en: 'All services' },
  relatedWork:   { ar: 'أعمال ذات صلة',           en: 'Related work' },
  whatWeDo:      { ar: 'ما نقوم به',              en: 'What this covers' },
  nextService:   { ar: 'الخدمة التالية',          en: 'Next service' },
  seeWork:       { ar: 'شاهد أعمالنا',            en: 'See our work' },
  aboutUs:       { ar: 'المزيد عن فاريوس',        en: 'More about VARIOUS' },
  talkToUs:      { ar: 'تحدّث إلينا',             en: 'Talk to us' },
  pageOf:        { ar: 'من',                      en: 'of' },
  whatsapp:      { ar: 'واتساب',                  en: 'WhatsApp' },
  phoneWhatsapp: { ar: 'الهاتف والواتساب',        en: 'Phone & WhatsApp' },
  followUs:      { ar: 'تابعنا',                  en: 'Follow us' },
  company:       { ar: 'الشركة',                  en: 'Company' },
  website:       { ar: 'الموقع الإلكتروني',       en: 'Website' },
  address:       { ar: 'العنوان',                 en: 'Address' },
  theme:         { ar: 'تبديل المظهر الفاتح والداكن', en: 'Switch light / dark appearance' },
  themeLight:    { ar: 'المظهر الفاتح',           en: 'Light appearance' },
  themeDark:     { ar: 'المظهر الداكن',           en: 'Dark appearance' },
  relatedService:{ ar: 'أعمال ذات صلة',           en: 'See related work' },
  solutions:     { ar: 'حلولنا',                  en: 'Our solutions' },
  owners:        { ar: 'خدمات أصحاب المعارض',     en: 'For exhibition owners' },
  inThisPage:    { ar: 'في هذه الصفحة',           en: 'On this page' },
  projectPhotoSoon: { ar: 'صور المشروع قريبًا',   en: 'Project photography to follow' },
  partsLabel:    { ar: 'المشاريع',                en: 'The projects' },
  types:         { ar: 'نوع العمل',               en: 'Type of work' },
  backToTop:     { ar: 'إلى أعلى الصفحة',         en: 'Back to top' },
}

/**
 * Every figure on the site uses Western digits — in the Arabic edition too —
 * by the client's instruction, so the website and the printed profile match.
 */

/** A sequence label, zero-padded: 01 02 03. */
export function num(n) {
  return String(n).padStart(2, '0')
}

/** A quantity, not a label — no zero padding, grouped in thousands. */
export function figure(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
