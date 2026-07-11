type Props = {
  color?: string
  className?: string
}

export default function CardBackground({
  color = "#FFC7C7",
  className = "",
}: Props) {
  return (
    <svg
      viewBox="27 0 260 157"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <rect
        x={32.5}
        y={5.5}
        width={254}
        height={151}
        rx={23.5}
        fill="white"
        stroke="#D5D5D5"
      />

      <rect
        x={30.5}
        y={3.5}
        width={254}
        height={151}
        rx={23.5}
        fill="white"
        stroke="#D5D5D5"
      />

      <rect
        x={27}
        y={0}
        width={255}
        height={152}
        rx={24}
        fill={color}
      />
    </svg>
  )
}