import { IsDefined, IsEmail, IsOptional, IsString } from "class-validator";

export class ContactDto {
    @IsEmail()
    @IsOptional()
    @IsDefined()
    email: string;

    @IsString()
    @IsOptional()
    @IsDefined()
    phone: string;
}