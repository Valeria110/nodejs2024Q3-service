import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './interfaces/track.interface';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';

@Injectable()
export class TracksService {
  private tracks: Map<string, ITrack> = new Map();

  constructor(private readonly artistsService: ArtistsService) {}

  findAll(): ITrack[] {
    return [...this.tracks.values()];
  }

  findOne(id: string): ITrack {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track with this id does not exist');
    }

    return track;
  }

  create(createTrackDto: CreateTrackDto): ITrack {
    // TODO:
    // check if artist and album with the provided ids exist and throw errors
    // const album = this.albumsService.findOne(createTrackDto.albumId);
    const artist = this.artistsService.findOne(createTrackDto.artistId);
    if (artist) {
      const trackId = uuidv4();
      this.tracks.set(trackId, { ...createTrackDto, id: trackId });
      return this.tracks.get(trackId);
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto): ITrack {
    const track = this.findOne(id);
    if (track) {
      // TODO:
      // check if artist and album with the provided ids exist and throw errors
      const updatedTrackData = { ...track, ...updateTrackDto };
      this.tracks.set(id, updatedTrackData);
      return updatedTrackData;
    }
  }

  remove(id: string) {
    const track = this.tracks.get(id);
    if (track) {
      this.tracks.delete(id);
    }
  }
}
