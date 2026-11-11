
export const Robot: React.FC<{eye?: number; size?: number; tilt?: number; id?: string; color?: string}> = ({
  eye = 1,
  size = 600,
  tilt = 0,
  id = "r",
  color = C.cyan,
}) => {
  const uniqueId = React.useId().replace(/:/g, "");
  const gradientId = `${id}-${uniqueId}`;

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 400 500"
      style={{
        transform: `rotate(${tilt}deg)`,
        filter: `drop-shadow(0 0 40px ${color}55)`,
      }}
    >
      <defs>
        <linearGradient id={`${gradientId}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#32456B" />
          <stop offset=".5" stopColor="#0E1626" />
          <stop offset="1" stopColor="#1D2D4B" />
        </linearGradient>

        <linearGradient id={`${gradientId}rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity=".9" />
          <stop offset=".25" stopColor={color} stopOpacity="0" />
          <stop offset=".8" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".6" />
        </linearGradient>

        <radialGradient id={`${gradientId}e`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".3" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d="M10 500 C20 400 100 360 200 360 C300 360 380 400 390 500Z" fill={`url(#${gradientId}m)`} stroke={color} strokeOpacity=".3" strokeWidth="2" />
      <rect x="165" y="290" width="70" height="90" rx="14" fill="#0A1120" />
      <line x1="200" y1="70" x2="200" y2="30" stroke={color} strokeWidth="4" opacity=".7" />
      <circle cx="200" cy="26" r="8" fill={color} opacity={0.4 + 0.6 * eye} />
      <rect x="80" y="70" width="240" height="240" rx="90" fill={`url(#${gradientId}m)`} />
      <rect x="80" y="70" width="240" height="240" rx="90" fill={`url(#${gradientId}rim)`} opacity=".55" />
      <rect x="108" y="130" width="184" height="104" rx="50" fill="#02050B" stroke={color} strokeOpacity=".45" strokeWidth="2" />

      <g opacity={eye}>
        <circle cx="158" cy="182" r="42" fill={`url(#${gradientId}e)`} />
        <circle cx="242" cy="182" r="42" fill={`url(#${gradientId}e)`} />
        <circle cx="158" cy="182" r={4 + 8 * eye} fill="#fff" />
        <circle cx="242" cy="182" r={4 + 8 * eye} fill="#fff" />
      </g>

      <path d="M130 268 H270" stroke={color} strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};
