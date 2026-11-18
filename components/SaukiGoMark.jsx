export default function SaukiGoMark({ className = 'h-9 w-9', decorative = false }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xs ${className}`}
    >
      <img
        src="/logos/sauki-go-mark.webp"
        alt={decorative ? '' : 'Sauki Go'}
        aria-hidden={decorative ? 'true' : undefined}
        width={64}
        height={64}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
