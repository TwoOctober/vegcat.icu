"use client"

import { useState, useEffect, useRef } from "react"
import { Gamepad2, Globe, ArrowRight, Heart, Star, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Bilibili 图标组件
function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.789 1.894v7.52c.02.765.283 1.395.789 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.128.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  )
}

// 优化的打字机效果组件 - 减少重渲染
function TypewriterEffect({
  text,
  delay = 0,
  speed = 100,
  className = "",
  showCursor = false,
  onComplete,
  forceFullText = false,
}) {
  const [displayedText, setDisplayedText] = useState("")
  const timeoutRef = useRef(null)
  const isCompleteRef = useRef(false)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (forceFullText || isCompleteRef.current) {
      setDisplayedText(text)
      onComplete?.()
      return
    }

    let charIndex = 0
    const typeNextChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
        timeoutRef.current = setTimeout(typeNextChar, speed)
      } else {
        isCompleteRef.current = true
        onComplete?.()
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, delay, speed, onComplete, forceFullText])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: displayedText.length < text.length ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
          className="inline-block ml-1 w-0.5 h-[1em] bg-current"
        />
      )}
    </span>
  )
}

// 二次元风格头像组件 - 优化性能
function AnimeStyleAvatar({ onComplete, isLoading }) {
  const [currentRotation, setCurrentRotation] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleInteraction = () => {
    if (isLoading) return

    const direction = Math.random() > 0.5 ? 1 : -1
    const rotationAmount = 360 * direction

    setCurrentRotation((prev) => prev + rotationAmount)
    setAnimationKey((prev) => prev + 1)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 800) // 减少加载时间
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onMouseEnter={() => {
        setIsHovered(true)
        handleInteraction()
      }}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleInteraction}
      onClick={handleInteraction}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={animationKey}
        animate={{
          rotate: currentRotation,
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className="relative"
      >
        {/* 二次元风格边框 */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden relative">
          {/* 渐变边框 */}
          <div
            className="absolute inset-0 rounded-full p-1"
            style={{
              background: "linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6b9d)",
              backgroundSize: "300% 300%",
              animation: "gradientShift 3s ease infinite",
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              <Image
                src="http://q.qlogo.cn/headimg_dl?dst_uin=1145145797&spec=640&img_type=jpg"
                alt="Avatar"
                width={640}
                height={640}
                className="w-full h-full object-cover"
                priority
                loading="eager"
              />
            </div>
          </div>

          {/* 二次元光效 */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,107,157,0.3) 0%, transparent 70%)",
                boxShadow: "0 0 30px rgba(255,107,157,0.5)",
              }}
            />
          )}
        </div>

        {/* 二次元装饰元素 */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -top-2 -right-2 text-pink-400"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -bottom-2 -left-2 text-yellow-400"
        >
          <Star className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// 二次元风格背景组件 - 优化兼容性和性能
function AnimeStyleBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // 检测浏览器支持
    const testEl = document.createElement("div")
    testEl.style.background = "linear-gradient(45deg, red, blue)"
    const isGradientSupported = testEl.style.background !== ""
    setIsSupported(isGradientSupported)

    const handleMouseMove = (e) => {
      // 节流处理，减少性能消耗
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // 回退背景样式
  const fallbackStyle = {
    backgroundColor: "#1a1a2e",
    backgroundImage:
      "radial-gradient(circle at 25% 25%, #16213e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0f3460 0%, transparent 50%)",
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 主背景 - 二次元风格渐变 */}
      <motion.div
        className="absolute inset-0"
        style={
          isSupported
            ? {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                backgroundSize: "400% 400%",
              }
            : fallbackStyle
        }
        animate={
          isSupported
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : {}
        }
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* 覆盖层 - 降低亮度 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      />

      {/* 二次元光斑效果 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          background: "radial-gradient(circle, #ff6b9d 0%, transparent 70%)",
          filter: "blur(40px)",
          WebkitFilter: "blur(40px)",
        }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 30 },
          y: { type: "spring", stiffness: 50, damping: 30 },
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-15"
        style={{
          left: mousePosition.x * 0.3 - 160,
          top: mousePosition.y * 0.3 - 160,
          background: "radial-gradient(circle, #4facfe 0%, transparent 70%)",
          filter: "blur(35px)",
          WebkitFilter: "blur(35px)",
        }}
        transition={{
          x: { type: "spring", stiffness: 30, damping: 40 },
          y: { type: "spring", stiffness: 30, damping: 40 },
        }}
      />

      {/* 二次元装饰粒子 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 12}%`,
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            backgroundColor: ["#ff6b9d", "#4facfe", "#f093fb", "#764ba2", "#667eea", "#f5576c"][i],
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// 快速加载动画 - 二次元风格
function AnimeLoadingAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 400) // 减少加载时间
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="w-12 h-12 mx-auto relative"
        >
          <Heart className="w-12 h-12 text-pink-300" fill="currentColor" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-white text-lg font-bold"
          style={{ fontFamily: "'Comic Sans MS', cursive" }}
        >
          Loading...♡
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Component() {
  const [isLoading, setIsLoading] = useState(true)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [displayedDescription, setDisplayedDescription] = useState("那一天的忧郁 忧郁起来")
  const hoverTimeoutRef = useRef(null)

  const handleAvatarHover = (isHovering) => {
    if (isLoading) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (isHovering) {
      setIsHoveringAvatar(true)
      setDisplayedDescription("有bug吗？有bug就对了～(￣▽￣)~*")
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHoveringAvatar(false)
        setDisplayedDescription("那一天的忧郁 忧郁起来")
      }, 2000)
    } else {
      setIsHoveringAvatar(false)
      setDisplayedDescription("那一天的忧郁 忧郁起来")
    }
  }

  return (
    <>
      {/* 内联CSS动画 - 避免外部依赖 */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .anime-text {
          font-family: 'Comic Sans MS', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          text-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
        }
        .anime-button {
          background: linear-gradient(45deg, #ff6b9d, #4facfe);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
          transition: all 0.3s ease;
        }
        .anime-button:hover {
          box-shadow: 0 6px 20px rgba(255, 107, 157, 0.5);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
        {/* 加载动画 */}
        <AnimatePresence>
          {isLoading && <AnimeLoadingAnimation onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* 二次元风格背景 */}
        <AnimeStyleBackground />

        {/* 主内容区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center space-y-4 sm:space-y-6">
              {/* 二次元风格头像 */}
              <div
                className="flex justify-center"
                onMouseEnter={() => handleAvatarHover(true)}
                onMouseLeave={() => handleAvatarHover(false)}
              >
                <AnimeStyleAvatar onComplete={() => {}} isLoading={isLoading} />
              </div>

              {/* 域名标注 - 二次元风格 */}
              <div className="text-xl sm:text-2xl lg:text-3xl anime-text">
                <TypewriterEffect text="✧･ﾟ: *✧･ﾟ:* Vegcat.icu *:･ﾟ✧*:･ﾟ✧" delay={400} speed={80} />
              </div>

              {/* 描述文字 - 二次元风格 */}
              <motion.div className="text-lg sm:text-xl lg:text-2xl max-w-lg leading-relaxed mx-auto anime-text">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayedDescription}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <TypewriterEffect
                      text={displayedDescription}
                      delay={isLoading ? 800 : 0}
                      speed={isHoveringAvatar ? 0 : 60}
                      forceFullText={isHoveringAvatar}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* 二次元风格按钮 */}
              <motion.div
                transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-6"
              >
                {[
                  {
                    icon: BilibiliIcon,
                    label: "哔哩哔哩 ♡",
                    href: "https://m.bilibili.com/space/497350955",
                    color: "#ff6b9d",
                  },
                  {
                    icon: Gamepad2,
                    label: "Steam ★",
                    href: "https://steamcommunity.com/id/TwoOctober",
                    color: "#4facfe",
                  },
                  {
                    icon: Globe,
                    label: "联系我 ♪",
                    href: "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh75o0o28biX4Bx8LpQABB9kt0kAgYhkAAlYZAAKap5hWhIUMoKRTIr42BA.jpg",
                    color: "#f093fb",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: isLoading ? 0 : 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 1.4 + index * 0.1,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: { duration: 0.1 },
                    }}
                    className="w-full sm:w-auto"
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="anime-button block w-full sm:w-auto px-6 py-3 rounded-full text-white font-bold text-center no-underline"
                      style={{
                        background: `linear-gradient(45deg, ${item.color}, #764ba2)`,
                      }}
                    >
                      <span className="flex items-center justify-center">
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 底部信息 - 二次元风格 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
          transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 pb-4"
        >
          <div className="flex justify-between items-center px-4 sm:px-8">
            <div className="flex-shrink-0">
              <a
                href="https://cat.vegcat.icu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-300 hover:text-pink-200 transition-colors duration-300 text-sm anime-text no-underline"
              >
                ← 旧版网页
              </a>
            </div>
            <div className="text-pink-300 text-sm anime-text text-right">
              <TypewriterEffect text="© 2025 Made with ♡ by Vegcat" delay={200} speed={80} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
