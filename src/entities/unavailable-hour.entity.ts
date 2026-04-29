import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'unavailable_hours' })
export class UnavailableHour {
  @PrimaryKey()
  id!: number;

  @Property()
  dayOfWeek!: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  @Property()
  startTime!: string; // Format: "HH:mm" e.g., "12:00"

  @Property()
  endTime!: string; // Format: "HH:mm" e.g., "13:00"

  @Property({ nullable: true })
  reason?: string; // e.g., "Lunch Break"

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  constructor(
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    reason?: string,
  ) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.reason = reason;
  }
}
