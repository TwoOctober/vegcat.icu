"use client"

import { useState, useEffect } from "react"
import { Gamepad2, Globe, ArrowRight, X } from "lucide-react"
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

// 打字机效果组件
function TypewriterEffect({ text, delay = 0, speed = 100, className = "" }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let charIndex = 0
    const timeoutId = setTimeout(() => {
      const interval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1))
          charIndex++
        } else {
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [text, delay, speed])

  return <span className={className}>{displayedText}</span>
}

// 头像组件
function Avatar({ isLoading }: { isLoading: boolean }) {
  const [rotation, setRotation] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  const handleClick = () => {
    if (!isLoading) {
      setRotation((prev) => prev + 360)
    }
  }

  const avatarSize = isMobile
    ? "w-48 h-48 sm:w-56 sm:h-56"
    : "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80"

  return (
    <motion.div
      className={`${avatarSize} rounded-full overflow-hidden cursor-pointer mx-auto relative`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        <div
          className="w-full h-full rounded-full p-1"
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
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 背景组件
function Background() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePos({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  const desktopBg =
    "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECvfFo1T7nkSNHFW3k3piiOQel15EpPAACQC8AAttgqVZ4h-_ykpBOHjYE.jpg"
  const mobileBg =
    "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh8xo0pFTN0Yp1H_7zL3pzPQX1c0JTwACZRkAApqnmFYYPck9JMXOrTYE.jpg"
  const bgImage = isMobile ? mobileBg : desktopBg

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 背景图片 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#8b6f47",
        }}
      />

      {/* 覆盖层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-yellow-900/30" />
      <div className="absolute inset-0 bg-black/45" />

      {/* 鼠标跟踪光影 - 仅桌面端 */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              left: mousePos.x - 200,
              top: mousePos.y - 200,
              background: "radial-gradient(circle, rgba(184, 149, 106, 0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            transition={{ x: { duration: 0.2 }, y: { duration: 0.2 } }}
          />
        </>
      )}
    </div>
  )
}

// 加载动画
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 400)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #b8956a 0%, #d4a574 100%)" }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto"
        />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-lg mt-4 font-medium">
          Loading...
        </motion.p>
      </div>
    </motion.div>
  )
}

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-md w-full bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg border border-white/20 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-medium text-white mb-4 text-center">联系方式</h2>

          <div className="rounded-lg overflow-hidden mb-4 bg-black/20">
            <img
              src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECk7do09oCTJLgnsKMQfhKnlXjNutRcAACHiAAAttgoVbC13g_hSTY1zYE.jpg"
              alt="Contact"
              className="w-full h-auto"
            />
          </div>

          <a
            href="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECk7do09oCTJLgnsKMQfhKnlXjNutRcAACHiAAAttgoVbC13g_hSTY1zYE.jpg"
            download
            className="block w-full text-center px-4 py-2 bg-black/30 hover:bg-black/50 rounded text-white transition-colors"
          >
            保存图片
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .warm-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .warm-button {
          background: linear-gradient(135deg, #a67c52 0%, #b8956a 50%, #d4a574 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(166, 124, 82, 0.25);
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .warm-button:hover {
          box-shadow: 0 6px 20px rgba(166, 124, 82, 0.35);
          transform: translateY(-2px);
          background: linear-gradient(135deg, #b8956a 0%, #d4a574 50%, #e8c5a0 100%);
        }

        @media (max-width: 768px) {
          .mobile-btn {
            min-width: 120px;
            padding: 12px 20px !important;
          }
        }

        @media (min-width: 769px) {
          .desktop-btn {
            min-width: 160px;
            padding: 12px 28px !important;
          }
        }
      `}</style>

      <div className="min-h-screen text-white relative flex flex-col overflow-hidden">
        {/* 加载屏幕 */}
        <AnimatePresence>{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}</AnimatePresence>

        {/* 背景 */}
        <Background />

        {/* 主内容 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-8"
        >
          <div className="max-w-2xl w-full text-center space-y-6">
            {/* 头像 */}
            <div>
              <Avatar isLoading={isLoading} />
            </div>

            {/* 标题 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`warm-text font-medium ${isMobile ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl lg:text-4xl"}`}
            >
              <TypewriterEffect text="Vegcat.icu" delay={300} speed={80} />
            </motion.div>

            {/* 描述 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`warm-text ${isMobile ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}
            >
              <TypewriterEffect text="漫无止境的八月循环了多少次" delay={500} speed={70} />
            </motion.div>

            {/* 按钮组 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
            >
              {[
                {
                  label: "Bilibili",
                  icon: BilibiliIcon,
                  href: "https://m.bilibili.com/space/497350955",
                },
                {
                  label: "Steam",
                  icon: Gamepad2,
                  href: "https://steamcommunity.com/id/TwoOctober",
                },
                {
                  label: "联系我",
                  icon: Globe,
                  onClick: () => setShowContact(true),
                },
              ].map((btn, idx) => (
                <motion.a
                  key={btn.label}
                  href={btn.href || "#"}
                  target={btn.href ? "_blank" : undefined}
                  onClick={(e) => {
                    if (btn.onClick) {
                      e.preventDefault()
                      btn.onClick()
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`warm-button block no-underline text-white font-medium rounded-lg flex items-center justify-center gap-2 ${
                    isMobile ? "mobile-btn text-sm" : "desktop-btn"
                  }`}
                >
                  <btn.icon size={18} />
                  {btn.label}
                  <ArrowRight size={16} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="relative z-10 flex justify-between items-center px-4 sm:px-8 py-4 text-sm"
        >
          <a
            href="https://cat.vegcat.icu"
            target="_blank"
            className="text-amber-200 hover:text-amber-100 no-underline"
            rel="noreferrer"
          >
            旧版网页
          </a>
          <span className="text-amber-200 warm-text">
            <TypewriterEffect text="© 2025 Powered by Vegcat" delay={100} speed={80} />
          </span>
        </motion.div>

        {/* 联系我弹窗 */}
        <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      </div>
    </>
  )
}
