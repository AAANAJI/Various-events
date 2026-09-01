// One entry per service page.
//
// A note on provenance. The deck gives each service a single sentence. That
// sentence is rewritten here as web copy — shorter, front-loaded, addressed to
// a reader rather than a slide — and the capability list under each is the set
// of things that sentence already names, broken out so the page is scannable.
// No capability, claim or number has been invented; where the deck is silent,
// this file is silent.

export const services = [
  {
    slug: 'event-management',
    image: 'tahakom',
    title: { ar: 'تنظيم وإدارة الفعاليات', en: 'Event Management' },
    // The one line that has to land if the reader reads nothing else.
    lead: {
      ar: 'من الفكرة إلى إطفاء آخر ضوء — فريق واحد يملك القرار في كل مرحلة.',
      en: 'From the idea to the last light switched off — one team owning every decision along the way.',
    },
    body: [
      {
        ar: 'نبدأ من الهدف، لا من التجهيزات. نفهم الجمهور والرسالة ومؤشرات النجاح، ثم نبني عليها الخطة والجدول والميزانية.',
        en: 'We start from the objective, not the equipment. We establish the audience, the message and what success looks like, then build the plan, the schedule and the budget on top of that.',
      },
      {
        ar: 'وفي يوم الحدث، يدير فريقنا الميداني التشغيل لحظة بلحظة — بموردين نتعاقد معهم نحن، وبروتوكول نضبطه نحن، ومسؤولية واحدة واضحة أمامكم.',
        en: 'On show day our field team runs operations minute by minute — with suppliers we contract, protocol we manage, and a single line of accountability back to you.',
      },
    ],
    capabilities: [
      { ar: 'التخطيط والجداول الزمنية', en: 'Planning and schedules' },
      { ar: 'إعداد الميزانيات ومتابعتها', en: 'Budgeting and cost control' },
      { ar: 'إدارة الموردين والتعاقدات', en: 'Supplier and contract management' },
      { ar: 'إدارة البروتوكول', en: 'Protocol management' },
      { ar: 'التشغيل الميداني يوم الحدث', en: 'On-site operations on show day' },
    ],
    matchTags: ['إدارة حدث', 'فعالية تنفيذية', 'إنتاج', 'حفل'],
  },
  {
    slug: 'exhibition-stands',
    image: 'book-fair',
    title: { ar: 'أجنحة المعارض', en: 'Exhibition Stands & Pavilions' },
    lead: {
      ar: 'جناح يُبنى في مصنعنا، لا يُجمَّع من قطع جاهزة.',
      en: 'A stand built in our own workshop, not assembled from off-the-shelf parts.',
    },
    body: [
      {
        ar: 'نصمم ونصنّع ونركّب أجنحة المعارض والأجنحة الوطنية — من الرسم الأول إلى التسليم، داخل فاريوس بالكامل.',
        en: 'We design, fabricate and install exhibition stands and national pavilions — from the first sketch to handover, entirely in-house.',
      },
      {
        ar: 'هذا التكامل يعني أن التعديل في التصميم لا يمر عبر ثلاثة أطراف قبل أن يصل إلى ورشة التصنيع، وأن ما اعتُمد على الورق هو ما يقف في الموقع.',
        en: 'That integration means a design change does not travel through three parties before it reaches the workshop — and that what was approved on paper is what stands on the floor.',
      },
    ],
    capabilities: [
      { ar: 'التصميم والتصور ثلاثي الأبعاد', en: 'Design and 3D visualisation' },
      { ar: 'المخططات التنفيذية', en: 'Technical drawings' },
      { ar: 'التصنيع', en: 'Fabrication' },
      { ar: 'التركيب والتسليم', en: 'Installation and handover' },
      { ar: 'الأجنحة الوطنية والمشاركات الدولية', en: 'National pavilions and international showings' },
    ],
    matchTags: ['جناح', 'جناح معرض', 'تصنيع', 'تنفيذ'],
  },
  {
    slug: 'creative-design',
    image: 'kleija',
    title: { ar: 'التصميم الإبداعي والسينوغرافيا', en: 'Creative Design & Scenography' },
    lead: {
      ar: 'لكل عميل قصة مختلفة، فنصمم لكل حدث تجربة لا تشبه سواها.',
      en: 'Every client has a different story, so every event gets an experience of its own.',
    },
    body: [
      {
        ar: 'نبني للحدث هوية بصرية خاصة به، ونترجمها إلى مجسمات وديكورات ومسارات حركة تصنع إحساسًا بالمكان.',
        en: 'We give the event a visual identity of its own, then translate it into set pieces, décor and circulation that create a sense of place.',
      },
      {
        ar: 'ونصمم داخلها لحظات تُلتقط وتُشارك — لأن أثر الحدث لا ينتهي عند بابه.',
        en: 'And we design moments inside it that people capture and share — because an event’s reach does not stop at its doors.',
      },
    ],
    capabilities: [
      { ar: 'هوية بصرية للحدث', en: 'Event visual identity' },
      { ar: 'المجسمات والديكورات', en: 'Set pieces and décor' },
      { ar: 'صناعة المكان ومسارات الزوار', en: 'Placemaking and visitor flow' },
      { ar: 'التجارب التفاعلية', en: 'Interactive experiences' },
    ],
    matchTags: ['تصميم', 'صناعة مكان', 'تفاعلي', 'مناطق تفاعلية', 'تصميم وتنفيذ'],
  },
  {
    slug: 'technical-production',
    image: 'sinclair',
    title: { ar: 'الإنتاج الفني والتجهيزات', en: 'Technical Production' },
    lead: {
      ar: 'هندسة عرض متكاملة، تُصمَّم وتُشغَّل بأعلى معايير السلامة.',
      en: 'Integrated show engineering, designed and operated to the highest safety standards.',
    },
    body: [
      {
        ar: 'مسارح وإضاءة وصوت وشاشات — تُخطَّط كمنظومة واحدة من البداية، لا كعناصر تُجمع في اللحظة الأخيرة.',
        en: 'Staging, lighting, sound and screens — planned as one system from the outset, not as elements gathered at the last minute.',
      },
      {
        ar: 'السلامة عندنا شرط تصميم قبل أن تكون إجراءً في الموقع: الأحمال والمسارات والمخارج تُحسب في المرحلة الهندسية.',
        en: 'Safety is a design constraint before it is a site procedure: loads, routes and exits are calculated at the engineering stage.',
      },
    ],
    capabilities: [
      { ar: 'المسارح والمنصات', en: 'Staging and platforms' },
      { ar: 'الإضاءة', en: 'Lighting' },
      { ar: 'الصوت', en: 'Sound' },
      { ar: 'الشاشات وأنظمة العرض', en: 'Screens and display systems' },
      { ar: 'التشغيل وفق معايير السلامة', en: 'Operation to safety standards' },
    ],
    matchTags: ['إنتاج', 'تجهيز', 'مؤتمر', 'تجهيز ملتقى', 'تجهيز مهرجان'],
  },
  {
    slug: 'studio-content',
    image: 'team-crew',
    title: { ar: 'الاستوديو والمحتوى', en: 'Studio & Content' },
    lead: {
      ar: 'كل مشروع يخرج بأرشيف بصري وفيلم توثيقي — دليل عمل، لا مجرد وعود.',
      en: 'Every project leaves with a visual archive and a documentary film — proof of work, not promises.',
    },
    body: [
      {
        ar: 'استوديو داخلي يوثّق مشاريعنا ويُنتج محتوى الفعالية: أفلامًا وتصويرًا ومحتوى رقميًا، من الكواليس إلى الفيلم الختامي.',
        en: 'An in-house studio documents our projects and produces the event’s own content: film, photography and digital, from behind the scenes to the final cut.',
      },
      {
        ar: 'وجود الاستوديو داخل الفريق هو ما يجعل التوثيق جزءًا من المشروع منذ يومه الأول، لا مهمة تُسند بعد انتهاء الحدث.',
        en: 'Having the studio inside the team is what makes documentation part of the project from day one, rather than a job commissioned after the event is over.',
      },
    ],
    capabilities: [
      { ar: 'الأفلام الوثائقية للفعاليات', en: 'Event documentary films' },
      { ar: 'التصوير الفوتوغرافي', en: 'Photography' },
      { ar: 'المحتوى الرقمي', en: 'Digital content' },
      { ar: 'أرشيف بصري كامل للمشروع', en: 'A complete visual archive per project' },
    ],
    matchTags: [],
  },
  {
    slug: 'hospitality',
    image: 'retal',
    title: { ar: 'الضيافة والترفيه', en: 'Hospitality & Entertainment' },
    lead: {
      ar: 'ضيافة تليق بمقام الحضور، وعروض تناسب جمهورهم.',
      en: 'Hospitality that matches the room, and shows that match its audience.',
    },
    body: [
      {
        ar: 'قوائم مدروسة وتجارب ضيافة تُبنى على طبيعة الحدث وعلى من يحضره — لا قائمة واحدة تُعاد في كل مناسبة.',
        en: 'Considered menus and hospitality built around the nature of the event and the people at it — not one menu repeated at every occasion.',
      },
      {
        ar: 'ونتولّى حجز المواهب والعروض التي تخدم برنامج الحدث بدل أن تزاحمه.',
        en: 'And we book the talent and performances that serve the programme rather than compete with it.',
      },
    ],
    capabilities: [
      { ar: 'تجارب الضيافة', en: 'Hospitality experiences' },
      { ar: 'إعداد القوائم', en: 'Menu curation' },
      { ar: 'حجز المواهب', en: 'Talent booking' },
      { ar: 'العروض والبرامج المصاحبة', en: 'Shows and supporting programmes' },
    ],
    matchTags: ['احتفالية', 'فعالية شركات', 'حفل', 'موسمي', 'تفعيل تجاري'],
  },
]

export const servicesIntro = {
  eyebrow: { ar: 'خدماتنا', en: 'Our Services' },
  lead: {
    ar: 'ست خدمات تحت سقف واحد. تُطلب مجتمعة أو منفردة — والنتيجة في الحالتين مسؤولية واحدة.',
    en: 'Six services under one roof. Take them together or separately — either way, accountability stays in one place.',
  },
  body: {
    ar: 'ما يتوزّع عادةً بين عدة شركاء نجمعه في فريق واحد: التخطيط، والتصميم، والتصنيع، والإنتاج الفني، والتشغيل، والتوثيق. هذا ما يمنح عملاءنا قرارات أسرع وجودة متسقة.',
    en: 'What is usually split across several partners we hold in one team: planning, design, fabrication, technical production, operations and documentation. That is what gives our clients faster decisions and consistent quality.',
  },
}
