const YEARS = [
  { id: 1, label: '1st Year' },
  { id: 2, label: '2nd Year' },
  { id: 3, label: '3rd Year' },
  { id: 4, label: '4th Year' },
]

const CURRICULUM = {
  subjects: [
    {
      id: 'constitutional-law',
      title: 'Constitutional Law I',
      year: 1,
      yearLevel: '1st Year',
      chapters: [
        {
          id: '1',
          title: 'Nature of the Constitution and Judicial Review',
          sections: [
            {
              id: '1-1',
              heading: 'Constitution as Fundamental Law',
              yearLevel: '1st Year',
              difficulty: 'easy',
              barFrequency: 'high',
              content: 'The Constitution is the fundamental and supreme law of the land. Every statute, executive issuance, and judicial act must conform to it.\n\nIn Philippine constitutional law, supremacy means that public authority is valid only when exercised within constitutional limits. Any governmental act inconsistent with the Constitution is void.',
              barExam: {
                frequency: 'High',
                commonTraps: ['Failing to state constitutional supremacy before analysis', 'Confusing constitutional validity with policy wisdom'],
                sampleAnswer: 'Begin with constitutional supremacy, identify the conflicting governmental act, apply the void-for-unconstitutionality principle, and conclude clearly.'
              },
              cases: [{ name: 'Angara v. Electoral Commission', doctrine: 'Judicial review and constitutional supremacy', facts: 'The Court recognized its duty to determine constitutional boundaries among branches.' }],
              quiz: {
                question: 'What is the strongest constitutional argument when a statute conflicts with the Constitution?',
                options: ['Congressional intent controls', 'Statute remains valid unless repealed', 'Constitution prevails and inconsistent law is void', 'Executive interpretation controls'],
                answerIndex: 2,
                explanation: 'Under constitutional supremacy, all laws must conform to the Constitution.'
              }
            },
            {
              id: '1-2',
              heading: 'Judicial Review in Philippine Law',
              yearLevel: '1st Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Judicial review is the power of courts to determine whether acts of the political branches comply with the Constitution. In the Philippine setting, this power is expressly recognized and reinforced by Article VIII of the 1987 Constitution.\n\nCourts exercise judicial review only when an actual case or controversy exists and constitutional adjudication is unavoidable.',
              barExam: {
                frequency: 'High',
                commonTraps: ['Discussing doctrine without requisites', 'Ignoring justiciability limitations'],
                sampleAnswer: 'Define judicial review, cite Article VIII, then test justiciability and lis mota before concluding.'
              },
              cases: [{ name: 'Francisco v. House of Representatives', doctrine: 'Expanded judicial power over grave abuse of discretion', facts: 'The Court examined constitutional limits in impeachment proceedings under expanded judicial review.' }],
              quiz: {
                question: 'Which constitutional provision strengthened judicial review in the Philippines?',
                options: ['Article II only', 'Article VIII expanded judicial power', 'Article VI legislative powers', 'Bill of Rights alone'],
                answerIndex: 1,
                explanation: 'Article VIII includes the expanded concept of judicial power and grave abuse review.'
              }
            },
            {
              id: '1-3',
              heading: 'Requisites of Judicial Review',
              yearLevel: '1st Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Philippine jurisprudence consistently requires: (1) actual case or controversy, (2) legal standing, (3) raised at the earliest opportunity, and (4) constitutional question as the lis mota of the case.\n\nThese requisites prevent courts from issuing advisory opinions and preserve separation of powers.',
              barExam: {
                frequency: 'High',
                commonTraps: ['Enumerating requisites but not applying to facts', 'Treating lis mota as optional'],
                sampleAnswer: 'Enumerate all four requisites, apply each one to facts, and conclude whether review is proper.'
              },
              cases: [{ name: 'Belgica v. Ochoa', doctrine: 'Application of standing and lis mota in constitutional challenges', facts: 'The Court discussed requisites in evaluating PDAF-related constitutional claims.' }],
              quiz: {
                question: 'Which is NOT a classic requisite of judicial review?',
                options: ['Actual case or controversy', 'Legal standing', 'Prior executive approval', 'Lis mota'],
                answerIndex: 2,
                explanation: 'Executive approval is not a judicial review requisite.'
              }
            }
          ]
        },
        {
          id: '2',
          title: 'State Policies and Separation of Powers',
          sections: [
            {
              id: '2-1',
              heading: 'Philippine State Policies',
              yearLevel: '1st Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'State policies in Article II articulate constitutional aspirations and guide public governance. Although many provisions are not self-executing, they inform statutory interpretation and constitutional reasoning.\n\nCourts may rely on state policies as interpretive principles when resolving ambiguity in constitutional and statutory texts.'
            },
            {
              id: '2-2',
              heading: 'Doctrine of Separation of Powers',
              yearLevel: '1st Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Governmental powers are distributed among the legislative, executive, and judicial departments. This distribution reduces concentration of authority and supports constitutional accountability.\n\nNo branch may arrogate powers constitutionally lodged in another branch, subject to constitutionally recognized overlaps.'
            },
            {
              id: '2-3',
              heading: 'Checks and Balances',
              yearLevel: '1st Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Checks and balances is the structural mechanism by which each branch can restrain excesses of the others. Examples include judicial review, legislative oversight, and executive veto.\n\nThe doctrine preserves constitutional equilibrium by ensuring that power is not absolute in any single department.'
            }
          ]
        }
      ]
    },
    {
      id: 'obligations-and-contracts',
      title: 'Obligations and Contracts',
      year: 2,
      yearLevel: '2nd Year',
      chapters: [
        {
          id: '1',
          title: 'Obligations: Sources and Essential Requisites',
          sections: [
            {
              id: '1-1',
              heading: 'Concept of Obligation',
              yearLevel: '2nd Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'An obligation is a juridical necessity to give, to do, or not to do. Under the Civil Code, obligations are enforceable relations between a debtor and creditor.\n\nThe legal tie creates enforceable rights and correlating duties, subject to statutory and jurisprudential limits.'
            },
            {
              id: '1-2',
              heading: 'Sources of Obligations',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Article 1157 of the Civil Code identifies five sources: law, contracts, quasi-contracts, delicts, and quasi-delicts.\n\nEach source has doctrinally distinct requisites and remedial consequences. Proper source identification is often decisive in legal analysis and pleading strategy.'
            },
            {
              id: '1-3',
              heading: 'Determinate and Generic Obligations',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'A determinate obligation refers to a specific object distinctly identified, while a generic obligation refers to a class or genus.\n\nThe distinction affects risk allocation, remedies for breach, and the extent of diligence required from the obligor.'
            }
          ]
        }
      ]
    }
  ]
}

function normalizeYear(value) {
  if (!value) return null
  if (/^[1-4]$/.test(String(value))) return Number(value)
  const map = { '1st year': 1, '2nd year': 2, '3rd year': 3, '4th year': 4 }
  return map[String(value).toLowerCase()] || null
}

function getYears() {
  return YEARS
}

function getSubjects(year) {
  const y = normalizeYear(year)
  const source = CURRICULUM.subjects
  const list = y ? source.filter(s => s.year === y) : source
  return list.map(s => ({
    id: s.id,
    title: s.title,
    year: s.year,
    yearLevel: s.yearLevel,
    chapterCount: s.chapters.length,
  }))
}

function getSubjectById(subjectId) {
  return CURRICULUM.subjects.find(s => s.id === subjectId) || null
}

function getChapters(subjectId) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null
  return {
    subject: subject.id,
    title: subject.title,
    year: subject.year,
    yearLevel: subject.yearLevel,
    chapters: subject.chapters.map(ch => ({
      id: ch.id,
      title: ch.title,
      sections: ch.sections.map(sec => ({
        id: sec.id,
        heading: sec.heading,
        yearLevel: sec.yearLevel,
        difficulty: sec.difficulty,
        barFrequency: sec.barFrequency,
      })),
    })),
  }
}

function getTopic(subjectId, chapterId) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null
  const chapter = subject.chapters.find(ch => String(ch.id) === String(chapterId))
  if (!chapter) return null
  return {
    subject: subject.id,
    subjectTitle: subject.title,
    year: subject.year,
    yearLevel: subject.yearLevel,
    chapterId: String(chapter.id),
    title: chapter.title,
    sections: chapter.sections,
  }
}

module.exports = {
  getYears,
  getSubjects,
  getChapters,
  getTopic,
}
