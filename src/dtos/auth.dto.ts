import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
	@IsEmail()
	public email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(9)
	@MaxLength(32)
	public password: string;
}

export class LoginDto {
	@IsEmail()
	public email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(9)
	@MaxLength(32)
	public password: string;
}
