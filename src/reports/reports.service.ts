import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReportDTO } from './dtos/create-report.dto';

import { Report } from './reports.entity';
import { User } from '../users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  findOne(id: string) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  create(reportDto: CreateReportDTO, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    console.log(`id is ${id}`);
    const report = await this.findOne(id);
    console.log(`report is ${report}`);
    if (!report) throw new NotFoundException('report not found!');
    report.approved = approved;
    return this.repo.save(report);
  }
}
