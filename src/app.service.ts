/**
 * Production-ready service for interacting with the Wikimedia API.
 * Provides methods for retrieving the short description of a Wikipedia page given its name.
 */

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { GetShortDescriptionInput, GetShortDescriptionOutput } from './dto/schema';

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
  async getShortDescription(queryParamsDTO: GetShortDescriptionInput): Promise<GetShortDescriptionOutput> {
    try {
      // Define the base URL of the Wikipedia API and the parameters of the API request
      const baseUrl = process.env.WIKIPEDIA_API_URL;

      const normalizedName = this.transformString(queryParamsDTO.name);

      const queryParams = {
        titles: normalizedName,
        action: process.env.WIKIPEDIA_ACTION,
        prop: process.env.WIKIPEDIA_PROP,
        rvlimit: process.env.WIKIPEDIA_RV_LIMIT,
        format: process.env.WIKIPEDIA_FORMAT,
        formatversion: process.env.WIKIPEDIA_FORMAT_VERSION,
        rvprop: process.env.WIKIPEDIA_RV_PROP
      }

      // Send an HTTP GET request to the Wikipedia API
      const htmlContent = await this.getWikipediaHtmlContent(baseUrl, queryParams)

      // Check if the pages array is empty
      if (!htmlContent?.query?.pages?.length) {
        this.logger.error(`No page found with name: ${queryParamsDTO.name}`);
        throw new HttpException(`Person not found on English Wikipedia`, HttpStatus.NOT_FOUND);
      }

      // Check if revisions is available 
      if (!htmlContent.query.pages[0].revisions?.length) {
        this.logger.error(`No page found with name: ${queryParamsDTO.name}`);
        throw new HttpException(`Person not found on English Wikipedia`, HttpStatus.NOT_FOUND);
      }

      // Extract the short description from the wikitext using a regular expression pattern
      const wikitext = htmlContent.query.pages[0].revisions[0].content;
      const shortDescription: GetShortDescriptionOutput = this.extractShortDescription(wikitext);

      // Check if not short description available 
      if (!shortDescription) {
        let suggestions = this.suggestSimilarNames(wikitext, normalizedName);
        throw new HttpException(`No exact short description was found for the person on English Wikipedia but there might be are similar names : ${suggestions}`,
          HttpStatus.BAD_REQUEST);
      }

      //If short description is present return <IDEAL>
      return {description:shortDescription};


    } catch (error) {
      // If an error occurs, log the error and throw an HttpException
      this.logger.error(error);
      throw error
    }
  }


/**
 * Send an HTTP GET request to the Wikipedia API and extract the HTML content of the page.
 * 
 * @param baseUrl - The base URL of the Wikipedia API.
 * @param queryParams - An object containing the query parameters for the Wikipedia API request.
 * @returns The HTML content of the requested Wikipedia page.
 * @throws {HttpException} If an error occurs during the HTTP request.
 */
 async  getWikipediaHtmlContent(baseUrl: string, queryParams: {}): Promise<any> {
  try {
    // Send an HTTP GET request to the Wikipedia API and extract the HTML content of the page
    const htmlContent = await lastValueFrom(
      this.httpService.get(baseUrl, { params: queryParams }).pipe(
        map((response) => response.data)
      )
    ).catch((error) => {
      // If an error occurs during the HTTP request, log the error and throw an HttpException
      this.logger.error(error);
      throw new HttpException("Service not available. Kindly try again another time", HttpStatus.GATEWAY_TIMEOUT);
    });
    
    // Return the extracted HTML content
    return htmlContent;

  } catch (error) {
    // If an error occurs, log the error and re-throw it to the calling function
    throw error;
  }
}


  /**
   * Transforms a string by replacing spaces or underscores with underscores and capitalizing the first letter of each word
   * @param {string} str - The input string to transform
   * @returns {string} The transformed string
   */
  transformString(str: string): string {
    // Replace underscores with spaces and camelCase with spaces
    const words = str.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

    // Capitalize the first letter of each word and join with underscores
    const transformed = words.map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('_');
    return transformed;
  }

  /**
   * Extracts the short description from a string of wikitext using a regular expression pattern.
   * @param wikitext A string of wikitext to search for the short description in.
   * @returns The short description, or an empty string if no short description was found.
   */
  extractShortDescription(wikitext: string): any {
    // Define a regular expression pattern to match the short description field
    const shortDescPattern = /{{Short description\|(.+?)}}/;

    // Use the regular expression pattern to extract the short description from the wikitext string
    const match = wikitext.match(shortDescPattern);

    // If no match was found, return a generic message
    if (!match) {
      return "";
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
      return "None";
    }

    // Filter out any names that contain "Category" and are not the input name
    const similarNames = namesMatch
      .map((nameMatch) => nameMatch.replace("[[", "").replace("]]", ""))
      .filter((n) => !n.includes("Category") && n !== name && n.includes(name));

    // If no similar names are found, return an error message with the input name
    if (similarNames.length === 0) {
      return `None`;
    }

    // Return a string with the similar names joined by commas
    return `${similarNames.join(", ")}`;
  }



}
