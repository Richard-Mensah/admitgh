// components/features/aiCounsellor/ChatMessage.tsx
// Single chat bubble — user (right, teal) or assistant (left, card)

type Props = {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export default function ChatMessage({ role, content, isStreaming = false }: Props) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-3 py-2 text-sm text-white leading-relaxed">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      {/* Avatar */}
      <div
        aria-hidden="true"
        className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-[10px] font-bold text-brand-700 dark:text-brand-300"
      >
        AI
      </div>

      {/* Bubble */}
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--card-bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
        {content}
        {isStreaming && (
          <span
            className="inline-block w-0.5 h-3.5 bg-brand-500 ml-0.5 align-middle animate-[blink_1s_step-end_infinite]"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}
