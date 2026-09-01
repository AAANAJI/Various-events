// Global site data: brand, contact, navigation and UI strings.
// Every string carries an Arabic (ar) and English (en) form. Arabic is the
// primary language of this site; English is the secondary edition under /en/.

export const brand = {
  name:     { ar: 'فاريوس لخدمات الفعاليات', en: 'VARIOUS for Events Services' },
  shortName:{ ar: 'فاريوس',                   en: 'VARIOUS' },
  tagline:  { ar: 'نصنع تجارب تستحق أن تُروى.', en: 'We craft experiences worth telling.' },
  legalName:{
    ar: 'مؤسسة الفعاليات المتنوعة لتنظيم المعارض والمؤتمرات',
    en: 'Various Events Est. for Exhibitions & Conferences Organization',
  },
  cr: '1010960212',
}

export const contact = {
  phone:       '+966 55 051 1403',
  phoneHref:   '+966550511403',
  email:       'info@variousevent.com',
  website:     'variouseventsksa.com',
  websiteHref: 'https://variouseventsksa.com',
  address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Kingdom of Saudi Arabia' },
}

// Routes are declared once and emitted for both languages.
// `path` is the Arabic (root) path; the English edition prefixes it with `en/`.
export const nav = [
  { id: 'home',     path: '',          ar: 'الرئيسية',  en: 'Home' },
  { id: 'about',    path: 'about',     ar: 'من نحن',    en: 'About' },
  { id: 'services', path: 'services',  ar: 'خدماتنا',   en: 'Services' },
  { id: 'work',     path: 'work',      ar: 'أعمالنا',   en: 'Work' },
  { id: 'clients',  path: 'clients',   ar: 'عملاؤنا',   en: 'Clients' },
  { id: 'contact',  path: 'contact',   ar: 'تواصل معنا', en: 'Contact' },
]

// Interface strings. Kept out of the templates so both editions stay in step.
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
  crLabel:       { ar: 'س.ت',                     en: 'CR' },
  readMore:      { ar: 'اقرأ المزيد',             en: 'Read more' },
  pageOf:        { ar: 'من',                      en: 'of' },
}

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩'

/**
 * Section numbering — zero-padded to two digits, as the deck sets it: ٠١ ٠٢ ٠٣.
 * The English edition keeps Latin digits.
 */
export function num(n, lang) {
  const s = String(n).padStart(2, '0')
  return lang === 'ar' ? s.replace(/\d/g, d => ARABIC_INDIC[Number(d)]) : s
}

/**
 * A quantity, not a label — so no zero padding, and grouped in thousands.
 * Arabic uses U+066C (٬) as its thousands separator, not the Latin comma.
 */
export function figure(n, lang) {
  const grouped = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'ar' ? '\u066C' : ',')
  return lang === 'ar' ? grouped.replace(/\d/g, d => ARABIC_INDIC[Number(d)]) : grouped
}
