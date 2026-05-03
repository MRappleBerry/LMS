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

export function getSubjectMeta(subject) {
  return BOOK_CATALOG[subject] || null
}

export function getDefaultRoute() {
  return {
    subject: 'constitutional-law',
    chapterId: '1',
  }
}

export async function loadChapterContent(subject, chapterId) {
  const key = `./books/${subject}/chapter-${chapterId}.json`
  const loader = chapterModules[key]
  if (!loader) return null
  const mod = await loader()
  return mod.default || mod
}
