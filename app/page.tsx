"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
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
  forceFullText = false, // New prop to force full text display
}) {
  const [displayedText, setDisplayedText] = useState("")
  const timeoutRef = useRef(null)
  const currentTextPropRef = useRef(text) // To detect changes in the text prop

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If forceFullText is true, display immediately and exit
    if (forceFullText) {
      setDisplayedText(text)
      currentTextPropRef.current = text // Ensure ref is updated
      onComplete?.()
      return
    }

    // If the text prop has changed, reset the displayed text
    if (currentTextPropRef.current !== text) {
      setDisplayedText("")
      currentTextPropRef.current = text
    }

    let charIndex = displayedText.length // Start from current length or 0 if reset

    const typeNextChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++ // Increment for the next call
        timeoutRef.current = setTimeout(typeNextChar, speed)
      } else {
        onComplete?.()
      }
    }

    // Initial delay before starting to type
    timeoutRef.current = setTimeout(typeNextChar, charIndex === 0 ? delay : speed)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, delay, speed, onComplete, forceFullText]) // Dependencies are stable props.

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: displayedText.length < text.length ? Number.POSITIVE_INFINITY : 0, // Cursor blinks only while typing
            ease: "easeInOut",
          }}
          className="inline-block ml-1 w-0.5 h-[1em] bg-current"
        />
      )}
    </span>
  )
}

// 快速响应的旋转头像组件
function QuickRotatingAvatar({ onComplete, isLoading }) {
  const [currentRotation, setCurrentRotation] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  const handleInteraction = () => {
    if (isLoading) return // 如果正在加载，则不响应旋转

    // 随机选择旋转方向和角度
    const direction = Math.random() > 0.5 ? 1 : -1
    const rotationAmount = 360 * direction

    // 立即更新旋转值
    setCurrentRotation((prev) => prev + rotationAmount)
    setAnimationKey((prev) => prev + 1)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      // 移除 initial 和 animate，由父级 motion.div 统一控制入场动画
      className="relative cursor-pointer select-none"
      onMouseEnter={handleInteraction}
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
          duration: 1.5,
          ease: "easeOut",
        }}
        className="relative"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
          <Image
            src="http://q.qlogo.cn/headimg_dl?dst_uin=1145145797&spec=640&img_type=jpg"
            alt="Avatar"
            width={640}
            height={640}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {/* 光环效果 */}
        <motion.div
          animate={{
            rotate: 360,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute inset-0 rounded-full border-2 border-white/10"
        />
      </motion.div>
    </motion.div>
  )
}

// 灰黑色鼠标跟随动态背景组件
function GrayBlackMouseFollowBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 主渐变背景 - 灰黑色调 */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(135deg, #000000 0%, #374151 50%, #111827 100%)",
            "linear-gradient(225deg, #111827 0%, #4b5563 50%, #000000 100%)",
            "linear-gradient(315deg, #000000 0%, #6b7280 50%, #1f2937 100%)",
            "linear-gradient(45deg, #1f2937 0%, #374151 50%, #000000 100%)",
            "linear-gradient(135deg, #000000 0%, #374151 50%, #111827 100%)",
          ],
        }}
        transition={{
          duration: 80,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
      />

      {/* 主光斑 - 灰色调 */}
      <motion.div
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
          scale: [1, 1.1, 0.95, 1.05, 1],
          opacity: [0.08, 0.15, 0.12, 0.18, 0.08],
        }}
        transition={{
          x: { type: "spring", stiffness: 10, damping: 70 },
          y: { type: "spring", stiffness: 10, damping: 70 },
          scale: { duration: 100, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          opacity: { duration: 90, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="absolute w-96 h-96 bg-gray-400/10 rounded-full blur-2xl"
        style={{
          left: 0,
          top: 0,
        }}
      />

      {/* 次要光斑 - 深灰色调 */}
      <motion.div
        animate={{
          x: mousePosition.x * 0.2 - 160,
          y: mousePosition.y * 0.2 - 160,
          scale: [1.05, 0.85, 1.2, 0.9, 1.05],
          opacity: [0.06, 0.12, 0.09, 0.15, 0.06],
        }}
        transition={{
          x: { type: "spring", stiffness: 8, damping: 80 },
          y: { type: "spring", stiffness: 8, damping: 80 },
          scale: { duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          opacity: { duration: 110, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="absolute w-80 h-80 bg-gray-500/8 rounded-full blur-2xl"
        style={{
          right: 0,
          bottom: 0,
        }}
      />

      {/* 第三个光斑 - 浅灰色调 */}
      <motion.div
        animate={{
          x: -mousePosition.x * 0.1 + (typeof window !== "undefined" ? window.innerWidth / 2 : 400) - 140,
          y: -mousePosition.y * 0.1 + (typeof window !== "undefined" ? window.innerHeight / 2 : 400) - 140,
          scale: [0.9, 1.15, 0.8, 1.1, 0.9],
          opacity: [0.04, 0.1, 0.07, 0.12, 0.04],
        }}
        transition={{
          x: { type: "spring", stiffness: 5, damping: 90 },
          y: { type: "spring", stiffness: 5, damping: 90 },
          scale: { duration: 140, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          opacity: { duration: 130, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="absolute w-72 h-72 bg-gray-300/6 rounded-full blur-2xl"
        style={{
          left: 0,
          top: 0,
        }}
      />

      {/* 极慢的粒子 - 白色调 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 0.8, 0],
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 40,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// 快速加载动画组件
function LoadingAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-white/60 text-sm"
        >
          Loading...
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Component() {
  const [showContent, setShowContent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [displayedDescription, setDisplayedDescription] = useState("那一天的忧郁 忧郁起来")
  const hoverTimeoutRef = useRef(null)

  const handleAvatarHover = (isHovering) => {
    if (isLoading) return // 如果正在加载，则不响应旋转

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (isHovering) {
      setIsHoveringAvatar(true)
      setDisplayedDescription("那一天的寂寞 寂寞起来")
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHoveringAvatar(false)
        setDisplayedDescription("那一天的忧郁 忧郁起来")
      }, 2000)
    } else {
      // If mouse leaves before 2 seconds, revert immediately
      setIsHoveringAvatar(false)
      setDisplayedDescription("那一天的忧郁 忧郁起来")
    }
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      {/* 加载动画 */}
      <AnimatePresence>{isLoading && <LoadingAnimation onComplete={() => setIsLoading(false)} />}</AnimatePresence>

      {/* 灰黑色鼠标跟随动态背景 */}
      <GrayBlackMouseFollowBackground />

      {/* 主内容区域 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // 统一的入场动画
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 50 : 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8"
      >
        <div className="max-w-4xl w-full">
          {/* 居中内容 */}
          <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
            {/* 头像替代标题 */}
            <div
              className="flex justify-center"
              onMouseEnter={() => handleAvatarHover(true)}
              onMouseLeave={() => handleAvatarHover(false)}
            >
              <QuickRotatingAvatar onComplete={() => setShowContent(true)} isLoading={isLoading} />
            </div>

            {/* 域名标注 */}
            <div className="text-lg sm:text-xl lg:text-2xl text-gray-300">
              <TypewriterEffect text="Vegcat.icu" delay={600} speed={50} className="font-mono" />
            </div>

            {/* 描述文字 */}
            <motion.div className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-lg leading-relaxed mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedDescription} // Key changes when text changes, triggering re-animation
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }} // Fade transition for text change
                >
                  <TypewriterEffect
                    text={displayedDescription}
                    delay={isLoading ? 1200 : 0} // Delay only on initial load
                    speed={isHoveringAvatar ? 0 : 40} // No typing speed when hovering
                    forceFullText={isHoveringAvatar} // Force full text when hovering
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* 联系按钮 */}
            <motion.div
              transition={{ delay: 1.9, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8"
            >
              {[
                { icon: BilibiliIcon, label: "Bilibili", href: "https://m.bilibili.com/space/497350955" },
                { icon: Gamepad2, label: "Steam", href: "https://steamcommunity.com/id/TwoOctober" },
                { icon: Globe, label: "联系我", href: "http://wpa.qq.com/msgrd?v=3&uin=1145145797&site=qq&menu=yes" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 },
                  }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-white/20 text-sm sm:text-base"
                    asChild
                  >
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center"
                    >
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      </motion.div>
                      {item.label}
                      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                      </motion.div>
                    </motion.a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 底部信息区域 - 优化水平排列 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
        transition={{ delay: 3.0, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 pb-2 sm:pb-4"
      >
        {/* 始终水平排列的响应式布局 */}
        <div className="flex justify-between items-center px-2 xs:px-3 sm:px-4 md:px-8">
          {/* 左侧版权信息 */}

          {/* 中间旧版网页按钮 */}
          <div className="flex-shrink-0 mx-1 xs:mx-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200 transition-colors duration-300 text-[10px] xs:text-xs sm:text-sm px-1 xs:px-2 py-1 h-auto min-h-0"
              asChild
            >
              <a href="https://cat.vegcat.icu" target="_blank" rel="noopener noreferrer">
                <span className="sm:hidden">旧版网页</span>
                <span className="hidden sm:inline">旧版网页</span>
              </a>
            </Button>
          </div>

          {/* 右侧 Powered by */}
          <div className="text-gray-400 text-[10px] xs:text-xs sm:text-sm flex-shrink-0 text-right">
            <span className="sm:hidden">
              <TypewriterEffect text="© 2025 Powered by Vegcat" delay={300} speed={50} />
            </span>
            <span className="hidden sm:inline">
              <TypewriterEffect text="© 2025 Powered by Vegcat" delay={300} speed={50} />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
