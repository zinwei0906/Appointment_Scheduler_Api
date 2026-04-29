import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'days_off' })
export class DayOff {
  @PrimaryKey()
  id!: number;

  @Property()
  date!: Date;

  @Property({ nullable: true })
  reason?: string; // e.g., "Public Holiday - Christmas"

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  constructor(date: Date, reason?: string) {
    this.date = date;
    this.reason = reason;
  }
}
