import { GoogleGenAI } from "@google/genai";
import { Copy, Edit, RefreshCcw, Send } from "lucide-react";
import { useState } from "react";

interface Message {
  prompt: string;
  response: string;
}

const Chatbot = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_AI_API_KEY || process.env.AI_API_KEY,
  });

  const askai = async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    try {
      setError(false);
      setLoading(true);
      setPrompt("");
      setHistory((prev) => [...prev, { prompt: prompt, response: "" }]);
      const res = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt, 
      });
      setHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, response: res.text || "" } : msg
        )
      );
    } catch (err) {
      console.log("limit exceeded , fahhh!!!");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#272626] text-white">
      <nav className="flex justify-between items-center p-3 mx-2 border-b-[0.5px] border-[#dadada2a]">
        <div className="text-sm font-semibold">ShoziGPT</div>
        <button className="scale-75" onClick={() => setHistory([])}><RefreshCcw/></button>
      </nav>
      <main className="h-[75%] max-h-[75%] overflow-y-scroll scrollbar-none p-4">
        {history.map((msg, idx) => (
          <div key={idx} className="flex flex-col w-full gap-5">
            <div className="w-full flex justify-end">
              <div className="bg-green-700 min-h-13 w-[70%] p-4 m-3 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl truncate">{msg.prompt}</div>
            </div>
            {loading && idx === history.length - 1 ? (
              <div><span className="text-2xl animate-pulse delay-200">...</span></div>
            ) : error && idx === history.length - 1 ? (
              <div><span className="text-sm font-bold text-red-500">Error , Retry !!!</span></div>
            ) : (
              <div className="flex flex-col group">
                <div className="bg-gray-700 min-h-13 w-[70%] p-4 m-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl truncate">{msg.response}</div>
                <div className="flex w-[70%] justify-end gap-2">
                  <Copy className="stroke-[#dadada7a] hidden group-hover:block scale-65 group-hover:transition-all group-hover:duration-10000"/>
                  <RefreshCcw className="stroke-[#dadada7a] hidden group-hover:block scale-65 group-hover:transition-all group-hover:duration-10000"/>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    
      <section className="flex justify-evenly gap-5 p-4 border-t-[0.5px] border-[#dadada2a]">
        <input autoFocus={true} className="w-[88%] rounded-full border-2 border-[#dadada2a] outline-none px-5 py-2" type="text" value={prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){askai(prompt);}}} placeholder="ask anything ..." />
        <button onClick={()=>askai(prompt)} className=""><Send className="stroke-1.5 stroke-[#dadada7a]"/></button>
      </section>
    </div>
  );
};

export default Chatbot;
