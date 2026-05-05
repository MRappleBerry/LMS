const RANK_TIERS = [
  { key: 'bronze', label: 'Bronze', min: 0, max: 1099, icon: 'B', tone: 'from-amber-700 to-orange-500' },
  { key: 'silver', label: 'Silver', min: 1100, max: 1299, icon: 'S', tone: 'from-slate-400 to-slate-200' },
  { key: 'gold', label: 'Gold', min: 1300, max: 1499, icon: 'G', tone: 'from-yellow-500 to-amber-300' },
  { key: 'elite', label: 'Elite', min: 1500, max: 1699, icon: 'E', tone: 'from-fuchsia-500 to-cyan-400' },
  { key: 'bar-candidate', label: 'Bar Candidate', min: 1700, max: 1899, icon: 'C', tone: 'from-indigo-500 to-violet-400' },
  { key: 'bar-master', label: 'Bar Master', min: 1900, max: 9999, icon: 'M', tone: 'from-emerald-400 to-cyan-300' },
]

export function getTierByRating(rating = 1000) {
  const safeRating = Number(rating || 1000)
  return RANK_TIERS.find((tier) => safeRating >= tier.min && safeRating <= tier.max) || RANK_TIERS[0]
}

export function getNextTier(rating = 1000) {
  const safeRating = Number(rating || 1000)
  return RANK_TIERS.find((tier) => tier.min > safeRating) || null
}

export function getTierProgress(rating = 1000) {
  const tier = getTierByRating(rating)
  const safeRating = Number(rating || 1000)
  if (!tier) return 0
  if (tier.key === 'bar-master') return 100

  const span = Math.max(1, tier.max - tier.min + 1)
  const value = Math.max(0, Math.min(span, safeRating - tier.min + 1))
  return Math.round((value / span) * 100)
}

export default function RankBadge({ rating = 1000, compact = false }) {
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
