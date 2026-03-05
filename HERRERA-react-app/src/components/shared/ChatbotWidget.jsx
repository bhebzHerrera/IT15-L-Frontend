import { MessageCircle, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { chatbotSuggestions } from "../../data/mockData";

function botReply(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("deadline")) {
    return "Enrollment closes on March 28, 2026 for regular admission and April 3, 2026 for late registration.";
  }
  if (normalized.includes("requirements")) {
    return "Required files are form 138, certificate of good moral, PSA birth certificate, and 2x2 ID photo.";
  }
  if (normalized.includes("status")) {
    return "For this prototype, statuses are mock data. In Laravel integration, this panel will call /api/enrollments/{id}.";
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

  const sendMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: clean,
    };
    const response = {
      id: Date.now() + 1,
      sender: "bot",
      text: botReply(clean),
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
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
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
