/*
  Warnings:

  - You are about to drop the `_AlbumToFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtistToFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoritesToTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlbumToFavorites" DROP CONSTRAINT "_AlbumToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumToFavorites" DROP CONSTRAINT "_AlbumToFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToFavorites" DROP CONSTRAINT "_ArtistToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToFavorites" DROP CONSTRAINT "_ArtistToFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToTrack" DROP CONSTRAINT "_FavoritesToTrack_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToTrack" DROP CONSTRAINT "_FavoritesToTrack_B_fkey";

-- DropTable
DROP TABLE "_AlbumToFavorites";

-- DropTable
DROP TABLE "_ArtistToFavorites";

-- DropTable
DROP TABLE "_FavoritesToTrack";

-- CreateTable
CREATE TABLE "_FavTrackToFavorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FavAlbumToFavorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FavArtistToFavorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavTrackToFavorites_AB_unique" ON "_FavTrackToFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_FavTrackToFavorites_B_index" ON "_FavTrackToFavorites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavAlbumToFavorites_AB_unique" ON "_FavAlbumToFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_FavAlbumToFavorites_B_index" ON "_FavAlbumToFavorites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavArtistToFavorites_AB_unique" ON "_FavArtistToFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_FavArtistToFavorites_B_index" ON "_FavArtistToFavorites"("B");

-- AddForeignKey
ALTER TABLE "_FavTrackToFavorites" ADD CONSTRAINT "_FavTrackToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "FavTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavTrackToFavorites" ADD CONSTRAINT "_FavTrackToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Favorites"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavAlbumToFavorites" ADD CONSTRAINT "_FavAlbumToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "FavAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavAlbumToFavorites" ADD CONSTRAINT "_FavAlbumToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Favorites"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavArtistToFavorites" ADD CONSTRAINT "_FavArtistToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "FavArtist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavArtistToFavorites" ADD CONSTRAINT "_FavArtistToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Favorites"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
