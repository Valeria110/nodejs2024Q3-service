import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((obj) => obj.artistId !== null)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  artistId: string | null;

  @ValidateIf((obj) => obj.albumId !== null)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  albumId: string | null;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration: number;
}
