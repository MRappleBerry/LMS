import RankBadge, { getNextTier, getTierProgress } from './RankBadge'
import AvatarView from './AvatarView'

function safeRecord(profile) {
  const safeProfile = profile || {}
  return {
    wins: Number(safeProfile.wins || 0),
    losses: Number(safeProfile.losses || 0),
  }
}

export default function PlayerCard({ profile, streak = 0, onAvatarClick }) {
  const rating = Number(profile?.rating || 1000)
  const record = safeRecord(profile)
  const nextTier = getNextTier(rating)
  const progress = getTierProgress(rating)

  return (
    <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-cyan-400/70 via-indigo-400/60 to-emerald-300/70 shadow-[0_10px_30px_rgba(45,212,191,0.15)]">
      <div className="rounded-3xl bg-[#0d1228] border border-white/10 p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onAvatarClick}
            className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/15 text-xl grid place-items-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Choose avatar"
          >
            <AvatarView
              avatar={profile?.avatar}
              className="h-12 w-12 rounded-2xl overflow-hidden grid place-items-center"
              textClassName="text-xl"
              alt="Player avatar"
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-cyan-200/80">Player Identity</div>
            <div className="text-base font-bold text-white truncate">{profile?.name || 'Law Learner'}</div>
            <div className="mt-1 flex items-center gap-2">
              <RankBadge rating={rating} compact />
              <span className="text-xs text-amber-200/90 font-semibold">ELO {rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90">{record.wins}W - {record.losses}L</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-orange-200">🔥 {streak} win streak</div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
            <span>Tier Progress</span>
            <span>{nextTier ? `${progress}% to ${nextTier.label}` : 'Max tier reached'}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 prog-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
