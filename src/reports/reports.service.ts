import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { CreateReportDTO } from './dtos/create-report.dto';
import { GetEstimateDTO } from './dtos/get-estimates.dto';

import { Report } from '../entities/reports.entity';
import { User } from '../entities/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate(estimateDTO: GetEstimateDTO) {
    const { make, model, lat, lng, year, mileage } = estimateDTO;
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

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
    const report = await this.findOne(id);
    if (!report) throw new NotFoundException('report not found!');
    report.approved = approved;
    return this.repo.save(report);
  }

  async deleteReport(id: string) {
    const report = await this.findOne(id);
    if (!report) throw new NotFoundException('report not founc');
    return this.repo.remove(report);
  }
}
