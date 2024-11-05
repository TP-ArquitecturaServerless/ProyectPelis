import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import audioTerror from '../assets/sfx-horror12.mp3'

export default function ScaryEffect() {
  const [showScaryImage, setShowScaryImage] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.textContent?.includes('Ver ahora')) {
        setShowScaryImage(true)
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(error => console.error("Audio playback failed:", error))
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    if (showScaryImage) {
      redirectTimeout = setTimeout(() => {
        setShowScaryImage(false)
        window.location.href = 'https://youtu.be/8VPwKXW8EOM?si=8QqgUq4GHNiVoIFk'
      }, 3000) // Espera de 3 segundos antes de redirigir
    }
    return () => clearTimeout(redirectTimeout)
  }, [showScaryImage])

  const handleClose = () => {
    setShowScaryImage(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <>
      <audio ref={audioRef} src={audioTerror} />
      <AnimatePresence>
        {showScaryImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer overflow-hidden"
          >
            <motion.div
              initial={{ scale: 20, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-red-900 mix-blend-multiply"
            />
            <motion.img
              src="https://i.pinimg.com/564x/21/4e/84/214e84bcf83da803aee99789f013ba4f.jpg"
              alt="Scary ghost with mask"
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.5, rotate: -15, filter: 'blur(20px)' }}
              animate={{ scale: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 1 }}
            />
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
            >
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-red-500"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 10px 2px rgba(255, 0, 0, 0.7)',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
