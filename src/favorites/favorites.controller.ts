import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Get('track/:id')
  async findOneTrack(@Param('id') id: string) {
    return await this.favoritesService.findOneTrack(id);
  }

  @Post('track/:id')
  async createFavTrack(@Param('id') id: string) {
    return await this.favoritesService.createFavTrack(id);
  }

  @HttpCode(204)
  @Delete('track/:id')
  async removeFavTrack(@Param('id') id: string) {
    return await this.favoritesService.removeFavTrack(id);
  }

  @Get('album/:id')
  async findOneAlbum(@Param('id') id: string) {
    return await this.favoritesService.findOneAlbum(id);
  }

  @Post('album/:id')
  async createFavAlbum(@Param('id') id: string) {
    return await this.favoritesService.createFavAlbum(id);
  }

  @HttpCode(204)
  @Delete('album/:id')
  async removeFavAlbum(@Param('id') id: string) {
    return await this.favoritesService.removeFavAlbum(id);
  }

  @Get('artist/:id')
  async findOneArtist(@Param('id') id: string) {
    return await this.favoritesService.findOneArtist(id);
  }

  @Post('artist/:id')
  async createFavArtist(@Param('id') id: string) {
    return await this.favoritesService.createFavArtist(id);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  async removeFavArtist(@Param('id') id: string) {
    return await this.favoritesService.removeFavArtist(id);
  }
}
