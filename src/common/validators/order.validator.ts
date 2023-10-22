import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class OrderValidator{
  @IsString()
  @IsNotEmpty()
  by: string;

  @IsIn(["ASC", "DESC"])
  @IsString()
  @IsNotEmpty()
  type: "ASC" | "DESC";
}