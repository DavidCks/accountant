export class TimePoints {
  static dayStartMS(): number {
    const nowMs = Date.now();
    const nowHoursMs = new Date().getHours() * 60 * 60 * 1000;
    const nowMinutesMs = new Date().getMinutes() * 60 * 1000;
    const dayStartMs = nowMs - nowHoursMs - nowMinutesMs;
    return dayStartMs;
  }

  static h24AgoMS(): number {
    const nowMs = Date.now();
    const h24AgoMs = nowMs - 24 * 60 * 60 * 1000;
    return h24AgoMs;
  }

  static weekStartMS(): number {
    const nowMs = Date.now();
    const nowDayMs = new Date().getDay() * 24 * 60 * 60 * 1000;
    const nowHoursMs = new Date().getHours() * 60 * 60 * 1000;
    const nowMinutesMs = new Date().getMinutes() * 60 * 1000;
    const weekStartMs = nowMs - nowDayMs - nowHoursMs - nowMinutesMs;
    return weekStartMs;
  }

  static d7AgoMS(): number {
    const nowMs = Date.now();
    const d7AgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;
    return d7AgoMs;
  }

  static d14AgoMS(): number {
    const nowMs = Date.now();
    const d14AgoMs = nowMs - 14 * 24 * 60 * 60 * 1000;
    return d14AgoMs;
  }

  static monthStartMS(): number {
    const nowMs = Date.now();
    const nowDayMs = new Date().getDate() * 24 * 60 * 60 * 1000;
    const nowHoursMs = new Date().getHours() * 60 * 60 * 1000;
    const nowMinutesMs = new Date().getMinutes() * 60 * 1000;
    const h24 = 24 * 60 * 60 * 1000;
    const monthStartMs = nowMs - nowDayMs - nowHoursMs - nowMinutesMs + h24;
    return monthStartMs;
  }

  static isoToLocalMs(iso: string): number {
    const date = new Date(iso);
    const localTimeMS = date.getTime();
    return localTimeMS;
  }
}
