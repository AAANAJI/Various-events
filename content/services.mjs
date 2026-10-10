// Services, in the three parts the client's copy deck sets out:
//
//   1. Our Services — the kinds of event VARIOUS delivers.
//   2. Our Solutions — what goes into them, grouped by discipline.
//   3. For Exhibition Owners — services sold to the show organiser rather
//      than to an exhibitor.
//
// The deck's own guidance is "the full list on the website, filtered in
// print", so the website carries every item below and the printed profile
// carries a shorter selection. Digits are Western throughout, by the client's
// instruction.

export const servicesIntro = {
  eyebrow: { ar: 'خدماتنا', en: 'Our Services' },
  lead: {
    ar: 'نغطّي احتياج الحدث كاملًا — التخطيط والتصميم والتنفيذ والتشغيل.',
    en: "We cover an event's full requirement — planning, design, delivery, and operations.",
  },
}

/**
 * Part one. The deck names these and nothing more, so each carries a photograph
 * and a pointer to where the proof is — a category of work or a solution group —
 * rather than invented description.
 */
export const eventTypes = [
  {
    id: 'exhibitions',
    title: { ar: 'المعارض', en: 'Exhibitions' },
    image: 'book-fair',
    link: { route: 'work', hash: 'exhibitions' },
  },
  {
    id: 'conferences',
    title: { ar: 'المؤتمرات والملتقيات', en: 'Conferences & Forums' },
    image: 'sinclair',
    link: { route: 'work', hash: 'conferences' },
  },
  {
    id: 'festivals',
    title: { ar: 'المهرجانات والفعاليات الثقافية', en: 'Festivals & Cultural Events' },
    image: 'kleija',
    link: { route: 'work/ministry-of-culture' },
  },
  {
    id: 'meetings',
    title: { ar: 'الاجتماعات وورش العمل', en: 'Meetings & Workshops' },
    image: 'tahakom',
    link: { route: 'work/tahakom-ceos-meeting' },
  },
  {
    id: 'ceremonies',
    title: { ar: 'الاحتفالات وفعاليات الاتصال الداخلي', en: 'Ceremonies & Internal Communication Events' },
    image: 'retal',
    link: { route: 'work', hash: 'ceremonies' },
  },
  {
    id: 'technology',
    title: { ar: 'الأنظمة والحلول التقنية للفعاليات', en: 'Event Technology Systems & Solutions' },
    image: 'saso',
    link: { route: 'services/solutions', hash: 'technology' },
  },
]

/** The seventh service is a way of buying, not a kind of event, so it is set apart. */
export const frameworkAgreements = {
  title: { ar: 'العقود والاتفاقيات الإطارية', en: 'Framework Agreements' },
}

export const solutionsIntro = {
  eyebrow: { ar: 'حلولنا', en: 'Our Solutions' },
  lead: {
    ar: 'كل ما يحتاجه الحدث، من الاستشارة الأولى إلى التقرير الختامي — في أربعة عشر تخصصًا.',
    en: 'Everything an event needs, from the first consultation to the closing report — across fourteen disciplines.',
  },
}

export const solutions = [
  {
    id: 'planning',
    title: { ar: "التخطيط والاستشارات", en: "Planning & Consulting" },
    items: [
      { ar: "التخطيط ووضع التصور العام", en: "Planning and overall concept" },
      { ar: "الاستشارات قبل التعاقد", en: "Pre-contract consulting" },
      { ar: "تخطيط رحلة الضيوف", en: "Guest journey planning" },
      { ar: "تحديد مؤشرات النجاح", en: "Defining success measures" },
      { ar: "التصاريح والتنسيق مع الجهات", en: "Permits and coordination with authorities" },
    ],
  },
  {
    id: 'project-management',
    title: { ar: "إدارة المشاريع", en: "Project Management" },
    items: [
      { ar: "إدارة المشروع من التعاقد إلى التسليم", en: "Project management from contract to handover" },
      { ar: "الجداول الزمنية وخطط التنفيذ", en: "Timelines and delivery plans" },
      { ar: "إعداد الميزانيات ومتابعتها", en: "Budget preparation and control" },
      { ar: "إدارة المخاطر وخطط الطوارئ", en: "Risk management and contingency planning" },
      { ar: "إدارة التعديلات: استيعاب اليسير منها وتوثيق الجوهري قبل اعتماده", en: "Change management: minor changes absorbed, substantial ones documented before approval" },
      { ar: "ضبط الجودة والتفتيش قبل التسليم", en: "Quality control and pre-handover inspection" },
      { ar: "التقارير الدورية ومحاضر الاجتماعات", en: "Periodic reports and meeting minutes" },
    ],
  },
  {
    id: 'design',
    title: { ar: "التصميم والإبداع", en: "Design & Creative" },
    items: [
      { ar: "بناء التصور الفني للفعالية", en: "Building the event's creative concept" },
      { ar: "هوية الحدث البصرية ودليل تطبيقها", en: "Event visual identity and brand guidelines" },
      { ar: "تصميم الموقع وتوزيع المساحات ومسار الزائر", en: "Site design, space planning and visitor flow" },
      { ar: "التصميم ثنائي وثلاثي الأبعاد والمشاهد التخيلية", en: "2D and 3D design and visualizations" },
      { ar: "تصميم المسارح والديكورات", en: "Stage and décor design" },
      { ar: "الموشن جرافيك والأنيميشن", en: "Motion graphics and animation" },
      { ar: "صناعة المحتوى", en: "Content production" },
      { ar: "تصميم محتوى شاشات LED", en: "LED screen content design" },
      { ar: "تصميم واجهات الشاشات التفاعلية", en: "Interactive screen interface design" },
      { ar: "التصميم الجرافيكي ومواد الحدث", en: "Graphic design and event collateral" },
      { ar: "الماكيتات والنماذج الأولية", en: "Scale models and prototypes" },
    ],
  },
  {
    id: 'engineering',
    title: { ar: "الأعمال الهندسية", en: "Engineering" },
    items: [
      { ar: "المخططات التنفيذية والرسومات الهندسية", en: "Technical drawings and engineering plans" },
      { ar: "الحسابات الإنشائية وحسابات الأحمال", en: "Structural and load calculations" },
      { ar: "حسابات أحمال التعليق بالأسقف", en: "Ceiling rigging load calculations" },
      { ar: "مخططات الكهرباء والتوزيع", en: "Electrical and distribution drawings" },
      { ar: "الإشراف الهندسي في الموقع", en: "On-site engineering supervision" },
      { ar: "اعتمادات السلامة والمطابقة", en: "Safety and compliance approvals" },
    ],
  },
  {
    id: 'fabrication',
    title: { ar: "التصنيع وبناء الموقع", en: "Fabrication & Site Build" },
    items: [
      { ar: "أجنحة المعارض والأجنحة الوطنية", en: "Exhibition stands and national pavilions" },
      { ar: "المجسمات والديكورات", en: "Set pieces and décor" },
      { ar: "المسارح والمنصات", en: "Stages and platforms" },
      { ar: "أعمال النجارة", en: "Carpentry" },
      { ar: "أعمال الحدادة والهياكل المعدنية", en: "Metalwork and steel structures" },
      { ar: "القص بالليزر والـCNC", en: "Laser and CNC cutting" },
      { ar: "الأكريليك والخامات الخاصة", en: "Acrylic and specialty materials" },
      { ar: "الأعمال الكهربائية والتأسيس داخل الأجنحة", en: "Electrical works and in-stand installation" },
      { ar: "التشطيبات والدهانات", en: "Finishing and paintwork" },
      { ar: "التركيب في الموقع", en: "On-site installation" },
      { ar: "الفك والتسليم", en: "Tear-down and handover" },
    ],
  },
  {
    id: 'venue',
    title: { ar: "الموقع والبنية التحتية", en: "Venue & Site Infrastructure" },
    items: [
      { ar: "حجز القاعات ومواقع الفعاليات", en: "Venue and event site sourcing and booking" },
      { ar: "مولدات الكهرباء وتوزيعها", en: "Generators and power distribution" },
      { ar: "تأجير دورات المياه المتنقلة", en: "Portable restroom rental" },
      { ar: "التكييف والتبريد المتنقل", en: "Mobile cooling and air conditioning" },
      { ar: "الخيام والمظلات", en: "Tents and canopies" },
      { ar: "الحواجز والسياج وتنظيم المداخل", en: "Barriers, fencing and entrance control" },
      { ar: "الإنترنت والشبكات", en: "Internet and networks" },
    ],
  },
  {
    id: 'avl',
    title: { ar: "الصوتيات والشاشات والإضاءة", en: "AVL" },
    items: [
      { ar: "أنظمة الصوت والميكروفونات", en: "Sound and microphone systems" },
      { ar: "أنظمة الترجمة الفورية وكبائنها وسماعاتها", en: "Simultaneous interpretation systems, booths and headsets" },
      { ar: "شاشات LED بدقّات مختلفة (P1، P2 وغيرها)", en: "LED screens at various pitches (P1, P2 and others)" },
      { ar: "شاشات العرض ومنصات الفيديو", en: "Display screens and video walls" },
      { ar: "شاشات تاتش تفاعلية بجميع المقاسات", en: "Interactive touch screens in all sizes" },
      { ar: "أنظمة البروجكشن والماپينج", en: "Projection and mapping systems" },
      { ar: "إضاءة المسرح والعروض", en: "Stage and show lighting" },
      { ar: "إضاءة المواقع والواجهات", en: "Site and façade lighting" },
      { ar: "الإضاءة المتحركة والمؤثرات الضوئية", en: "Moving lights and lighting effects" },
      { ar: "أنظمة التحكم والبرمجة", en: "Control and programming systems" },
    ],
  },
  {
    id: 'technology',
    title: { ar: "الأنظمة التقنية المتطورة", en: "Advanced Technology Systems" },
    items: [
      { ar: "نفق العرض التفاعلي", en: "Interactive display tunnel" },
      { ar: "مكعب التدشين التفاعلي", en: "Interactive launch cube" },
      { ar: "منصة التدشين متعددة الشاشات", en: "Multi-screen launch podium" },
      { ar: "الشاشات الشفافة: أكشاك وروبوت متحرك", en: "Transparent screens: kiosks and mobile robot" },
      { ar: "جدار اللمس التفاعلي", en: "Interactive touch wall" },
      { ar: "أنابيب العرض المجسّم", en: "Holographic display tubes" },
      { ar: "مكعب التحكم بالمحتوى", en: "Content-control cube" },
      { ar: "الطاولة التفاعلية بالأقراص", en: "Interactive puck table" },
      { ar: "التحكم بالإيماءات دون لمس", en: "Touchless gesture control" },
      { ar: "المراوح الهولوجرامية", en: "Holographic fans" },
      { ar: "الشاشات المرنة والمنحنية", en: "Flexible and curved screens" },
      { ar: "الأرضيات التفاعلية", en: "Interactive floors" },
      { ar: "الواقع المعزز والافتراضي", en: "Augmented and virtual reality" },
      { ar: "وغيرها من التقنيات المتنوعة", en: "and other varied technologies" },
    ],
  },
  {
    id: 'agenda',
    title: { ar: "إدارة الأجندة والمتحدثين", en: "Agenda & Speaker Management" },
    items: [
      { ar: "إدارة الأجندة وجدول الجلسات", en: "Agenda and session scheduling" },
      { ar: "تطبيق الحدث والأجندة الرقمية", en: "Event app and digital agenda" },
      { ar: "استقطاب المتحدثين والتنسيق معهم", en: "Speaker sourcing and coordination" },
      { ar: "إدارة ورش العمل والجلسات المتوازية", en: "Workshop and parallel session management" },
      { ar: "إدارة الأنشطة والفقرات المصاحبة", en: "Activity and side-programme management" },
      { ar: "الحفلات الافتتاحية والختامية", en: "Opening and closing ceremonies" },
    ],
  },
  {
    id: 'protocol',
    title: { ar: "البروتوكول والمراسم", en: "Protocol & Ceremonial" },
    items: [
      { ar: "إدارة بروتوكول ومراسم كبار الشخصيات", en: "VIP protocol and ceremonial management" },
      { ar: "استقبال الوفود وتوديعها", en: "Delegation reception and send-off" },
      { ar: "حجز الطيران والفنادق", en: "Flight and hotel booking" },
      { ar: "تنقلات الوفود وإقامتهم", en: "Delegate transport and accommodation" },
      { ar: "إدارة الوفود والمشاركين", en: "Delegate and participant management" },
      { ar: "الهدايا التذكارية والدروع", en: "Commemorative gifts and awards" },
    ],
  },
  {
    id: 'crowd',
    title: { ar: "إدارة الحشود", en: "Crowd Management" },
    items: [
      { ar: "الإدارة والتشغيل الميداني", en: "Field management and operations" },
      { ar: "المنظمون والمضيفون", en: "Organizers and hosts" },
      { ar: "أنظمة تسجيل الزوار والحضور", en: "Visitor and attendance registration systems" },
      { ar: "التسجيل المسبق والتسجيل في الموقع", en: "Pre-registration and on-site registration" },
      { ar: "إصدار البطاقات والباجات", en: "Badge and pass issuing" },
      { ar: "الاستقبال والاستعلامات وخدمة الحضور", en: "Reception, information desks and attendee services" },
      { ar: "تنظيم مسارات الزوار والطوابير", en: "Visitor routing and queue management" },
      { ar: "التجليس وتنظيم المقاعد", en: "Seating and seat allocation" },
      { ar: "الأمن وتنظيم الدخول", en: "Security and access control" },
      { ar: "السلامة والإسعافات", en: "Safety and first aid" },
    ],
  },
  {
    id: 'hospitality',
    title: { ar: "الضيافة", en: "Hospitality" },
    items: [
      { ar: "القهوة العربية والتمور والضيافة التراثية", en: "Arabic coffee, dates and heritage hospitality" },
      { ar: "البوفيهات المفتوحة", en: "Open buffets" },
      { ar: "حفلات الغداء والعشاء الرسمية", en: "Formal lunch and dinner service" },
      { ar: "الكوفي بريك وفترات الاستراحة", en: "Coffee breaks and refreshments" },
      { ar: "عربات القهوة والباريستا المباشر", en: "Coffee carts and live barista" },
      { ar: "الكيك والحلويات المخصصة", en: "Custom cakes and desserts" },
      { ar: "خدمة كبار الضيوف ومجالس VIP", en: "VIP service and majlis settings" },
      { ar: "الضيافة المغلّفة بهوية الحدث", en: "Hospitality packaged in the event identity" },
      { ar: "الأطقم والمستلزمات", en: "Tableware and supplies" },
      { ar: "فرق الخدمة والتقديم", en: "Service and waiting teams" },
      { ar: "إدارة موردي الأطعمة والتصاريح الصحية", en: "Food supplier management and health permits" },
    ],
  },
  {
    id: 'advertising',
    title: { ar: "الدعاية والإعلان", en: "Advertising & Promotion" },
    items: [
      { ar: "الهدايا الترويجية والتوزيعات", en: "Promotional gifts and giveaways" },
      { ar: "الدروع والتحف التذكارية", en: "Awards, trophies and keepsakes" },
      { ar: "مجسمات الأكريليك والفوم", en: "Acrylic and foam sculptures" },
      { ar: "الطباعة بجميع أنواعها", en: "Printing of all types" },
      { ar: "طباعة البنرات واللوحات", en: "Banner and signage printing" },
      { ar: "الاستيكرات والفينيل", en: "Stickers and vinyl" },
      { ar: "البراندنج وتطبيق الهوية على الأسطح", en: "Branding and identity application" },
      { ar: "اللوحات الخارجية والإرشادية", en: "Outdoor and wayfinding signage" },
      { ar: "المطبوعات ومواد التعريف", en: "Print and informational collateral" },
      { ar: "شهادات الحضور وحقائب المشاركين", en: "Attendance certificates and delegate bags" },
    ],
  },
  {
    id: 'documentation',
    title: { ar: "التوثيق والتغطية الإعلامية", en: "Documentation & Media Coverage" },
    items: [
      { ar: "التصوير الفوتوغرافي", en: "Photography" },
      { ar: "تصوير الفيديو والأفلام", en: "Video and film production" },
      { ar: "التصوير الجوي بالدرون", en: "Aerial drone filming" },
      { ar: "البث المباشر", en: "Live streaming" },
      { ar: "التغطية الإعلامية والعلاقات مع الصحافة", en: "Media coverage and press relations" },
      { ar: "المونتاج والفيلم الختامي", en: "Editing and the closing film" },
      { ar: "استبيانات الرضا وقياس أثر الحدث", en: "Satisfaction surveys and event impact measurement" },
      { ar: "التقرير الختامي الموثّق", en: "The documented final report" },
    ],
  },
]

export const ownersIntro = {
  eyebrow: { ar: 'خدمات أصحاب المعارض', en: 'For Exhibition Owners' },
  lead: {
    ar: 'موجَّه لصاحب المعرض أو منظّمه.',
    en: 'For the show owner or organizer.',
  },
}

export const ownerServices = [
  {
    id: 'show-planning',
    title: { ar: "تخطيط المعرض", en: "Show Planning" },
    items: [
      { ar: "تخطيط المساحات وتوزيع الأجنحة", en: "Floor planning and stand allocation" },
      { ar: "مخططات الحركة ومسارات الطوارئ", en: "Circulation and emergency route plans" },
      { ar: "التنسيق مع إدارة الصالة والجهات الرسمية", en: "Coordination with venue management and authorities" },
      { ar: "التصاريح العامة للمعرض", en: "Show-wide permits" },
    ],
  },
  {
    id: 'stands',
    title: { ar: "الأجنحة والتأثيث", en: "Stands & Furnishing" },
    items: [
      { ar: "بوثات الأوكتانورم والشِل سكيم", en: "Octanorm and shell-scheme booths" },
      { ar: "لافتات الأجنحة وأرقامها", en: "Fascia signage and stand numbering" },
      { ar: "الأجنحة المخصصة للعارضين", en: "Custom-built exhibitor stands" },
      { ar: "تأجير الأثاث ووحدات العرض", en: "Furniture and display unit rental" },
      { ar: "السجاد والأرضيات", en: "Carpeting and flooring" },
      { ar: "تأجير النباتات والتنسيق", en: "Plant rental and landscaping" },
    ],
  },
  {
    id: 'infrastructure',
    title: { ar: "البنية التحتية والطاقة", en: "Infrastructure & Power" },
    items: [
      { ar: "التغذية الكهربائية الرئيسية للصالة", en: "Main hall power supply" },
      { ar: "مولدات الكهرباء", en: "Generators" },
      { ar: "شبكة الإنترنت للمعرض", en: "Show-wide internet network" },
      { ar: "تأجير دورات المياه المتنقلة", en: "Portable restroom rental" },
    ],
  },
  {
    id: 'identity',
    title: { ar: "هوية المعرض والطباعة", en: "Show Identity & Print" },
    items: [
      { ar: "البراندنج العام للمعرض", en: "Show-wide branding" },
      { ar: "اللوحات الإرشادية والتوجيهية", en: "Wayfinding and directional signage" },
      { ar: "الطباعة والتجهيزات", en: "Printing and collateral" },
      { ar: "دليل المعرض وكتالوج العارضين", en: "Show directory and exhibitor catalogue" },
    ],
  },
  {
    id: 'visitors',
    title: { ar: "خدمات الزوار", en: "Visitor Services" },
    items: [
      { ar: "أنظمة تسجيل الزوار والدخول", en: "Visitor registration and access systems" },
      { ar: "الاستقبال والاستعلامات العامة", en: "General reception and information" },
      { ar: "المنظمون والمضيفون", en: "Organizers and hosts" },
      { ar: "إدارة الحشود وتنظيم المسارات", en: "Crowd management and routing" },
      { ar: "إدارة مواقف السيارات والحركة الخارجية", en: "Parking and external traffic management" },
      { ar: "الأمن وتنظيم الدخول للصالة", en: "Security and hall access control" },
      { ar: "الإسعاف والطوارئ الطبية", en: "Medical and emergency response" },
    ],
  },
  {
    id: 'exhibitors',
    title: { ar: "خدمات العارضين", en: "Exhibitor Services" },
    items: [
      { ar: "تسجيل العارضين وإصدار بطاقاتهم", en: "Exhibitor registration and badge issuing" },
      { ar: "بوابة الخدمات الإلكترونية للعارضين", en: "Exhibitor online services portal" },
      { ar: "مكتب خدمة العارضين", en: "Exhibitor services desk" },
      { ar: "توصيلات الكهرباء والإنترنت للأجنحة", en: "Stand power and internet connections" },
      { ar: "خدمات التعليق بالأسقف", en: "Ceiling rigging services" },
      { ar: "الشحن والتخليص الجمركي للعارضين الدوليين", en: "Freight forwarding and customs clearance for international exhibitors" },
    ],
  },
  {
    id: 'operations',
    title: { ar: "التشغيل والنقل", en: "Operations & Transport" },
    items: [
      { ar: "النظافة العامة للصالة", en: "Hall-wide cleaning" },
      { ar: "الخدمات اللوجستية ونقل المعدات", en: "Logistics and equipment transport" },
      { ar: "الرافعات والفوركليفت ونقل الأحمال الثقيلة", en: "Cranes, forklifts and heavy load handling" },
      { ar: "التخزين", en: "Storage" },
      { ar: "فريق صيانة ميداني طوال أيام المعرض", en: "On-site maintenance team throughout the show" },
      { ar: "التركيب العام قبل المعرض", en: "Show-wide build-up" },
    ],
  },
  {
    id: 'closing',
    title: { ar: "الإغلاق والتقارير", en: "Closing & Reporting" },
    items: [
      { ar: "الفك والتسليم بعد المعرض", en: "Tear-down and handover after the show" },
      { ar: "إحصاءات الزوار وتقارير الحضور", en: "Visitor statistics and attendance reports" },
      { ar: "التقرير الختامي للمعرض", en: "Show closing report" },
    ],
  },
]
