import { Test } from '@nestjs/testing';
import { HttpModule ,HttpService} from '@nestjs/axios';
import { lastValueFrom, of } from 'rxjs';
import { GetShortDescriptionInput } from '../dto/schema';
import { AppService } from '../app.service';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RedisClient } from '../persistent/redis';

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppService,RedisClient, Logger],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });


  
  describe("suggestSimilarNames", () => {
    it("returns an error message if no matches are found", () => {
      const content = "This is some random text with no double bracket names.";
      const name = "John";
      expect(appService.suggestSimilarNames(content, name)).toBe("None");
    });

    it("filters out Category names and names that don't include the input name", () => {
      const content = "This is some [[Category:Actors]] text with [[Tom Holland]] and [[Tom Cruise]] names.";
      const name = "Tom";
      expect(appService.suggestSimilarNames(content, name)).toBe("Tom Holland, Tom Cruise");
    });

    it("returns an error message if no similar names are found", () => {
      const content = "This is some [[Tom Hanks]] text with only one similar name.";
      const name = "Tommy";
      expect(appService.suggestSimilarNames(content, name)).toBe('None');
    });
  });

  describe('extractShortDescription', () => {
    it('should extract the short description from a wikitext string', () => {
      const input = '{{Short description|English actor}}';
      const expected = 'English actor';
      const result = appService.extractShortDescription(input);
      expect(result).toEqual(expected);
    });

    it('should return an empty string if no short description is found in the wikitext string', () => {
      const input = 'Tom Holland is an English actor and dancer.';
      const expected = '';
      const result = appService.extractShortDescription(input);
      expect(result).toEqual(expected);
    });
  });

  describe('transformString', () => {
    it('transforms "Nicki Minaj" to "Nicki_Minaj"', () => {
      expect(appService.transformString('Nicki Minaj')).toBe('Nicki_Minaj');
    });

    it('transforms "Nicki_Minaj" to "Nicki_Minaj"', () => {
      expect(appService.transformString('Nicki_Minaj')).toBe('Nicki_Minaj');
    });

    it('transforms "nicki minaj" to "Nicki_Minaj"', () => {
      expect(appService.transformString('nicki minaj')).toBe('Nicki_Minaj');
    });

    it('transforms "nicki_minaj" to "Nicki_Minaj"', () => {
      expect(appService.transformString('nicki_minaj')).toBe('Nicki_Minaj');
    });

    it('transforms "nicki" to "Nicki"', () => {
      expect(appService.transformString('nicki')).toBe('Nicki');
    });

    it('transforms "nickiMinaj" to "Nicki_Minaj"', () => {
      expect(appService.transformString('nickiMinaj')).toBe('Nicki_Minaj');
    });

    it('transforms "NickiMinaj" to "Nicki_Minaj"', () => {
      expect(appService.transformString('NickiMinaj')).toBe('Nicki_Minaj');
    });
  });

  
});