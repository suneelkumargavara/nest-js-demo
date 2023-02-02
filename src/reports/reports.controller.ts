import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

import { CurrentUser } from '../users/decorators/currentuser.decorator';
import { User } from '../users/users.entity';

import { ReportDTO } from './dtos/reports.dto';
import { Serialize } from '../interceprots/serialize.interceptor';
import { ApproveReportDTO } from './dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDTO) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
