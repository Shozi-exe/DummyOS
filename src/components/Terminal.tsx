import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  onExit: () => void;
}

interface HistoryItem {
  cmd: string;
  res: string;
}

const Terminal = ({ onExit }: TerminalProps) => {
  const arr: HistoryItem[] = [
    {
      cmd: "whoami",
      res: "Shozab",
    },
    {
      cmd: "help",
      res: "whoami \nhelp \ncls \ndate \ntime \nhostname \ncolor 1  \ncolor 0 \necho \nhack \nexit",
    },
    {
      cmd: "hack",
      res: `Bypassing mainframe firewall protocols...
        Establishing encrypted tunnel at port 443...
        Tunnel online. Resolving domain height address...
        Target Block IP: 192.168.1.109 resolved.
        Brute forcing root access hashes (attempt 1/5)... Failed.
        Brute forcing root access hashes (attempt 2/5)... Success.
        Bypassing cluster checks: [Auth] [Secure] [SSH]
          - Auth Cluster: Passed.
          - Secure Cluster: Passed.
          - SSH Cluster: Passed.
        Injecting secondary payload signature...
        Wiping system intrusion syslog event logs...
        Establishing terminal interface hook...
        Host successfully breached! Terminal linked.
        Welcome back, Shozi.`,
    },
    {
      cmd: "hostname",
      res: "shoziOS",
    },
  ];

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cmdin, setCmdin] = useState<string>("");
  const [clr, setClr] = useState<boolean>(false);
  const show = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    show.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const runcmd = (Val: string) => {
    const val = Val.trim().toLowerCase();

    if (val === "cls") {
      setHistory([]);
      setCmdin("");
    } else if (val === "color 1") {
      setClr(true);
      setCmdin("");
    } else if (val === "color 0") {
      setClr(false);
      setCmdin("");
    } else if (val === "date") {
      setHistory((prev) => [...prev, { cmd: val, res: new Date().toDateString() }]);
      setCmdin("");
    } else if (val === "time") {
      setHistory((prev) => [...prev, { cmd: val, res: new Date().toTimeString().slice(0, 5) }]);
      setCmdin("");
    } else if (val === "exit") {
      setHistory([]);
      setCmdin("");
      onExit();
    } else if (val.includes("echo")) {
      const x = val.split("echo")[1];
      setHistory((prev) => [...prev, { cmd: val, res: x }]);
      setCmdin("");
    } else {
      const command = arr.find((el) => el.cmd === val);
      if (command) {
        setHistory((prev) => [...prev, { cmd: val, res: command.res }]);
        setCmdin("");
      }
    }
  };

  return (
    <div className={`h-full w-full p-3 font-mono bg-black ${clr ? "text-green-500" : "text-white"}`}>
      <div className="h-full overflow-auto scrollbar-none">
        <div className="text-sm mb-4">
          <p>shozi0S Terminal [ v 9.1.1 ]</p>
          <p>Copyright (c) 2026 Shozab. No rights reserved.</p>
        </div>

        <div className="w-full">
          {history.map((h, i) => (
            <div className="text-sm my-2" key={i}>
              <p className="mb-1">C:/shoziOS/sys69&gt;{h.cmd}</p>
              <p className="whitespace-pre-line">{h.res}</p>
            </div>
          ))}
        </div>

        <div className="w-full flex text-sm">
          <p ref={show} className="w-fit mr-1 whitespace-nowrap">C:/shoziOS/sys69&gt;</p>
          <input
            autoFocus
            placeholder={history.length > 0 ? "" : 'type "help" for commands'}
            type="text"
            value={cmdin}
            className="placeholder:italic placeholder:text-xs placeholder:animate-pulse h-5 w-full text-wrap outline-none"
            onChange={(e) => setCmdin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runcmd(cmdin);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;