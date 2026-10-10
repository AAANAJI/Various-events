// The portfolio — 22 projects, from the client's approved copy deck.
//
// One file feeds both outputs: the website's work pages and the printed
// profile. Two rules from the client's feedback are built into the data
// rather than left to the templates:
//
//   • No project carries a year or a location field. A project is not tied to
//     a date or a place; where an edition name includes one ("Global Health
//     Exhibition 2024") it is part of the name, not metadata. Two titles the
//     copy deck gave as client + city ("Sinclair — Riyadh", "TRAX — Riyadh
//     Exhibition") are titled by what was delivered instead.
//   • Every figure uses Western digits, in Arabic as well as English.
//
// `image: null` means no photograph has been supplied yet. Both outputs
// render a branded panel in its place, so a missing photo never reads as a
// broken layout; dropping a JPEG into assets/img and naming it here is the
// whole fix.
//
// `client` is the roster name in content/clients.mjs, so the clients page can
// link each name to its work. It is null where the copy deck does not name a
// contracting client.

export const categories = [
  {
    id: 'exhibitions',
    title: { ar: 'المعارض والأجنحة', en: 'Exhibitions & Pavilions' },
    note: {
      ar: 'ثلاثة من هذه الأجنحة نُفِّذت في نسخة واحدة من معرض الصحة العالمي 2024 — لثلاث جهات مختلفة.',
      en: 'Three of these stands were delivered at a single edition of the Global Health Exhibition 2024 — for three different clients.',
    },
  },
  {
    id: 'conferences',
    title: { ar: 'المؤتمرات والاجتماعات', en: 'Conferences & Meetings' },
  },
  {
    id: 'ceremonies',
    title: { ar: 'الاحتفالات وفعاليات الشركات', en: 'Ceremonies & Corporate Events' },
  },
]

export const projects = [
  {
    slug: 'moh-nonprofit-pavilion',
    image: null,
    category: 'exhibitions',
    client: "وزارة الصحة",
    title: {
      ar: "وزارة الصحة — جناح القطاع الصحي غير الربحي، معرض الصحة العالمي 2024",
      en: "Ministry of Health — Non-Profit Healthcare Pavilion, Global Health Exhibition 2024",
    },
    text: {
      ar: "شاركت وزارة الصحة في معرض الصحة العالمي 2024 بالرياض بجناح القطاع الصحي غير الربحي، الذي أبرز المبادرات الصحية الهادفة لتعزيز الاستدامة. صمّمنا الجناح ونفّذناه، مع الضيافة والتغطية الإعلامية.",
      en: "The Ministry of Health took part in the Global Health Exhibition 2024 in Riyadh with its Non-Profit Healthcare Sector pavilion, spotlighting purpose-driven health initiatives. We designed and delivered the pavilion, with hospitality and media coverage.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "تغطية إعلامية", en: "Media coverage" }],
  },
  {
    slug: 'health-endowment-fund',
    image: 'health-endowment',
    category: 'exhibitions',
    client: "صندوق الوقف الصحي",
    title: {
      ar: "صندوق الوقف الصحي — مشروعان",
      en: "Health Endowment Fund — Two Projects",
    },
    text: {
      ar: "مشروعان مع صندوق الوقف الصحي: جناح تفاعلي في معرض الصحة العالمي 2024 يبرز الابتكار في القطاع الصحي، وجناح في برج الساعة بمكة المكرمة. صمّمنا الاثنين ونفّذناهما.",
      en: "Two projects with the Health Endowment Fund: an interactive stand at the Global Health Exhibition 2024 spotlighting innovation in the health sector, and a stand at the Clock Tower in Makkah. We designed and delivered both.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }, { ar: "جناح", en: "Stand" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "هدايا", en: "Gifts" }, { ar: "تغطية إعلامية", en: "Media coverage" }],
    parts: [
      {
        title: { ar: "معرض الصحة العالمي — الرياض", en: "Global Health Exhibition — Riyadh" },
        text: {
          ar: "جناح تفاعلي يبرز الابتكار في القطاع الصحي.",
          en: "An interactive stand spotlighting innovation in the health sector.",
        },
        scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "هدايا", en: "Gifts" }, { ar: "تغطية إعلامية", en: "Media coverage" }],
      },
      {
        title: { ar: "برج الساعة — مكة المكرمة", en: "Clock Tower — Makkah" },
        text: {
          ar: "جناح في أحد أكثر المواقع ازدحامًا في المملكة، بمتطلبات تركيب وتشغيل خاصة.",
          en: "A stand in one of the Kingdom's busiest locations, with its own installation and operating constraints.",
        },
        scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
      },
    ],
  },
  {
    slug: 'obeikan-health',
    image: null,
    category: 'exhibitions',
    client: "العبيكان",
    title: {
      ar: "العبيكان الصحية — معرض الصحة العالمي 2024",
      en: "Obeikan Health — Global Health Exhibition 2024",
    },
    text: {
      ar: "شاركت العبيكان الصحية في معرض الصحة العالمي 2024 بالرياض. صمّمنا جناحها ونفّذناه، مع الضيافة والتغطية الإعلامية — وهو ثالث جناح ننفّذه في النسخة نفسها.",
      en: "Obeikan Health took part in the Global Health Exhibition 2024 in Riyadh. We designed and delivered their stand, with hospitality and media coverage — the third stand we built at that same edition.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "تغطية إعلامية", en: "Media coverage" }],
  },
  {
    slug: 'moe-education-exhibition',
    image: null,
    category: 'exhibitions',
    client: "وزارة التعليم",
    title: {
      ar: "وزارة التعليم — معرض التعليم",
      en: "Ministry of Education — Education Exhibition",
    },
    text: {
      ar: "شاركت وزارة التعليم في معرض التعليم بجناح متكامل استعرض أبرز مبادراتها وبرامجها والتقنيات الداعمة للعملية التعليمية. نفّذنا الجناح.",
      en: "The Ministry of Education took part in the Education Exhibition with a full stand presenting its leading initiatives, programs, and the technologies behind them. We delivered the stand.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'ministry-of-culture',
    image: 'saudi-cup',
    category: 'exhibitions',
    client: "وزارة الثقافة",
    title: {
      ar: "وزارة الثقافة — أربعة مشاريع",
      en: "Ministry of Culture — Four Projects",
    },
    text: {
      ar: "أربعة مشاريع مع وزارة الثقافة عبر أربعة أنواع مختلفة من الأحداث — حدث رياضي ومعرض ومهرجان وفعالية.",
      en: "Four projects with the Ministry of Culture across four different event types — a sporting event, an exhibition, a festival, and a corporate event.",
    },
    types: [{ ar: "حدث رياضي", en: "Sporting event" }, { ar: "جناح معرض", en: "Exhibition stand" }, { ar: "مهرجان", en: "Festival" }, { ar: "فعالية", en: "Event" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "هدايا", en: "Gifts" }, { ar: "مضيفون", en: "Hosts" }],
    featured: true,
    parts: [
      {
        title: { ar: "كأس السعودية", en: "The Saudi Cup" },
        image: 'saudi-cup',
        text: {
          ar: "أحد أبرز الأحداث الرياضية في المملكة. صمّمنا تجهيزات الحدث ونفّذناها بالكامل.",
          en: "One of the Kingdom's landmark sporting events. We designed and delivered the full event build.",
        },
        scope: [{ ar: "حدث رياضي", en: "Sporting event" }, { ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
      },
      {
        title: { ar: "معرض الكتاب", en: "The Book Fair" },
        image: 'book-fair',
        text: {
          ar: "جناح الوزارة في معرض الكتاب: مساحات تحتفي بالمحتوى وتُيسّر حركة الزوار. صمّمناه ونفّذناه، ووفّرنا الهدايا والمضيفين.",
          en: "The Ministry's stand at the Book Fair: spaces that celebrate content and ease visitor flow. We designed and delivered it, and supplied gifts and hosts.",
        },
        scope: [{ ar: "جناح معرض", en: "Exhibition stand" }, { ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "هدايا", en: "Gifts" }, { ar: "مضيفون", en: "Hosts" }],
      },
      {
        title: { ar: "مهرجان الكليجا", en: "Kleija Festival" },
        image: 'kleija',
        text: {
          ar: "مهرجان بهوية مكانية تحتفي بالموروث وتجربة عائلية تنتقل بين الأجنحة والمسرح ومناطق التفاعل. صمّمناه ونفّذناه، ووفّرنا الهدايا والمضيفين.",
          en: "A festival with a sense of place that celebrates heritage, and a family experience moving between stalls, stage, and interaction zones. We designed and delivered it, and supplied gifts and hosts.",
        },
        scope: [{ ar: "مهرجان", en: "Festival" }, { ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "هدايا", en: "Gifts" }, { ar: "مضيفون", en: "Hosts" }],
      },
      {
        title: { ar: "يوم خصوصية البيانات", en: "Data Privacy Day" },
        image: 'data-privacy',
        text: {
          ar: "فعالية توعوية بمناطق تفاعلية قرّبت موضوعًا تقنيًا من جمهور واسع. صمّمناها ونفّذناها.",
          en: "An awareness event with interaction zones that made a technical subject accessible to a broad audience. We designed and delivered it.",
        },
        scope: [{ ar: "فعالية", en: "Event" }, { ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
      },
    ],
  },
  {
    slug: 'saso-boulevard-city',
    image: 'saso',
    category: 'exhibitions',
    client: "الهيئة السعودية للمواصفات والمقاييس والجودة",
    title: {
      ar: "الهيئة السعودية للمواصفات — بوليفارد سيتي",
      en: "SASO — Boulevard City",
    },
    text: {
      ar: "حضرت الهيئة السعودية للمواصفات والمقاييس والجودة في بوليفارد سيتي بالرياض بجناح يوصل رسائل الجودة والمطابقة إلى جمهور عام. صمّمنا الجناح ونفّذناه — بناء في وجهة مفتوحة لا في قاعة معارض، بمتطلبات تركيب وسلامة مختلفة.",
      en: "The Saudi Standards, Metrology and Quality Organization was present at Boulevard City, Riyadh, with a stand carrying quality and conformity messages to a general audience. We designed and delivered it — a build in an open destination rather than an exhibition hall, with a different set of installation and safety requirements.",
    },
    types: [{ ar: "جناح", en: "Stand" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
    featured: true,
  },
  {
    slug: 'snood-hotels',
    image: null,
    category: 'exhibitions',
    client: "فنادق سنود",
    title: {
      ar: "فنادق سنود — أربع مشاركات في ثلاث سنوات",
      en: "Snood Hotels — Four Participations in Three Years",
    },
    text: {
      ar: "شراكة ممتدة مع فنادق سنود عبر أربع مشاركات في ثلاث سنوات، امتدّت عبر تغيير هوية العميل: نسختان من معرض الحج والعمرة بجدة سوبر دوم — تضمّنت نسخة 2025 تدشينًا — ونسختان من منتدى العمرة والزيارة. صمّمنا الأجنحة الأربعة ونفّذناها، ونال جناح 2026 جائزة أفضل جناح في المنتدى.",
      en: "An extended partnership with Snood Hotels across four participations in three years, spanning a change in the client's brand identity: two editions of the Hajj & Umrah Expo at Jeddah Super Dome — the 2025 edition including a launch — and two editions of the Umrah & Ziyarah Forum. We designed and delivered all four stands, and the 2026 stand was awarded Best Booth at the forum.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "تدشين", en: "Launch" }],
    award: { ar: "جائزة أفضل جناح · منتدى العمرة والزيارة 2026", en: 'Best Booth · Umrah & Ziyarah Forum 2026' },
    parts: [
      {
        title: { ar: "معرض الحج والعمرة — جدة سوبر دوم", en: "Hajj & Umrah Expo — Jeddah Super Dome" },
        group: { ar: "الهوية القديمة", en: "Previous identity" },
        scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
      },
      {
        title: { ar: "منتدى العمرة والزيارة", en: "Umrah & Ziyarah Forum" },
        scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
      },
      {
        title: { ar: "معرض الحج والعمرة — جدة سوبر دوم", en: "Hajj & Umrah Expo — Jeddah Super Dome" },
        group: { ar: "الهوية الجديدة", en: "New identity" },
        scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "تدشين", en: "Launch" }],
      },
      {
        title: { ar: "منتدى العمرة والزيارة", en: "Umrah & Ziyarah Forum" },
        award: { ar: "جائزة أفضل جناح", en: "Best Booth" },
        scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }],
      },
    ],
  },
  {
    slug: 'btc-networks-black-hat',
    image: null,
    category: 'exhibitions',
    client: "بُعد للاتصالات",
    title: {
      ar: "بُعد للاتصالات — معرض Black Hat",
      en: "BTC Networks — Black Hat MEA",
    },
    text: {
      ar: "شاركت بُعد للاتصالات في معرض Black Hat بالرياض، أكبر تجمّع للأمن السيبراني في المنطقة. صمّمنا جناحها ونفّذناه بشاشات منحنية، مع الضيافة والتغطية الإعلامية.",
      en: "BTC Networks took part in Black Hat MEA in Riyadh, the region's largest cybersecurity gathering. We designed and delivered their stand with curved screens, plus hospitality and media coverage.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "تغطية إعلامية", en: "Media coverage" }, { ar: "شاشات منحنية", en: "Curved screens" }],
  },
  {
    slug: 'mindware-black-hat',
    image: null,
    category: 'exhibitions',
    client: "مايندوير",
    title: {
      ar: "مايندوير — معرض Black Hat",
      en: "Mindware — Black Hat MEA",
    },
    text: {
      ar: "شاركت مايندوير في معرض Black Hat 2023 بالرياض بجناح عرضت فيه حلولها في الأمن السيبراني. نفّذنا الجناح — ثاني جناح ننفّذه في هذا المعرض.",
      en: "Mindware took part in Black Hat MEA 2023 in Riyadh with a stand presenting its cybersecurity solutions. We delivered it — the second stand we have built at this show.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'nova-medical',
    image: 'nova-medical',
    category: 'exhibitions',
    client: "نوفا الطبية",
    title: {
      ar: "نوفا الطبية",
      en: "Nova Medical",
    },
    text: {
      ar: "شاركت نوفا لطب الأسنان في معرض الطب التجميلي بجناح استعرضت فيه أحدث تقنيات المجال. نفّذنا الجناح.",
      en: "Nova Dental took part in the Aesthetic Medicine Exhibition with a stand presenting the field's latest techniques. We delivered it.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'sera-leap',
    image: null,
    category: 'exhibitions',
    client: "سيرا",
    title: {
      ar: "سيرا — مؤتمر LEAP",
      en: "Sera — LEAP",
    },
    text: {
      ar: "شاركت سيرا في مؤتمر LEAP 2023 بمركز الرياض فرونت، وعرضت حلولها في السفر والسياحة. نفّذنا جناحها.",
      en: "Sera took part in LEAP 2023 at Riyadh Front Exhibition Center, presenting its travel and tourism solutions. We delivered their stand.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'trax',
    image: null,
    category: 'exhibitions',
    client: "تراكس",
    title: {
      ar: "تراكس — جناح معرض",
      en: "TRAX — Exhibition Stand",
    },
    text: {
      ar: "شاركت تراكس في أحد معارض الرياض بجناح عرضت فيه حلولها في التحول الرقمي والاستشارات التقنية. نفّذنا الجناح.",
      en: "TRAX took part in a Riyadh exhibition with a stand presenting its digital-transformation and technology-consulting solutions. We delivered it.",
    },
    types: [{ ar: "جناح معرض", en: "Exhibition stand" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'hayat-mall',
    image: 'hayat-mall',
    category: 'exhibitions',
    client: "حياة مول",
    title: {
      ar: "حياة مول — مشروعان",
      en: "Hayat Mall — Two Projects",
    },
    text: {
      ar: "مشروعان مع إدارة حياة مول بالرياض: جناح موسمي، وتجهيزات رمضان. نفّذنا الاثنين.",
      en: "Two projects with Hayat Mall management in Riyadh: a seasonal stand, and the Ramadan build. We delivered both.",
    },
    types: [{ ar: "جناح", en: "Stand" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
    parts: [
      {
        title: { ar: "جناح موسمي", en: "Seasonal stand" },
        text: {
          ar: "جناح بتخطيط لحركة الزوار يناسب مساحة تجارية مفتوحة.",
          en: "A stand with visitor-flow planning suited to an open retail space.",
        },
        scope: [{ ar: "تنفيذ", en: "Delivery" }],
      },
      {
        title: { ar: "تجهيزات رمضان", en: "Ramadan build" },
        text: {
          ar: "تجهيز المول لموسم رمضان.",
          en: "The mall's Ramadan seasonal build.",
        },
        scope: [{ ar: "تنفيذ", en: "Delivery" }],
      },
    ],
  },
  {
    slug: 'regional-hq-dialogues',
    image: null,
    category: 'conferences',
    client: "برنامج المقرات الإقليمية",
    title: {
      ar: "برنامج المقرات الإقليمية — الحوارات",
      en: "Saudi Regional Headquarters Program — Dialogues",
    },
    text: {
      ar: "حوارات برنامج المقرات الإقليمية. نفّذنا الفعالية.",
      en: "The Saudi Regional Headquarters Program Dialogues. We delivered the event.",
    },
    types: [{ ar: "فعالية", en: "Event" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'tahakom-ceos-meeting',
    image: 'tahakom',
    category: 'conferences',
    client: "شركة تحكم التقنية",
    title: {
      ar: "شركة تحكم التقنية — اجتماع الرؤساء التنفيذيين",
      en: "Technology Control Company — CEOs Meeting",
    },
    text: {
      ar: "عقدت شركة تحكم التقنية اجتماع رؤسائها التنفيذيين في لقاء رفيع المستوى. صمّمنا الاجتماع ونفّذناه وشغّلناه، بالضيافة والهدايا، وبتشغيل يراعي خصوصية اللقاء.",
      en: "Technology Control Company held its CEOs Meeting as a senior-level gathering. We designed, delivered, and ran it, with hospitality and gifts, and ran it with the discretion the meeting required.",
    },
    types: [{ ar: "اجتماع", en: "Meeting" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "تشغيل", en: "Operations" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "هدايا", en: "Gifts" }],
  },
  {
    slug: 'investment-forum',
    image: 'investment-forum',
    category: 'conferences',
    client: null,
    title: {
      ar: "الملتقى الدولي للاستثمار",
      en: "International Investment Forum",
    },
    text: {
      ar: "الملتقى الدولي للاستثمار في المملكة. نفّذنا أعمال تجهيز ضمن الملتقى.",
      en: "The International Investment Forum in the Kingdom. We delivered build works within the forum.",
    },
    types: [{ ar: "مؤتمر", en: "Conference" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'sinclair',
    image: 'sinclair',
    category: 'conferences',
    client: "سنكلير",
    title: {
      ar: "سنكلير — مؤتمر متخصص",
      en: "Sinclair — Specialist Conference",
    },
    text: {
      ar: "عقدت سنكلير مؤتمرًا متخصصًا في الرياض بجلسات وورش عمل في مجال التجميل الطبي. نفّذنا المؤتمر: قاعة الجلسات وورش العمل وبيئة العرض والضيافة.",
      en: "Sinclair held a specialist conference in Riyadh with sessions and workshops in medical aesthetics. We delivered it: the session hall, the workshops, the presentation environment, and hospitality.",
    },
    types: [{ ar: "مؤتمر", en: "Conference" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'passports-founding-day',
    image: null,
    category: 'ceremonies',
    client: "المديرية العامة للجوازات",
    title: {
      ar: "المديرية العامة للجوازات — يوم التأسيس",
      en: "General Directorate of Passports — Founding Day",
    },
    text: {
      ar: "احتفت المديرية العامة للجوازات بيوم التأسيس. صمّمنا الاحتفاء ونفّذناه وشغّلناه.",
      en: "The General Directorate of Passports marked Founding Day. We designed, delivered, and ran the celebration.",
    },
    types: [{ ar: "احتفالية", en: "Celebration" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "تشغيل", en: "Operations" }],
  },
  {
    slug: 'tahakom-great-place-to-work',
    image: null,
    category: 'ceremonies',
    client: "شركة تحكم التقنية",
    title: {
      ar: "شركة تحكم التقنية — حفل أفضل بيئة عمل",
      en: "Technology Control Company — Great Place to Work",
    },
    text: {
      ar: "احتفلت شركة تحكم التقنية بحصولها على اعتماد أفضل بيئة عمل. صمّمنا الحفل ونفّذناه وشغّلناه، بالضيافة والهدايا — ثاني عمل ننفّذه للشركة بعد اجتماع الرؤساء التنفيذيين.",
      en: "Technology Control Company celebrated its Great Place to Work certification. We designed, delivered, and ran the event, with hospitality and gifts — our second delivery for the company after the CEOs Meeting.",
    },
    types: [{ ar: "احتفالية", en: "Celebration" }],
    scope: [{ ar: "تصميم", en: "Design" }, { ar: "تنفيذ", en: "Delivery" }, { ar: "تشغيل", en: "Operations" }, { ar: "ضيافة", en: "Hospitality" }, { ar: "هدايا", en: "Gifts" }],
  },
  {
    slug: 'media-excellence-award',
    image: 'media-award',
    category: 'ceremonies',
    client: null,
    title: {
      ar: "جائزة التميز الإعلامي",
      en: "Media Excellence Award",
    },
    text: {
      ar: "جائزة سنوية تحتفي بالأعمال الإعلامية الإبداعية وتكرّم المؤسسات والشخصيات ذات الأثر، أُقيمت نسختها الخامسة بالشراكة مع برنامج تنمية القدرات البشرية. نفّذنا الحفل.",
      en: "An annual award celebrating creative media work and honoring institutions and individuals of distinctive impact, its fifth edition held in partnership with the Human Capability Development Program. We delivered the ceremony.",
    },
    types: [{ ar: "حفل جوائز", en: "Awards ceremony" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
  {
    slug: 'retal-annual-ceremony',
    image: 'retal',
    category: 'ceremonies',
    client: "رتال العقارية",
    title: {
      ar: "رتال العقارية — الحفل السنوي",
      en: "Retal — Annual Ceremony",
    },
    text: {
      ar: "أقامت رتال العقارية حفلها السنوي. نفّذنا الحفل.",
      en: "Retal held its annual ceremony. We delivered the event.",
    },
    types: [{ ar: "احتفالية", en: "Celebration" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
    featured: true,
  },
  {
    slug: 'sab-founding-day',
    image: 'sab-founding-day',
    category: 'ceremonies',
    client: "البنك الأول",
    title: {
      ar: "البنك الأول — يوم التأسيس",
      en: "SAB — Founding Day",
    },
    text: {
      ar: "احتفل البنك الأول بيوم التأسيس بتجربة تمزج الرموز التراثية بحضور العلامة. نفّذنا الاحتفال، بالضيافة والتوثيق البصري.",
      en: "SAB marked Founding Day with an experience weaving heritage symbols into the bank's brand presence. We delivered it, with hospitality and visual documentation.",
    },
    types: [{ ar: "احتفالية", en: "Celebration" }],
    scope: [{ ar: "تنفيذ", en: "Delivery" }],
  },
]

export const workIntro = {
  eyebrow: { ar: 'أعمالنا', en: 'Our Work' },
  lead: {
    ar: 'من كأس السعودية إلى المعارض الدولية، ومن أجنحة الوزارات إلى احتفالات الشركات.',
    en: 'From the Saudi Cup to international exhibitions, from ministry pavilions to corporate celebrations.',
  },
}

