import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

import { ReportsService } from './reports.service';

import { CurrentUser } from '../users/decorators/currentuser.decorator';

import { Serialize } from '../interceprots/serialize.interceptor';

import { User } from '../entities/users.entity';

import { ReportDTO } from './dtos/reports.dto';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { GetEstimateDTO } from './dtos/get-estimates.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimates(@Query() query: GetEstimateDTO) {
    return this.reportsService.createEstimate(query);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDTO) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Delete('/:id')
  deleteReport(@Param('id') id: string) {
    return this.reportsService.deleteReport(id);
  }
}
