import { useEffect, useState } from "react"

/**
 * Hook untuk membuat typing effect seperti ChatGPT
 * @param text - Text yang akan di-typing
 * @param speed - Speed typing dalam milliseconds per karakter
 * @returns Typed text yang sedang muncul
 */
export function useTypingEffect(text: string | null | undefined, speed = 30) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    setDisplayedText("")

    let currentIndex = 0
    const words = text.split(" ")
    let accumulatedText = ""
    const timeouts: NodeJS.Timeout[] = []

    const typeNextWord = () => {
      if (currentIndex >= words.length) {
        setIsTyping(false)
        return
      }

      const word = words[currentIndex]
      accumulatedText = currentIndex === 0 ? word : `${accumulatedText} ${word}`
      
      setDisplayedText(accumulatedText)
      currentIndex++

      // Delay antar kata
      if (currentIndex < words.length) {
        const timeoutId = setTimeout(typeNextWord, speed * (word.length + 1))
        timeouts.push(timeoutId)
      } else {
        setIsTyping(false)
      }
    }

    // Start typing setelah delay kecil
    const initialTimeout = setTimeout(() => {
      typeNextWord()
    }, 100)
    timeouts.push(initialTimeout)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      setIsTyping(false)
    }
  }, [text, speed])

  return { displayedText, isTyping }
}

