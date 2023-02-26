import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetShortDescriptionInput, GetShortDescriptionOutput } from './dto/schema'
@Controller()
@ApiTags('Search By Name')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @ApiQuery({
    name: 'name',
    type: String,
    description: 'The name of the person to look up on English Wikipedia',
    example: 'Tom Holland',
  })
  @ApiOkResponse({
    description: 'The short description of the person',
    schema: {
      properties: {
        description: {
          type: 'string',
          example: 'English actor (born 1996)',
        }
      }
    }
  })

  @ApiNotFoundResponse({
    description: 'The person was not found on English Wikipedia',
    schema: {
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.NOT_FOUND,
        },
        message: {
          type: 'string',
          example: 'Person not found on English Wikipedia',
        }
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No short description was found on English Wikipedia but there are similar names :',
    schema: {
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        message: {
          type: 'string',
          example: 'No short description was found on English Wikipedia but there are similar names : ',
        }
      },
    },
  })
  @Get()
  async getShortDescription(@Query() queryParamsDTO: GetShortDescriptionInput): Promise<GetShortDescriptionOutput> {
    return await this.appService.getShortDescription(queryParamsDTO);
  }
}
