export class TimePoints {
  static dayStartMS(): number {
    const now = new Date();
    // Midnight local time of the current day
    const dayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    return dayStart.getTime();
  }

  static h24AgoMS(): number {
    const nowMs = Date.now();
    const h24AgoMs = nowMs - 24 * 60 * 60 * 1000;
    return h24AgoMs;
  }

  static weekStartMS(): number {
    const now = new Date();
    // Start of the current week (Sunday) at midnight
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
      0,
      0,
      0,
      0
    );
    return weekStart.getTime();
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
    const now = new Date();
    // Midnight at the first day of the current month
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    return monthStart.getTime();
  }

  static isoToLocalMs(iso: string): number {
    const date = new Date(iso);
    const localTimeMS = date.getTime();
    return localTimeMS;
  }
}
