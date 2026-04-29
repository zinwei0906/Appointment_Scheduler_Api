import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'appointments' })
export class Appointment {
  @PrimaryKey()
  id!: number;

  @Property()
  date!: Date;

  @Property()
  time!: string; // Format: "HH:mm" e.g., "10:00"

  @Property({ nullable: true })
  customerName?: string;

  @Property({ nullable: true })
  customerEmail?: string;

  @Property({ nullable: true })
  customerPhone?: string;

  @Property({ default: 1 })
  slotsBooked!: number;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  constructor(date: Date, time: string, slotsBooked: number = 1) {
    this.date = date;
    this.time = time;
    this.slotsBooked = slotsBooked;
  }
}
