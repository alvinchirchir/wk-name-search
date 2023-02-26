import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetShortDescriptionInput, GetShortDescriptionOutput } from './dto/schema'
@Controller()
@ApiTags('Get Description By Name')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @ApiQuery({
    name: 'name',
    type: String,
    description: 'This query parameter expects a string input with the name of a person to look up on English Wikipedia. The endpoint requires names to follow a specific format where each word is separated by a single underscore and the first letter of each word is capitalized. However, to make it more user-friendly, the input string can also contain spaces or underscores between words, which will be transformed by the endpoint to follow the required naming convention. For example, "Nicki Minaj" or "nicki_minaj" are both valid inputs for this query parameter, and will be transformed into "Nicki_Minaj" by the endpoint. This naming convention is necessary to ensure that the endpoint can correctly retrieve the desired information from Wikipedia.',
    example: 'Tom Holland',
  })
  @ApiOkResponse({
    description: 'Short description of the person.',
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
    description: 'No short description was found on English Wikipedia but there might be similar names : ...',
    schema: {
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        message: {
          type: 'string',
          example: 'No short description was found on English Wikipedia but there might be similar names : ',
        }
      },
    },
  })
  @Get('short-description')
  async getShortDescription(@Query() queryParamsDTO: GetShortDescriptionInput): Promise<GetShortDescriptionOutput> {
    return await this.appService.getShortDescription(queryParamsDTO);
  }
}
