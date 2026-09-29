import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import circleImage from "../assets/images/circle.png";
import { useChat } from "../context";

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const { messages, isSending, isLoadingHistory, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || isSending) return;
    sendMessage(inputPrompt);
    setInputPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = (lastUserPrompt) => {
    if (!isSending && lastUserPrompt) {
      sendMessage(lastUserPrompt);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[250px]"
        }`}
      >
        <Navbar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col justify-between px-4 sm:px-6 pb-6 pt-4">
          {isLoadingHistory ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Loader2 size={18} className="animate-spin text-[var(--primary)]" />
                Loading conversation history...
              </div>
            </div>
          ) : !hasMessages ? (
            /* Initial Hero State */
            <div className="flex flex-1 items-center justify-center">
              <div className="flex w-full max-w-[900px] flex-col items-center justify-center">
                <div className="mb-3 flex justify-center">
                  <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />
                    <img
                      src={circleImage}
                      alt="AI Assistant"
                      className="relative h-24 w-24 object-contain sm:h-28 sm:w-28"
                    />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center">
                  <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                    What can I help with?
                  </h1>

                  <p className="mt-2 text-xs text-[var(--text-muted)] sm:text-sm">
                    Ask about attendance, reports, training, or portal support.
                  </p>
                </div>

                {/* Ask Anything Box (Hero Centered) */}
                <form
                  onSubmit={handleSend}
                  className="mt-5 w-full max-w-[730px]"
                >
                  <div className="relative flex items-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-2 shadow-[var(--shadow-card)] transition-all duration-200 focus-within:border-[var(--primary)]">
                    <input
                      type="text"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything"
                      className="w-full flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)]"
                      disabled={isSending}
                    />

                    <button
                      type="submit"
                      disabled={isSending || !inputPrompt.trim()}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_4px_12px_var(--primary-glow)] transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-95 disabled:opacity-50"
                      aria-label="Send"
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ArrowUp size={16} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Active Chat Messages State */
            <div className="mx-auto flex w-full max-w-[850px] flex-1 flex-col justify-between">
              {/* Message List */}
              <div className="space-y-4 py-4">
                {messages.map((msg, index) => {
                  const isUser = msg.sender === "user";

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 p-1 mt-1">
                          <img
                            src={circleImage}
                            alt="Bot"
                            className="h-6 w-6 object-contain"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isUser
                            ? "bg-[var(--primary)] text-white shadow-sm"
                            : msg.isError
                            ? "border border-red-500/30 bg-red-500/10 text-red-500"
                            : "border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-primary)] shadow-sm"
                        }`}
                      >
                        {/* Rendering Markdown for Bot, Plain Text for User */}
                        {isUser ? (
                          <div className="whitespace-pre-wrap">{msg.message_text}</div>
                        ) : msg.isError ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 font-medium text-red-500">
                              <AlertCircle size={15} />
                              <span>Request Error</span>
                            </div>
                            <p className="text-xs text-red-400 leading-relaxed">
                              {msg.message_text}
                            </p>
                            {index > 0 && messages[index - 1]?.sender === "user" && (
                              <button
                                type="button"
                                onClick={() => handleRetry(messages[index - 1].message_text)}
                                disabled={isSending}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-[var(--surface-bg)] px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                              >
                                <RotateCcw size={12} />
                                <span>Retry</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="markdown-body text-sm leading-relaxed space-y-2">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                table: ({ ...props }) => (
                                  <div className="overflow-x-auto my-3 w-full">
                                    <table className="min-w-full divide-y divide-[var(--table-border)] border border-[var(--table-border)] rounded-lg text-sm bg-[var(--table-bg)]" {...props} />
                                  </div>
                                ),
                                thead: ({ ...props }) => <thead className="bg-[var(--table-header-bg)]" {...props} />,
                                th: ({ ...props }) => (
                                  <th className="px-4 py-3 text-left font-semibold text-[var(--table-th-text)] border-b border-[var(--table-border)] whitespace-nowrap" {...props} />
                                ),
                                td: ({ ...props }) => (
                                  <td className="px-4 py-3 border-b border-[var(--table-border)] text-[var(--table-td-text)] whitespace-nowrap" {...props} />
                                ),
                                ul: ({ ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                                p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                strong: ({ ...props }) => <strong className="font-semibold text-[var(--text-primary)]" {...props} />,
                              }}
                            >
                              {msg.message_text || ""}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* In-Flight Indicator */}
                {isSending && (
                  <div className="flex items-center gap-3 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 p-1">
                      <img
                        src={circleImage}
                        alt="Bot"
                        className="h-6 w-6 object-contain animate-pulse"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-3 shadow-sm text-xs text-[var(--text-muted)]">
                      <Loader2 size={14} className="animate-spin text-[var(--primary)]" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Fixed Bottom Input Bar for Active Chat */}
              <div className="sticky bottom-0 pt-2 bg-[var(--page-bg)] transition-colors duration-200">
                <form
                  onSubmit={handleSend}
                  className="w-full"
                >
                  <div className="relative flex items-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-2 shadow-[var(--shadow-card)] transition-all duration-200 focus-within:border-[var(--primary)]">
                    <input
                      type="text"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything"
                      className="w-full flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)]"
                      disabled={isSending}
                    />

                    <button
                      type="submit"
                      disabled={isSending || !inputPrompt.trim()}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_4px_12px_var(--primary-glow)] transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-95 disabled:opacity-50"
                      aria-label="Send"
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ArrowUp size={16} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;