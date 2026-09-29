import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  History,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Trash2,
} from "lucide-react";

import logo from "../assets/images/logo.png";
import { useAuth, useChat } from "../context";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activeItem, setActiveItem] = useState("New chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { logout } = useAuth();
  const {
    currentSessionId,
    sessions,
    createNewChat,
    selectSession,
    deleteChatSession,
    loadSessions,
  } = useChat();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCollapsed]);

  const handleNewChat = () => {
    setActiveItem("New chat");
    setShowSearchInput(false);
    createNewChat();
  };

  const handleMenuItemClick = (name) => {
    setActiveItem(name);
    if (name === "Search chats") {
      setShowSearchInput((prev) => !prev);
    } else if (name === "History") {
      loadSessions();
    }
  };

  const handleBottomItemClick = (name) => {
    setActiveItem(name);
    if (name === "Logout") {
      logout();
    }
  };

  const filteredSessions = sessions.filter((s) =>
    (s.title || "New conversation")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[250px]"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`flex h-[58px] items-center border-b border-[var(--border-subtle)] bg-[var(--sidebar-header-bg)] ${
          collapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        {!collapsed && (
          <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
        )}

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] transition hover:bg-[var(--hover-bg)] hover:text-[var(--primary)]"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`flex flex-1 flex-col overflow-hidden py-4 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {/* New Chat Button */}
        <button
          type="button"
          onClick={handleNewChat}
          title={collapsed ? "New chat" : ""}
          className={`flex h-9 w-full items-center rounded-md transition ${
            activeItem === "New chat"
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
          } ${collapsed ? "justify-center" : "gap-2 px-3"}`}
        >
          <Plus size={collapsed ? 22 : 18} />
          {!collapsed && <span className="text-sm font-medium">New chat</span>}
        </button>

        {/* Search Chats Button */}
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => handleMenuItemClick("Search chats")}
            title={collapsed ? "Search chats" : ""}
            className={`flex w-full items-center rounded-md py-2 transition ${
              activeItem === "Search chats"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
            } ${collapsed ? "justify-center" : "gap-3 px-3"}`}
          >
            <Search size={collapsed ? 21 : 16} />
            {!collapsed && (
              <span className="text-sm font-medium">Search chats</span>
            )}
          </button>

          {!collapsed && showSearchInput && (
            <div className="px-1 py-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--primary)]"
              />
            </div>
          )}

          {/* History Button */}
          <button
            type="button"
            onClick={() => handleMenuItemClick("History")}
            title={collapsed ? "History" : ""}
            className={`flex w-full items-center rounded-md py-2 transition ${
              activeItem === "History"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
            } ${collapsed ? "justify-center" : "gap-3 px-3"}`}
          >
            <History size={collapsed ? 21 : 16} />
            {!collapsed && (
              <span className="text-sm font-medium">History</span>
            )}
          </button>
        </div>

        {/* Sessions History List */}
        {!collapsed && filteredSessions.length > 0 && (
          <div className="mt-3 flex-1 overflow-y-auto border-t border-[var(--border-subtle)] pt-2">
            <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Recent Sessions
            </p>
            <div className="space-y-0.5">
              {filteredSessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition ${
                    currentSessionId === session.session_id
                      ? "bg-[var(--active-bg)] font-medium text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItem("History");
                      selectSession(session.session_id);
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <MessageSquare size={13} className="shrink-0" />
                    <span className="truncate">
                      {session.title || "Chat session"}
                    </span>
                  </button>

                  <button
                    type="button"
                    title="Delete session"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatSession(session.session_id);
                    }}
                    className="ml-1 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spacer if no sessions list */}
        {collapsed || filteredSessions.length === 0 ? <div className="flex-1" /> : null}

        {/* Bottom Menu */}
        <div className="border-t border-[var(--border-subtle)] pt-3">
          <button
            type="button"
            onClick={() => handleBottomItemClick("Settings")}
            title={collapsed ? "Settings" : ""}
            className={`mt-1 flex w-full items-center rounded-md py-2 transition ${
              activeItem === "Settings"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
            } ${collapsed ? "justify-center" : "gap-3 px-3"}`}
          >
            <Settings size={collapsed ? 21 : 16} />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </button>

          <button
            type="button"
            onClick={() => handleBottomItemClick("Logout")}
            title={collapsed ? "Logout" : ""}
            className={`mt-1 flex w-full items-center rounded-md py-2 text-red-500 transition hover:bg-red-500/10 ${
              collapsed ? "justify-center" : "gap-3 px-3"
            }`}
          >
            <LogOut size={collapsed ? 21 : 16} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
