// The portfolio, transcribed from the company profile deck.
//
// A note on `year` and `location`: the source deck carries the literal placeholder
// «السنة» / «الموقع» / «الدورة» for many projects, alongside an explicit
// «للاعتماد» (to be confirmed) marker. Those are recorded here as null rather than
// guessed. The templates omit a null field entirely — nothing is invented, and
// filling one in later is a one-line edit.

export const projects = [
  {
    slug: 'saudi-cup',
    image: 'saudi-cup',
    client: { ar: 'وزارة الثقافة', en: 'Ministry of Culture' },
    title:  { ar: 'كأس السعودية للخيل', en: 'The Saudi Cup' },
    year: null, location: null,
    tags: [
      { ar: 'تصميم',      en: 'Design' },
      { ar: 'تصنيع',      en: 'Fabrication' },
      { ar: 'إدارة حدث',  en: 'Event management' },
    ],
    text: {
      ar: 'كانت مشاركتنا في كأس السعودية شراكة متكاملة: صمّمنا وصنّعنا وأدرنا تجهيزات الحدث بالكامل، بتفاصيل خُطط لها ونُفِّذت بدقة جعلت التجربة استثنائية لجميع الحاضرين.',
      en: 'Our role at the Saudi Cup was end-to-end: we designed, fabricated, and managed the event build in full — planned and executed to a level of detail that made the experience exceptional for every attendee.',
    },
    featured: true,
  },
  {
    slug: 'book-fair',
    image: 'book-fair',
    client: { ar: 'وزارة الثقافة', en: 'Ministry of Culture' },
    title:  { ar: 'معرض الكتاب', en: 'The Book Fair' },
    year: null, location: null,
    tags: [
      { ar: 'جناح', en: 'Pavilion' },
      { ar: 'تنفيذ', en: 'Build' },
    ],
    text: {
      ar: 'نفّذنا حضور وزارة الثقافة في معرض الكتاب بمساحات تحتفي بالمحتوى وتُيسّر حركة الزوار وتترك للكتاب مساحة الصدارة.',
      en: "We delivered the Ministry of Culture's presence at the Book Fair — spaces that celebrate content, ease visitor flow, and keep the books center stage.",
    },
    featured: true,
  },
  {
    slug: 'kleija-festival',
    image: 'kleija',
    client: { ar: 'وزارة الثقافة', en: 'Ministry of Culture' },
    title:  { ar: 'مهرجان الكليجا', en: 'Kleija Festival' },
    year: null, location: null,
    tags: [
      { ar: 'تجهيز مهرجان', en: 'Festival build' },
      { ar: 'صناعة مكان',   en: 'Placemaking' },
    ],
    text: {
      ar: 'أعمال تصميم وتنفيذ لمهرجان الكليجا بهوية مكانية تحتفي بالموروث وتصنع تجربة عائلية متكاملة بين الأجنحة والمسرح ومناطق التفاعل.',
      en: 'Design and build for the Kleija Festival — a sense of place that celebrates heritage across stalls, stage, and interaction zones for a complete family experience.',
    },
    featured: true,
  },
  {
    slug: 'data-privacy-day',
    image: 'data-privacy',
    client: { ar: 'وزارة الثقافة', en: 'Ministry of Culture' },
    title:  { ar: 'يوم خصوصية البيانات', en: 'Data Privacy Day' },
    year: null, location: null,
    tags: [
      { ar: 'تفعيل توعوي',   en: 'Awareness activation' },
      { ar: 'مناطق تفاعلية', en: 'Interactive zones' },
    ],
    text: {
      ar: 'تجهيز فعالية يوم خصوصية البيانات بمناطق توعوية وتجارب تفاعلية تقرّب موضوعًا تقنيًا من جمهور واسع.',
      en: 'An awareness build for Data Privacy Day — interactive zones that make a technical subject accessible to a broad audience.',
    },
  },
  {
    slug: 'sab-founding-day',
    image: 'sab-founding-day',
    client: { ar: 'البنك الأول', en: 'SAB' },
    title:  { ar: 'يوم التأسيس', en: 'Founding Day' },
    year: null, location: null,
    tags: [
      { ar: 'احتفالية',     en: 'Celebration' },
      { ar: 'تصميم وتنفيذ', en: 'Design & build' },
    ],
    text: {
      ar: 'احتفالية يوم التأسيس للبنك الأول: تصميم وتنفيذ تجربة تمزج الرموز التراثية بحضور العلامة، بتفاصيل ضيافة وتصوير تليق بالمناسبة.',
      en: "SAB's Founding Day celebration: design and build of an experience weaving heritage symbols with the bank's brand presence, with hospitality and photo moments to match the occasion.",
    },
    featured: true,
  },
  {
    slug: 'tahakom-ceos-meeting',
    image: 'tahakom',
    client: { ar: 'تحكم', en: 'Tahakom' },
    title:  { ar: 'اجتماع الرؤساء التنفيذيين', en: 'CEOs Meeting' },
    year: null, location: null,
    tags: [
      { ar: 'فعالية تنفيذية', en: 'Executive event' },
      { ar: 'إنتاج',          en: 'Production' },
    ],
    text: {
      ar: 'تجهيز وإدارة لقاء تنفيذي رفيع المستوى لشركة تحكم، ببيئة عرض وضيافة تليق بمقام الحضور وتراعي خصوصية الاجتماع.',
      en: 'Build and management of a senior executive gathering for Tahakom — a presentation and hospitality environment to match the room, with the discretion the meeting requires.',
    },
  },
  {
    slug: 'saso-boulevard',
    image: 'saso',
    client: {
      ar: 'الهيئة السعودية للمواصفات والمقاييس والجودة',
      en: 'Saudi Standards, Metrology and Quality Organization (SASO)',
    },
    title:  { ar: 'البوليفارد', en: 'Boulevard City' },
    year: null,
    location: { ar: 'بوليفارد سيتي، الرياض', en: 'Boulevard City, Riyadh' },
    tags: [
      { ar: 'تفعيل جماهيري', en: 'Public activation' },
      { ar: 'تفاعلي',        en: 'Interactive' },
    ],
    text: {
      ar: 'حضور تفاعلي للهيئة السعودية للمواصفات والمقاييس والجودة في بوليفارد سيتي بالرياض، يوصل رسائل الجودة والمطابقة بأسلوب قريب من الزوار.',
      en: 'An interactive presence for SASO at Boulevard City, Riyadh — quality and conformity messages delivered in a visitor-friendly way.',
    },
    featured: true,
  },
  {
    slug: 'health-endowment-fund',
    image: 'health-endowment',
    client: { ar: 'صندوق الوقف الصحي', en: 'Health Endowment Fund' },
    title:  { ar: 'برج الساعة', en: 'Clock Tower, Makkah' },
    year: null,
    location: { ar: 'برج الساعة، مكة المكرمة', en: 'Clock Tower, Makkah' },
    tags: [
      { ar: 'حضور علامة', en: 'Brand presence' },
      { ar: 'تنفيذ',      en: 'Build' },
    ],
    text: {
      ar: 'تجهيز حضور صندوق الوقف الصحي في برج الساعة بمكة المكرمة. ويمتد تعاوننا مع الصندوق إلى جناح تفاعلي في معرض الصحة العالمي ٢٠٢٤ أبرز الابتكار في القطاع الصحي.',
      en: "The Fund's presence at the Clock Tower, Makkah. Our partnership extends to an interactive pavilion at the Global Health Exhibition 2024 spotlighting healthcare innovation.",
    },
  },
  {
    slug: 'international-investment-forum',
    image: 'investment-forum',
    client: null,
    title:  { ar: 'الملتقى الدولي للاستثمار في المملكة', en: 'International Investment Forum, KSA' },
    year: null, location: null,
    tags: [
      { ar: 'تجهيز ملتقى', en: 'Forum build' },
      { ar: 'تنفيذ',       en: 'Delivery' },
    ],
    text: {
      ar: 'أعمال تجهيز وتنفيذ ضمن الملتقى الدولي للاستثمار في المملكة.',
      en: 'Build and delivery works for the International Investment Forum in the Kingdom.',
    },
  },
  {
    slug: 'media-excellence-award',
    image: 'media-award',
    client: null,
    title:  { ar: 'جائزة التميز الإعلامي', en: 'Media Excellence Award' },
    year: { ar: 'النسخة الخامسة', en: 'Fifth edition' },
    location: null,
    tags: [
      { ar: 'حفل',  en: 'Ceremony' },
      { ar: 'إنتاج', en: 'Production' },
    ],
    text: {
      ar: 'جائزة سنوية تحتفي بالأعمال الإعلامية الإبداعية في مختلف المناسبات الوطنية والمجالات، أقيمت نسختها الخامسة بالشراكة مع برنامج تنمية القدرات البشرية — وتولّت فاريوس تنظيم الحفل وتجهيزاته وإنتاجه.',
      en: "An annual award celebrating creative media work across national occasions and fields, its fifth edition delivered in partnership with the Human Capability Development Program — with VARIOUS behind the ceremony's organization, build, and production.",
    },
    featured: true,
  },
  {
    slug: 'hayat-mall',
    image: 'hayat-mall',
    client: { ar: 'حياة مول', en: 'Hayat Mall' },
    title:  { ar: 'تفعيل موسمي', en: 'Seasonal Activation' },
    year: null,
    location: { ar: 'الرياض', en: 'Riyadh' },
    tags: [
      { ar: 'تفعيل تجاري', en: 'Retail activation' },
      { ar: 'موسمي',       en: 'Seasonal' },
    ],
    text: {
      ar: 'تفعيل موسمي في حياة مول بالرياض يجمع بين التصميم الجاذب وإدارة تدفق الزوار وتجربة عائلية آمنة وسلسة.',
      en: 'A seasonal activation at Hayat Mall, Riyadh — attention-grabbing design with visitor-flow management for a safe, seamless family experience.',
    },
  },
  {
    slug: 'retal-annual-ceremony',
    image: 'retal',
    client: { ar: 'رتال العقارية', en: 'Retal' },
    title:  { ar: 'الحفل السنوي', en: 'Annual Ceremony' },
    year: null, location: null,
    tags: [
      { ar: 'فعالية شركات', en: 'Corporate event' },
      { ar: 'متكامل',       en: 'End-to-end' },
    ],
    text: {
      ar: 'تولّينا تصميم وتنفيذ وإدارة حفل رتال السنوي، بتخطيط دقيق لكل التفاصيل وتنفيذ صنع تجربة لا تُنسى للحضور.',
      en: "We designed, delivered, and managed Retal's annual ceremony — planned in detail and executed to create a memorable experience for guests.",
    },
    featured: true,
  },
  {
    slug: 'nova-medical',
    image: 'nova-medical',
    client: { ar: 'نوفا الطبية', en: 'Nova Medical' },
    title:  { ar: 'جناح معرض الطب التجميلي', en: 'Aesthetic Medicine Exhibition Stand' },
    year: null, location: null,
    tags: [{ ar: 'جناح معرض', en: 'Exhibition stand' }],
    text: {
      ar: 'جناح نوفا لطب الأسنان في معرض الطب التجميلي: استعراض أحدث تقنيات المجال بحلول عرض مبتكرة تعزز حضور العلامة.',
      en: "Nova Dental's stand at the Aesthetic Medicine Exhibition: the field's latest techniques presented through inventive display solutions that elevate the brand.",
    },
  },
  {
    slug: 'sinclair-riyadh',
    image: 'sinclair',
    client: { ar: 'سنكلير', en: 'Sinclair' },
    title:  { ar: 'مؤتمر الرياض', en: 'Riyadh Conference' },
    year: null,
    location: { ar: 'الرياض', en: 'Riyadh' },
    tags: [
      { ar: 'مؤتمر', en: 'Conference' },
      { ar: 'تجهيز', en: 'Build' },
    ],
    text: {
      ar: 'مؤتمر متخصص لعلامة سنكلير في الرياض: جلسات وورش عمل وبيئة عرض أنيقة تليق بقطاع التجميل الطبي.',
      en: 'A specialist conference for Sinclair in Riyadh — sessions, workshops, and a refined environment for the medical aesthetics sector.',
    },
  },
]

// «ومن أعمالنا أيضًا» — additional works listed by title only in the deck.
export const additionalWorks = [
  {
    client: { ar: 'فنادق سنود', en: 'Snood Hotels' },
    title:  { ar: 'معرض الحج والعمرة، جدة سوبر دوم', en: 'Hajj & Umrah Expo, Jeddah Super Dome' },
  },
  {
    client: { ar: 'فنادق سنود', en: 'Snood Hotels' },
    title:  { ar: 'منتدى العمرة والزيارة', en: 'Umrah & Ziyarah Forum' },
  },
  {
    client: { ar: 'سيرا', en: 'Sera' },
    title:  { ar: 'مؤتمر LEAP 2023', en: 'LEAP 2023' },
  },
  {
    client: { ar: 'مايندوير', en: 'Mindware' },
    title:  { ar: 'معرض Black Hat 2023', en: 'Black Hat 2023' },
  },
  {
    client: { ar: 'وزارة الصحة', en: 'Ministry of Health' },
    title:  {
      ar: 'جناح القطاع غير الربحي، معرض الصحة العالمي 2024',
      en: 'Non-Profit Sector Pavilion, Global Health Exhibition 2024',
    },
  },
  {
    client: { ar: 'وزارة التعليم', en: 'Ministry of Education' },
    title:  { ar: 'معرض التعليم', en: 'Education Exhibition' },
  },
  {
    client: { ar: 'تراكس', en: 'TRAX' },
    title:  { ar: 'الرياض', en: 'Riyadh' },
  },
]

export const workIntro = {
  eyebrow: { ar: 'أعمالنا', en: 'Our Work' },
  lead: {
    ar: 'من كأس السعودية إلى المعارض الدولية، ومن أجنحة الوزارات إلى احتفالات الشركات: مشاريع نفخر بأن نرويها كما صنعناها.',
    en: 'From the Saudi Cup to international exhibitions, ministry pavilions to corporate celebrations: projects we are proud to tell the way we built them.',
  },
  note: {
    ar: 'كل مشروع في هذه الصفحات نُفِّذ بفريقنا الداخلي — تصميمًا وتصنيعًا وتشغيلًا.',
    en: 'Every project on these pages was delivered by our in-house team — design, fabrication, and operations.',
  },
}
