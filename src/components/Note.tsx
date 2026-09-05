import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Page {
  id: string;
  title: string;
  content: string;
}

const Note = () => {
  const [pages, setPages] = useState<Page[]>(() => {
    try {
      const saved = localStorage.getItem("shoziOS_notes");
      return saved ? JSON.parse(saved) : [{ id: "0", title: "untitled", content: "" }];
    } catch {
      return [{ id: "0", title: "untitled", content: "" }];
    }
  });

  const [active, setActive] = useState<string>(() => {
    return localStorage.getItem("shoziOS_active_note") || "0";
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateTitle = (id: string, title: string): void => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title } : p))
    );
  };

  useEffect(() => {
    localStorage.setItem("shoziOS_notes", JSON.stringify(pages));
    localStorage.setItem("shoziOS_active_note", active);
  }, [pages, active]);

  useEffect(() => {
    if (!editingId && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [active, editingId]);

  const addPage = (): void => {
    const newId = String(Date.now());
    setPages((prev) => [
      ...prev,
      { id: newId, title: `untitled ${prev.length + 1}`, content: "" },
    ]);
    setActive(newId);
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>, pageId: string): void => {
    e.stopPropagation();

    if (pages.length === 1) {
      const freshId = String(Date.now());
      setPages([{ id: freshId, title: "untitled", content: "" }]);
      setActive(freshId);
      return;
    }

    const nextPages = pages.filter((p) => p.id !== pageId);
    setPages(nextPages);

    if (editingId === pageId) {
      setEditingId(null);
    }

    if (active === pageId) {
      const idx = pages.findIndex((p) => p.id === pageId);
      setActive((nextPages[idx] || nextPages[idx - 1] || nextPages[0]).id);
    }
  };

  const activePage = pages.find((p) => p.id === active) || pages[0];

  return (
    <div className="h-full w-full bg-white text-black flex flex-col">
      <nav className="w-full h-10 bg-[#f8e4d6]/20 border-b border-[#dadada] gap-2 flex items-end px-2 shrink-0">
        <section className="h-10 w-fit max-w-[80%] flex gap-2 items-end justify-start overflow-x-scroll scrollbar-none">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => setActive(page.id)}
              className={`h-7 flex items-center gap-2 px-3 border-t border-l border-r border-[#dadada] rounded-t-md cursor-pointer select-none transition-colors ${
                active === page.id
                  ? "bg-white font-medium text-black"
                  : "bg-[#d7d1cc5a] text-gray-600 hover:bg-white/80"
              }`}
            >
              {editingId === page.id ? (
                <input
                  type="text"
                  autoFocus
                  value={page.title}
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTitle(page.id, e.target.value)}
                  onBlur={() => {
                    if (!page.title.trim()) updateTitle(page.id, "untitled");
                    setEditingId(null);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      if (!page.title.trim()) updateTitle(page.id, "untitled");
                      setEditingId(null);
                    }
                  }}
                  className="text-xs bg-transparent outline-none w-20 px-0.5"
                />
              ) : (
                <span
                  onDoubleClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                    e.stopPropagation();
                    setActive(page.id);
                    setEditingId(page.id);
                  }}
                  title="Double click to rename"
                  className="text-xs truncate max-w-[120px] cursor-text"
                >
                  {page.title}
                </span>
              )}
              <button
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClose(e, page.id)}
                className="p-0.5 rounded text-gray-500 transition-colors"
                title="Close tab"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </section>

        <button className="text-gray-600 text-xl cursor-pointer" onClick={addPage}>
          +
        </button>
      </nav>

      <main className="flex-1 w-full overflow-hidden">
        {activePage && (
          <div className="h-full w-full p-2 text-sm">
            <textarea
              ref={textareaRef}
              className="resize-none h-full w-full outline-none border-none"
              placeholder="Type here..."
              value={activePage.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const val = e.target.value;
                setPages((prev) =>
                  prev.map((p) => (p.id === activePage.id ? { ...p, content: val } : p))
                );
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Note;