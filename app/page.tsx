"use client"

import { useState, useEffect, useRef } from "react"
import { Gamepad2, Globe, ArrowRight } from "lucide-react"
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

// 优化的打字机效果组件
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

// 更大的移动端头像组件
function EnhancedResponsiveAvatar({ onComplete, isLoading }) {
  const [currentRotation, setCurrentRotation] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    }, 800)
    return () => clearTimeout(timer)
  }, [onComplete])

  // 移动端头像更大
  const avatarSize = isMobile
    ? "w-52 h-52 sm:w-60 sm:h-60" // 移动端显著增大
    : "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72"

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      onClick={handleInteraction}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <motion.div
        key={animationKey}
        animate={{
          rotate: currentRotation,
        }}
        transition={{
          duration: 1.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="relative"
      >
        <div className={`${avatarSize} rounded-full overflow-hidden relative`}>
          <div
            className="absolute inset-0 rounded-full p-1"
            style={{
              background: "linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0, #b8956a)",
              backgroundSize: "300% 300%",
              animation: "gradientShift 5s ease infinite",
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
        </div>
      </motion.div>
    </motion.div>
  )
}

// 简化的老旧浏览器兼容背景组件
function SimplifiedCompatibleBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [delayedMousePosition, setDelayedMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [canUseAdvancedEffects, setCanUseAdvancedEffects] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // 简化的浏览器能力检测
    const checkAdvancedSupport = () => {
      const testEl = document.createElement("div")
      testEl.style.filter = "blur(1px)"
      const supportsFilter = testEl.style.filter !== ""

      const userAgent = navigator.userAgent.toLowerCase()
      const isModernBrowser =
        !userAgent.includes("msie") && !userAgent.includes("trident") && !userAgent.includes("360") && supportsFilter

      setCanUseAdvancedEffects(isModernBrowser)
    }

    checkAdvancedSupport()

    // 鼠标移动事件 - 仅现代浏览器
    const handleMouseMove = (e) => {
      if (canUseAdvancedEffects && !isMobile) {
        const newPosition = { x: e.clientX, y: e.clientY }
        setMousePosition(newPosition)

        // 更优雅的延迟
        setTimeout(() => {
          setDelayedMousePosition(newPosition)
        }, 200)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", checkMobile)
    }
  }, [canUseAdvancedEffects, isMobile])

  // 选择背景图片
  const desktopBg =
    "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh8ho0o-qNZfpecYx-loV1Ij3gF6BmgACYRkAApqnmFZH3mnkoy1eyzYE.jpg"
  const mobileBg =
    "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh8xo0pFTN0Yp1H_7zL3pzPQX1c0JTwACZRkAApqnmFYYPck9JMXOrTYE.jpg"
  const backgroundImage = isMobile ? mobileBg : desktopBg

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 简化的背景图片层 - 老旧浏览器兼容 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#8b6f47", // 回退颜色
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      {/* 简化的温暖覆盖层 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(184, 149, 106, 0.2)",
        }}
      />

      {/* 深色遮罩 - 确保文字可读性 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* 优雅的光影效果 - 仅现代浏览器 */}
      {canUseAdvancedEffects && !isMobile && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              left: delayedMousePosition.x - 200,
              top: delayedMousePosition.y - 200,
              background: "radial-gradient(circle, rgba(184, 149, 106, 0.06) 0%, transparent 70%)",
              filter: "blur(50px)",
              opacity: 0.8,
            }}
            transition={{
              x: { type: "spring", stiffness: 20, damping: 80 },
              y: { type: "spring", stiffness: 20, damping: 80 },
            }}
          />

          <motion.div
            className="absolute w-80 h-80 rounded-full"
            style={{
              left: delayedMousePosition.x * 0.2 - 160,
              top: delayedMousePosition.y * 0.2 - 160,
              background: "radial-gradient(circle, rgba(212, 165, 116, 0.04) 0%, transparent 70%)",
              filter: "blur(40px)",
              opacity: 0.6,
            }}
            transition={{
              x: { type: "spring", stiffness: 15, damping: 100 },
              y: { type: "spring", stiffness: 15, damping: 100 },
            }}
          />
        </>
      )}
    </div>
  )
}

// 优雅的加载动画
function ElegantLoadingAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        transition: { duration: 0.5, ease: "easeOut" },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "#b8956a",
      }}
    >
      <div className="text-center space-y-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full mx-auto"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="text-white text-xl font-light tracking-wide"
        >
          Loading...
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Component() {
  const [isLoading, setIsLoading] = useState(true)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [displayedDescription, setDisplayedDescription] = useState("漫无止境的八月循环了多少次")
  const [isMobile, setIsMobile] = useState(false)
  const hoverTimeoutRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleAvatarHover = (isHovering) => {
    if (isLoading) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (isHovering) {
      setIsHoveringAvatar(true)
      setDisplayedDescription("15532次")
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHoveringAvatar(false)
        setDisplayedDescription("漫无止境的八月循环了多少次")
      }, 2500)
    } else {
      setIsHoveringAvatar(false)
      setDisplayedDescription("漫无止境的八月循环了多少次")
    }
  }

  return (
    <>
      {/* 优化的CSS样式 */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .warm-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        
        /* 丰富的按钮颜色 */
        .warm-button-bilibili {
          background: linear-gradient(135deg, #ff6b9d 0%, #ff8e8e 50%, #ffa8a8 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }
        .warm-button-bilibili:hover {
          box-shadow: 0 8px 25px rgba(255, 107, 157, 0.5);
          transform: translateY(-3px);
          background: linear-gradient(135deg, #ff8eb3 0%, #ffa4a4 50%, #ffbebe 100%);
        }
        
        .warm-button-steam {
          background: linear-gradient(135deg, #4a90e2 0%, #5ba3f5 50%, #6bb6ff 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(74, 144, 226, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }
        .warm-button-steam:hover {
          box-shadow: 0 8px 25px rgba(74, 144, 226, 0.5);
          transform: translateY(-3px);
          background: linear-gradient(135deg, #60a0f2 0%, #71b3ff 50%, #81c6ff 100%);
        }
        
        .warm-button-contact {
          background: linear-gradient(135deg, #50c878 0%, #66d68a 50%, #7ce49c 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(80, 200, 120, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }
        .warm-button-contact:hover {
          box-shadow: 0 8px 25px rgba(80, 200, 120, 0.5);
          transform: translateY(-3px);
          background: linear-gradient(135deg, #66d68a 0%, #7ce49c 50%, #92f2ae 100%);
        }
        
        /* 移动端按钮优化 - 更短 */
        @media (max-width: 768px) {
          .mobile-button {
            width: auto !important;
            min-width: 85px !important; /* 进一步缩短 */
            max-width: 120px !important; /* 进一步缩短 */
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
        }
        
        /* 桌面端按钮优化 - 更宽更矮 */
        @media (min-width: 769px) {
          .desktop-button {
            min-width: 140px !important; /* 加宽 */
            padding: 10px 24px !important; /* 垂直缩短，水平加宽 */
          }
        }
        
        /* 移动端布局修复 */
        @media (max-width: 768px) {
          .mobile-layout {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
          }
          .mobile-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1rem;
          }
          .mobile-footer {
            flex-shrink: 0;
            margin-top: auto;
          }
        }
        
        /* 老旧浏览器回退 */
        .legacy-browser .warm-button-bilibili,
        .legacy-browser .warm-button-steam,
        .legacy-browser .warm-button-contact {
          background: #b8956a !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
        }
      `}</style>

      <div
        className={`text-white relative overflow-hidden ${isMobile ? "mobile-layout" : "min-h-screen flex flex-col"}`}
      >
        {/* 优雅加载动画 */}
        <AnimatePresence>
          {isLoading && <ElegantLoadingAnimation onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* 简化兼容背景 */}
        <SimplifiedCompatibleBackground />

        {/* 主内容区域 - 移动端布局修复 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 40 : 0 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`relative z-10 ${isMobile ? "mobile-main" : "flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8"}`}
        >
          <div className="max-w-4xl w-full">
            <div className={`text-center ${isMobile ? "space-y-4" : "space-y-4 sm:space-y-6"}`}>
              {/* 更大的响应式头像 */}
              <motion.div
                className="flex justify-center"
                onMouseEnter={() => handleAvatarHover(true)}
                onMouseLeave={() => handleAvatarHover(false)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isLoading ? 0.8 : 1,
                  opacity: isLoading ? 0 : 1,
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <EnhancedResponsiveAvatar onComplete={() => {}} isLoading={isLoading} />
              </motion.div>

              {/* 响应式域名标注 - 移动端更大 */}
              <motion.div
                className={`warm-text font-medium ${
                  isMobile ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl lg:text-3xl"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                transition={{
                  delay: 0.6,
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <TypewriterEffect text="Vegcat.icu" delay={600} speed={90} />
              </motion.div>

              {/* 描述文字 - 移动端更大 */}
              <motion.div
                className={`max-w-lg leading-relaxed mx-auto warm-text ${
                  isMobile ? "text-xl sm:text-2xl px-4" : "text-lg sm:text-xl lg:text-2xl"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayedDescription}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <TypewriterEffect
                      text={displayedDescription}
                      delay={isLoading ? 1000 : 0}
                      speed={isHoveringAvatar ? 0 : 70}
                      forceFullText={isHoveringAvatar}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* 彩色矩形按钮 - 响应式尺寸 */}
              <motion.div
                className={`flex flex-col sm:flex-row flex-wrap justify-center gap-3 ${isMobile ? "pt-5" : "pt-6"}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
                transition={{
                  delay: 1.0,
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {[
                  {
                    icon: BilibiliIcon,
                    label: "Bilibili",
                    href: "https://m.bilibili.com/space/497350955",
                    className: "warm-button-bilibili",
                  },
                  {
                    icon: Gamepad2,
                    label: "Steam",
                    href: "https://steamcommunity.com/id/TwoOctober",
                    className: "warm-button-steam",
                  },
                  {
                    icon: Globe,
                    label: "联系我",
                    href: "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh75o0o28biX4Bx8LpQABB9kt0kAgYhkAAlYZAAKap5hWhIUMoKRTIr42BA.jpg",
                    className: "warm-button-contact",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: isLoading ? 0 : 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 1.2 + index * 0.15,
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
                    }}
                    className={isMobile ? "mobile-button" : "desktop-button w-full sm:w-auto"}
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${item.className} block text-center no-underline text-white font-medium ${
                        isMobile ? "px-3 py-2.5 text-sm" : "w-full sm:w-auto px-6 py-2.5"
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </span>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 底部信息 - 移动端固定在底部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{
            delay: 2.2,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`relative z-10 ${isMobile ? "mobile-footer pb-3" : "pb-4"}`}
        >
          <div className={`flex justify-between items-center ${isMobile ? "px-4 text-xs" : "px-4 sm:px-8"}`}>
            <div className="flex-shrink-0">
              <a
                href="https://cat.vegcat.icu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 text-sm warm-text no-underline"
              >
                旧版网页
              </a>
            </div>
            <div className="text-amber-200 text-sm warm-text text-right">
              <TypewriterEffect text="© 2025 Powered by Vegcat" delay={300} speed={90} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
