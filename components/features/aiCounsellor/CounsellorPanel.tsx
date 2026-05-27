"use client"
// components/features/aiCounsellor/CounsellorPanel.tsx
// Floating AI Counsellor chat — fixed button opens a slide-up drawer.
// Only rendered for paid checks (parent controls visibility).

import { useState, useRef, useEffect } from "react"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"

type Message = { role: "user" | "assistant"; content: string }

const STARTER_PROMPTS = [
  "Which programme is my safest bet?",
  "Explain my chances at KNUST",
  "What if I resit to improve a grade?",
]

export default function CounsellorPanel({ checkId }: { checkId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingText, setStreamingText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to latest message whenever content changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  async function sendMessage(userMessage: string) {
    if (loading || limitReached) return

    const priorMessages = messages
    const optimistic: Message[] = [...priorMessages, { role: "user", content: userMessage }]
    setMessages(optimistic)
    setLoading(true)
    setError(null)
    setStreamingText("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkId, userMessage, messages: priorMessages }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          setLimitReached(true)
          setError("You've used all 20 messages for this check.")
        } else {
          const data = await response.json().catch(() => ({}))
          setError((data as { error?: string }).error ?? "Something went wrong — try again")
        }
        setLoading(false)
        return
      }

      // Read the SSE stream
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""

      outer: while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue
          const payload = line.slice(6).trim()
          if (payload === "[DONE]") break outer
          try {
            const parsed = JSON.parse(payload) as { text?: string }
            if (parsed.text) {
              assistantText += parsed.text
              setStreamingText(assistantText)
            }
          } catch {
            // Malformed chunk — skip
          }
        }
      }

      // Commit fully-streamed assistant message
      setMessages([...optimistic, { role: "assistant", content: assistantText }])
      setStreamingText("")
    } catch {
      setError("Connection error — please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Floating launch button ── */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI Counsellor chat"
          className="fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-700 active:scale-95 transition-all"
        >
          {/* Chat bubble icon */}
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          <span className="hidden sm:inline">Ask AI Counsellor</span>
        </button>
      )}

      {/* ── Chat drawer ── */}
      {open && (
        <div
          role="dialog"
          aria-label="AI Counsellor chat"
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 z-50 sm:inset-auto sm:bottom-6 sm:right-4 sm:w-96"
        >
          <div
            className="flex flex-col rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            style={{ height: "min(540px, 88dvh)" }}
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-xs font-bold text-brand-700 dark:text-brand-300"
                >
                  AI
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">AI Counsellor</p>
                  <p className="text-xs text-[var(--muted)]">Powered by Claude · AdmitGH</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI Counsellor"
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--card-bg)] transition-colors"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {/* Empty state: starter prompts */}
              {messages.length === 0 && !streamingText && (
                <div className="space-y-2">
                  <p className="py-2 text-center text-sm text-[var(--muted)]">
                    Ask me anything about your results 👋
                  </p>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      disabled={loading}
                      className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--muted)] hover:border-brand-400 hover:text-[var(--foreground)] disabled:opacity-50 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Message history */}
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}

              {/* Live streaming bubble */}
              {streamingText && (
                <ChatMessage role="assistant" content={streamingText} isStreaming />
              )}

              {/* Error notice */}
              {error && (
                <p className="text-center text-xs text-red-600 dark:text-red-400">{error}</p>
              )}

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 border-t border-[var(--border)] p-3">
              {limitReached ? (
                <p className="py-1 text-center text-xs text-[var(--muted)]">
                  Message limit reached (20 per check)
                </p>
              ) : (
                <ChatInput onSend={sendMessage} disabled={loading} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
