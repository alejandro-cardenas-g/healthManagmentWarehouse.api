import { IsNotEmpty, IsString } from "class-validator";

export abstract class FiltersValidator{
  @IsNotEmpty()
  @IsString()
  key: string;

  value: unknown;
}