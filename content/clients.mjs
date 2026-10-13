// Client names, in the order of the client's approved copy deck.
//
// `logo` is a file in assets/clients/, collected from each organisation's own
// website or from public logo libraries; the profile uses them on the clients page and on each project page.
// `onDark` marks a logo drawn in white, which needs a dark plate. A client with
// no `logo` is set as a name until its logo is supplied (vector logos are
// requested from the client). The website still shows the typographic roster.

export const clients = [
  { ar: 'وزارة الثقافة',                                en: 'Ministry of Culture', logo: 'culture.png' },
  { ar: 'وزارة الصحة',                                  en: 'Ministry of Health', logo: 'moh.png' },
  { ar: 'وزارة التعليم',                                en: 'Ministry of Education', logo: 'moe.svg' },
  { ar: 'المديرية العامة للجوازات',                      en: 'General Directorate of Passports', logo: 'passports.png' },
  { ar: 'الهيئة السعودية للمواصفات والمقاييس والجودة',    en: 'SASO', logo: 'saso.png' },
  { ar: 'صندوق الوقف الصحي',                            en: 'Health Endowment Fund', logo: 'hef.png' },
  { ar: 'برنامج تنمية القدرات البشرية',                  en: 'Human Capability Development Program', logo: 'hcdp.png' },
  { ar: 'برنامج المقرات الإقليمية',                      en: 'Saudi Regional Headquarters Program' },
  { ar: 'شركة تحكم التقنية',                            en: 'Technology Control Company', logo: 'tahakom.svg' },
  { ar: 'سبل',                                          en: 'SPL', logo: 'spl.svg' },
  { ar: 'البنك الأول',                                  en: 'SAB', logo: 'sab.svg' },
  { ar: 'العبيكان',                                     en: 'Obeikan', logo: 'obeikan.png', onDark: true },
  { ar: 'بُعد للاتصالات',                               en: 'BTC Networks', logo: 'btc.png' },
  { ar: 'رتال العقارية',                                en: 'Retal', logo: 'retal.png', onDark: true },
  { ar: 'حياة مول',                                     en: 'Hayat Mall', logo: 'hayat.png' },
  { ar: 'فنادق سنود',                                   en: 'Snood Hotels', logo: 'snood.svg' },
  { ar: 'سيرا',                                         en: 'Sera', logo: 'sera.png' },
  { ar: 'مايندوير',                                     en: 'Mindware', logo: 'mindware.svg' },
  { ar: 'نوفا الطبية',                                  en: 'Nova Medical', logo: 'nova.png' },
  { ar: 'سنكلير',                                       en: 'Sinclair', logo: 'sinclair.png', onDark: true },
  { ar: 'تراكس',                                        en: 'TRAX', logo: 'trax.png' },
  { ar: 'ميديا آي دي',                                  en: 'Media ID', logo: 'mediaid.png' },
  { ar: 'لواسيس شوكولا',                                en: "L'Oasis Chocolate", logo: 'loasis.png' },
]

export const clientsIntro = {
  eyebrow: { ar: 'عملاؤنا', en: 'Our Clients' },
  lead: {
    ar: 'نفخر بثقة جهات حكومية وشركات رائدة اختارت فاريوس شريكًا لحضورها.',
    en: 'We are proud of the trust of government entities and leading companies that chose VARIOUS as their partner.',
  },
}
