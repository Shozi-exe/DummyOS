import { useState } from "react";
import { Trash2 } from "lucide-react";

const Cal = () => {
  const buttons = [
    "C", "(", ")", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "−",
    "1", "2", "3", "+",
    "%", "0", ".", "="
  ];
  const [value, setValue] = useState("");
  const [history, setHistory] = useState("");
  const [historyList, setHistoryList] = useState<{ expr: string; result: string }[]>([]);

  const calculate = (expression: string) => {
    try {
      const mathExpr = expression
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replaceAll("−", "-");

      const result = new Function(`return (${mathExpr})`)();

      if (result !== undefined && !isNaN(result)) {
        const resStr = String(result);
        setHistory(expression);
        setValue(resStr);
        setHistoryList((prev) => [{ expr: expression, result: resStr }, ...prev]);
      } else {
        setValue("Error");
      }
    } catch {
      setValue("Error");
    }
  };

  const handleButtonClick = (btn: string) => {
    if (btn === "C") {
      setValue("");
      setHistory("");
    } else if (btn === "=") {
      if (value) calculate(value);
    } else {
      setValue((prev) => (prev === "Error" ? btn : prev + btn));
    }
  };

  const allowedChars = /^[0-9+\-*/().%÷×−]$/;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (value) calculate(value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setValue("");
      setHistory("");
    } else if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="h-full w-full flex p-6 bg-[#272626] text-white">
      <aside className="hidden lg:flex flex-col w-72 shrink-0 h-full bg-[#7272724a] border border-white/5 rounded-xl p-4 mr-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3">
          <span className="text-sm font-semibold text-gray-300">History</span>
          {historyList.length > 0 && (
            <button
              onClick={() => setHistoryList([])}
              className="p-1 rounded-md text-rose-800 cursor-pointer"
              title="Clear History"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {historyList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 font-medium">
            NO HISTORY
          </div>
        ) : (
          <div className="flex-1 mt-2 flex flex-col gap-1.5 pr-1 overflow-y-scroll scrollbar-none">
            {historyList.map((item, index) => (
              <div
                key={index}
                onClick={() => setValue(item.result)}
                className="p-5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center text-lg font-mono group"
              >
                <span className="text-gray-400 truncate mr-5">{item.expr} =</span>
                <span className="text-white font-medium shrink-0">
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="flex flex-col justify-between w-full">
        <section className="w-full flex flex-col items-end justify-end mb-4">
          <p className="w-full text-right px-2 min-h-6 text-sm text-gray-400 font-mono tracking-wide">
            {history}
          </p>
          <input
            autoFocus
            className="w-full outline-none text-5xl font-light p-2 text-right bg-transparent text-white tracking-wider caret-transparent"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9+\-*/().%÷×−]/g, ""))}
            onKeyDown={handleKeyDown}
            placeholder="0"
          />
        </section>

        <section className="w-full flex justify-end">
          <div className="w-full max-w-4xl grid grid-cols-4 gap-2.5">
            {buttons.map((btn, index) => {
              const isEquals = btn === "=";
              const isClear = btn === "C";
              return (
                <button
                  key={index}
                  onClick={() => handleButtonClick(btn)}
                  className={`h-15 rounded-xl text-xl font-medium transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center select-none shadow-sm ${
                    isEquals
                      ? "bg-pink-500 text-white font-semibold"
                      : isClear
                      ? "text-rose-700 bg-[#504d4d82] hover:bg-[#63606082] font-bold"
                      : "bg-[#504d4d82] hover:bg-[#63606082]"
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Cal;