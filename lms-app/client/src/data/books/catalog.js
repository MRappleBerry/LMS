export const BOOK_CATALOG = {
  'constitutional-law': {
    subject: 'constitutional-law',
    title: 'Constitutional Law I',
    shortTitle: 'Consti Law I',
    yearLevel: '1st Year',
    chapters: [
      {
        id: '1',
        title: 'Nature of the Constitution and Judicial Review',
        sections: [
          { id: '1-1', heading: 'Constitution as Fundamental Law', yearLevel: '1st Year' },
          { id: '1-2', heading: 'Judicial Review in Philippine Law', yearLevel: '1st Year' },
          { id: '1-3', heading: 'Requisites of Judicial Review', yearLevel: '1st Year' }
        ]
      },
      {
        id: '2',
        title: 'State Policies and Separation of Powers',
        sections: [
          { id: '2-1', heading: 'Philippine State Policies', yearLevel: '1st Year' },
          { id: '2-2', heading: 'Doctrine of Separation of Powers', yearLevel: '1st Year' },
          { id: '2-3', heading: 'Checks and Balances', yearLevel: '1st Year' }
        ]
      }
    ]
  },
  'obligations-and-contracts': {
    subject: 'obligations-and-contracts',
    title: 'Obligations and Contracts',
    shortTitle: 'ObliCon',
    yearLevel: '2nd Year',
    chapters: [
      {
        id: '1',
        title: 'Obligations: Sources and Essential Requisites',
        sections: [
          { id: '1-1', heading: 'Concept of Obligation', yearLevel: '2nd Year' },
          { id: '1-2', heading: 'Sources of Obligations', yearLevel: '2nd Year' },
          { id: '1-3', heading: 'Determinate and Generic Obligations', yearLevel: '2nd Year' }
        ]
      }
    ]
  }
}

const chapterModules = import.meta.glob('./books/*/chapter-*.json')

function toTitleCase(slug) {
  return (slug || '')
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getSubjectMeta(subject) {
  return BOOK_CATALOG[subject] || null
}

export function getAllSubjects() {
  return Object.values(BOOK_CATALOG)
}

export function getDefaultRoute() {
  return {
    subject: 'constitutional-law',
    chapterId: '1',
  }
}

export function buildDummyChapter(subject, chapterId) {
  const subjectMeta = getSubjectMeta(subject)
  const chapterMeta = subjectMeta?.chapters?.find(ch => String(ch.id) === String(chapterId))
  const chapterTitle = chapterMeta?.title || `Chapter ${chapterId} Draft Reading`
  const subjectTitle = subjectMeta?.title || toTitleCase(subject)

  return {
    subject,
    yearLevel: subjectMeta?.yearLevel || '1st Year',
    chapterId: String(chapterId),
    title: chapterTitle,
    isDummy: true,
    sections: [
      {
        id: `${chapterId}-1`,
        heading: 'Chapter Overview',
        yearLevel: subjectMeta?.yearLevel || '1st Year',
        difficulty: 'easy',
        barFrequency: 'medium',
        content: `This is a temporary structured chapter for ${subjectTitle}. The requested chapter does not yet have uploaded source content, so a dummy reading draft was generated to keep the reader usable.\n\nUse this section as a scaffold for inserting final doctrine text, codal anchors, and case references.`
      },
      {
        id: `${chapterId}-2`,
        heading: 'Core Doctrine Placeholder',
        yearLevel: subjectMeta?.yearLevel || '1st Year',
        difficulty: 'medium',
        barFrequency: 'high',
        content: 'Doctrine placeholder: identify the controlling legal principle, enumerate requisites, and define exceptions.\n\nSuggested structure:\n1. Legal basis\n2. Jurisprudential rule\n3. Policy rationale\n4. Common bar exam traps'
      },
      {
        id: `${chapterId}-3`,
        heading: 'Case and Bar Notes Placeholder',
        yearLevel: subjectMeta?.yearLevel || '1st Year',
        difficulty: 'hard',
        barFrequency: 'high',
        content: 'Insert landmark Philippine cases and one issue-spotting pattern per doctrine.\n\nExample format:\n- Facts\n- Issue\n- Ruling\n- Doctrine\n- Bar relevance'
      }
    ]
  }
}

export async function loadChapterContent(subject, chapterId) {
  const key = `./books/${subject}/chapter-${chapterId}.json`
  const loader = chapterModules[key]
  if (!loader) return buildDummyChapter(subject, chapterId)
  const mod = await loader()
  return mod.default || mod
}
