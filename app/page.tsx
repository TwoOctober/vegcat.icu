"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Gamepad2, Globe, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Bilibili Icon with explicit dimensions for safety
function BilibiliIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.789 1.894v7.52c.02.765.283 1.395.789 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.128.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  )
}

export default function Page() {
  // State
  const [isLoading, setIsLoading] = useState(true)
  const [isAvatarRotating, setIsAvatarRotating] = useState(false)
  const [description, setDescription] = useState("那一天的忧郁 忧郁起来")

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Avatar interaction
  const handleAvatarClick = () => {
    setIsAvatarRotating(true)
    setTimeout(() => setIsAvatarRotating(false), 2000) // Stop after 2s
  }

  // Contact modal
  const [showContact, setShowContact] = useState(false)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans text-white"
      style={{
        backgroundColor: "#1a1a1a", // Fallback color
      }}
    >
      {/* CSS-based Background for better performance & stability */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh8ho0o-qNZfpecYx-loV1Ij3gF6BmgACYRkAApqnmFZH3mnkoy1eyzYE.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay to ensure text readability */}
      <div
        className="fixed inset-0 z-0 backdrop-blur-[2px]"
        style={{
          background: "linear-gradient(135deg, rgba(212, 165, 116, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-6 p-4 w-full max-w-lg text-center"
      >
        {/* Avatar */}
        <div
          onClick={handleAvatarClick}
          className="relative cursor-pointer transition-transform active:scale-95"
          style={{ width: "160px", height: "160px" }} // Explicit size to prevent huge image
        >
          <motion.div
            animate={{ rotate: isAvatarRotating ? 360 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full h-full rounded-full border-4 border-white/20 shadow-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 30px rgba(212, 165, 116, 0.3)",
            }}
          >
            <Image
              src="https://q.qlogo.cn/headimg_dl?dst_uin=1145145797&spec=640&img_type=jpg"
              alt="Avatar"
              width={640}
              height={640}
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-lg">Vegcat.icu</h1>

        {/* Description */}
        <p className="text-lg text-white/90 font-medium drop-shadow-md">{description}</p>

        {/* Links / Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mt-4">
          <SocialButton
            href="https://m.bilibili.com/space/497350955"
            icon={<BilibiliIcon className="w-5 h-5" />}
            label="Bilibili"
          />
          <SocialButton
            href="https://steamcommunity.com/id/TwoOctober"
            icon={<Gamepad2 className="w-5 h-5" />}
            label="Steam"
          />
          <button
            onClick={() => setShowContact(true)}
            className="group relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 w-full sm:w-auto min-w-[160px]"
            style={{
              background: "linear-gradient(45deg, #d4a574, #e8c5a0)",
              boxShadow: "0 4px 15px rgba(212, 165, 116, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Globe className="w-5 h-5" />
            <span>联系我</span>
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.main>

      {/* Footer */}
      <div className="fixed bottom-4 w-full text-center z-10 text-white/60 text-sm flex flex-col gap-1 pb-safe">
        <a href="https://cat.vegcat.icu" className="hover:text-white transition-colors">
          旧版网页
        </a>
        <p>© 2025 Powered by Vegcat</p>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full"
            >
              <div className="p-1 bg-gradient-to-r from-[#d4a574] to-[#e8c5a0]">
                <div className="bg-white p-4 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">联系方式</h3>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <Image
                      src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh75o0o28biX4Bx8LpQABB9kt0kAgYhkAAlYZAAKap5hWhIUMoKRTIr42BA.jpg"
                      alt="Contact QR"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <a
                      href="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAECh75o0o28biX4Bx8LpQABB9kt0kAgYhkAAlYZAAKap5hWhIUMoKRTIr42BA.jpg"
                      download="contact.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-[#d4a574] hover:bg-[#c59663] text-white rounded-lg transition-colors font-medium"
                    >
                      保存图片
                    </a>
                    <button
                      onClick={() => setShowContact(false)}
                      className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      关闭
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]"
            style={{
              background: "linear-gradient(135deg, #d4a574, #e8c5a0)",
            }}
          >
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Reusable Button Component
function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 w-full sm:w-auto min-w-[160px]"
      style={{
        background: "linear-gradient(45deg, #d4a574, #e8c5a0)",
        boxShadow: "0 4px 15px rgba(212, 165, 116, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {icon}
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
    </a>
  )
}
