import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class GetShortDescriptionInput {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class GetShortDescriptionOutput {
  @IsNotEmpty()
  @IsJSON()
  description: {};
}


