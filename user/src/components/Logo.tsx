export default function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 50"
      fill="none"
      className={className}
    >
      {/* Icon: Lightning bolt spike inside hexagon */}
      <g transform="translate(4, 3)">
        {/* Hexagon background */}
        <path
          d="M22 0L40 10.5V31.5L22 42L4 31.5V10.5L22 0Z"
          fill="#DC2626"
        />
        {/* Inner hexagon */}
        <path
          d="M22 4L36 12.5V29.5L22 38L8 29.5V12.5L22 4Z"
          fill="#EF4444"
        />
        {/* Lightning bolt / spike */}
        <path
          d="M25 10L15 23H21L17 34L29 19H23L25 10Z"
          fill="white"
        />
        {/* Small accent arrow */}
        <path
          d="M30 12L34 16L30 20"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </g>
      {/* SpikeX text */}
      <text
        x="52"
        y="34"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.5"
        fill="#DC2626"
      >
        Spike
      </text>
      <text
        x="120"
        y="34"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.5"
        fill="#1F2937"
      >
        X
      </text>
      {/* logistics text */}
      <text
        x="140"
        y="34"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="500"
        fontSize="26"
        letterSpacing="0.5"
        fill="#6B7280"
      >
        logistics
      </text>
    </svg>
  );
}
