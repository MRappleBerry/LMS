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
