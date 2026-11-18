export default function SaukiGoMark({ className = 'h-8 w-8', decorative = false }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : 'Sauki Go Utility Mark'}
    >
      {!decorative && <title>Sauki Go Utility Mark</title>}
      <rect width="64" height="64" rx="16" fill="#0F172A" />
      <rect x="1" y="1" width="62" height="62" rx="15" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="2" />
      {/* Signal arcs */}
      <path d="M40 16C44.8 18.8 48 24 48 30" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42.5 11.5C49.2 15.2 53.5 22.1 53.5 30" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
      {/* Stylized G */}
      <path
        d="M36 22.5C33.8 20.9 31 20 28 20C20.8 20 15 25.8 15 33C15 40.2 20.8 46 28 46C34.4 46 39.7 41.4 40.8 35.3H29"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Instant utility lightning bolt */}
      <path d="M37 31L31.5 39H36L34.5 46L42.5 36.5H37.8L39.5 31H37Z" fill="#34D399" />
    </svg>
  )
}
