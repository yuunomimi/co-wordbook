type Props = {
  className?: string
}

export default function CardRing({
  className = "",
}: Props) {
  return (
    <svg
      viewBox="0 0 58 54"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="52"
        cy="27"
        r="6"
        fill="#949494"
      />

      <path
        d="M25.5022 51.9551C20.6302 51.6627 15.9504 49.9506 12.04 47.0299C8.12957 44.1093 5.15957 40.1079 3.49636 35.5193C1.83314 30.9307 1.54944 25.9556 2.68027 21.2077C3.8111 16.4598 6.30698 12.1467 9.86006 8.80048C13.4131 5.45427 17.868 3.22127 22.6751 2.37693C27.4823 1.53259 32.4314 2.11384 36.9122 4.04898C41.3929 5.98412 45.2091 9.18851 47.8902 13.2669C50.5713 17.3453 52 22.1193 52 27"
        stroke="#D1D5DB"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}