function isUrlAvatar(value) {
  if (!value || typeof value !== 'string') return false
  return /^https?:\/\//i.test(value)
}

export default function AvatarView({
  avatar,
  fallback = '⚖️',
  className = '',
  textClassName = '',
  alt = 'Avatar',
}) {
  const value = avatar || fallback

  if (isUrlAvatar(value)) {
    return (
      <div className={className}>
        <img
          src={value}
          alt={alt}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={(event) => {
            // Fallback to emoji container if external avatar fails to load
            event.currentTarget.style.display = 'none'
            const parent = event.currentTarget.parentElement
            if (parent) parent.textContent = fallback
          }}
        />
      </div>
    )
  }

  return <div className={`${className} ${textClassName}`}>{value}</div>
}
