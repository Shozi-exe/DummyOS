import { IoSearch, IoWifiSharp, IoVolumeHigh, IoVolumeMedium, IoVolumeLow, IoVolumeMute } from "react-icons/io5";
import { BsAirplane, BsBatteryHalf } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Minus, Square, X, Copy, Wifi, Bluetooth, BatteryFull, Settings as SettingsIcon } from "lucide-react";
import { BiBrightness } from "react-icons/bi";
import Cal from "./components/Cal";
import Note from "./components/Note";
import Terminal from "./components/Terminal";
import Weather from "./components/Weather";
import Chatbot from "./components/Chatbot";
import Browser from "./components/Browser";

interface AppItem {
  name: string;
  icon: string;
}

interface Position {
  x: number;
  y: number;
}

const apps: AppItem[] = [
  {
    name: "Calculator",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Windows_11_Windows_Calculator.svg"
  },
  {
    name: "Weather",
    icon: "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sun%20behind%20cloud/3D/sun_behind_cloud_3d.png"
  },
  {
    name: "Terminal",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Windows_Terminal_logo.svg"
  },
  {
    name: "Notes",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/07/Notepad_Win11.svg"
  },
  {
    name: "Chatbot",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
  },
  {
    name: "Browser",
    icon: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/brave.svg"
  }
];

const VolumeIcon = ({ volume }: { volume: number }) => {
  if (volume === 0) return <IoVolumeMute size={20} />;
  if (volume < 33) return <IoVolumeLow size={20} />;
  if (volume < 66) return <IoVolumeMedium size={20} />;
  return <IoVolumeHigh size={20} />;
};

const App = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [volume, setVolume] = useState<number>(100);
  const [bright, setBright] = useState<number>(100);
  const [stats, setStats] = useState<boolean>(false);
  const [rightClick, setRightClick] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [win, setWin] = useState<boolean>(false);
  const [min, setMin] = useState<boolean>(false);
  const [opened, setOpened] = useState<string | null>(null);
  const [act, setAct] = useState<boolean>(false);
  const [isize , setIsize] = useState<string>("md");


  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appName: string): void => {
    if (opened === appName && act) {
      setMin(!min);
    } else {
      setOpened(appName);
      setAct(true);
      setMin(false);
    }
  };

  return (
    <main
      className="h-dvh w-full relative bg-[url('/batman.jpg')] bg-cover bg-center overflow-hidden"
      onClick={() => {
        if (stats) setStats(false);
        if (rightClick) setRightClick(false);
      }}
      onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
        if (e.button === 2) {
          if (!act || min) {
            setRightClick(true);
            setPosition({ x: e.clientX, y: e.clientY });
          }
        } else {
          setRightClick(false);
        }
      }}
      onContextMenu={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}
    >
      {rightClick && (!act || min) && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute bg-[#474242]/50 text-white w-[180px] rounded-md shadow-lg backdrop-blur-md z-50 text-xs"
          style={{ top: position.y, left: position.x }}
        >
          <button
            onClick={() => {
              setIsize("sm");
              setRightClick(false);
            }}
            className="w-full text-left px-3 py-3 hover:bg-white/10 cursor-pointer"
          >
            Small icons
          </button>
          <button
            onClick={() => {
              setIsize("md");
              setRightClick(false);
            }}
            className="w-full text-left px-3 py-3 hover:bg-white/10 cursor-pointer"
          >
            Medium icons
          </button>
          <button
            onClick={() => {
              setIsize("lg");
              setRightClick(false);
            }}
            className="w-full text-left px-3 py-3 hover:bg-white/10 cursor-pointer"
          >
            Large icons
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="w-full text-left px-3 py-3 hover:bg-white/10 cursor-pointer border-t border-white/20"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setIsize("lg");
              setRightClick(false);
            }}
            className="w-full text-left px-3 py-3 hover:bg-white/10 cursor-pointer border-b border-white/20"
          >
            Personalize
          </button>
          <button
            onClick={() => openApp("Terminal")}
            className="w-full text-left px-3 py-3 hover:bg-white/10 cursor-pointer border-t border-white/20"
          >
            Open Terminal
          </button>
        </div>  
      )}

      <div className="flex flex-col items-start p-2">
        {apps.map((app) => (
          <button
            key={app.name}
            onDoubleClick={() => openApp(app.name)}
            className={`${isize === "lg" ? "h-16 w-16" : isize === "md" ? "h-14 w-14" : "h-12 w-12"} mx-2 my-4 gap-3 flex flex-col items-center justify-center text-white rounded-lg transition-colors cursor-pointer`}
          >
            <img src={app.icon} alt={app.name} className={`${isize === "lg" ? "h-8 w-8" : isize === "md" ? "h-7 w-7" : "h-6 w-6"} object-contain`} />
            <span className="text-xs font-semibold">{app.name}</span>
          </button>
        ))}
      </div>

      <footer className="text-white absolute w-full h-12 flex items-center justify-between px-2 sm:px-4 bottom-0 bg-[#2f2a2a] bg-gradient-to-r from-transparent to-[#330b0b]/65 backdrop-blur-md border-slate-800 z-30">
        <section className="h-full hidden md:flex items-center w-24 shrink-0"></section>

        <section className="h-full flex gap-1 sm:gap-2 items-center justify-center flex-1 max-w-full overflow-x-auto scrollbar-none">
          <button className="hover:bg-white/10 hover:scale-105 rounded-md h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center transition-all cursor-pointer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" alt="Start" className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] object-contain" />
          </button>
          <button className="hover:bg-white/10 hover:scale-105 rounded-md h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center transition-all cursor-pointer">
            <IoSearch className="text-lg sm:text-2xl" />
          </button>
          {apps.filter((app) => app.name !== "Settings").map((app) => {
            const isOpened = act && opened === app.name;
            return (
              <button
                key={app.name}
                onClick={() => openApp(app.name)}
                className={`relative hover:bg-white/10 hover:scale-105 rounded-md h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  isOpened ? "bg-white/10" : ""
                }`}
              >
                <img src={app.icon} alt={app.name} className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] object-contain" />
                {isOpened && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-200 ${
                      min ? "w-2 bg-gray-400" : "w-4 bg-purple-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </section>

        <section className="h-full items-center flex justify-end gap-2 sm:gap-4 shrink-0">
          <div onClick={() => setStats(!stats)} className="flex gap-1.5 sm:gap-2 relative items-center cursor-pointer">
            <BsBatteryHalf size={18} className="hover:text-slate-300 shrink-0" />
            <button className="hover:text-slate-300 outline-none shrink-0">
              <VolumeIcon volume={volume} />
            </button>
            <IoWifiSharp size={18} className="hover:text-slate-300 shrink-0" />

            {stats && (
              <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className="absolute bottom-12 right-0 bg-[#312e2e]/95 text-white p-3 rounded-lg flex flex-col items-center gap-3 backdrop-blur-md h-80 w-72 max-w-[calc(100vw-1rem)] z-50 shadow-2xl"
              >
                <div className="gap-8 p-5 grid grid-cols-3 w-full">
                  <button className="h-[52px] w-[52px] flex items-center justify-center bg-[#504d4d]/50 hover:bg-[#656161]/50 rounded-md transition-colors cursor-pointer"><Wifi size={18} /></button>
                  <button className="h-[52px] w-[52px] flex items-center justify-center bg-[#504d4d]/50 hover:bg-[#656161]/50 rounded-md transition-colors cursor-pointer"><Bluetooth size={18} /></button>
                  <button className="h-[52px] w-[52px] flex items-center justify-center bg-[#504d4d]/50 hover:bg-[#656161]/50 rounded-md transition-colors cursor-pointer"><BsAirplane size={18} /></button>
                  <button className="h-[52px] w-[52px] flex items-center justify-center bg-[#504d4d]/50 hover:bg-[#656161]/50 rounded-md transition-colors cursor-pointer"><BiBrightness size={18} /></button>
                  <button className="h-[52px] w-[52px] flex items-center justify-center bg-[#504d4d]/50 hover:bg-[#656161]/50 rounded-md transition-colors cursor-pointer"><BatteryFull size={18} /></button>
                  <button className="h-[52px] w-[52px] flex items-center justify-center bg-[#504d4d]/50 hover:bg-[#656161]/50 rounded-md transition-colors cursor-pointer"><SettingsIcon size={18} /></button>
                </div>
                <div className="flex flex-col justify-center px-2 py-6 w-full gap-6">
                  <div className="flex items-center gap-3">
                    <VolumeIcon volume={volume} />
                    <input
                      type="range"
                      className="w-full h-1 accent-purple-300 cursor-pointer"
                      max={100}
                      value={volume}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <BiBrightness size={20} />
                    <input
                      type="range"
                      className="w-full h-1  accent-purple-300 cursor-pointer"
                      max={100}
                      value={bright}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBright(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-xs flex flex-col items-end justify-center font-medium select-none shrink-0">
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="hidden sm:block">{time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
          </div>
        </section>
      </footer>

      <div
        className={`${act && !min ? "flex" : "hidden"} flex-col absolute bg-[#383636] z-40 overflow-hidden transition-all duration-150 ${
          win
            ? "inset-0 bottom-12 w-full h-[calc(100dvh-3rem)] rounded-none"
            : "top-4 bottom-16 inset-x-2 sm:inset-x-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] md:w-[80vw] lg:w-[70vw] sm:h-[80vh] max-w-5xl rounded-lg shadow-2xl"
        }`}
      >
        <nav className="flex justify-between items-center w-full h-10 bg-[#272626] px-3 shrink-0 select-none">
          <h1 className="text-sm font-semibold text-gray-300">{opened}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMin(true)}
              className="hover:text-slate-300 text-slate-400 transition-colors cursor-pointer"
              title="Minimize"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => setWin(!win)}
              className="hover:text-slate-300 text-slate-400 transition-colors cursor-pointer"
              title={win ? "Restore Down" : "Maximize"}
            >
              {win ? <Square size={13} /> : <Copy size={13} />}
            </button>
            <button
              onClick={() => {
                setAct(false);
                setOpened(null);
              }}
              className="hover:text-slate-300 text-slate-400 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </nav>

        <section className="flex-1 w-full overflow-hidden">
          {opened === "Calculator" && <Cal />}
          {opened === "Notes" && <Note />}
          {opened === "Terminal" && <Terminal onExit={() => setAct(false)}/>}
          {opened === "Weather" && <Weather />}
          {opened === "Chatbot" && <Chatbot />}
          {opened === "Browser" && <Browser />}
          {!opened && <div className="flex items-center justify-center h-full text-2xl text-white">Open an app</div>}
        </section>
      </div>
    </main>
  );
};

export default App;