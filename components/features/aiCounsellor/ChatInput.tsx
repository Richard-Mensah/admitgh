"use client"
// components/features/aiCounsellor/ChatInput.tsx
// Auto-growing textarea + send button (Enter to send, Shift+Enter for newline)

import { useState, useRef, type KeyboardEvent } from "react"

type Props = {
  onSend: (message: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const msg = value.trim()
    if (!msg || disabled) return
    onSend(msg)
    setValue("")
    // Reset height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        rows={1}
        placeholder="Ask anything about your results…"
        disabled={disabled}
        aria-label="Chat message"
        className="flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 transition-colors"
        style={{ minHeight: "38px", maxHeight: "120px" }}
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        className="flex-shrink-0 rounded-lg bg-brand-600 px-3 py-2.5 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {disabled ? (
          /* Spinner */
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          /* Send arrow */
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        )}
      </button>
    </div>
  )
}
