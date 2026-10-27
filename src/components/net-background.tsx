const NODES: [number, number, number][] = [
  [80, 120, 3],
  [260, 210, 4],
  [420, 140, 3],
  [330, 380, 4],
  [140, 520, 3],
  [520, 560, 3],
  [700, 700, 3],
  [1040, 90, 3],
  [1180, 230, 4],
  [1120, 420, 4],
  [1230, 610, 3],
  [960, 720, 3],
]
const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [3, 5],
  [5, 6],
  [7, 8],
  [8, 9],
  [9, 10],
  [11, 9],
]

/** Nodos de red y ondas Wi-Fi para el login. Decorativo. */
export function NetBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1280 800"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full text-[var(--net-line)]"
    >
      <g stroke="currentColor" strokeOpacity="0.16" fill="none">
        {LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a]![0]}
            y1={NODES[a]![1]}
            x2={NODES[b]![0]}
            y2={NODES[b]![1]}
          />
        ))}
      </g>
      <g fill="currentColor" fillOpacity="0.45">
        {NODES.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g stroke="currentColor" fill="none" strokeLinecap="round" strokeWidth="2">
        {[70, 120, 170, 220].map((radius, i) => (
          <path
            key={radius}
            d={`M ${890 - radius} 470 A ${radius} ${radius} 0 0 1 ${890 + radius} 470`}
            strokeOpacity={[0.22, 0.14, 0.09, 0.05][i]}
          />
        ))}
      </g>
    </svg>
  )
}
