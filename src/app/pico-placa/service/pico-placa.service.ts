import { Injectable } from '@angular/core';

export interface Restriction {
  weekday: number;      // 1 = Monday, …, 5 = Friday
  digits: number[];     // restricted last‐digit plates
}

@Injectable({ providedIn: 'root' })
export class PicoPlacaService {
  private restrictions: Restriction[] = [
    { weekday: 1, digits: [1, 2] },
    { weekday: 2, digits: [3, 4] },
    { weekday: 3, digits: [5, 6] },
    { weekday: 4, digits: [7, 8] },
    { weekday: 5, digits: [9, 0] },
  ];

  // Restriction windows in minutes since midnight
  private morningStart = this.toMinutes('07:00');
  private morningEnd   = this.toMinutes('09:30');
  private eveningStart = this.toMinutes('16:00');
  private eveningEnd   = this.toMinutes('19:30');

  /**
   * Returns true if the vehicle **may** be on the road.
   * @param plate Full plate string, e.g. "PBX-1234"
   * @param dateStr ISO date string, e.g. "19/05/2025"
   * @param timeStr 24h time, e.g. "08:15"
   */
  canDrive(plate: string, dateStr: string, timeStr: string): boolean {
    // 1) Parse the date
    const parts = dateStr.split('-').map(n => parseInt(n, 10));
    if (parts.length !== 3 || parts.some(isNaN)) {
      throw new Error(`Invalid date: ${dateStr}`);
    }
    const [year, month, dayOfMonth] = parts;
    const date = new Date(year, month - 1, dayOfMonth);
    const weekday = date.getDay();

    // weekends are always allowed
    if (weekday === 0 || weekday === 6) {
      return true;
    }

    // 2) Extract last digit
    const lastChar = plate.trim().slice(-1);
    const lastDigit = parseInt(lastChar, 10);
    if (isNaN(lastDigit)) {
      throw new Error('Invalid plate: last character is not a digit');
    }

    // 3) Look up today's restriction
    const rule = this.restrictions.find(r => r.weekday === weekday)!;

    // 4) Check if we're in a restricted time window
    const minutes = this.toMinutes(timeStr);
    const inPeak =
      (minutes >= this.morningStart && minutes <= this.morningEnd) ||
      (minutes >= this.eveningStart && minutes <= this.eveningEnd);

    return !(inPeak && rule.digits.includes(lastDigit));
  }

  /**
   * Converts a time string in "HH:MM" format into the total number of minutes
   * elapsed since midnight.
   *
   * @param hhmm - A string representing time in 24-hour format (e.g., "07:30").
   * @returns The total minutes from 00:00. For example, "07:30" returns 450.
   */
  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(v => parseInt(v, 10));
    return h * 60 + m;
  }
}
