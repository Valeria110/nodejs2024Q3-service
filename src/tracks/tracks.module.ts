import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
  imports: [forwardRef(() => ArtistsModule)],
})
export class TracksModule {}
