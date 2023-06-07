import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class PostDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    image: string

    @IsMongoId()
    authorId: string

}

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    image: string


}