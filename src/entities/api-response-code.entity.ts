import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity({ tableName: 'api_response_codes' })
export class ApiResponseCode {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  @Index()
  code!: string; // e.g., "APPOINTMENT_CREATED", "SLOT_NOT_AVAILABLE"

  @Property({ columnType: 'text', nullable: true })
  messageEn?: string; // English message

  @Property({ columnType: 'text', nullable: true })
  messageMs?: string; // Malay message

  @Property({ columnType: 'text', nullable: true })
  messageZh?: string; // Chinese message

  @Property({ columnType: 'text', nullable: true })
  remark?: string; // Internal notes/documentation

  @Property({ default: true })
  isActive!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  constructor(
    code: string,
    messageEn?: string,
    messageMs?: string,
    messageZh?: string,
    remark?: string,
  ) {
    this.code = code;
    this.messageEn = messageEn;
    this.messageMs = messageMs;
    this.messageZh = messageZh;
    this.remark = remark;
    this.isActive = true;
  }
}
