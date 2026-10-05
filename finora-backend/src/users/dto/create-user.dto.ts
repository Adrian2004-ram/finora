import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDTO {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsEmail()
    @MaxLength(255)
    email!:string;

    @MinLength(8)
    @MaxLength(72)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    {
        message:
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    },)
    password!: string;

}