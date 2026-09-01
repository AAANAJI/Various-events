// ═══════════════════════════════════════════════════════════════════════════
//  THE ONLY FILE THAT NEEDS EDITING TO PUBLISH THE NUMBERS.
//
//  The source deck ships this slide with every figure as a literal "X"
//  placeholder, so five of the six values below are null. Set a number and the
//  figure renders; leave it null and that tile renders a neutral em-dash with
//  its label intact, so the section never looks broken.
//
//  Example:  { ..., value: 12 }   →   "+١٢"  in Arabic, "12+" in English
// ═══════════════════════════════════════════════════════════════════════════

export const stats = [
  {
    id: 'years',
    value: null,          // ← years of experience
    plus: true,
    label: { ar: 'سنوات من الخبرة', en: 'Years of experience' },
  },
  {
    id: 'events',
    value: null,          // ← events & exhibitions delivered
    plus: true,
    label: { ar: 'فعالية ومعرضًا نفّذناها', en: 'Events & exhibitions delivered' },
  },
  {
    id: 'clients',
    value: null,          // ← government & private clients
    plus: true,
    label: { ar: 'عميلًا من القطاعين الحكومي والخاص', en: 'Government & private clients' },
  },
  {
    id: 'sectors',
    value: 9,             // derived from the nine sectors listed on the Sectors page
    plus: false,
    label: { ar: 'قطاعات نخدمها', en: 'Sectors served' },
  },
  {
    id: 'square-metres',
    value: null,          // ← m² of stands and sets fabricated
    plus: true,
    unit: { ar: 'م²', en: 'm²' },
    label: { ar: 'من الأجنحة والمجسمات المصنّعة', en: 'Of stands and sets fabricated' },
  },
  {
    id: 'team',
    value: null,          // ← specialists on the team
    plus: false,
    label: { ar: 'متخصصًا في فريقنا', en: 'Specialists on our team' },
  },
]

export const statsIntro = {
  eyebrow: { ar: 'فاريوس بالأرقام', en: 'VARIOUS in Numbers' },
}
