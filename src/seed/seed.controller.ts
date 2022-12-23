import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }


  @Get()
  public async executeSeed() {
    return await this.seedService.executeSeed();
  }

}
