import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ApiKey } from '../../entities/api-key.entity';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly repo: EntityRepository<ApiKey>,
  ) {}

  async findByKey(key: string) {
    return this.repo.findOne({ keyValue: key });
  }

  async updateUsage(apiKey: ApiKey) {
    apiKey.lastUsedAt = new Date();
    apiKey.usageCount += 1;
    await this.repo.getEntityManager().flush();
  }
}
