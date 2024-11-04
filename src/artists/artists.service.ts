import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { TracksService } from 'src/tracks/tracks.service';
import { ITrack } from 'src/tracks/interfaces/track.interface';

@Injectable()
export class ArtistsService {
  private artists: Map<string, IArtist> = new Map();

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  findAll(): IArtist[] {
    return [...this.artists.values()];
  }

  findOne(id: string): IArtist {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist with this id does not exist');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): IArtist {
    const artistData = { id: uuidv4(), ...createArtistDto };
    this.artists.set(artistData.id, artistData);
    return artistData;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists.get(id);
    if (artist) {
      const updatedArtistData = { ...artist, ...updateArtistDto };
      this.artists.set(id, updatedArtistData);
      return updatedArtistData;
    }
  }

  remove(id: string) {
    const artist = this.artists.get(id);
    if (artist) {
      this.artists.delete(id);
      this.tracksService.findAll().forEach((track) => {
        if (track.artistId === id) {
          const updatedTrackData: ITrack = { ...track, artistId: null };
          this.tracksService.update(track.id, updatedTrackData);
          return;
        }
      });
    }
  }
}
