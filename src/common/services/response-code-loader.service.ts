import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ApiResponseCode } from '../../entities/api-response-code.entity';
import { ResponseService } from './response.service';

@Injectable()
export class ResponseCodeLoaderService implements OnModuleInit {
  constructor(
    @InjectRepository(ApiResponseCode)
    private readonly repo: EntityRepository<ApiResponseCode>,
    private readonly responseService: ResponseService,
  ) {}

  async onModuleInit() {
    const codes = await this.repo.find({
      isActive: true,
    });

    this.responseService.setCodes(codes);
  }
}
