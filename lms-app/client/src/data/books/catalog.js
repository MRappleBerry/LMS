export const BOOK_CATALOG = {
  'constitutional-law': {
    subject: 'constitutional-law',
    title: 'Constitutional Law I',
    shortTitle: 'Consti Law I',
    chapters: [
      {
        id: '1',
        title: 'Nature of the Constitution and Judicial Review',
        sections: [
          { id: '1-1', heading: 'Constitution as Fundamental Law' },
          { id: '1-2', heading: 'Judicial Review in Philippine Law' },
          { id: '1-3', heading: 'Requisites of Judicial Review' }
        ]
      },
      {
        id: '2',
        title: 'State Policies and Separation of Powers',
        sections: [
          { id: '2-1', heading: 'Philippine State Policies' },
          { id: '2-2', heading: 'Doctrine of Separation of Powers' },
          { id: '2-3', heading: 'Checks and Balances' }
        ]
      }
    ]
  },
  'obligations-and-contracts': {
    subject: 'obligations-and-contracts',
    title: 'Obligations and Contracts',
    shortTitle: 'ObliCon',
    chapters: [
      {
        id: '1',
        title: 'Obligations: Sources and Essential Requisites',
        sections: [
          { id: '1-1', heading: 'Concept of Obligation' },
          { id: '1-2', heading: 'Sources of Obligations' },
          { id: '1-3', heading: 'Determinate and Generic Obligations' }
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
    chapterId: String(chapterId),
    title: chapterTitle,
    isDummy: true,
    sections: [
      {
        id: `${chapterId}-1`,
        heading: 'Chapter Overview',
        content: `This is a temporary structured chapter for ${subjectTitle}. The requested chapter does not yet have uploaded source content, so a dummy reading draft was generated to keep the reader usable.\n\nUse this section as a scaffold for inserting final doctrine text, codal anchors, and case references.`
      },
      {
        id: `${chapterId}-2`,
        heading: 'Core Doctrine Placeholder',
        content: 'Doctrine placeholder: identify the controlling legal principle, enumerate requisites, and define exceptions.\n\nSuggested structure:\n1. Legal basis\n2. Jurisprudential rule\n3. Policy rationale\n4. Common bar exam traps'
      },
      {
        id: `${chapterId}-3`,
        heading: 'Case and Bar Notes Placeholder',
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
