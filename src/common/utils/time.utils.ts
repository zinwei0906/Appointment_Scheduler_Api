import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export class TimeUtils {
  /**
   * Generate time slots between start and end hours
   * @param startHour - Starting hour (0-23)
   * @param endHour - Ending hour (0-23)
   * @param slotDurationMinutes - Duration of each slot in minutes
   * @returns Array of time strings in HH:mm format
   */
  static generateTimeSlots(
    startHour: number,
    endHour: number,
    slotDurationMinutes: number,
  ): string[] {
    const slots: string[] = [];
    let currentTime = dayjs().hour(startHour).minute(0).second(0);
    const endTime = dayjs().hour(endHour).minute(0).second(0);

    while (currentTime.isBefore(endTime)) {
      slots.push(currentTime.format('HH:mm'));
      currentTime = currentTime.add(slotDurationMinutes, 'minute');
    }

    return slots;
  }

  /**
   * Check if a time is within a range
   * @param time - Time to check (HH:mm)
   * @param startTime - Start time (HH:mm)
   * @param endTime - End time (HH:mm)
   * @returns true if time is within range
   */
  static isTimeInRange(
    time: string,
    startTime: string,
    endTime: string,
  ): boolean {
    const timeToCheck = dayjs(time, 'HH:mm');
    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');

    return (
      (timeToCheck.isAfter(start) || timeToCheck.isSame(start)) &&
      timeToCheck.isBefore(end)
    );
  }

  /**
   * Format date to YYYY-MM-DD
   */
  static formatDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string): Date {
    return dayjs(dateString).toDate();
  }

  /**
   * Check if date is a weekday
   */
  static isWeekday(date: Date): boolean {
    const dayOfWeek = dayjs(date).day();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  /**
   * Get day of week (0 = Sunday, 6 = Saturday)
   */
  static getDayOfWeek(date: Date): number {
    return dayjs(date).day();
  }
}
