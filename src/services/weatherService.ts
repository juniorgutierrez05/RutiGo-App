/**
 * Weather Service for RutiGo
 * Live weather conditions for Atlántico destinations powered by Open-Meteo (Free & Open)
 */

export interface WeatherInfo {
  temperature: number;
  windspeed: number;
  description: string;
  iconName: 'sunny' | 'partly-sunny' | 'cloudy' | 'rainy' | 'thunderstorm';
}

function mapWeatherCode(code: number): { description: string; iconName: WeatherInfo['iconName'] } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) {
    return { description: 'Despejado', iconName: 'sunny' };
  }
  if (code >= 1 && code <= 3) {
    return { description: 'Parcialmente nublado', iconName: 'partly-sunny' };
  }
  if (code === 45 || code === 48) {
    return { description: 'Neblina ligera', iconName: 'cloudy' };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { description: 'Lluvias ligeras', iconName: 'rainy' };
  }
  if (code >= 95 && code <= 99) {
    return { description: 'Tormenta eléctrica', iconName: 'thunderstorm' };
  }
  return { description: 'Cálido', iconName: 'partly-sunny' };
}

/**
 * Fetches current weather for a specific latitude and longitude
 */
export async function fetchPlaceWeather(lat: number, lng: number): Promise<WeatherInfo | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    );
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current_weather;
    if (!current) return null;

    const { description, iconName } = mapWeatherCode(current.weathercode);

    return {
      temperature: Math.round(current.temperature),
      windspeed: Math.round(current.windspeed),
      description,
      iconName,
    };
  } catch {
    return null;
  }
}
