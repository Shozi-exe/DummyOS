import { GoogleGenAI } from "@google/genai";
import { Copy, Edit, RefreshCcw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  prompt: string;
  response: string;
}

const Chatbot = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const show = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    show.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const apiKey = import.meta.env.VITE_AI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  const askai = async (userPrompt: string) => {
    if (!userPrompt.trim() || loading) return;
    setError(false);
    setLoading(true);
    setPrompt("");
    setHistory((prev) => [...prev, { prompt: userPrompt, response: "" }]);

    let success = false;
    for (const model of MODELS) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: userPrompt,
        });
        setHistory((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, response: res.text || "" } : msg
          )
        );
        success = true;
        break;
      } catch (err) {
        console.warn(`Model ${model} limit exceeded or unavailable, trying fallback...`, err);
      }
    }

    if (!success) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full bg-[#272626] text-white">
      <nav className="flex justify-between items-center p-3 mx-2 border-b border-[#dadada]/15">
        <div className="text-sm font-semibold">TalkGPT</div>
        <button className="scale-75 cursor-pointer" onClick={() => setHistory([])}><RefreshCcw /></button>
      </nav>
      <main className="h-[75%] max-h-[75%] overflow-y-scroll scrollbar-none p-4">
        {history.map((msg, idx) => (
          <div key={idx} className="flex flex-col w-full gap-3">
            <div className="w-full flex flex-col place-items-end group">
              <div className="bg-green-800 min-h-[52px] w-[70%] p-4 m-3 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl truncate">{msg.prompt}</div>
              <Edit onClick={() => setPrompt(history[idx].prompt)} className="stroke-[#dadada]/50 scale-[0.65] mx-3 hidden group-hover:block cursor-pointer" />
            </div>
            {loading && idx === history.length - 1 ? (
              <div><span className="text-2xl animate-pulse delay-200">...</span></div>
            ) : error && idx === history.length - 1 ? (
              <span className="text-sm font-semibold text-rose-700">Error , Retry !!!</span>
            ) : (
              <div className="flex flex-col group">
                <div className="bg-gray-700 min-h-[52px] w-[70%] p-4 m-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl text-wrap">{msg.response}</div>
                <div className="flex w-[70%] justify-end gap-2">
                  <Copy onClick={() => navigator.clipboard.writeText(history[idx].response)} className="stroke-[#dadada]/50 hidden group-hover:block scale-[0.65] cursor-pointer" />
                  <RefreshCcw onClick={() => prompt === "" ? askai(history[idx].prompt) : setPrompt("")} className="stroke-[#dadada]/50 hidden group-hover:block scale-[0.65] cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={show} className="h-1"></div>
      </main>

      <section className="flex justify-evenly gap-5 p-4 border-t border-[#dadada]/15">
        <input autoFocus className="w-[88%] rounded-full border-2 border-[#dadada]/15 outline-none px-5 py-2" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") askai(prompt); }} placeholder="ask anything ..." />
        <button onClick={() => askai(prompt)} className="cursor-pointer">
          <Send className="stroke-[1.5] stroke-[#dadada]/50" />
        </button>
      </section>
    </div>
  );
};

export default Chatbot;
