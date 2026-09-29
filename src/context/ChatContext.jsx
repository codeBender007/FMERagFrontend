import { useState, useEffect, useCallback } from "react";
import { chatApi } from "../api/chatApi";
import { ChatContext } from "./chatContextDef";

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const ChatProvider = ({ children }) => {
  const [currentSessionId, setCurrentSessionId] = useState(generateSessionId);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all user chat sessions from backend
  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const data = await chatApi.getSessions();
      if (data && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  // Fetch sessions on initial mount
  useEffect(() => {
    let isMounted = true;
    chatApi
      .getSessions()
      .then((data) => {
        if (isMounted && data && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        }
      })
      .catch((err) => {
        console.error("Failed to load sessions on mount:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Start a new chat session
  const createNewChat = useCallback(() => {
    const newId = generateSessionId();
    setCurrentSessionId(newId);
    setMessages([]);
    setError(null);
  }, []);

  // Select an existing session and load its messages
  const selectSession = useCallback(async (sessionId) => {
    setCurrentSessionId(sessionId);
    setIsLoadingHistory(true);
    setError(null);
    try {
      const data = await chatApi.getHistory(sessionId);
      if (data && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load session history:", err);
      setError("Failed to load chat history.");
      setMessages([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Delete a session
  const deleteChatSession = useCallback(
    async (sessionId) => {
      try {
        await chatApi.deleteSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
        if (currentSessionId === sessionId) {
          createNewChat();
        }
      } catch (err) {
        console.error("Failed to delete session:", err);
      }
    },
    [currentSessionId, createNewChat]
  );

  // Send a message in the active session
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed || isSending) return;

      const userTurn = {
        id: `user_${Date.now()}`,
        sender: "user",
        message_text: trimmed,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userTurn]);
      setIsSending(true);
      setError(null);

      try {
        const response = await chatApi.sendMessage({
          session_id: currentSessionId,
          message: trimmed,
        });

        const botTurn = {
          id: `bot_${Date.now()}`,
          sender: "bot",
          message_text: response.answer,
          sql_executed: response.sql_executed,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botTurn]);

        // Refresh sessions list to update title if new
        loadSessions();
      } catch (err) {
        console.error("Failed to send message:", err);
        const errorTurn = {
          id: `bot_err_${Date.now()}`,
          sender: "bot",
          message_text:
            err.message || "An error occurred while getting response. Please try again.",
          isError: true,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorTurn]);
        setError(err.message || "Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [currentSessionId, isSending, loadSessions]
  );

  return (
    <ChatContext.Provider
      value={{
        currentSessionId,
        messages,
        sessions,
        isSending,
        isLoadingHistory,
        isLoadingSessions,
        error,
        sendMessage,
        selectSession,
        createNewChat,
        deleteChatSession,
        loadSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
