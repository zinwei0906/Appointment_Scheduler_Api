import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity({ tableName: 'api_logs' })
export class ApiLog {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  apiKey!: string;

  @Property()
  method!: string; // GET, POST, PUT, DELETE, etc.

  @Property({ columnType: 'text' })
  url!: string;

  @Property({ columnType: 'text', nullable: true })
  requestHeaders?: string; // JSON string

  @Property({ columnType: 'text', nullable: true })
  requestBody?: string; // JSON string

  @Property({ columnType: 'text', nullable: true })
  requestQuery?: string; // JSON string

  @Property()
  @Index()
  statusCode!: number;

  @Property({ columnType: 'text', nullable: true })
  responseBody?: string; // JSON string

  @Property({ nullable: true })
  responseTime?: number; // in milliseconds

  @Property({ nullable: true })
  ipAddress?: string;

  @Property({ nullable: true })
  userAgent?: string;

  @Property({ nullable: true })
  language?: string;

  @Property({ onCreate: () => new Date() })
  @Index()
  createdAt!: Date;

  constructor(apiKey: string, method: string, url: string, statusCode: number) {
    this.apiKey = apiKey;
    this.method = method;
    this.url = url;
    this.statusCode = statusCode;
  }
}
