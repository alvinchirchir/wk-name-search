import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiGatewayTimeoutResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
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
    description: 'A short description of the requested person. This response returns a JSON with a description field bearing the short description.',
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
    description: 'The requested resource was not found. This error occurs when the API is unable to find the requested person on English Wikipedia.',
    schema: {
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.NOT_FOUND,
        },
        message: {
          type: 'string',
          //example: 'Person not found on English Wikipedia',
        },
        page: {
          type: 'string',
           example: true,
           description: 'Indicates whether pages with similar names exist. If set to true it means there exist pages and suggestions are provided in message string and if false no suggestions are provided.  ',
        }
      },
    },
  })

  @ApiBadRequestResponse({
    description: 'The request was malformed or contained invalid data. This error occurs when the API is unable to process the request due to validation errors, such as missing or invalid parameters.',
    schema: {
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        message: {
          type: 'string',
          example: [],

        },
        error: {
          type: 'string',
        }
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'The requested service is currently unavailable. This error occurs when the API is unable to connect to the Wikimedia API or when the Wikimedia API is down for maintenance or other reasons.',
    schema: {
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.SERVICE_UNAVAILABLE,
        },
        message: {
          type: 'string',
        },
      },
    },
  })
  @Get('short-description')
  async getShortDescription(@Query() queryParamsDTO: GetShortDescriptionInput): Promise<GetShortDescriptionOutput> {
    return await this.appService.getShortDescription(queryParamsDTO);
  }
}
