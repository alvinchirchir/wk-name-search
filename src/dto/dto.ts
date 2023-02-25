import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class QueryParamsDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}