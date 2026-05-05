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
      description: 'Master constitutional structure, judicial review, and rights analysis through bar-focused doctrine and Philippine case method.',
      price: 1499,
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
      id: 'persons-and-family-relations',
      title: 'Persons and Family Relations',
      description: 'Understand civil personality, family law, marriage, parental authority, and support under the Family Code and Civil Code of the Philippines.',
      price: 1499,
      year: 1,
      yearLevel: '1st Year',
      chapters: [
        {
          id: '1',
          title: 'Civil Personality and Capacity to Act',
          sections: [
            {
              id: '1-1',
              heading: 'Civil Personality: Concept and Commencement',
              yearLevel: '1st Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'Civil personality is the aptitude to be the subject of legal relations. It commences at birth, but the conceived child is considered born for all purposes favorable to it, provided it is born later with conditions specified by law.\n\nNatural persons acquire civil personality at birth; juridical persons upon compliance with the law creating them.',
              barExam: { frequency: 'Medium', commonTraps: ['Forgetting the "conceived child" exception', 'Confusing civil personality with legal capacity'], sampleAnswer: 'State the rule on commencement of civil personality, apply the conceived child exception if applicable, and conclude on the rights available.' },
              cases: [{ name: 'Continental Steel v. Montano', doctrine: 'Civil personality of unborn child for favorable purposes', facts: 'The Court recognized benefits for the unborn child under the Labor Code in light of Article 40 of the Civil Code.' }],
              quiz: { question: 'Civil personality of a natural person commences:', options: ['Upon conception', 'At birth', 'Upon registration of birth', 'At age of majority'], answerIndex: 1, explanation: 'Under Article 40 of the Civil Code, civil personality commences at birth, though the conceived child enjoys limited capacity for favorable purposes.' }
            },
            {
              id: '1-2',
              heading: 'Capacity to Act and Restrictions',
              yearLevel: '1st Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'Capacity to act is the power to do acts with legal effect. It may be restricted by minority, insanity, civil interdiction, or other disabilities prescribed by law.\n\nMinors below 18 generally cannot validly enter contracts except for necessaries. Contracts entered by incapacitated persons are voidable, not void, unless expressly declared void by law.',
              barExam: { frequency: 'Medium', commonTraps: ['Treating contracts of minors as absolutely void', 'Forgetting that ratification upon reaching majority cures voidability'], sampleAnswer: 'Identify the incapacity, classify the resulting defect (voidable vs. unenforceable), and address the remedy of ratification or annulment.' },
              cases: [{ name: 'Sia v. CA', doctrine: 'Voidability of contracts entered by incapacitated persons', facts: 'The Court upheld the voidability (not nullity) of a contract entered by a minor, allowing ratification upon reaching majority.' }],
              quiz: { question: 'A contract entered by a minor is generally:', options: ['Void', 'Voidable', 'Unenforceable', 'Rescissible'], answerIndex: 1, explanation: 'Contracts entered by minors are voidable under Article 1390 of the Civil Code, not void. They may be ratified upon reaching majority.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Marriage: Requisites, Validity, and Void Marriages',
          sections: [
            {
              id: '2-1',
              heading: 'Essential and Formal Requisites of Marriage',
              yearLevel: '1st Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Under the Family Code, the essential requisites of marriage are: (1) legal capacity of the contracting parties who must be male and female, and (2) consent freely given in the presence of the solemnizing officer.\n\nFormal requisites are: (1) authority of the solemnizing officer, (2) a valid marriage license (except in cases specifically exempted), and (3) a marriage ceremony.',
              barExam: { frequency: 'High', commonTraps: ['Confusing essential requisites with formal requisites', 'Forgetting that absence of a formal requisite does not always void the marriage'], sampleAnswer: 'Classify the missing element (essential or formal), identify the consequence of absence, and conclude on the validity of the marriage.' },
              cases: [{ name: 'Ninal v. Bayadog', doctrine: 'Void marriage for lack of marriage license', facts: 'The Court declared a marriage void ab initio for failure to secure a valid marriage license, rejecting the claim of cohabitation exemption.' }],
              quiz: { question: 'Absence of a marriage license generally renders a marriage:', options: ['Voidable', 'Void ab initio', 'Valid but irregular', 'Unenforceable'], answerIndex: 1, explanation: 'Under Article 35 of the Family Code, a marriage contracted without a marriage license is void ab initio, subject to limited exceptions.' }
            },
            {
              id: '2-2',
              heading: 'Void and Voidable Marriages',
              yearLevel: '1st Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Void marriages are those specifically declared void by law (Articles 35, 36, 37, 38 of the Family Code) and produce no legal effect except as provided. A void marriage may be collaterally attacked.\n\nVoidable marriages are valid until annulled. Grounds include lack of parental consent, insanity, fraud, force, intimidation, undue influence, and impotence. Only the parties to the marriage may attack its validity in a direct proceeding.',
              barExam: { frequency: 'High', commonTraps: ['Confusing grounds for declaration of nullity with grounds for annulment', 'Using the wrong prescriptive periods for annulment actions'], sampleAnswer: 'Identify whether the ground makes the marriage void or voidable, determine the proper action (declaration of nullity vs. annulment), and state the applicable prescriptive period.' },
              cases: [{ name: 'Republic v. Molina', doctrine: 'Psychological incapacity under Article 36 standards', facts: 'The Court set strict guidelines for what constitutes psychological incapacity, requiring gravity, juridical antecedence, and incurability.' }],
              quiz: { question: 'Psychological incapacity as a ground to declare a marriage void under Article 36 must be:', options: ['Medically diagnosed only', 'Existing before the marriage, grave, and incurable', 'Proven by a psychiatrist in all cases', 'Manifested through infidelity'], answerIndex: 1, explanation: 'Following Molina and Tan-Andal, Article 36 incapacity must be existing before the marriage, grave, and incurable in the sense of being personally incapable of marital obligations.' }
            },
            {
              id: '2-3',
              heading: 'Property Relations Between Spouses',
              yearLevel: '1st Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'The default property regime under the Family Code is absolute community of property (ACP), under which all property owned by the spouses at the time of marriage and acquired thereafter becomes community property, subject to exceptions.\n\nConjugal partnership of gains (CPG) may be chosen by marriage settlement. Under CPG, the spouses retain separate ownership of property brought into the marriage; only fruits and gains during the marriage form the partnership.',
              barExam: { frequency: 'High', commonTraps: ['Applying CPG rules to ACP marriages and vice versa', 'Forgetting that personal obligations of one spouse do not bind the community or partnership property'], sampleAnswer: 'Identify the applicable property regime, classify the property (exclusive or community/conjugal), and apply the regime rules to the transaction or liability.' },
              cases: [{ name: 'Spouses Villanueva v. CA', doctrine: 'Personal debts and conjugal partnership liability', facts: 'The Court held that conjugal property cannot be held liable for personal obligations contracted by one spouse without the other\'s consent or benefit to the family.' }],
              quiz: { question: 'Under the absolute community of property regime, property owned before marriage is:', options: ['Community property by default', 'Exclusive property of the owner-spouse', 'Conjugal property', 'Subject to donation to the community automatically'], answerIndex: 1, explanation: 'Under Article 92 of the Family Code, property acquired before marriage is excluded from the community, along with property acquired by gratuitous title and personal items.' }
            }
          ]
        }
      ]
    },
    {
      id: 'obligations-and-contracts',
      title: 'Obligations and Contracts',
      description: 'Build deep command of obligations, contracts, and remedies with practical issue-spotting and codal anchoring.',
      price: 1699,
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
              content: 'A determinate obligation refers to a specific object distinctly identified, while a generic obligation refers to a class or genus.\n\nThe distinction affects risk allocation, remedies for breach, and the extent of diligence required from the obligor.',
              barExam: {
                frequency: 'High',
                commonTraps: ['Confusing determinate with determinable', 'Ignoring how genus never perishes rule applies'],
                sampleAnswer: 'Identify the object, classify as determinate or generic, apply the genus never perishes doctrine where relevant, and address remedies for breach.',
              },
              cases: [{ name: 'PNOC v. CA', doctrine: 'Generic obligation and fungibility of money', facts: 'The Court held that money, as a generic thing, can always be replaced and its loss does not extinguish the obligation.' }],
              quiz: { question: 'Under the "genus never perishes" rule, which obligation is extinguished by loss of the specific object?', options: ['Generic obligation', 'Determinate obligation', 'Both are extinguished', 'Neither; the law substitutes the object'], answerIndex: 1, explanation: 'Only a determinate obligation is extinguished when the specific object is lost without the debtor\'s fault.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Nature and Effects of Obligations',
          sections: [
            {
              id: '2-1',
              heading: 'Pure and Conditional Obligations',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'A pure obligation is one not subject to any condition or term and is immediately demandable. A conditional obligation is dependent on a future and uncertain event.\n\nConditions may be suspensive (the right arises upon fulfillment) or resolutory (the right is extinguished upon fulfillment).',
              barExam: { frequency: 'High', commonTraps: ['Confusing suspensive and resolutory conditions', 'Ignoring the retroactive effect of fulfilled conditions'], sampleAnswer: 'Classify the condition, determine whether suspensive or resolutory, apply retroactivity rule, and conclude on demandability.' },
              cases: [{ name: 'Gaite v. Fonacier', doctrine: 'Suspensive condition and benefit of the term', facts: 'The Court analyzed whether the condition in a mineral sales agreement was purely potestative and therefore void.' }],
              quiz: { question: 'A suspensive condition that depends solely on the will of the debtor is:', options: ['Valid', 'Void', 'Voidable', 'Unenforceable'], answerIndex: 1, explanation: 'A purely potestative suspensive condition depending on the debtor\'s will is void because it negates the obligatory character.' }
            },
            {
              id: '2-2',
              heading: 'Obligations with a Period',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'An obligation with a period has a fixed date or time for performance. The debtor cannot be compelled to perform before the period arrives, and the creditor cannot refuse performance after it lapses.\n\nCourts may fix the period when it is left to the will of the debtor or when its determination was intended but not fixed.',
              barExam: { frequency: 'Medium', commonTraps: ['Confusing period with suspensive condition', 'Forgetting Article 1198 grounds for losing the benefit of the period'], sampleAnswer: 'Identify the period, assess whether it is for the benefit of debtor or creditor, and apply Article 1198 if the benefit is lost.' },
              cases: [{ name: 'Borromeo v. CA', doctrine: 'Loss of benefit of the period', facts: 'The debtor\'s insolvency triggered the loss of the benefit of the period under Article 1198 of the Civil Code.' }],
              quiz: { question: 'When the debtor becomes insolvent after the period was granted, the creditor may demand performance:', options: ['Only after the original period lapses', 'Immediately under Article 1198', 'Never; insolvency does not affect the period', 'Only with court approval'], answerIndex: 1, explanation: 'Article 1198 allows the creditor to demand immediate performance when the debtor loses the benefit of the period due to insolvency.' }
            },
            {
              id: '2-3',
              heading: 'Breach of Obligations: Fraud, Negligence, and Delay',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Obligations may be breached through fraud (dolo), negligence (culpa), delay (mora), or contravention of tenor. Fraud is intentional evasion; negligence is omission of diligence required by the circumstances.\n\nMora solvendi (debtor\'s delay) requires demand unless demand is unnecessary by law, contract, or nature of the obligation.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting demand as a requisite of mora solvendi', 'Confusing culpa contractual with culpa aquiliana'], sampleAnswer: 'Identify the ground (fraud, negligence, delay), apply the corresponding liability standard, and state the remedies available including damages.' },
              cases: [{ name: 'Nakpil v. CA', doctrine: 'Concurrent causes and obligation liability', facts: 'Architect and contractor were held solidarily liable where negligence in design and construction concurred to cause building collapse.' }],
              quiz: { question: 'Mora solvendi generally requires:', options: ['No demand; delay is automatic upon the period lapsing', 'A judicial or extrajudicial demand by the creditor', 'Filing of a lawsuit', 'Written notice sent by registered mail only'], answerIndex: 1, explanation: 'As a rule, the debtor incurs delay only from the time the creditor demands performance, judicial or extrajudicial.' }
            }
          ]
        },
        {
          id: '3',
          title: 'Contract Formation and Validity',
          sections: [
            {
              id: '3-1',
              heading: 'Essential Requisites of Contracts',
              yearLevel: '2nd Year',
              difficulty: 'easy',
              barFrequency: 'high',
              content: 'Article 1318 of the Civil Code provides that no contract exists unless the following requisites concur: (1) consent of the contracting parties, (2) object certain as subject matter, and (3) cause of the obligation.\n\nAbsence of any one requisite renders the contract inexistent or void from the very beginning.',
              barExam: { frequency: 'High', commonTraps: ['Enumerating requisites without applying them to facts', 'Confusing essential with natural and accidental elements'], sampleAnswer: 'Enumerate the three requisites, check each against the fact pattern, and conclude on validity.' },
              cases: [{ name: 'Liguez v. CA', doctrine: 'Illegal cause and pari delicto', facts: 'The Court ruled that a donation for an illicit cause was void but applied equity to award partial relief under pari delicto exceptions.' }],
              quiz: { question: 'Which is NOT an essential requisite of a contract under the Civil Code?', options: ['Consent', 'Form', 'Object certain', 'Cause'], answerIndex: 1, explanation: 'Form is generally not an essential requisite; contracts are binding in whatever form unless the law requires a specific form for validity or enforceability.' }
            },
            {
              id: '3-2',
              heading: 'Vices of Consent',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Consent given through mistake, violence, intimidation, undue influence, or fraud renders a contract voidable. These are called vices of consent.\n\nFraud in consent (dolo causante) must be serious and must not be mutual to vitiate consent. Incidental fraud merely entitles the defrauded party to damages.',
              barExam: { frequency: 'High', commonTraps: ['Confusing dolo causante with dolo incidente', 'Treating all vices as making a contract void instead of voidable'], sampleAnswer: 'Identify the vice, classify as dolo causante or incidente, apply voidability doctrine, and state the remedy (annulment vs. damages).' },
              cases: [{ name: 'Azarraga v. Gay', doctrine: 'Dolo causante and voidability of consent', facts: 'Misrepresentations as to the character of land induced consent to contract, making it voidable for fraud.' }],
              quiz: { question: 'Incidental fraud (dolo incidente) makes a contract:', options: ['Void', 'Voidable', 'Unenforceable', 'Valid but damages are due'], answerIndex: 3, explanation: 'Dolo incidente does not vitiate consent but entitles the defrauded party to recover damages.' }
            }
          ]
        }
      ]
    },
    {
      id: 'constitutional-law-2',
      title: 'Constitutional Law II',
      description: 'Master the Bill of Rights, due process, equal protection, and individual liberties through Philippine jurisprudence and bar-focused analysis.',
      price: 1599,
      year: 2,
      yearLevel: '2nd Year',
      chapters: [
        {
          id: '1',
          title: 'The Bill of Rights: Due Process and Equal Protection',
          sections: [
            {
              id: '1-1',
              heading: 'Due Process of Law',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Due process has two aspects: substantive and procedural. Substantive due process requires that the law itself be fair, reasonable, and just. Procedural due process requires that the manner of its enforcement be fair.\n\nIn administrative proceedings, minimum procedural due process requires notice and an opportunity to be heard. The "twin notice" rule demands notice of the charge and notice of the decision.',
              barExam: { frequency: 'High', commonTraps: ['Conflating procedural and substantive due process', 'Applying criminal-level procedural protections to administrative proceedings'], sampleAnswer: 'Identify whether the issue is procedural or substantive, apply the appropriate standard (reasonableness for substantive, notice and hearing for procedural), and conclude on the due process claim.' },
              cases: [{ name: 'Ynot v. IAC', doctrine: 'Substantive due process and arbitrary executive power', facts: 'The Court struck down E.O. 626-A as an invalid exercise of police power lacking reasonable relationship to its stated purpose, violating substantive due process.' }],
              quiz: { question: 'Substantive due process requires that a law:', options: ['Be applied with notice and hearing', 'Be fair, reasonable, and just in content', 'Be passed by Congress only', 'Apply equally to all persons'], answerIndex: 1, explanation: 'Substantive due process scrutinizes the content of the law itself — it must not be arbitrary, oppressive, or unreasonable.' }
            },
            {
              id: '1-2',
              heading: 'Equal Protection of the Laws',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Equal protection does not require identical treatment of all persons. It permits valid classification provided: (1) it rests on substantial distinctions, (2) it is germane to the purpose of the law, (3) it is not limited to existing conditions, and (4) it applies equally to all members of the same class.\n\nSuspect classifications (race, alienage, national origin) and fundamental rights receive strict scrutiny. Other classifications receive rational basis review.',
              barExam: { frequency: 'High', commonTraps: ['Applying strict scrutiny to all classifications', 'Forgetting the four requisites of valid classification'], sampleAnswer: 'Identify the classification, determine the applicable standard (rational basis or strict scrutiny), apply the four-requisite test, and conclude on constitutionality.' },
              cases: [{ name: 'People v. Cayat', doctrine: 'Valid classification and equal protection', facts: 'The Court sustained a law restricting non-Christian tribes from drinking alcohol as a valid classification with substantial distinction germane to the legislative purpose.' }],
              quiz: { question: 'Which is NOT a requisite for a valid classification under the equal protection clause?', options: ['Based on substantial distinctions', 'Germane to the law\'s purpose', 'Applies permanently regardless of changed conditions', 'Applies equally to all in the same class'], answerIndex: 2, explanation: 'A valid classification must not be limited to existing conditions — it must apply to future conditions of the same class, not just present ones.' }
            },
            {
              id: '1-3',
              heading: 'Freedom of Speech and Expression',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Freedom of speech and expression is a preferred right. Content-based restrictions (targeting the message) are presumptively invalid and subject to strict scrutiny. Content-neutral restrictions (targeting time, place, or manner) are subject to intermediate scrutiny.\n\nThe clear and present danger test asks whether the words are used in such circumstances and are of such nature as to create a clear and present danger of a substantive evil the State has the right to prevent.',
              barExam: { frequency: 'High', commonTraps: ['Applying the wrong test (clear and present danger vs. dangerous tendency)', 'Forgetting prior restraint carries heavy presumption of unconstitutionality'], sampleAnswer: 'Classify the restriction as content-based or content-neutral, apply the appropriate test, address prior restraint doctrine if applicable, and conclude on constitutionality.' },
              cases: [{ name: 'Chavez v. Gonzales', doctrine: 'Prior restraint and freedom of expression', facts: 'The Court struck down government warnings to media against broadcasting content from the "Hello Garci" controversy as an unconstitutional prior restraint.' }],
              quiz: { question: 'Content-based restrictions on speech are subject to:', options: ['Rational basis review', 'Intermediate scrutiny', 'Strict scrutiny', 'Absolute prohibition'], answerIndex: 2, explanation: 'Content-based restrictions, which target the message itself, are presumptively unconstitutional and must pass strict scrutiny — a compelling state interest achieved through narrowly tailored means.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Rights of the Accused and Search and Seizure',
          sections: [
            {
              id: '2-1',
              heading: 'Rights of Persons Under Investigation',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Under Section 12 of the Bill of Rights, any person under custodial investigation has the right to remain silent, to have competent and independent counsel (preferably of their choice), and to be informed of these rights.\n\nConfessions obtained in violation of Section 12 are inadmissible. The right attaches as soon as the investigation focuses on the suspect in custody.',
              barExam: { frequency: 'High', commonTraps: ['Applying custodial investigation rights to administrative investigations', 'Forgetting that the right to counsel in custodial investigation cannot be waived without counsel'], sampleAnswer: 'Determine whether the person is in custodial investigation, apply the Miranda-equivalent rights, assess any waiver, and conclude on admissibility of the confession.' },
              cases: [{ name: 'People v. Mahinay', doctrine: 'Comprehensive Miranda-equivalent rights checklist', facts: 'The Court enumerated the specific rights that arresting officers must inform suspects of during custodial investigation.' }],
              quiz: { question: 'A waiver of the right to counsel during custodial investigation is valid only if:', options: ['Made in writing', 'Made in writing and in the presence of counsel', 'Oral waiver is sufficient if witnessed', 'The accused is a law graduate'], answerIndex: 1, explanation: 'Under Section 12(1), the waiver of the right to counsel must be made in writing and in the presence of counsel to be valid.' }
            },
            {
              id: '2-2',
              heading: 'Search and Seizure: Warrants and Exceptions',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'The Constitution protects persons from unreasonable searches and seizures. A valid search warrant must: (1) be based on probable cause, (2) be determined personally by a judge, (3) be upon examination under oath of the complainant and witnesses, and (4) particularly describe the place and things to be seized.\n\nRecognized exceptions include warrantless arrests, search incident to a lawful arrest, consented search, plain view, stop-and-frisk, and customs searches.',
              barExam: { frequency: 'High', commonTraps: ['Missing the particularity requirement', 'Applying one exception too broadly when another applies to the facts'], sampleAnswer: 'Assess the warrant\'s validity against all four requisites, and if invalid, check each warrantless search exception sequentially against the facts.' },
              cases: [{ name: 'People v. Cogaed', doctrine: 'Limits of stop-and-frisk under Terry doctrine', facts: 'The Court excluded evidence obtained after a pat-down that was not justified by specific and articulable facts beyond a mere suspicion.' }],
              quiz: { question: 'For a search warrant to be valid, probable cause must be determined:', options: ['By the arresting officer', 'By the prosecutor', 'Personally by the judge after examination of witnesses', 'By any court officer in emergencies'], answerIndex: 2, explanation: 'Section 2, Article III requires that probable cause be determined personally by the judge after examination under oath of the complainant and witnesses.' }
            }
          ]
        }
      ]
    },
    {
      id: 'criminal-law',
      title: 'Criminal Law I',
      description: 'Develop command of the Revised Penal Code, fundamental doctrines, and Philippine criminal jurisprudence through bar-tested issue-spotting.',
      price: 1599,
      year: 2,
      yearLevel: '2nd Year',
      chapters: [
        {
          id: '1',
          title: 'Fundamental Principles of Criminal Liability',
          sections: [
            {
              id: '1-1',
              heading: 'Characteristics of Philippine Criminal Law',
              yearLevel: '2nd Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'Philippine criminal law is characterized by three classical properties: generality (applies to all persons in Philippine territory), territoriality (applies to all crimes committed within Philippine territory), and prospectivity (it does not apply retroactively except when favorable to the accused).\n\nThese properties frame the scope of criminal jurisdiction and govern conflicts between Philippine law and foreign law.',
              barExam: { frequency: 'Medium', commonTraps: ['Forgetting the exceptions to territoriality under Article 2 RPC', 'Confusing generality with universality'], sampleAnswer: 'State the three characteristics, apply the relevant one to the fact pattern, and identify applicable exceptions.' },
              cases: [{ name: 'People v. Wong Cheng', doctrine: 'Territoriality and jurisdiction over foreign vessels', facts: 'The Court held that Philippine courts have jurisdiction over crimes committed aboard foreign merchant vessels in Philippine territorial waters if the crime affects public order.' }],
              quiz: { question: 'Which characteristic of criminal law holds that penal laws cannot apply to acts committed before the law\'s effectivity?', options: ['Generality', 'Territoriality', 'Prospectivity', 'Universality'], answerIndex: 2, explanation: 'Prospectivity means the law applies only to acts committed after its effectivity, subject to the exception of retroactivity when favorable to the accused.' }
            },
            {
              id: '1-2',
              heading: 'Elements of a Felony',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'A felony under the Revised Penal Code requires: (1) an act or omission, (2) punished by the RPC, and (3) committed through dolo (deceit) or culpa (fault).\n\nDolo requires freedom, intelligence, and intent. Culpa requires freedom, intelligence, and negligence or imprudence. Strict liability offenses punishable under special laws do not require intent.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting culpa as a mode of committing felonies', 'Applying RPC intent requirements to special law offenses'], sampleAnswer: 'Identify the mode (dolo or culpa), enumerate the required mental elements, and conclude on criminal liability.' },
              cases: [{ name: 'People v. Abarca', doctrine: 'Intent and proximate causation in felonies', facts: 'The Court analyzed intent and the causal chain in a complex felony case involving unintended consequences.' }],
              quiz: { question: 'An intentional felony requires all of the following EXCEPT:', options: ['Freedom of action', 'Intelligence', 'Negligence', 'Criminal intent'], answerIndex: 2, explanation: 'Negligence is an element of culpable (not intentional) felonies. Intentional felonies require freedom, intelligence, and criminal intent.' }
            },
            {
              id: '1-3',
              heading: 'Stages of Execution',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'The RPC recognizes three stages: attempted, frustrated, and consummated. An attempt arises when the offender commences commission by direct overt acts and does not perform all acts of execution by reason of a cause other than voluntary desistance.\n\nA frustrated felony results when the offender performs all acts of execution that would produce the felony as a consequence but is prevented by causes independent of the offender\'s will.',
              barExam: { frequency: 'High', commonTraps: ['Misclassifying frustrated and attempted stages', 'Forgetting voluntary desistance as a bar to attempt liability'], sampleAnswer: 'Identify all acts performed, determine if overt acts are past commencement, check whether all acts are complete, and determine if prevention is independent of will.' },
              cases: [{ name: 'People v. Orita', doctrine: 'Frustrated rape vs. attempted rape distinction', facts: 'The Supreme Court clarified the boundary between frustrated and attempted rape, ultimately concluding the acts constituted consummated rape.' }],
              quiz: { question: 'A frustrated felony differs from an attempted felony because:', options: ['The offender has not yet commenced overt acts', 'All acts of execution were completed but the crime did not result due to extraneous cause', 'The victim consented', 'The offender voluntarily desisted'], answerIndex: 1, explanation: 'In a frustrated felony, the offender has performed all acts of execution; in an attempt, performance is not yet complete.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Circumstances Affecting Criminal Liability',
          sections: [
            {
              id: '2-1',
              heading: 'Justifying Circumstances',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Justifying circumstances under Article 11 RPC preclude criminal liability because the act is lawful. These include: self-defense, defense of relatives, defense of strangers, fulfillment of duty, and obedience to a superior order.\n\nSelf-defense requires: (1) unlawful aggression by the victim, (2) reasonable necessity of means employed, and (3) lack of sufficient provocation by the defender.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting unlawful aggression as indispensable element of self-defense', 'Confusing justifying with exempting circumstances'], sampleAnswer: 'Enumerate the three requisites of self-defense, apply them in sequence to the facts, and conclude on whether liability is excluded.' },
              cases: [{ name: 'People v. Alconga', doctrine: 'Unlawful aggression and the peril on the life or limb standard', facts: 'The Court held that there must be actual or imminent peril to life or limb for self-defense to be valid; a perceived threat without overt act is insufficient.' }],
              quiz: { question: 'Which is an indispensable element of all forms of self-defense?', options: ['Lack of provocation', 'Unlawful aggression by the victim', 'Reasonable necessity of means employed', 'Imminent danger of injury'], answerIndex: 1, explanation: 'Unlawful aggression is the foundation of self-defense. Without it, all other elements become irrelevant.' }
            },
            {
              id: '2-2',
              heading: 'Exempting and Mitigating Circumstances',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Exempting circumstances under Article 12 RPC negate criminal liability because of absence of intelligence, freedom, or intent, even though the act is not lawful. Mitigating circumstances (Article 13) reduce the penalty without eliminating liability.\n\nOrdinary mitigating circumstances lower the penalty by one degree if no aggravating circumstance is present; privileged mitigation always reduces the penalty and cannot be offset by aggravating circumstances.',
              barExam: { frequency: 'High', commonTraps: ['Treating exempting circumstances as defenses available to all accused regardless of age', 'Confusing ordinary and privileged mitigation effects'], sampleAnswer: 'Identify the circumstance, classify it (exempting or mitigating), and compute the penalty including the effect on the indeterminate sentence.' },
              cases: [{ name: 'People v. Doqueña', doctrine: 'Discernment and exemption based on minority', facts: 'The Court assessed discernment as the key determinant of criminal liability for a youthful offender.' }],
              quiz: { question: 'An accused who acted under an irresistible force is:', options: ['Mitigated in liability', 'Exempt from criminal liability', 'Subject to civil liability only', 'Fully criminally liable'], answerIndex: 1, explanation: 'Acting under an irresistible force is an exempting circumstance under Article 12(5) RPC. No criminal liability attaches, though civil liability may remain.' }
            }
          ]
        }
      ]
    },
    {
      id: 'property',
      title: 'Property',
      description: 'Study ownership, modes of acquiring property, the Torrens system, and land registration law as part of the Philippine law school curriculum.',
      price: 1599,
      year: 2,
      yearLevel: '2nd Year',
      chapters: [
        {
          id: '1',
          title: 'Ownership and Its Incidents',
          sections: [
            {
              id: '1-1',
              heading: 'Concept and Attributes of Ownership',
              yearLevel: '2nd Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'Ownership is the independent and general right of a person to control a thing particularly in his possession, enjoyment, disposal, and recovery, subject to no restrictions except those imposed by the State or private persons.\n\nAttributes of ownership include: jus utendi (right to use), jus fruendi (right to the fruits), jus disponendi (right to dispose), jus abutendi (right to consume/destroy), and jus vindicandi (right to recover from unlawful possession).',
              barExam: { frequency: 'Medium', commonTraps: ['Confusing ownership with possession', 'Forgetting that ownership may be subject to legal restrictions even without a specific law'], sampleAnswer: 'Identify the specific attribute of ownership at issue, state the limitation applicable, and conclude on the owner\'s right to exercise the attribute in the given facts.' },
              cases: [{ name: 'Heirs of Malabanan v. Republic', doctrine: 'Requirements for registration of alienable and disposable land', facts: 'The Court clarified that open, continuous, exclusive, and notorious possession of alienable and disposable public land for at least 30 years confers an imperfect title eligible for judicial confirmation.' }],
              quiz: { question: 'The right of an owner to use the fruits of a thing is called:', options: ['Jus utendi', 'Jus fruendi', 'Jus disponendi', 'Jus vindicandi'], answerIndex: 1, explanation: 'Jus fruendi is the right to the fruits — natural, industrial, and civil fruits — produced by or derived from the thing owned.' }
            },
            {
              id: '1-2',
              heading: 'Co-Ownership',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Co-ownership arises when two or more persons own an undivided thing or right. Each co-owner may use the thing in accordance with its intended purpose, provided the rights of the other co-owners are not impaired.\n\nA co-owner may alienate their undivided share without the consent of the others, but cannot convey a specific physical portion without partition. No co-owner is obliged to remain in co-ownership; any co-owner may demand partition at any time.',
              barExam: { frequency: 'High', commonTraps: ['Allowing one co-owner to convey a specific portion without partition', 'Applying prescription against co-owners incorrectly (prescription does not run among co-owners unless repudiation is proven)'], sampleAnswer: 'Identify the co-ownership, determine the nature of the act (management or alienation), apply the appropriate consent requirement, and address prescription or partition rights.' },
              cases: [{ name: 'De la Cruz v. Cruz', doctrine: 'Co-owner cannot convey specific portion without partition', facts: 'The Court voided a deed of sale purporting to convey a specific area of co-owned land, as the co-owner could only convey their undivided interest.' }],
              quiz: { question: 'May a co-owner sell their undivided interest in co-owned property without consent of other co-owners?', options: ['No, consent of all is required', 'Yes, a co-owner may freely alienate their undivided share', 'Only if the share is more than 50%', 'Only for immovable property'], answerIndex: 1, explanation: 'Under Article 493 of the Civil Code, each co-owner may alienate, assign, or mortgage their undivided share without the consent of the others, but cannot affect the other shares.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Land Titles and the Torrens System',
          sections: [
            {
              id: '2-1',
              heading: 'The Torrens System and Original Registration',
              yearLevel: '2nd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'The Torrens System of land registration provides for indefeasibility of title upon registration. A certificate of title issued under the Torrens System serves as conclusive evidence of ownership and cannot be collaterally attacked.\n\nOriginal registration may proceed by judicial (Section 14 of P.D. 1529) or administrative means. The applicant must prove that the land is alienable and disposable public land and that they and their predecessors have been in open, continuous, exclusive, and notorious possession for the required period.',
              barExam: { frequency: 'High', commonTraps: ['Treating all Torrens titles as absolutely indefeasible without noting the one-year period for petition for review based on fraud', 'Forgetting the State\'s immunity — the government is not bound by Torrens if land is not alienable'], sampleAnswer: 'Confirm the land\'s alienable and disposable status, assess possession requirements, state the Torrens indefeasibility rule, and address any applicable exception (fraud, one-year review period).' },
              cases: [{ name: 'Heirs of Malabanan v. Republic', doctrine: 'Open and notorious possession for original registration', facts: 'The Supreme Court en banc clarified that for judicial confirmation under CA 141 as amended, possession must be from June 12, 1945 and the land must be alienable and disposable public agricultural land at the time of application.' }],
              quiz: { question: 'A certificate of title under the Torrens System may be directly attacked within:', options: ['Anytime, as fraud vitiates everything', 'One year from the issuance of the decree of registration', 'Five years from discovery of fraud', '30 years by prescription'], answerIndex: 1, explanation: 'Under Section 32 of P.D. 1529, a person aggrieved by a decree of registration may petition the court to reopen or review the decree within one year from entry of the decree, based on actual fraud.' }
            },
            {
              id: '2-2',
              heading: 'Subsequent Registration and Dealings',
              yearLevel: '2nd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Subsequent dealings with registered land (sale, mortgage, lease, etc.) must be registered to bind third parties. Registration is the operative act. An unregistered sale between the parties is valid, but cannot be set up against a subsequent registered buyer in good faith.\n\nThe buyer in good faith and for value (innocent purchaser for value, or IPV) is protected by the Torrens System. Constructive notice from registration prevents a buyer from claiming ignorance after the fact.',
              barExam: { frequency: 'High', commonTraps: ['Protecting a buyer who purchased from a forger without examining original documents', 'Treating registration as validating a void deed'], sampleAnswer: 'Determine if the buyer is an IPV (examined title, paid fair value, no notice of defects), apply constructive notice from prior registrations, and conclude on the priority of competing claims.' },
              cases: [{ name: 'Spouses Lim v. Spouses Vera Cruz', doctrine: 'Buyer in bad faith and duty to investigate', facts: 'The Court denied IPV status to a buyer who purchased land with notice of adverse claims on the title and failed to investigate the actual occupants in possession.' }],
              quiz: { question: 'The protection of an innocent purchaser for value requires:', options: ['Only that the purchase price was paid', 'That the buyer examined the title and paid value without notice of any defect or encumbrance', 'That the sale was notarized', 'That the seller held the title for at least 5 years'], answerIndex: 1, explanation: 'An innocent purchaser for value must have dealt with the registered owner, relied on the title, paid a fair price, and had no notice — actual or constructive — of any defect or adverse claim.' }
            }
          ]
        }
      ]
    },
    {
      id: 'civil-procedure',
      title: 'Civil Procedure',
      description: 'Command the Rules of Court on civil actions — from jurisdiction and pleadings through trial, judgment, and appeals — using bar-tested procedural analysis.',
      price: 1799,
      year: 3,
      yearLevel: '3rd Year',
      chapters: [
        {
          id: '1',
          title: 'Jurisdiction and Venue',
          sections: [
            {
              id: '1-1',
              heading: 'Nature and Concept of Jurisdiction',
              yearLevel: '3rd Year',
              difficulty: 'easy',
              barFrequency: 'high',
              content: 'Jurisdiction is the power and authority of the court to hear and decide a case. It is conferred exclusively by law and cannot be acquired by stipulation, waiver, or acquiescence.\n\nJurisdiction over the subject matter is determined by the allegations of the complaint, not by the defenses raised, and is challenged via a motion to dismiss or as an affirmative defense in the answer.',
              barExam: { frequency: 'High', commonTraps: ['Confusing jurisdiction with venue', 'Forgetting that jurisdiction is conferred by law, not by consent'], sampleAnswer: 'State the rule that jurisdiction is conferred by law, identify the court with jurisdiction based on the amount or nature of the claim, and distinguish from venue.' },
              cases: [{ name: 'Figueroa v. People', doctrine: 'Jurisdiction over subject matter raised anytime', facts: 'The Court reiterated that lack of jurisdiction over the subject matter may be raised at any stage of the proceedings, even on appeal.' }],
              quiz: { question: 'Jurisdiction over the subject matter is conferred by:', options: ['Agreement of the parties', 'The filing of the complaint', 'Law', 'The judge\'s order'], answerIndex: 2, explanation: 'Jurisdiction is conferred exclusively by law; parties cannot confer or waive subject-matter jurisdiction.' }
            },
            {
              id: '1-2',
              heading: 'Jurisdiction of Trial Courts',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'The Metropolitan Trial Court (MeTC), Municipal Trial Court (MTC), and Municipal Circuit Trial Courts have exclusive original jurisdiction over civil actions involving personal property not exceeding PHP 400,000 (outside Metro Manila: PHP 300,000).\n\nThe Regional Trial Court (RTC) has exclusive original jurisdiction over all civil actions involving amounts exceeding those thresholds, and over all other cases not within the exclusive original jurisdiction of any other court.',
              barExam: { frequency: 'High', commonTraps: ['Using outdated jurisdictional amounts', 'Forgetting that real actions are based on assessed value, not purchase price'], sampleAnswer: 'Identify the nature of the action (personal or real), determine the applicable amount threshold, and assign the case to the correct trial court.' },
              cases: [{ name: 'Barangay Mayamot v. Antipolo City', doctrine: 'Assessed value governs real action jurisdiction', facts: 'The Court held that in real actions, jurisdiction is determined by assessed value of the property and not market or purchase price.' }],
              quiz: { question: 'In real actions, the basis for determining court jurisdiction is the:', options: ['Market value', 'Assessed value', 'Purchase price', 'Rental value'], answerIndex: 1, explanation: 'The assessed value of the real property governs jurisdiction in real actions under B.P. 129 as amended.' }
            },
            {
              id: '1-3',
              heading: 'Venue of Civil Actions',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'Venue determines the place of trial, not the court\'s authority. In personal actions, venue is where either party resides at the election of the plaintiff. In real actions, venue is where the real property is located.\n\nVenue may be waived by the parties through an exclusive venue stipulation in a contract, which is binding and enforceable.',
              barExam: { frequency: 'Medium', commonTraps: ['Treating venue rules as jurisdictional', 'Forgetting exclusive venue stipulations override the general rule'], sampleAnswer: 'Classify the action (personal or real), apply the default venue rule, then check for a valid contractual exclusive venue stipulation.' },
              cases: [{ name: 'Unimasters v. CA', doctrine: 'Exclusive venue stipulation and waiver of default venue', facts: 'The Court upheld an exclusive venue clause specifying Tacloban courts despite the plaintiff filing in Manila.' }],
              quiz: { question: 'Improper venue in a civil case is:', options: ['Jurisdictional and may be raised anytime', 'Waivable if not raised promptly in an answer or motion to dismiss', 'Never waivable', 'Grounds for automatic dismissal'], answerIndex: 1, explanation: 'Venue is procedural and personal. Failure to object to improper venue seasonably constitutes a waiver under the Rules of Court.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Pleadings, Motions, and Summons',
          sections: [
            {
              id: '2-1',
              heading: 'Kinds of Pleadings',
              yearLevel: '3rd Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'Pleadings are written statements of the respective claims and defenses of the parties. The Rules of Court recognize: complaint, answer, counterclaim, cross-claim, third-party complaint, complaint-in-intervention, and reply.\n\nA complaint must contain a concise statement of the ultimate facts constituting the plaintiff\'s cause of action and a demand for relief.',
              barExam: { frequency: 'Medium', commonTraps: ['Confusing ultimate facts with evidentiary or conclusory facts', 'Forgetting that reply is optional except when new matters are raised in the answer'], sampleAnswer: 'Identify the pleading type, confirm it is filed within the reglementary period, check for complete ultimate facts, and address affirmative defenses.' },
              cases: [{ name: 'Chua v. Santos', doctrine: 'Cause of action and ultimate facts', facts: 'The Court dismissed the complaint for failure to allege ultimate facts constituting a cause of action, distinguishing it from conclusions of law.' }],
              quiz: { question: 'A complaint must allege:', options: ['Evidentiary facts supporting each element', 'Ultimate facts constituting the cause of action', 'Legal conclusions only', 'Both evidentiary and ultimate facts'], answerIndex: 1, explanation: 'Pleadings must contain ultimate facts — the essential facts constituting the plaintiff\'s cause of action, not evidentiary details or legal conclusions.' }
            },
            {
              id: '2-2',
              heading: 'Summons and Service of Process',
              yearLevel: '3rd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Summons is the process by which a court acquires jurisdiction over the person of the defendant. Under the 2019 Amendments to the Rules of Civil Procedure, personal service remains primary; substituted service is allowed only after two failed attempts on two separate dates.\n\nService on a domestic corporation is made on the president, managing partner, general manager, corporate secretary, treasurer, or in-house counsel.',
              barExam: { frequency: 'High', commonTraps: ['Applying old rules for substituted service without two failed attempts', 'Confusing service on corporations with service on natural persons'], sampleAnswer: 'Identify the mode (personal, substituted, or publication), check compliance with the 2019 Rules requirements, and assess whether jurisdiction over the defendant was properly acquired.' },
              cases: [{ name: 'Manotoc v. CA', doctrine: 'Strict requirements of substituted service', facts: 'The Court held that strict compliance with the requirements of substituted service is required for it to confer jurisdiction over the defendant\'s person.' }],
              quiz: { question: 'Under the 2019 Rules, substituted service of summons requires:', options: ['One failed attempt at personal service', 'Two failed attempts on two separate dates', 'A court order before proceeding', 'Service through registered mail always'], answerIndex: 1, explanation: 'The 2019 Amendments require two failed attempts at personal service on two separate dates before resorting to substituted service.' }
            }
          ]
        },
        {
          id: '3',
          title: 'Trial, Judgment, and Appeals',
          sections: [
            {
              id: '3-1',
              heading: 'Pre-Trial and Trial Procedures',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Pre-trial is mandatory in civil cases. The parties must file pre-trial briefs at least three days before the scheduled pre-trial, containing a statement of willingness to enter into amicable settlement, proposed stipulations, issues to be tried, names of witnesses, and documents to be offered.\n\nJudicial affidavits now replace direct examination under A.M. No. 12-8-8-SC to expedite trial.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting that pre-trial brief must be filed before pre-trial conference', 'Missing the Judicial Affidavit Rule waiver consequence'], sampleAnswer: 'State the pre-trial requirements, identify the consequences of non-appearance, and address judicial affidavit substitution for direct testimony.' },
              cases: [{ name: 'Spouses Jacinto v. Bangko', doctrine: 'Consequence of failure to file pre-trial brief', facts: 'The Court held that failure of the plaintiff to file a pre-trial brief results in dismissal; failure by defendant results in being declared as in default.' }],
              quiz: { question: 'Under the Judicial Affidavit Rule, if a witness fails to appear for cross-examination:', options: ['The judicial affidavit is automatically admitted', 'The judicial affidavit shall not be admitted', 'The court must grant a continuance', 'The testimony stands on the record unchanged'], answerIndex: 1, explanation: 'Under A.M. No. 12-8-8-SC, if the witness fails to appear for cross-examination, the judicial affidavit is not admitted in evidence.' }
            },
            {
              id: '3-2',
              heading: 'Judgments and Final Orders',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'A judgment becomes final and executory when no appeal is taken within the reglementary period. The doctrine of immutability of judgments bars any modification once finality attaches, subject only to recognized exceptions such as clerical errors, nunc pro tunc entries, and void judgments.\n\nExecution of judgment is a matter of right on motion by the prevailing party within five years from finality, or by independent action within ten years.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting that finality bars even the Supreme Court from modifying the decision', 'Miscomputing the five-year / ten-year execution periods'], sampleAnswer: 'Determine whether judgment has attained finality, assess exceptions to immutability if raised, and identify the correct execution mode.' },
              cases: [{ name: 'Abrigo v. De Vera', doctrine: 'Immutability of final judgment', facts: 'The Court refused to modify a final judgment even where the modification would appear just, applying the doctrine of immutability strictly.' }],
              quiz: { question: 'Execution by motion must be filed within:', options: ['1 year from finality', '5 years from entry of judgment', '10 years from finality', '5 years from the date of judgment'], answerIndex: 1, explanation: 'Rule 39, Section 6 allows execution by motion within five years from entry of judgment; after that, only by independent action within ten years.' }
            }
          ]
        }
      ]
    },
    {
      id: 'criminal-procedure',
      title: 'Criminal Procedure',
      description: 'Sharpen your command of criminal proceedings from investigation and prosecution through trial and post-conviction remedies under the Rules of Court.',
      price: 1799,
      year: 3,
      yearLevel: '3rd Year',
      chapters: [
        {
          id: '1',
          title: 'Prosecution of Offenses and Preliminary Investigation',
          sections: [
            {
              id: '1-1',
              heading: 'Complaint vs. Information',
              yearLevel: '3rd Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'A complaint is a sworn written statement charging a person with an offense, subscribed by the offended party or an authorized officer. An information is an accusation in writing charging a person with an offense subscribed by the prosecutor and filed with the court.\n\nOffenses where a preliminary investigation is required include those punishable by at least four years, two months, and one day.',
              barExam: { frequency: 'Medium', commonTraps: ['Confusing when a complaint vs. information must be used', 'Forgetting that the prosecutor signs the information, not the offended party'], sampleAnswer: 'Distinguish complaint from information, identify who must subscribe each, and apply the rule on when preliminary investigation is required.' },
              cases: [{ name: 'Cruz v. People', doctrine: 'Prosecutor\'s control over information', facts: 'The Court held that once the information is filed, the prosecutor loses control over the offense but retains authority over the prosecution.' }],
              quiz: { question: 'An information is subscribed by:', options: ['The offended party', 'The prosecuting officer', 'The judge', 'A law enforcement officer'], answerIndex: 1, explanation: 'An information is subscribed by the prosecuting fiscal/prosecutor and filed with the court, not by the offended party.' }
            },
            {
              id: '1-2',
              heading: 'Preliminary Investigation Procedure',
              yearLevel: '3rd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'A preliminary investigation is conducted to determine probable cause to charge a person with an offense. It is conducted by the prosecutor upon a complaint filed by the offended party.\n\nProbable cause in a preliminary investigation means sufficient ground to engender a well-founded belief that a crime has been committed and the respondent is probably guilty. The standard is lower than proof beyond reasonable doubt.',
              barExam: { frequency: 'High', commonTraps: ['Confusing probable cause in PI with probable cause for issuance of an arrest warrant', 'Forgetting the 10-day rule for filing the counter-affidavit'], sampleAnswer: 'Define probable cause in the PI context, distinguish it from the warrant standard, and apply to determine whether the prosecutor should file or dismiss.' },
              cases: [{ name: 'Ocampo v. Abando', doctrine: 'Probable cause standard in PI vs. prosecution phase', facts: 'The Supreme Court explained that a preliminary investigation is not the occasion for a full and exhaustive display of proof; only probability of guilt is required.' }],
              quiz: { question: 'Probable cause in a preliminary investigation requires:', options: ['Proof beyond reasonable doubt', 'Clear and convincing evidence', 'Well-founded belief that crime was committed and respondent is probably guilty', 'Preponderance of evidence'], answerIndex: 2, explanation: 'Preliminary investigation requires only probable cause — a well-founded belief in guilt — not the higher standards required for conviction or the issuance of warrants.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Bail, Arraignment, and Plea',
          sections: [
            {
              id: '2-1',
              heading: 'Bail: Nature, Forms, and Entitlement',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Bail is the security given for the release of a person in custody of the law, furnished to guarantee the accused\'s appearance before any court. The right to bail is guaranteed by the Constitution but is not absolute.\n\nBail is a matter of right before or after conviction by an inferior court, and before conviction by the RTC for offenses not punishable by death, reclusion perpetua, or life imprisonment. It is a matter of discretion after conviction by the RTC where the penalty imposed is reclusion perpetua.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting the distinction between bail as right vs. bail as discretion', 'Applying the wrong standard for capital offenses'], sampleAnswer: 'Classify the offense by penalty, determine whether bail is a matter of right or discretion, and apply the correct standard for the bail hearing.' },
              cases: [{ name: 'People v. Nitcha', doctrine: 'Discretionary bail and strong evidence of guilt', facts: 'The Court held that bail is discretionary for capital offenses and the prosecution must be given opportunity to show the evidence of guilt is strong.' }],
              quiz: { question: 'Bail is a matter of right for an accused:', options: ['Charged with reclusion perpetua before conviction', 'After conviction by the RTC for any offense', 'Charged with an offense not punishable by reclusion perpetua or life imprisonment, before conviction', 'At all stages in any offense'], answerIndex: 2, explanation: 'Bail is a matter of right before conviction for offenses not punishable by reclusion perpetua, life imprisonment, or death.' }
            },
            {
              id: '2-2',
              heading: 'Arraignment and Plea',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'Arraignment is the stage where the accused is formally charged and enters a plea. It must be held within 30 days from the filing of the information, or from the date of the accused\'s appearance in court, whichever is later.\n\nA plea of guilty to a capital offense requires the court to conduct a searching inquiry into the voluntariness and full comprehension of consequences of the plea before accepting it.',
              barExam: { frequency: 'Medium', commonTraps: ['Forgetting the searching inquiry requirement for guilty pleas to capital offenses', 'Missing the effect of a plea of not guilty on subsequent evidence presentation'], sampleAnswer: 'Confirm arraignment compliance, evaluate the validity of the plea, and apply the searching inquiry doctrine if the offense is capital.' },
              cases: [{ name: 'People v. Aranzado', doctrine: 'Searching inquiry requirement for guilty pleas in capital offenses', facts: 'The Court set aside a conviction where the trial court accepted a guilty plea to a capital offense without conducting the required searching inquiry.' }],
              quiz: { question: 'For a plea of guilty to a capital offense, the court must:', options: ['Accept the plea immediately', 'Conduct a searching inquiry into its voluntariness and comprehension', 'Require corroborating evidence only', 'Defer sentencing to a later date'], answerIndex: 1, explanation: 'Section 3, Rule 116 requires the court to conduct a searching inquiry before accepting a guilty plea in a capital offense to ensure the accused fully understands the consequences.' }
            }
          ]
        }
      ]
    },
    {
      id: 'evidence',
      title: 'Evidence',
      description: 'Master the law of evidence — admissibility, witnesses, documentary evidence, and the exclusionary rules — essential to bar exam success.',
      price: 1699,
      year: 3,
      yearLevel: '3rd Year',
      chapters: [
        {
          id: '1',
          title: 'Admissibility of Evidence',
          sections: [
            {
              id: '1-1',
              heading: 'Relevance and Admissibility',
              yearLevel: '3rd Year',
              difficulty: 'easy',
              barFrequency: 'high',
              content: 'Evidence is admissible when it is relevant and not excluded by the Rules. Relevant evidence has any tendency to make a fact of consequence more or less probable.\n\nAdmissibility is determined by the court at the time the evidence is offered and is distinct from the weight or credibility the court gives it during deliberation.',
              barExam: { frequency: 'High', commonTraps: ['Confusing admissibility with weight', 'Failing to object at the time of offer waives the objection'], sampleAnswer: 'Identify the ground for exclusion, apply the relevance and admissibility tests, and state the effect of failure to timely object.' },
              cases: [{ name: 'Estrada v. Sandiganbayan', doctrine: 'Admissibility of voluminous records and summaries', facts: 'The Court allowed summaries of thousands of documents as admissible secondary evidence upon compliance with the Best Evidence Rule exceptions.' }],
              quiz: { question: 'An objection to the admissibility of evidence must be raised:', options: ['During deliberation', 'In the pre-trial brief only', 'At the time the evidence is offered', 'In the memorandum after trial'], answerIndex: 2, explanation: 'Under the Rules of Court, an objection must be made at the time the evidence is offered; otherwise, the right to object is waived.' }
            },
            {
              id: '1-2',
              heading: 'Hearsay Rule and Exceptions',
              yearLevel: '3rd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Hearsay is an out-of-court statement offered to prove the truth of the matter asserted. It is generally inadmissible because the declarant cannot be cross-examined to test credibility.\n\nExceptions include dying declarations, declarations against interest, res gestae, entries in the course of business, official records, learned treatises, and family reputation. The 2019 Amendments added residual exceptions.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting that the statement must be offered for its truth to be hearsay', 'Misapplying dying declaration requirements (belief of impending death)'], sampleAnswer: 'Identify the statement, determine if offered for truth, apply hearsay definition, then check each applicable exception against the facts.' },
              cases: [{ name: 'People v. Estibal', doctrine: 'Dying declaration requisites', facts: 'The Court admitted a dying declaration made moments before death where the declarant expressed certainty of impending death and could not testify at trial.' }],
              quiz: { question: 'For a dying declaration to be admissible, the declarant must:', options: ['Survive the incident', 'Have been under consciousness of impending death', 'Have written the statement personally', 'Have been a witness to the crime'], answerIndex: 1, explanation: 'A dying declaration requires that the declarant made the statement under consciousness of impending death. The declarant need not ultimately die, but must have believed death was imminent.' }
            },
            {
              id: '1-3',
              heading: 'Exclusionary Rules: Fruit of the Poisonous Tree',
              yearLevel: '3rd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Evidence obtained in violation of the constitutional rights against unreasonable searches and seizures and the right to counsel during custodial investigation is inadmissible.\n\nThe fruit of the poisonous tree doctrine extends exclusion to evidence derived from the illegal act. Exceptions include independent source, inevitable discovery, and attenuation.',
              barExam: { frequency: 'High', commonTraps: ['Forgetting that the exclusionary rule applies only to constitutional (not statutory) violations in the Philippines', 'Missing the independent source and inevitable discovery exceptions'], sampleAnswer: 'Identify the constitutional violation, apply the exclusionary rule to primary evidence, extend to derivative evidence under fruit-of-the-poisonous-tree, and assess applicable exceptions.' },
              cases: [{ name: 'People v. Nuevas', doctrine: 'Exclusionary rule applied to illegal arrest and search', facts: 'The Court excluded both the drugs seized and the confession obtained following an illegal warrantless arrest, applying the fruit-of-the-poisonous-tree doctrine.' }],
              quiz: { question: 'The fruit of the poisonous tree doctrine excludes:', options: ['Only the primary illegally obtained evidence', 'Both primary evidence and all evidence derived from the illegal act', 'Only physical evidence, not testimonial', 'Evidence obtained after a curative warrant is issued'], answerIndex: 1, explanation: 'The doctrine extends exclusion to all derivative evidence — the "fruit" — that flows from the initial constitutional violation, subject to recognized exceptions.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Witnesses and Privilege',
          sections: [
            {
              id: '2-1',
              heading: 'Competency and Credibility of Witnesses',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'All persons who can perceive and make known their perceptions are competent to testify. Mental incapacity or immaturity does not automatically exclude a witness; the court assesses whether the witness can receive just impressions and relate them truthfully.\n\nCredibility is for the trier of fact. The doctrines of falsus in uno, falsus in omnibus and positive vs. negative testimony guide credibility assessment.',
              barExam: { frequency: 'Medium', commonTraps: ['Treating disqualification and privilege as the same concept', 'Automatically excluding child witnesses without applying the competency test'], sampleAnswer: 'Distinguish competency from credibility, apply the perception-and-communication test for competency, and address any ground for disqualification separately.' },
              cases: [{ name: 'People v. Balite', doctrine: 'Child witness competency standard', facts: 'The Court upheld the testimony of a 7-year-old victim, applying the test of capacity to receive impressions and relate them truthfully under the Rule on Examination of Child Witnesses.' }],
              quiz: { question: 'A witness\'s mental incapacity at the time of testifying:', options: ['Automatically renders the witness incompetent', 'Is assessed by whether the witness can perceive and communicate truthfully', 'Requires psychiatric certification before testimony', 'Disqualifies the witness if under 15 years old'], answerIndex: 1, explanation: 'The test for competency is functional: can the witness receive correct impressions of facts and relate them truly? Mental incapacity alone does not automatically disqualify.' }
            },
            {
              id: '2-2',
              heading: 'Privileged Communications',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Philippine law recognizes several privileged communications: (1) marital privilege (confidential communications between spouses), (2) attorney-client privilege, (3) physician-patient privilege, (4) priest-penitent privilege, and (5) state secrets privilege.\n\nPrivilege belongs to the holder; the professional cannot invoke it on their own. Waiver occurs when the holder voluntarily discloses privileged information.',
              barExam: { frequency: 'High', commonTraps: ['Confusing the marital disqualification with the marital privilege', 'Forgetting that privilege belongs to the client/patient, not the professional'], sampleAnswer: 'Identify the privilege claimed, confirm who holds it, assess whether it was waived, and conclude on whether the testimony is admissible.' },
              cases: [{ name: 'Krohn v. CA', doctrine: 'Marital privilege and waiver', facts: 'The Court allowed a husband to testify on his wife\'s mental condition in annulment proceedings, distinguishing marital privilege from the marital disqualification rule.' }],
              quiz: { question: 'The attorney-client privilege may be waived by:', options: ['The attorney disclosing in court', 'The client voluntarily revealing the communication', 'Any officer of the court', 'A court subpoena to the lawyer'], answerIndex: 1, explanation: 'Privilege belongs to the client. Waiver occurs when the client voluntarily discloses the privileged communication. The lawyer cannot waive it without the client\'s consent.' }
            }
          ]
        }
      ]
    },
    {
      id: 'corporation-law',
      title: 'Corporation Law',
      description: 'Build mastery over the Revised Corporation Code — corporate formation, governance, piercing the veil, and dissolution — for bar and practice.',
      price: 1699,
      year: 3,
      yearLevel: '3rd Year',
      chapters: [
        {
          id: '1',
          title: 'Nature and Formation of Corporations',
          sections: [
            {
              id: '1-1',
              heading: 'Concept and Attributes of a Corporation',
              yearLevel: '3rd Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'A corporation is an artificial being created by operation of law, having the right of succession and the powers, attributes, and properties expressly authorized by law or incident to its existence.\n\nKey attributes: separate juridical personality, limited liability of stockholders, transferability of shares, centralized management through the board of directors, and perpetual succession.',
              barExam: { frequency: 'Medium', commonTraps: ['Confusing corporate attributes with partnership attributes', 'Forgetting that under the RCCP corporations may have perpetual existence unless otherwise stated'], sampleAnswer: 'Enumerate the corporate attributes, apply them to the fact pattern, and distinguish from the attributes of a partnership or sole proprietorship.' },
              cases: [{ name: 'Stockholders of F. Guanzon v. Register of Deeds', doctrine: 'Separate juridical personality of corporations', facts: 'The Court held that property contributed to a corporation becomes corporate property; stockholders have no direct interest in specific corporate assets.' }],
              quiz: { question: 'Under the Revised Corporation Code, the corporate term is:', options: ['Limited to 50 years', 'Perpetual unless the articles provide otherwise', 'Limited to 25 years', 'Fixed by the SEC at formation'], answerIndex: 1, explanation: 'The RCCP (R.A. 11232) changed the default corporate term to perpetual unless a specific period is provided in the articles of incorporation.' }
            },
            {
              id: '1-2',
              heading: 'Piercing the Corporate Veil',
              yearLevel: '3rd Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Piercing the corporate veil is the judicial act of disregarding the separate personality of the corporation and holding its stockholders, officers, or parent company liable for corporate obligations.\n\nGrounds include: fraud, use of the corporate form to circumvent law, undercapitalization, and alter ego doctrine where there is such unity of interest that it would be inequitable to treat the corporation separately.',
              barExam: { frequency: 'High', commonTraps: ['Applying piercing too broadly to any closely-held corporation', 'Forgetting that piercing is the exception, not the rule'], sampleAnswer: 'State the general rule of separate corporate personality, identify the ground for piercing, apply the fraud or alter ego test to the facts, and conclude on individual liability.' },
              cases: [{ name: 'Philippine National Bank v. Andrada Electric', doctrine: 'Alter ego doctrine and piercing', facts: 'The Court pierced the corporate veil where the parent corporation used its subsidiary as a mere conduit to evade obligations, applying the alter ego doctrine.' }],
              quiz: { question: 'Piercing the corporate veil is proper when:', options: ['The corporation is closely-held by one family', 'The corporate form is used to commit fraud or evade legal obligations', 'The corporation has insufficient profits', 'A stockholder personally guarantees corporate debts'], answerIndex: 1, explanation: 'Piercing requires showing that the corporate form was used to commit fraud, evade legal obligations, or that there is such unity of interest as to make separate treatment inequitable.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Corporate Governance and Dissolution',
          sections: [
            {
              id: '2-1',
              heading: 'Powers and Duties of the Board of Directors',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Corporate powers are exercised and business conducted by the board of directors. Directors must act as a body; individual directors cannot bind the corporation unless authorized by the board.\n\nDirectors owe fiduciary duties of care, loyalty, and obedience. The business judgment rule protects directors from liability for honest business decisions made in good faith and within their authority.',
              barExam: { frequency: 'High', commonTraps: ['Holding individual directors liable without showing breach of fiduciary duty', 'Ignoring the business judgment rule protection'], sampleAnswer: 'Confirm the board acted as a body, apply the fiduciary duties, invoke or rebut the business judgment rule based on the facts, and conclude on director liability.' },
              cases: [{ name: 'Gokongwei v. Securities and Exchange Commission', doctrine: 'Director qualifications and stockholder rights', facts: 'The Court balanced the board\'s power to set director qualifications against stockholder rights to participate in corporate management.' }],
              quiz: { question: 'Under the business judgment rule, a director is protected from liability if they acted:', options: ['In the corporation\'s best interest only', 'In good faith, with due care, and within their authority', 'With stockholder approval of the decision', 'Following legal counsel\'s advice always'], answerIndex: 1, explanation: 'The business judgment rule protects directors who acted honestly, in good faith, with the care of an ordinarily prudent person, and within their authority.' }
            },
            {
              id: '2-2',
              heading: 'Dissolution and Winding Up',
              yearLevel: '3rd Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'A corporation may be dissolved voluntarily or involuntarily. Voluntary dissolution requires a majority vote of the board and 2/3 vote of outstanding capital stock. The SEC may revoke corporate registration for grounds including continuous inoperation for at least 5 years.\n\nWinding up involves collecting assets, paying creditors, and distributing remaining assets to stockholders. The corporation continues as a juridical person for three years solely for winding-up purposes.',
              barExam: { frequency: 'Medium', commonTraps: ['Forgetting the three-year winding up period', 'Missing the 2/3 stockholder vote requirement for voluntary dissolution'], sampleAnswer: 'Identify the mode of dissolution (voluntary or involuntary), confirm compliance with voting requirements, address the three-year winding up period, and state the priority of creditors over stockholders.' },
              cases: [{ name: 'Clemente v. CA', doctrine: 'Three-year winding up period and revival of corporate capacity', facts: 'The Court addressed the effect of the three-year winding-up period on pending litigation and the appointment of a receiver to continue the process beyond the period.' }],
              quiz: { question: 'After dissolution, a corporation continues its juridical personality for:', options: ['1 year for winding up only', '3 years for winding up purposes', '5 years for all pending obligations', 'Indefinitely for pending litigation'], answerIndex: 1, explanation: 'Under Section 139 of the RCCP, a dissolved corporation continues as a juridical entity for three years from dissolution for winding up purposes only.' }
            }
          ]
        }
      ]
    },
    {
      id: 'taxation-law',
      title: 'Taxation Law',
      description: 'Command national and local taxation, the NIRC, VAT, estate and donor\'s taxes, and tax remedies essential for the Philippine bar examination.',
      price: 1799,
      year: 4,
      yearLevel: '4th Year',
      chapters: [
        {
          id: '1',
          title: 'Fundamental Principles of Taxation',
          sections: [
            {
              id: '1-1',
              heading: 'Nature, Basis, and Limitations of Taxation',
              yearLevel: '4th Year',
              difficulty: 'easy',
              barFrequency: 'high',
              content: 'Taxation is the power of the State to impose burdens upon subjects and objects within its jurisdiction for the purpose of raising revenues. It is inherent in sovereignty and does not need constitutional grant.\n\nConstitutional limitations include: (1) due process, (2) equal protection, (3) uniformity and equity in taxation, (4) progressive system, and (5) exemption of religious, charitable, and educational entities from property taxes.',
              barExam: { frequency: 'High', commonTraps: ['Confusing tax exemption of religious entities (property only) with income tax exemption', 'Forgetting that taxation power may be delegated to LGUs under the Local Government Code'], sampleAnswer: 'State the nature of the taxing power, identify the applicable constitutional limitation, apply it to the specific tax measure, and conclude on constitutionality.' },
              cases: [{ name: 'Commissioner of Internal Revenue v. CA', doctrine: 'Strict construction of tax exemptions', facts: 'The Court held that tax exemptions are construed strictly against the taxpayer and that any doubt is resolved in favor of the government.' }],
              quiz: { question: 'Tax exemptions granted by law are construed:', options: ['Liberally in favor of the taxpayer', 'Strictly against the taxpayer', 'Equally for and against the taxpayer', 'In the manner most beneficial to the public'], answerIndex: 1, explanation: 'Tax exemptions are strictly construed against the taxpayer because they are departures from the general principle that everyone must pay taxes.' }
            },
            {
              id: '1-2',
              heading: 'Income Taxation: Concept and Classification',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Income tax is imposed on all income derived from whatever source. Income includes compensation, business income, capital gains, passive income, and other income. The NIRC taxes the net income of individuals and the net taxable income of corporations.\n\nResident citizens are taxed on worldwide income. Non-resident aliens and foreign corporations are taxed only on Philippine-source income. The graduated tax rates apply to individual taxpayers; corporations are taxed at 25% (or 20% for small corporations).',
              barExam: { frequency: 'High', commonTraps: ['Applying resident citizen rules to non-resident aliens', 'Forgetting the CREATE Law reduction of corporate income tax to 25%'], sampleAnswer: 'Classify the taxpayer (resident citizen, NRA, domestic or foreign corporation), determine income source (worldwide or Philippine-source), apply the applicable tax rate, and compute the income tax due.' },
              cases: [{ name: 'Commissioner of Internal Revenue v. Mitsubishi Metal Corp.', doctrine: 'Source of income for tax situs purposes', facts: 'The Court analyzed income source rules for interest income derived from Philippine operations of a foreign corporation.' }],
              quiz: { question: 'A non-resident alien individual is taxed in the Philippines on:', options: ['Worldwide income', 'Philippine-source income only', 'Income earned in ASEAN only', 'Compensation income only'], answerIndex: 1, explanation: 'Non-resident aliens are subject to Philippine income tax only on income derived from sources within the Philippines, unlike resident citizens who are taxed on worldwide income.' }
            },
            {
              id: '1-3',
              heading: 'Value Added Tax (VAT)',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'VAT is a 12% tax on the sale, barter, exchange, or lease of goods and services and on the importation of goods. The VAT registered taxpayer is the seller, who may pass on the tax to the buyer.\n\nInput VAT (paid on purchases) is credited against output VAT (collected on sales). If input VAT exceeds output VAT, the excess is a creditable input tax carry-over or refundable. Zero-rated transactions generate no output VAT but input VAT is refundable.',
              barExam: { frequency: 'High', commonTraps: ['Confusing zero-rating with exemption (exempt sales also produce no output VAT but input VAT is not refundable)', 'Forgetting the two-year prescriptive period for VAT refund claims'], sampleAnswer: 'Determine whether the transaction is VATable, zero-rated, or exempt; compute output and input VAT; determine if excess input VAT is refundable or creditable; and check the prescriptive period.' },
              cases: [{ name: 'Commissioner of Internal Revenue v. Seagate Technology', doctrine: 'Zero-rating of sales to PEZA-registered enterprises', facts: 'The Court held that sales to PEZA enterprises are zero-rated cross-border transactions entitling the seller to a VAT refund on input taxes.' }],
              quiz: { question: 'The key difference between a VAT-exempt sale and a zero-rated sale is:', options: ['Zero-rated sales are taxed at a lower rate', 'Zero-rated sales allow recovery of input VAT; exempt sales do not', 'VAT-exempt sales apply only to essential goods', 'There is no practical difference'], answerIndex: 1, explanation: 'Both zero-rated and exempt sales produce zero output VAT, but zero-rated sellers can claim refund/credit of input VAT while sellers of exempt goods and services cannot.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Estate Tax, Donor\'s Tax, and Tax Remedies',
          sections: [
            {
              id: '2-1',
              heading: 'Estate Tax',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Estate tax is imposed on the transfer of the net estate of a decedent to his heirs. Under the TRAIN Law, the estate tax rate is a flat 6% of the net taxable estate.\n\nThe estate tax return must be filed and tax paid within one year from the decedent\'s death, extendable by the BIR Commissioner for meritorious cases. The estate tax applies to the net estate — gross estate less allowable deductions including the standard deduction of PHP 5,000,000.',
              barExam: { frequency: 'High', commonTraps: ['Using old graduated estate tax rates instead of the TRAIN Law flat 6%', 'Forgetting the standard deduction amount under TRAIN'], sampleAnswer: 'Compute gross estate, apply deductions including the PHP 5M standard deduction, compute net estate, apply the 6% flat rate, and address compliance requirements.' },
              cases: [{ name: 'Dizon v. Court of Tax Appeals', doctrine: 'Deductibility of claims against the estate', facts: 'The Court clarified the conditions for deducting claims against the estate, requiring that the indebtedness be valid and existing at the time of death.' }],
              quiz: { question: 'Under the TRAIN Law, the estate tax rate is:', options: ['5% to 20% graduated', 'A flat 6%', '12%', '25% for estates above PHP 10 million'], answerIndex: 1, explanation: 'The TRAIN Law (R.A. 10963) replaced the graduated estate tax rates with a single flat rate of 6% of the net taxable estate.' }
            },
            {
              id: '2-2',
              heading: 'Tax Remedies: Assessment and Collection',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'The BIR has three years from the last day prescribed for filing the return (or actual filing, whichever is later) to assess a deficiency tax. The prescriptive period is extended to ten years in cases of fraudulent returns or failure to file.\n\nA disputed assessment follows the sequence: Preliminary Assessment Notice (PAN), Final Assessment Notice (FAN/FLD), administrative protest within 30 days, resolution, appeal to the Court of Tax Appeals (CTA) within 30 days, CTA Division, CTA En Banc, then Supreme Court.',
              barExam: { frequency: 'High', commonTraps: ['Missing the 30-day appeal period to the CTA', 'Confusing the three-year and ten-year prescriptive periods'], sampleAnswer: 'Identify the prescriptive period applicable (3 or 10 years), check whether it has lapsed, trace the protest procedure from PAN to CTA appeal, and determine whether the assessment is valid and collectible.' },
              cases: [{ name: 'Commissioner of Internal Revenue v. Philippine Daily Inquirer', doctrine: 'Validity of assessment and requirement of PAN', facts: 'The Court voided a deficiency assessment where the BIR failed to issue the required Preliminary Assessment Notice before issuing the final assessment.' }],
              quiz: { question: 'The general prescriptive period for the BIR to assess a deficiency tax is:', options: ['5 years from filing of return', '3 years from the last day to file or actual filing, whichever is later', '10 years from the transaction', '1 year from discovery of the deficiency'], answerIndex: 1, explanation: 'Under Section 203 of the NIRC, the BIR has three years from the last day prescribed for filing the return, or from the actual date of filing if filed late, to assess a deficiency.' }
            }
          ]
        }
      ]
    },
    {
      id: 'labor-law',
      title: 'Labor Law and Social Legislation',
      description: 'Master employment relations, labor standards, labor relations, and social legislation doctrines critical to the Philippine bar examination.',
      price: 1699,
      year: 4,
      yearLevel: '4th Year',
      chapters: [
        {
          id: '1',
          title: 'Employment Relations and Labor Standards',
          sections: [
            {
              id: '1-1',
              heading: 'Employer-Employee Relationship',
              yearLevel: '4th Year',
              difficulty: 'easy',
              barFrequency: 'high',
              content: 'The existence of an employer-employee relationship is determined by the four-fold test: (1) selection and engagement, (2) payment of wages, (3) power of dismissal, and (4) power of control over the means and method of work.\n\nThe control test is the most important element. Economic dependence and the two-tiered test (economic reality plus control) supplement analysis for non-traditional work arrangements.',
              barExam: { frequency: 'High', commonTraps: ['Focusing only on the control test without the full four-fold analysis', 'Treating independent contractors as employees based on integration alone'], sampleAnswer: 'Apply the four-fold test systematically to each element, emphasize the control test, and conclude on whether an employer-employee relationship exists.' },
              cases: [{ name: 'Orozco v. Court of Appeals', doctrine: 'Control test in employer-employee determination', facts: 'The Court found no employer-employee relationship where the engagement was for a specific task and the hiring party exercised no control over the manner of work.' }],
              quiz: { question: 'The most determinative element in the four-fold test of employment is:', options: ['Payment of wages', 'Power to hire and fire', 'Control over the means and method of work', 'Provision of tools and equipment'], answerIndex: 2, explanation: 'While all four elements must concur, the control test — power to control not just the result but the means and method — is the most important determinant of employer-employee relationship.' }
            },
            {
              id: '1-2',
              heading: 'Security of Tenure and Just Causes for Dismissal',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Security of tenure is a constitutionally protected right. An employee can only be dismissed for just cause (Article 297 Labor Code) or authorized cause (Article 298), and after compliance with procedural due process (twin notice and hearing rule).\n\nJust causes include serious misconduct, willful disobedience, gross and habitual neglect, fraud, and commission of a crime. Authorized causes include redundancy, retrenchment, closure, and disease. Authorized causes require 30 days advance notice to both the employee and the DOLE.',
              barExam: { frequency: 'High', commonTraps: ['Confusing just and authorized causes and their notice requirements', 'Forgetting that illegal dismissal entitles the employee to reinstatement and full backwages'], sampleAnswer: 'Classify the ground as just or authorized, apply the corresponding procedural requirements (twin notice vs. 30-day advance notice to DOLE), and compute the remedies for illegal dismissal.' },
              cases: [{ name: 'King of Kings Transport v. Mamac', doctrine: 'Twin notice rule in termination for just cause', facts: 'The Court laid down the requirements of the two-notice rule: a written notice specifying the grounds and a written notice of the decision to terminate after the opportunity to be heard.' }],
              quiz: { question: 'An employee dismissed for authorized cause (e.g., redundancy) is entitled to:', options: ['Reinstatement and full backwages', 'Separation pay only, computed at 1 month per year of service', 'Separation pay and moral damages automatically', 'Nothing if the cause is genuine'], answerIndex: 1, explanation: 'Authorized-cause dismissal entitles the employee to separation pay (at least 1 month per year of service for redundancy, or 1/2 month for retrenchment), not reinstatement, as the position itself is abolished.' }
            },
            {
              id: '1-3',
              heading: 'Wage Laws and Labor Standards',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'The State guarantees minimum wage, overtime pay, holiday pay, service incentive leave, and 13th month pay as mandatory labor standards. Employers cannot validly waive these through individual contracts.\n\nOvertime pay is 25% additional for work exceeding 8 hours on ordinary days; 30% for rest days and holidays. Night shift differential is 10% of regular wage for work between 10 PM and 6 AM.',
              barExam: { frequency: 'Medium', commonTraps: ['Applying regular overtime rates to holiday work', 'Forgetting the distinction between premium pay and overtime pay'], sampleAnswer: 'Identify the applicable labor standard (overtime, holiday, night shift differential), compute the correct rate, and address whether contractual waiver is valid.' },
              cases: [{ name: 'Dole Philippines v. Esteva', doctrine: 'Non-diminution of benefits and voluntary employer practice', facts: 'The Court applied the non-diminution rule to prevent the employer from withdrawing benefits regularly given to employees, even without a legal obligation to provide them.' }],
              quiz: { question: 'The non-diminution of benefits rule under the Labor Code means:', options: ['Wages can never be adjusted downward for any reason', 'Benefits that have become part of employment contracts by practice cannot be withdrawn unilaterally', 'Minimum wage applies to all benefits', 'Benefits set by CBA can be reduced by individual agreement'], answerIndex: 1, explanation: 'The non-diminution rule prohibits employers from eliminating or reducing employee benefits that have ripened into company practice, even if not required by law or CBA.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Labor Relations and Collective Bargaining',
          sections: [
            {
              id: '2-1',
              heading: 'Right to Self-Organization and Union Formation',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Workers have the constitutional right to form, join, or assist labor organizations for purposes of collective bargaining or for mutual aid and protection. This right is available to all workers except managerial employees and members of the AFP, PNP, and similar forces.\n\nA union may be organized upon compliance with registration requirements. A legitimate labor organization has legal personality to bargain collectively, sue and be sued, and represent its members.',
              barExam: { frequency: 'High', commonTraps: ['Extending self-organization rights to managerial employees', 'Confusing the bargaining unit with the exclusive bargaining agent'], sampleAnswer: 'Confirm the worker is not a managerial employee or falls within excluded categories, identify the appropriate bargaining unit, and address the union\'s status as exclusive bargaining representative.' },
              cases: [{ name: 'San Miguel v. Beralde', doctrine: 'Managerial employees excluded from self-organization', facts: 'The Court excluded employees who formulate, determine, or effectively recommend management policies from union membership and bargaining units.' }],
              quiz: { question: 'Managerial employees are excluded from the right to self-organization because:', options: ['They earn above minimum wage', 'They have the power to formulate or effectively recommend management policies', 'They are considered employers under the Labor Code', 'They are covered by civil service rules'], answerIndex: 1, explanation: 'The Labor Code excludes managerial employees because there is an inherent conflict of interest between their management functions and collective bargaining, as they act in the interest of the employer.' }
            },
            {
              id: '2-2',
              heading: 'Collective Bargaining Agreements and Unfair Labor Practices',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'A CBA is a contract between a certified union and the employer governing wages, hours, and other terms and conditions of employment. The CBA is effective for five years; the economic provisions may be renegotiated after three years.\n\nUnfair labor practices (ULPs) by employers include interference with the right to self-organization, discrimination to discourage union membership, and refusal to bargain collectively. ULPs by unions include restraint or coercion of employees and causing employers to discriminate against employees.',
              barExam: { frequency: 'High', commonTraps: ['Applying ULP rules symmetrically without noting that employer ULPs are more numerous', 'Forgetting the criminal nature of ULPs beyond the administrative remedy'], sampleAnswer: 'Identify whether the ULP is committed by the employer or union, apply the specific ULP ground, address the administrative (NLRC) and criminal remedies, and determine the appropriate relief.' },
              cases: [{ name: 'Insular Life Assurance v. NLRC', doctrine: 'Unfair labor practice and interference with union activities', facts: 'The Court found ULP where the employer pressured employees to withdraw from union membership through supervisory influence and economic threats.' }],
              quiz: { question: 'The economic provisions of a CBA may be renegotiated:', options: ['After one year', 'After three years within the five-year CBA term', 'Only upon expiry of the five-year term', 'At any time by mutual consent'], answerIndex: 1, explanation: 'Under Article 264 of the Labor Code, the CBA is for five years but the parties shall renegotiate the economic provisions not later than three years after its execution.' }
            }
          ]
        }
      ]
    },
    {
      id: 'legal-ethics',
      title: 'Legal Ethics and Practical Exercises',
      description: 'Command the Code of Professional Responsibility and Accountability, bar ethics, and practical court skills essential to Philippine law practice.',
      price: 1399,
      year: 4,
      yearLevel: '4th Year',
      chapters: [
        {
          id: '1',
          title: 'The Lawyer and the Legal Profession',
          sections: [
            {
              id: '1-1',
              heading: 'Nature of the Legal Profession',
              yearLevel: '4th Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'The practice of law is a privilege burdened with conditions, not a right. The Supreme Court has plenary power over the admission to and supervision of the Philippine bar, including the power to discipline and disbar.\n\nA lawyer is an officer of the court and an instrument for advancing justice. The lawyer owes duties to the client, to the court, to the profession, and to society.',
              barExam: { frequency: 'Medium', commonTraps: ['Treating bar admission as a vested right', 'Confusing the three-fold duties (court, client, society) with the four-fold duties'], sampleAnswer: 'State that law practice is a privilege, identify the Supreme Court\'s regulatory power, and enumerate the lawyer\'s four-fold duties.' },
              cases: [{ name: 'In re: Cunanan', doctrine: 'Bar admission as a judicial function', facts: 'The Supreme Court struck down a congressional act lowering the passing grade for the bar, reaffirming that bar admission is exclusively within the Court\'s prerogative.' }],
              quiz: { question: 'The power to discipline and disbar lawyers in the Philippines is vested in:', options: ['The Integrated Bar of the Philippines', 'The Department of Justice', 'The Supreme Court', 'The Court of Appeals'], answerIndex: 2, explanation: 'The Supreme Court has exclusive jurisdiction over bar admission, discipline, and disbarment of lawyers under the Constitution and the Rules of Court.' }
            },
            {
              id: '1-2',
              heading: 'Canon 1: Independence and Integrity',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Under the Code of Professional Responsibility and Accountability (CPRA), a lawyer shall uphold the Constitution, obey the laws, and promote respect for legal processes. A lawyer shall not engage in unlawful, dishonest, immoral, or deceitful conduct.\n\nIndependence requires the lawyer to maintain the integrity of the legal profession and avoid influence that compromises legal advice or advocacy.',
              barExam: { frequency: 'High', commonTraps: ['Citing old CPR canons without referring to the 2023 CPRA', 'Confusing administrative and criminal liability for lawyer misconduct'], sampleAnswer: 'Cite the applicable CPRA canon, apply it to the facts, identify any violation, and state the applicable sanction.' },
              cases: [{ name: 'Lim v. Barcelona', doctrine: 'Lawyer\'s duty of candor and independence from client control', facts: 'The Court disciplined counsel who followed client instructions to suppress material evidence, holding the duty to the court superior.' }],
              quiz: { question: 'Under the CPRA, a lawyer who knowingly assists a client in committing fraud:', options: ['Is justified if the client insists', 'Violates professional duties and may be disciplined', 'Has absolute immunity for following client orders', 'Must report the fraud but is not personally liable'], answerIndex: 1, explanation: 'The CPRA prohibits lawyers from assisting clients in illegal or fraudulent acts. Disciplinary liability attaches regardless of client instruction.' }
            },
            {
              id: '1-3',
              heading: 'Duties to the Court',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'A lawyer owes entire devotion to the cause of the client but also a duty of candor, fairness, and good faith to the court. The duty to the court is paramount and supersedes the duty to the client where they conflict.\n\nForum shopping, false statements of fact, and filing of frivolous pleadings constitute violations of the duty to the court and are grounds for disciplinary action.',
              barExam: { frequency: 'High', commonTraps: ['Treating the duty to the client as absolute', 'Forgetting that forum shopping violates both procedural rules and legal ethics'], sampleAnswer: 'Identify the conflict between duties, state that the court duty is paramount, and apply the relevant CPRA canon and Rules of Court provision.' },
              cases: [{ name: 'Chavez v. Viola', doctrine: 'Forum shopping as contempt and disciplinary violation', facts: 'The Court simultaneously imposed disciplinary sanctions on counsel and dismissed the case for willful forum shopping.' }],
              quiz: { question: 'When the duty to the court conflicts with the duty to the client, the lawyer must:', options: ['Follow the client\'s instructions to protect their interests', 'Prioritize the duty to the court', 'Seek a third opinion from the IBP', 'Withdraw from the case immediately'], answerIndex: 1, explanation: 'The duty to the court is paramount. A lawyer cannot do for a client what the law forbids or what would be dishonest or dishonorable to the court.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Attorney-Client Relations and Fees',
          sections: [
            {
              id: '2-1',
              heading: 'Creation and Termination of Attorney-Client Relationship',
              yearLevel: '4th Year',
              difficulty: 'easy',
              barFrequency: 'medium',
              content: 'The attorney-client relationship is created by express or implied agreement, or by appointment of the court. It is a fiduciary relationship requiring the lawyer to act with the utmost good faith and fidelity.\n\nTermination may occur by completion of the purpose, revocation by the client, withdrawal by the lawyer (with leave of court if the case is pending), death of either party, or disbarment/suspension of the lawyer.',
              barExam: { frequency: 'Medium', commonTraps: ['Forgetting that withdrawal from a pending case requires leave of court', 'Confusing termination of the relationship with termination of duties of confidentiality'], sampleAnswer: 'Identify how the relationship was created, assess the grounds for termination, and state whether court approval is needed.' },
              cases: [{ name: 'Orcino v. Gaspar', doctrine: 'Lawyer\'s duty to the client surviving termination', facts: 'The Court held that certain duties, particularly confidentiality, survive termination of the attorney-client relationship.' }],
              quiz: { question: 'A lawyer who withdraws from a pending case without leave of court:', options: ['Is automatically disbarred', 'Is subject to disciplinary action', 'Has no duty to the client after filing notice of withdrawal', 'May freely do so after the client fails to pay fees'], answerIndex: 1, explanation: 'Withdrawal from a pending case without leave of court violates the Rules of Court and the CPRA, and is a ground for disciplinary proceedings.' }
            },
            {
              id: '2-2',
              heading: 'Attorney\'s Fees and Quantum Meruit',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Attorney\'s fees may be contingent, fixed, or computed on a quantum meruit basis. Contingency fee arrangements are valid in the Philippines and courts will sustain them unless they are unconscionable.\n\nQuantum meruit allows recovery of reasonable compensation for services rendered even without an express contract, computed based on factors including complexity, time, results obtained, and customary fees.',
              barExam: { frequency: 'High', commonTraps: ['Treating all contingency fees as champertous', 'Forgetting quantum meruit as an independent basis for fee recovery'], sampleAnswer: 'Identify the fee arrangement, assess validity, apply quantum meruit factors if the arrangement is void or incomplete, and compute the reasonable fee.' },
              cases: [{ name: 'Rayos v. Hernandez', doctrine: 'Reduction of unconscionable attorney\'s fee', facts: 'The Court reduced a contingency fee from 50% to 30% on grounds of unconscionability, applying the court\'s inherent power to supervise attorney-client fee arrangements.' }],
              quiz: { question: 'A contingency fee arrangement in the Philippines is:', options: ['Prohibited as champertous', 'Valid unless unconscionable', 'Valid only if approved by the court beforehand', 'Limited to 20% of the amount recovered'], answerIndex: 1, explanation: 'Contingency fees are recognized and valid in the Philippines. Courts may reduce them if unconscionable but do not require pre-approval.' }
            }
          ]
        }
      ]
    },
    {
      id: 'remedial-law-review',
      title: 'Remedial Law Review',
      description: 'Synthesize and apply all remedial law doctrines — civil, criminal, and special proceedings — through bar-style comprehensive issue analysis and case method.',
      price: 1999,
      year: 4,
      yearLevel: '4th Year',
      chapters: [
        {
          id: '1',
          title: 'Special Civil Actions',
          sections: [
            {
              id: '1-1',
              heading: 'Certiorari, Prohibition, and Mandamus',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'Rule 65 provides three special civil actions: certiorari (annulment of jurisdictional errors or grave abuse of discretion), prohibition (command to desist), and mandamus (compulsion to perform a ministerial duty).\n\nCertiorari under Rule 65 lies only when there is no appeal or any plain, speedy, and adequate remedy in the ordinary course of law. It is not a substitute for a lost appeal.',
              barExam: { frequency: 'High', commonTraps: ['Using certiorari as substitute for a lost or lapsed appeal', 'Confusing grave abuse of discretion with error of judgment'], sampleAnswer: 'Identify the writ (certiorari, prohibition, or mandamus), confirm the absence of adequate remedy, and distinguish grave abuse from mere error of judgment.' },
              cases: [{ name: 'Delos Santos v. Metropolitan Bank', doctrine: 'Certiorari not a substitute for appeal', facts: 'The Court dismissed a Rule 65 petition filed after the reglementary period for appeal had lapsed, reiterating that certiorari cannot substitute for a lost appeal.' }],
              quiz: { question: 'Rule 65 certiorari is a proper remedy when:', options: ['The trial court erred in evaluating the evidence', 'There is no appeal or other plain, speedy, and adequate remedy', 'The appeal period has lapsed', 'The trial court denied a motion to dismiss'], answerIndex: 1, explanation: 'Certiorari under Rule 65 is available only when there is no appeal or other adequate remedy in the ordinary course of law.' }
            },
            {
              id: '1-2',
              heading: 'Quo Warranto and Expropriation',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'medium',
              content: 'Quo warranto is a special civil action to determine the right of a person to hold public office or a corporate franchise. It may be filed by the Solicitor General or by a private person claiming entitlement to the office.\n\nExpropriation (eminent domain) is the power of the State to take private property for public use upon payment of just compensation. The two-stage expropriation procedure requires a determination of the right to expropriate and then the determination of just compensation.',
              barExam: { frequency: 'Medium', commonTraps: ['Forgetting the Solicitor General\'s exclusive authority for quo warranto on usurped office', 'Missing the two-stage nature of expropriation proceedings'], sampleAnswer: 'Identify the writ or proceeding, state who may institute it, and apply the procedural two-stage framework for expropriation or the standing rules for quo warranto.' },
              cases: [{ name: 'Republic v. Gingoyon', doctrine: 'Just compensation and deposit rule in expropriation', facts: 'The Court established rules on the amount the government must deposit before taking possession of expropriated property under NAIA III proceedings.' }],
              quiz: { question: 'The first stage in an expropriation proceeding determines:', options: ['The amount of just compensation only', 'The right of the plaintiff to expropriate and the propriety of the action', 'Whether the property is declared public', 'The rental value of the property'], answerIndex: 1, explanation: 'The first stage of expropriation determines whether the condemnor has the right to take the property and whether the purpose is public. Only if answered affirmatively does the second stage (just compensation) proceed.' }
            }
          ]
        },
        {
          id: '2',
          title: 'Evidence: Core Doctrines',
          sections: [
            {
              id: '2-1',
              heading: 'Burden of Proof and Presumptions',
              yearLevel: '4th Year',
              difficulty: 'medium',
              barFrequency: 'high',
              content: 'Burden of proof is the duty of a party to present evidence to establish a claim or defense. In civil cases the standard is preponderance of evidence; in criminal cases it is proof beyond reasonable doubt.\n\nPresumptions may be conclusive (cannot be overturned by evidence) or disputable (may be rebutted). The best-known disputable presumption is that an accused is presumed innocent until proven guilty.',
              barExam: { frequency: 'High', commonTraps: ['Confusing burden of proof with burden of evidence (burden of going forward)', 'Misapplying the beyond reasonable doubt standard to civil claims'], sampleAnswer: 'Identify whether the case is civil or criminal, apply the correct standard, address any applicable disputable presumptions, and assess if the burden was met.' },
              cases: [{ name: 'People v. Dramayo', doctrine: 'Proof beyond reasonable doubt and presumption of innocence', facts: 'The Court acquitted the accused due to failure of the prosecution to prove guilt to moral certainty, reaffirming the primacy of the presumption of innocence.' }],
              quiz: { question: 'In criminal cases, the quantum of evidence required for conviction is:', options: ['Preponderance of evidence', 'Clear and convincing evidence', 'Proof beyond reasonable doubt', 'Substantial evidence'], answerIndex: 2, explanation: 'The Constitution and the Rules of Court require proof beyond reasonable doubt for criminal conviction to protect the accused\'s liberty interests.' }
            },
            {
              id: '2-2',
              heading: 'Best Evidence and Parol Evidence Rules',
              yearLevel: '4th Year',
              difficulty: 'hard',
              barFrequency: 'high',
              content: 'The Best Evidence Rule (now the Original Document Rule under the 2019 Amendments) requires the original of a document to be produced when its contents are the subject of inquiry. Exceptions include loss, destruction, or impossibility of production.\n\nThe Parol Evidence Rule bars the introduction of prior or contemporaneous oral or written agreements to modify, explain, or add to the terms of a written agreement that is final and complete.',
              barExam: { frequency: 'High', commonTraps: ['Applying Best Evidence when document contents are not in issue', 'Forgetting exceptions to parol evidence (fraud, mistake, failure of consideration)'], sampleAnswer: 'Determine whether the document\'s contents are in issue (Best Evidence) or whether an extrinsic agreement is being introduced to vary the writing (Parol Evidence), apply exceptions, and rule on admissibility.' },
              cases: [{ name: 'Bartolome v. Mariano', doctrine: 'Parol evidence exceptions for intrinsic ambiguity', facts: 'The Court allowed parol evidence to resolve a latent ambiguity in a deed of sale where the written terms were facially complete but internally contradictory.' }],
              quiz: { question: 'The Parol Evidence Rule bars extrinsic evidence to:', options: ['Prove fraud in the inducement of a contract', 'Vary, contradict, or add to the terms of a complete, final written agreement', 'Explain an ambiguous written term', 'Show failure of consideration'], answerIndex: 1, explanation: 'The Parol Evidence Rule bars extrinsic evidence that would contradict or vary the terms of a written agreement treated as final and complete. Exceptions such as fraud, mistake, and ambiguity remain available.' }
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
    description: s.description,
    price: s.price,
    year: s.year,
    yearLevel: s.yearLevel,
    chapterCount: s.chapters.length,
  }))
}

function getSubjectSummary(subjectId) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null
  return {
    id: subject.id,
    title: subject.title,
    description: subject.description,
    price: subject.price,
    year: subject.year,
    yearLevel: subject.yearLevel,
    chapterCount: subject.chapters.length,
  }
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
    description: subject.description,
    price: subject.price,
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
  getSubjectSummary,
  getChapters,
  getTopic,
}
