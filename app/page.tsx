"use client"

import { useState, useEffect, useRef } from "react"
import { Gamepad2, Globe, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Bilibili 图标组件
function BilibiliIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.789 1.894v7.52c.02.765.283 1.395.789 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498 1.134-.755 1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
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

// 响应式头像组件 - 移动端优化
function ResponsiveAvatar({ onComplete, isLoading }) {
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

  const handleClick = () => {
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

  // 移动端更大的头像尺寸
  const avatarSize = isMobile
    ? "w-48 h-48 sm:w-56 sm:h-56"
    : "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80"

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleClick} // 只保留点击事件
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
        <div className={`${avatarSize} rounded-full overflow-hidden relative`}>
          <div
            className="absolute inset-0 rounded-full p-1"
            style={{
              background: "linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0, #b8956a)",
              backgroundSize: "300% 300%",
              animation: "gradientShift 4s ease infinite",
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

// 增强兼容性的响应式背景组件
function EnhancedResponsiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [delayedMousePosition, setDelayedMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [browserInfo, setBrowserInfo] = useState({
    is360: false,
    isIE: false,
    isOldChrome: false,
    supportsGradient: true,
    supportsFilter: true,
    supportsBackgroundImage: true,
  })

  useEffect(() => {
    setIsClient(true)

    // 检测移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // 增强的浏览器检测
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const testEl = document.createElement("div")

      // 检测360浏览器
      const is360 =
        userAgent.includes("360") ||
        userAgent.includes("qihu") ||
        userAgent.includes("360se") ||
        userAgent.includes("360ee") ||
        /360\w+/i.test(userAgent)

      // 检测IE浏览器
      const isIE = userAgent.includes("msie") || userAgent.includes("trident") || /edge\/\d+/i.test(userAgent)

      // 检测旧版Chrome
      const chromeMatch = userAgent.match(/chrome\/(\d+)/)
      const isOldChrome = chromeMatch && Number.parseInt(chromeMatch[1]) < 50

      // 检测渐变支持
      testEl.style.background = "linear-gradient(45deg, red, blue)"
      testEl.style.background = "-webkit-linear-gradient(45deg, red, blue)"
      testEl.style.background = "-moz-linear-gradient(45deg, red, blue)"
      const supportsGradient = testEl.style.background !== ""

      // 检测滤镜支持
      testEl.style.filter = "blur(10px)"
      testEl.style.webkitFilter = "blur(10px)"
      const supportsFilter = testEl.style.filter !== "" || testEl.style.webkitFilter !== ""

      // 检测背景图片支持
      testEl.style.backgroundImage =
        "url('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')"
      const supportsBackgroundImage = testEl.style.backgroundImage !== ""

      setBrowserInfo({
        is360,
        isIE,
        isOldChrome,
        supportsGradient,
        supportsFilter,
        supportsBackgroundImage,
      })
    }

    detectBrowser()

    const handleMouseMove = (e) => {
      if (browserInfo.supportsFilter && !isMobile) {
        const newPosition = { x: e.clientX, y: e.clientY }
        setMousePosition(newPosition)

        // 延迟更新光影位置
        setTimeout(() => {
          setDelayedMousePosition(newPosition)
        }, 150)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

  if (!isClient) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#8b6f47",
          }}
        />
      </div>
    )
  }

  // 选择背景图片
  const desktopBg =
    "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECvfFo1T7nkSNHFW3k3piiOQel15EpPAACQC8AAttgqVZ4h-_ykpBOHjYE.jpg"
  const mobileBg =
    "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh8xo0pFTN0Yp1H_7zL3pzPQX1c0JTwACZRkAApqnmFYYPck9JMXOrTYE.jpg"
  const backgroundImage = isMobile ? mobileBg : desktopBg

  // 360浏览器和IE的特殊处理
  const getBackgroundStyle = () => {
    if (browserInfo.is360 || browserInfo.isIE || browserInfo.isOldChrome) {
      return {
        backgroundColor: "#8b6f47",
        backgroundImage: browserInfo.supportsBackgroundImage ? `url('${backgroundImage}')` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    }

    if (browserInfo.supportsBackgroundImage) {
      return {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }

    return {
      backgroundColor: "#8b6f47",
      backgroundImage: browserInfo.supportsGradient
        ? "radial-gradient(circle at 25% 25%, #b8956a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #d4a574 0%, transparent 50%)"
        : "none",
    }
  }

  // 覆盖层样式
  const getOverlayStyle = () => {
    if (browserInfo.is360 || browserInfo.isIE) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=50)",
      }
    }

    return browserInfo.supportsGradient
      ? {
          background:
            "linear-gradient(135deg, rgba(184, 149, 106, 0.25) 0%, rgba(212, 165, 116, 0.15) 50%, rgba(232, 197, 160, 0.25) 100%)",
        }
      : {
          backgroundColor: "rgba(184, 149, 106, 0.2)",
        }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 背景图片层 */}
      <div className="absolute inset-0" style={getBackgroundStyle()} />

      {/* 温暖色调覆盖层 */}
      <div className="absolute inset-0" style={getOverlayStyle()} />

      {browserInfo.supportsFilter && !browserInfo.is360 && !browserInfo.isIE && !isMobile && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
            filter: "blur(80px)",
            WebkitFilter: "blur(80px)",
            opacity: 0.5,
          }}
          animate={{
            x: delayedMousePosition.x - window.innerWidth / 2,
            y: delayedMousePosition.y - window.innerHeight / 2,
          }}
          transition={{
            type: "spring",
            stiffness: 20,
            damping: 35,
            mass: 0.5,
          }}
        />
      )}

      {/* 深色遮罩 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          filter: browserInfo.isIE ? "progid:DXImageTransform.Microsoft.Alpha(opacity=45)" : "none",
        }}
      />

      {/* 延迟光影效果 - 仅在支持的浏览器中显示 */}
      {browserInfo.supportsFilter && !browserInfo.is360 && !browserInfo.isIE && !isMobile && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              left: delayedMousePosition.x - 200,
              top: delayedMousePosition.y - 200,
              background: "radial-gradient(circle, rgba(184, 149, 106, 0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
              WebkitFilter: "blur(40px)",
              opacity: 0.6,
            }}
            transition={{
              x: { type: "spring", stiffness: 30, damping: 50 },
              y: { type: "spring", stiffness: 30, damping: 50 },
            }}
          />

          <motion.div
            className="absolute w-80 h-80 rounded-full"
            style={{
              left: delayedMousePosition.x * 0.3 - 160,
              top: delayedMousePosition.y * 0.3 - 160,
              background: "radial-gradient(circle, rgba(212, 165, 116, 0.06) 0%, transparent 70%)",
              filter: "blur(35px)",
              WebkitFilter: "blur(35px)",
              opacity: 0.5,
            }}
            transition={{
              x: { type: "spring", stiffness: 20, damping: 60 },
              y: { type: "spring", stiffness: 20, damping: 60 },
            }}
          />
        </>
      )}
    </div>
  )
}

// 简洁加载动画
function SimpleLoadingAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 400)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #b8956a 0%, #d4a574 100%)",
        filter:
          "progid:DXImageTransform.Microsoft.gradient(startColorstr='#b8956a', endColorstr='#d4a574', GradientType=1)",
      }}
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-white text-lg font-medium"
        >
          Loading...
        </motion.div>
      </div>
    </motion.div>
  )
}

// 联系我弹窗组件
function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(135deg, #b8956a 0%, #d4a574 100%)",
            borderRadius: "12px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center text-white"
          >
            ×
          </button>

          {/* 标题 */}
          <div className="p-6 pb-4">
            <h3 className="text-xl font-medium text-white text-center warm-text">联系方式</h3>
          </div>

          {/* 图片容器 */}
          <div className="px-6 pb-6">
            <div className="relative rounded-lg overflow-hidden bg-black/10">
              <img
                src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECk7do09oCTJLgnsKMQfhKnlXjNutRcAACHiAAAttgoVbC13g_hSTY1zYE.jpg"
                alt="联系方式"
                className="w-full h-auto"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>

            {/* 保存按钮 */}
            <div className="mt-4 text-center">
              <a
                href="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECk7do09oCTJLgnsKMQfhKnlXjNutRcAACHiAAAttgoVbC13g_hSTY1zYE.jpg"
                download="vegcat-contact.jpg"
                className="inline-block px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg text-white text-sm transition-colors warm-text"
              >
                保存图片
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Component() {
  const [isLoading, setIsLoading] = useState(true)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [displayedDescription, setDisplayedDescription] = useState("漫无止境的八月循环了多少次")
  const [isMobile, setIsMobile] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
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
      }, 2000)
    } else {
      setIsHoveringAvatar(false)
      setDisplayedDescription("15532次")
    }
  }

  return (
    <>
      {/* 增强的CSS样式 - 360浏览器兼容 */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .warm-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }
        .warm-button {
          background: linear-gradient(45deg, #a67c52, #b8956a, #d4a574);
          background: -webkit-linear-gradient(45deg, #a67c52, #b8956a, #d4a574);
          background: -moz-linear-gradient(45deg, #a67c52, #b8956a, #d4a574);
          background: -o-linear-gradient(45deg, #a67c52, #b8956a, #d4a574);
          background: -ms-linear-gradient(45deg, #a67c52, #b8956a, #d4a574);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px; /* 小圆角矩形 */
          box-shadow: 0 4px 15px rgba(166, 124, 82, 0.25);
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          /* 360浏览器兼容性 */
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
          /* IE兼容性 */
          filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#a67c52', endColorstr='#d4a574', GradientType=1);
          behavior: url(PIE.htc); /* IE6-8 圆角支持 */
        }
        .warm-button:hover {
          box-shadow: 0 6px 20px rgba(166, 124, 82, 0.35);
          transform: translateY(-2px);
          background: linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0);
          background: -webkit-linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0);
          background: -moz-linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0);
          background: -o-linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0);
          background: -ms-linear-gradient(45deg, #b8956a, #d4a574, #e8c5a0);
          /* IE兼容性 */
          filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#b8956a', endColorstr='#e8c5a0', GradientType=1);
        }
        /* 移动端按钮优化 */
        @media (max-width: 768px) {
          .mobile-button {
            width: auto !important;
            min-width: 120px;
            max-width: 160px;
            padding: 12px 20px !important;
          }
        }
        /* 桌面端按钮优化 - 更宽 */
        @media (min-width: 769px) {
          .desktop-button {
            min-width: 160px !important; /* 从140px增加到160px */
            padding: 12px 28px !important; /* 水平padding增加 */
          }
        }
        /* 360浏览器特殊处理 */
        .browser-360 .warm-button {
          background-color: #b8956a !important;
          background-image: none !important;
        }
        /* IE特殊处理 */
        .ie-fallback {
          background-color: #b8956a !important;
          background-image: none !important;
        }
      `}</style>

      <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
        {/* 加载动画 */}
        <AnimatePresence>
          {isLoading && <SimpleLoadingAnimation onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* 增强兼容性背景 */}
        <EnhancedResponsiveBackground />

        {/* 主内容区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center space-y-4 sm:space-y-6">
              {/* 响应式头像 */}
              <div className="flex justify-center">
                <ResponsiveAvatar onComplete={() => {}} isLoading={isLoading} />
              </div>

              {/* 响应式域名标注 - 移动端更大 */}
              <div
                className={`warm-text font-medium ${
                  isMobile ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl lg:text-3xl"
                }`}
              >
                <TypewriterEffect text="Vegcat.icu" delay={400} speed={80} />
              </div>

              {/* 描述文字 */}
              <motion.div className="text-lg sm:text-xl lg:text-2xl max-w-lg leading-relaxed mx-auto warm-text">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayedDescription}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
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

              {/* 矩形按钮 - 移动端优化 */}
              <motion.div
                transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-6"
              >
                {[
                  {
                    icon: BilibiliIcon,
                    label: "Bilibili",
                    href: "https://m.bilibili.com/space/497350955",
                  },
                  {
                    icon: Gamepad2,
                    label: "Steam",
                    href: "https://steamcommunity.com/id/TwoOctober",
                  },
                  {
                    icon: Globe,
                    label: "联系我",
                    href: "#", // 改为#
                    onClick: () => setShowContactModal(true), // 添加点击事件
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
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
                    className={isMobile ? "mobile-button" : "desktop-button"}
                  >
                    <a
                      href={item.href}
                      target={item.href === "#" ? "_self" : "_blank"}
                      rel={item.href === "#" ? "" : "noopener noreferrer"}
                      onClick={
                        item.onClick
                          ? (e) => {
                              e.preventDefault()
                              item.onClick()
                            }
                          : undefined
                      }
                      className={`warm-button block text-center no-underline text-white font-medium ${
                        isMobile ? "px-5 py-3 text-sm" : "px-6 py-3"
                      }`}
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

        {/* 底部信息 */}
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
                className="text-amber-200 hover:text-amber-100 transition-colors duration-300 text-sm warm-text no-underline"
              >
                旧版网页
              </a>
            </div>
            <div className="text-amber-200 text-sm warm-text text-right">
              <TypewriterEffect text="© 2025 Powered by Vegcat" delay={200} speed={80} />
            </div>
          </div>
        </motion.div>

        {/* 联系我弹窗 */}
        <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      </div>
    </>
  )
}
