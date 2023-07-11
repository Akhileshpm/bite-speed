import { IsDefined, IsEmail, IsOptional, IsString } from "class-validator";

export class ContactDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phoneNumber: string;
}