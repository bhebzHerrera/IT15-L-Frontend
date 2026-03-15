import { MessageCircle, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { chatbotSuggestions } from "../../data/mockData";
import { getEnrollmentStatusSummary } from "../../services/enrollmentService";

async function botReply(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("deadline")) {
    return "Enrollment closes on March 28, 2026 for regular admission and April 3, 2026 for late registration.";
  }
  if (normalized.includes("requirements")) {
    return "Required files are form 138, certificate of good moral, PSA birth certificate, and 2x2 ID photo.";
  }
  if (normalized.includes("status")) {
    try {
      const summary = await getEnrollmentStatusSummary();

      return `Current enrollment status summary: ${summary.total_students ?? 0} total students, ${summary.enrolled ?? 0} enrolled, ${summary.pending ?? 0} pending, ${summary.approved ?? 0} approved, ${summary.for_review ?? 0} for review, ${summary.probation ?? 0} probation, ${summary.rejected ?? 0} rejected, and ${summary.dropped ?? 0} dropped.`;
    } catch {
      return "I could not load real-time enrollment status right now. Please try again in a moment.";
    }
  }
  return "I can help with enrollment deadlines, requirements, and status flow. Ask me a specific question.";
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello. I am Crammy. Ask me about enrollment requirements, deadlines, or status tracking.",
    },
  ]);

  const visibleMessages = useMemo(() => messages.slice(-8), [messages]);

  const sendMessage = async (text) => {
    const clean = text.trim();
    if (!clean) return;

    const replyText = await botReply(clean);

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: clean,
    };
    const response = {
      id: Date.now() + 1,
      sender: "bot",
      text: replyText,
    };

    setMessages((prev) => [...prev, userMsg, response]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open chatbot"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {isOpen && (
        <section className="chat-panel glass-card">
          <header>
            <h3>Crammy</h3>
            <p>Cramming assistant</p>
          </header>

          <div className="chat-thread">
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`chat-bubble chat-${message.sender}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="chat-suggestions">
            {chatbotSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  void sendMessage(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
