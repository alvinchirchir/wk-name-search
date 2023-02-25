import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { QueryParamsDTO } from './dto/dto'
@Controller()
@ApiTags('Search By Name')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @ApiQuery({
    name: 'name',
    type: String,
    description: 'The name of the person to look up on English Wikipedia',
    example: 'Yoshua Bengio',
  })
  @ApiOkResponse({
    description: 'The short description of the person',
    schema: {
      properties: {
        description: {
          type: 'string',
          example: 'Canadian computer scientist',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The person was not found on English Wikipedia',
    schema: {
      properties: {
        error: {
          type: 'string',
          example: 'Person not found on English Wikipedia',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No short description was found for the person on English Wikipedia',
    schema: {
      properties: {
        error: {
          type: 'string',
          example: 'No short description was found on English Wikipedia',
        },
      },
    },
  })
  @Get()
  async getShortDescription(@Query() queryParamsDTO: QueryParamsDTO): Promise<String> {
    return await this.appService.getShortDescription(queryParamsDTO);
  }
}
