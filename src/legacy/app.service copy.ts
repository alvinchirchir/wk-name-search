/**
 * Production-ready service for interacting with the Wikimedia API.
 * Provides methods for retrieving the short description of a Wikipedia page given its name.
 */

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { QueryParamsDTO } from '../dto/dto';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name)

  /**
   * Creates a new instance of the AppService class.
   * @param httpService The HttpService to use for making HTTP requests to the Wikimedia API.
   */
   constructor(
    private readonly httpService: HttpService,
  ) { }


  /**
  * Retrieves the short description of a Wikipedia page given its name.
  * @param queryParamsDTO An object containing the name of the page to search for.
  * @returns The short description of the Wikipedia page, or an empty string if no short description was found.
  * @throws HttpException if an error occurs during the HTTP request.
  */
  async findByShortDescriptionByName(queryParamsDTO: QueryParamsDTO): Promise<String> {
    try {
      // Define the base URL of the Wikipedia API and the parameters of the API request
      const baseUrl = 'https://en.wikipedia.org/w/api.php';

      // const normalizedName = this.preProcessNameQueryParam(queryParamsDTO.name);
      const normalizedName = (queryParamsDTO.name);

      const predefinedParams = {
        action: "query",
        prop: "revisions",
        titles: normalizedName,
        rvlimit: 1,
        formatversion: 2,
        format: "json",
        rvprop: "content"
      }

      // Send an HTTP GET request to the Wikipedia API and extract the wikitext of the page
      const htmlContent = await lastValueFrom(
        this.httpService.get(baseUrl, { params: predefinedParams }).pipe(
          map((response) => response.data)
        )
      ).catch((error) => {
        // If an error occurs during the HTTP request, log the error and throw an HttpException
        this.logger.error(error);
        throw new HttpException("Service not available. Kindly try again another time", HttpStatus.BAD_REQUEST);
      });


      // Check if the pages array is empty
      if (!htmlContent?.query?.pages?.length) {
        this.logger.error(`No page found with name: ${queryParamsDTO.name}`);
        throw new HttpException(`No page found with name: ${queryParamsDTO.name}`, HttpStatus.NOT_FOUND);
      }

      // Extract the short description from the wikitext using a regular expression pattern
      const wikitext = htmlContent.query.pages[0].revisions[0].content;
      const shortDesc = this.extractShortDescription(wikitext);

      if (shortDesc) {
        return shortDesc;
      } else {
        return this.suggestSimilarNames(wikitext,normalizedName)
      }

      // Return the short description

    } catch (error) {
      // If an error occurs, log the error and throw an HttpException
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
 * Preprocesses the given name query parameter by replacing any spaces with underscores
 * and capitalizing each word.
 * If the name query parameter is a single word without spaces, capitalizes the word.
 * 
 * @param {string} nameQueryParam - The name query parameter to preprocess.
 * @returns {string} - The preprocessed name query parameter.
 */
  preProcessNameQueryParam(nameQueryParam: string): string {
    if (nameQueryParam.includes(' ')) {
      // If the name query parameter contains spaces, replace them with underscores and capitalize each word
      return nameQueryParam
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('_');
    } else {
      // If the name query parameter is a single word, capitalize it
      return nameQueryParam.charAt(0).toUpperCase() + nameQueryParam.slice(1);
    }
  }

  /**
   * Extracts the short description from a string of wikitext using a regular expression pattern.
   * @param wikitext A string of wikitext to search for the short description in.
   * @returns The short description, or an empty string if no short description was found.
   */
  extractShortDescription(wikitext: string): string {
    // Define a regular expression pattern to match the short description field
    const shortDescPattern = /{{Short description\|(.+?)}}/;

    // Use the regular expression pattern to extract the short description from the wikitext string
    const match = wikitext.match(shortDescPattern);

    // If no match was found, return a generic message
    if (!match) {
      return;
    }

    // Otherwise, return the matched text
    return match[1];
  }

/**
 * Returns a string with similar names to the given name from the provided content.
 * @param content - The string content to search for similar names.
 * @param name - The name to find similar names for.
 * @returns A string with similar names to the given name or an error message if no similar names are found.
 */
suggestSimilarNames(content: string, name: string): string {
  // Regular expression to match names wrapped in double brackets
  const namePattern = /\[\[(.*?)\]\]/g;

  // Find all matches of the name pattern in the content
  const namesMatch = content.match(namePattern);

  // If no matches are found, return an error message
  if (!namesMatch) {
    return "No similar names found";
  }

  // Filter out any names that contain "Category" and are not the input name
  const similarNames = namesMatch
    .map((nameMatch) => nameMatch.replace("[[", "").replace("]]", ""))
    .filter((n) => !n.includes("Category") && n !== name && n.includes(name));

  // If no similar names are found, return an error message with the input name
  if (similarNames.length === 0) {
    return `No similar names found for "${name}"`;
  }

  // Return a string with the similar names joined by commas
  return `Did you mean: ${similarNames.join(", ")}?`;
}

}
