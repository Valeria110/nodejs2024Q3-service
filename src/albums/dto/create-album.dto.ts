import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  year: number;

  @ValidateIf((obj) => obj.artistId !== null)
  @IsNotEmpty()
  @IsUUID()
  artistId: string | null;
}
