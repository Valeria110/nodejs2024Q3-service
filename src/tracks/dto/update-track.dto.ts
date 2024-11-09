import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import {
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsString()
  name: string;

  @ValidateIf((obj) => obj.artistId !== null)
  @IsString()
  @IsUUID()
  artistId: string | null;

  @ValidateIf((obj) => obj.albumId !== null)
  @IsString()
  @IsUUID()
  albumId: string | null;

  @IsInt()
  @IsPositive()
  duration: number;
}
