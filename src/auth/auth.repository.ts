import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

class CrudRepository<T extends string> {
  constructor(private prismaService: PrismaService) {
      
  }

  
}

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  get findUnique() {
    return this.prismaService.user.findUnique;
  }

  get create() {
    return this.prismaService.user.create;
  }

  get update() {
    return this.prismaService.user.update;
  }
}
