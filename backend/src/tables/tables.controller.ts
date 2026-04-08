import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { Table } from './entities/table.entity';
import { UpdateTableDto } from './dto/update-table.dto';
import { ResponseTableDto } from './dto/response-table.dto';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiOperation({ summary: 'create new table' })
  @ApiResponse({
    status: 201,
    type: ResponseTableDto,
  })
  @Post()
  async create(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return await this.tablesService.create(createTableDto);
  }

  @ApiOperation({ summary: 'Get all tables' })
  @Get()
  async getAll(): Promise<ResponseTableDto[]> {
    return await this.tablesService.findAll();
  }

  @ApiOperation({ summary: 'Get table by ID' })
  @ApiResponse({
    status: 200,
    type: ResponseTableDto,
  })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<ResponseTableDto> {
    return this.tablesService.findById(+id);
  }

  @ApiOperation({ summary: 'Update table by ID' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    return this.tablesService.update(+id, updateTableDto);
  }

  @ApiOperation({ summary: 'Delete table by ID' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.tablesService.delete(+id);
  }
}
