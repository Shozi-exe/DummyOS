import { useEffect, useState } from "react";
import { PiNavigationArrow } from "react-icons/pi";

interface WeatherCard {
  time: string;
  temp: number;
  wecode: number;
}

interface WeatherDetails {
  iconUrl: string;
  label: string;
}

const EMOJI_BASE_URL = import.meta.env.VITE_EMOJI_BASE_URL || "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";

const getWeatherDetails = (code: number): WeatherDetails => {
  const base = EMOJI_BASE_URL;
  if (code === 0) return { iconUrl: `${base}/Sun/3D/sun_3d.png`, label: "Clear Sky" };
  if (code <= 2) return { iconUrl: `${base}/Sun%20behind%20cloud/3D/sun_behind_cloud_3d.png`, label: "Partly Cloudy" };
  if (code === 3) return { iconUrl: `${base}/Cloud/3D/cloud_3d.png`, label: "Overcast" };
  if (code === 45 || code === 48) return { iconUrl: `${base}/Fog/3D/fog_3d.png`, label: "Foggy" };
  if (code <= 55) return { iconUrl: `${base}/Sun%20behind%20rain%20cloud/3D/sun_behind_rain_cloud_3d.png`, label: "Drizzle" };
  if (code <= 57 || code === 66 || code === 67) return { iconUrl: `${base}/Cloud%20with%20snow/3D/cloud_with_snow_3d.png`, label: "Freezing Rain" };
  if (code <= 65) return { iconUrl: `${base}/Cloud%20with%20rain/3D/cloud_with_rain_3d.png`, label: "Rain" };
  if (code <= 77) return { iconUrl: `${base}/Cloud%20with%20snow/3D/cloud_with_snow_3d.png`, label: "Snow" };
  if (code <= 82) return { iconUrl: `${base}/Sun%20behind%20rain%20cloud/3D/sun_behind_rain_cloud_3d.png`, label: "Rain Showers" };
  if (code <= 86) return { iconUrl: `${base}/Snowflake/3D/snowflake_3d.png`, label: "Snow Showers" };
  if (code <= 99) return { iconUrl: `${base}/Cloud%20with%20lightning%20and%20rain/3D/cloud_with_lightning_and_rain_3d.png`, label: "Thunderstorm" };
  return { iconUrl: `${base}/Sun/3D/sun_3d.png`, label: "Clear" };
};

const formatHour = (hStr: string, i: number) => {
  if (i === 0) return "Now";
  const h = Number(hStr);
  return h === 0 ? "12am" : h === 12 ? "12pm" : h > 12 ? `${h - 12}pm` : `${h}am`;
};

const Weather = () => {
  const [location, setLocation] = useState<string>("");
  const [currentWecode, setCurrentWecode] = useState<number>(0);
  const [cards, setCards] = useState<WeatherCard[]>([]);
  const curr = new Date().getHours();

  useEffect(() => {
    const load = async (lat: number, lon: number) => {
      try {
        const geoApiUrl = import.meta.env.VITE_GEO_API_URL || "https://nominatim.openstreetmap.org";
        const weatherApiUrl = import.meta.env.VITE_WEATHER_API_URL || "https://api.open-meteo.com";

        const [geoRes, weatherRes] = await Promise.all([
          fetch(`${geoApiUrl}/reverse?lat=${lat}&lon=${lon}&format=json`).catch(() => null),
          fetch(`${weatherApiUrl}/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,weather_code`).catch(() => null),
        ]);

        if (geoRes && geoRes.ok) {
          const data = await geoRes.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.address?.municipality || data.address?.county;
          const country = data.address?.country;
          if (city || country) setLocation([city, country].filter(Boolean).join(", "));
        } else {
          const fallback = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`).then((r) => r.json()).catch(() => null);
          if (fallback) {
            const city = fallback.city || fallback.locality || fallback.principalSubdivision;
            const country = fallback.countryName;
            if (city || country) setLocation([city, country].filter(Boolean).join(", "));
          }
        }

        if (weatherRes && weatherRes.ok) {
          const data = await weatherRes.json();
          const hourly = data.hourly;
          if (hourly?.temperature_2m) {
            setCurrentWecode(hourly.weather_code?.[curr] ?? 0);
            const list: WeatherCard[] = [];
            for (let i = curr; i < curr + 24; i++) {
              if (!hourly.time?.[i]) break;
              list.push({
                time: hourly.time[i].split("T")[1]?.slice(0, 2) || "0",
                temp: hourly.temperature_2m[i] ?? 0,
                wecode: hourly.weather_code?.[i] ?? 0,
              });
            }
            setCards(list);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => load(p.coords.latitude, p.coords.longitude),
        () => load(51.5074, -0.1278),
        { timeout: 8000 }
      );
    } else {
      load(51.5074, -0.1278);
    }
  }, [curr]);

  const currentWeather = getWeatherDetails(currentWecode);
  const minTemp = cards.length ? Math.round(Math.min(...cards.map((c) => c.temp))) : null;
  const maxTemp = cards.length ? Math.round(Math.max(...cards.map((c) => c.temp))) : null;

  return (
    <div className={`h-full w-full flex flex-col justify-evenly bg-gradient-to-tr ${curr >= 22 || curr <= 6 ? "from-black via-blue-900 to-white" : "from-white via-blue-400 to-blue-500"} text-white`}>
      <nav className="flex justify-between items-center py-2 px-5">
        <section className="text-xs font-medium">
          {location || "Locating..."}
        </section>
        <button className="text-xl cursor-pointer"><PiNavigationArrow /></button>
      </nav>
      <section className="w-full h-[200px] flex justify-between items-center px-5">
        <main className="flex flex-col px-5 gap-2">
          <div className="text-9xl font-semibold">
            {cards.length ? `${Math.round(cards[0].temp)}°` : "--"}
          </div>
          <div className="text-xs pl-3 font-medium text-white/90">
            {currentWeather.label} {minTemp !== null && maxTemp !== null ? `${minTemp}° / ${maxTemp}°` : ""}
          </div>
        </main>
        <aside className="relative flex items-center justify-center">
          <img
            className="h-[152px] w-[152px] object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
            src={currentWeather.iconUrl}
            alt={currentWeather.label}
          />
        </aside>
      </section>
      <section className="h-[168px] w-[95%] flex flex-col justify-evenly mx-auto px-7 bg-[#456f89]/15 rounded-xl mt-20">
        <p className="p-2 text-sm">next 24 hours</p>
        <main className="flex gap-3 overflow-scroll scrollbar-none">
          {cards.map((card, index) => {
            const cardDetails = getWeatherDetails(card.wecode);
            return (
              <div
                key={index}
                className="flex flex-col justify-evenly items-center m-3 w-20 h-[100px] shrink-0"
              >
                <div className="text-xs">
                  <h1>{formatHour(card.time, index)}</h1>
                </div>
                <div className="h-10 w-10 flex items-center justify-center">
                  <img
                    className="h-9 w-9 object-contain drop-shadow-md pointer-events-none transition-transform hover:scale-110"
                    src={cardDetails.iconUrl}
                    alt={cardDetails.label}
                    loading="lazy"
                  />
                </div>
                <h1 className="text-sm font-medium">{Math.round(card.temp)}°</h1>
              </div>
            );
          })}
        </main>
      </section>
    </div>
  );
};

export default Weather;
