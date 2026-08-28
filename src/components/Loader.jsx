import { useEffect, useState } from "react"
import { Lottie } from "lottie-react"

let cachedAnimation = null

function useLoaderAnimation() {
  const [animationData, setAnimationData] = useState(cachedAnimation)

  useEffect(() => {
    if (cachedAnimation) return

    fetch("/circle-loader.json")
      .then((res) => res.json())
      .then((data) => {
        cachedAnimation = data
        setAnimationData(data)
      })
      .catch((err) => console.error("Failed to load plant animation:", err))
  }, [])

  return animationData
}

export default function Loader({
  message = "Loading…",
  size = 160,
  className = "",
}) {
  const animationData = useLoaderAnimation()

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center gap-1 ${className}`}
    >
      {animationData ? (
        <Lottie
          src={animationData}
          autoplay
          loop
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="animate-pulse rounded-full bg-slate-200"
          style={{ width: size, height: size }}
        />
      )}
      {message && (
        <p className="text-sm font-medium text-slate-500">{message}</p>
      )}
    </div>
  )
}
