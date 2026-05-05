const BASE_RATING = 800
const DIVISION_STEP = 50
const MAJOR_TIERS = [
  { name: 'Bronze', icon: 'B', tone: 'from-amber-700 to-orange-500' },
  { name: 'Silver', icon: 'S', tone: 'from-slate-400 to-slate-200' },
  { name: 'Gold', icon: 'G', tone: 'from-yellow-500 to-amber-300' },
  { name: 'Diamond', icon: 'D', tone: 'from-cyan-400 to-indigo-300' },
]

const RANK_DIVISIONS = MAJOR_TIERS.flatMap((tier, tierIndex) => {
  return [5, 4, 3, 2, 1].map((division, divisionIndex) => {
    const ladderIndex = tierIndex * 5 + divisionIndex
    const min = BASE_RATING + ladderIndex * DIVISION_STEP
    const max = min + DIVISION_STEP - 1
    return {
      key: `${tier.name.toLowerCase()}-${division}`,
      label: `${tier.name} ${division}`,
      icon: tier.icon,
      tone: tier.tone,
      min,
      max,
    }
  })
})

function getDivisionIndex(rating = BASE_RATING) {
  const safeRating = Number(rating || BASE_RATING)
  if (safeRating <= BASE_RATING) return 0

  const raw = Math.floor((safeRating - BASE_RATING) / DIVISION_STEP)
  return Math.max(0, Math.min(RANK_DIVISIONS.length - 1, raw))
}

export function getTierByRating(rating = BASE_RATING) {
  return RANK_DIVISIONS[getDivisionIndex(rating)]
}

export function getNextTier(rating = BASE_RATING) {
  const idx = getDivisionIndex(rating)
  if (idx >= RANK_DIVISIONS.length - 1) return null
  return RANK_DIVISIONS[idx + 1]
}

export function getTierProgress(rating = BASE_RATING) {
  const tier = getTierByRating(rating)
  const safeRating = Number(rating || BASE_RATING)
  if (!tier) return 0
  if (tier.label === 'Diamond 1') return 100

  const span = Math.max(1, tier.max - tier.min + 1)
  const value = Math.max(0, Math.min(span, safeRating - tier.min + 1))
  return Math.round((value / span) * 100)
}

export default function RankBadge({ rating = BASE_RATING, compact = false }) {
  const tier = getTierByRating(rating)

  return (
    <div className={`inline-flex items-center ${compact ? 'gap-1.5' : 'gap-2'} rounded-full border border-white/20 bg-white/5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'}`}>
      <div className={`grid place-items-center rounded-full bg-gradient-to-br ${tier.tone} ${compact ? 'h-5 w-5 text-[10px]' : 'h-6 w-6 text-xs'} font-black text-black/80`}>
        {tier.icon}
      </div>
      <span className={`${compact ? 'text-[11px]' : 'text-xs'} font-semibold text-white/90`}>{tier.label}</span>
    </div>
  )
}
