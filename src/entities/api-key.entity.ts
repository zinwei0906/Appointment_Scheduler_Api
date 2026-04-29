import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity({ tableName: 'api_keys' })
export class ApiKey {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  @Index()
  keyValue!: string; // The actual API key

  @Property()
  name!: string; // Friendly name for the key

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  @Index()
  isActive!: boolean;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ nullable: true })
  lastUsedAt?: Date;

  @Property({ default: 0 })
  usageCount!: number;

  @Property({ nullable: true })
  createdBy?: string;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  constructor(keyValue: string, name: string, description?: string) {
    this.keyValue = keyValue;
    this.name = name;
    this.description = description;
    this.isActive = true;
    this.usageCount = 0;
  }
}
