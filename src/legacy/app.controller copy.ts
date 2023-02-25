import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service copy';
import { QueryParamsDTO } from '../dto/dto'
@Controller()
@ApiTags('Search By Name')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @ApiOkResponse({
    description: 'The end point return string of short description or suggestions if name is not found',
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'Something went wrong',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'No page found with name',
    type: String,
  })
  @Get()
  async findByShortDescriptionByName(@Query() queryParamsDTO: QueryParamsDTO): Promise<String> {
    return await this.appService.findByShortDescriptionByName(queryParamsDTO);
  }
}
