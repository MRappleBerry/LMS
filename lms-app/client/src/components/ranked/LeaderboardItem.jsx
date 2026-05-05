import RankBadge from './RankBadge'
import AvatarView from './AvatarView'

export default function LeaderboardItem({ entry, highlighted = false }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-3 py-2.5 border text-sm transition-all ${highlighted ? 'bg-cyan-500/12 border-cyan-300/50 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]' : 'bg-md-surf2 border-md-outline/50'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <AvatarView
          avatar={entry.avatar}
          className={`h-8 w-8 rounded-xl overflow-hidden grid place-items-center text-base ${highlighted ? 'bg-cyan-400/15' : 'bg-white/5'} border border-white/10`}
          alt={`${entry.name || 'Player'} avatar`}
        />
        <div className="min-w-0">
          <div className="text-md-onsurf truncate">#{entry.rankPosition} {entry.name}</div>
          <div className="mt-0.5"><RankBadge rating={entry.rating} compact /></div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-md-onsurf font-semibold">{entry.rating}</div>
        <div className="text-[11px] text-md-onsurfvar">ELO</div>
      </div>
    </div>
  )
}
