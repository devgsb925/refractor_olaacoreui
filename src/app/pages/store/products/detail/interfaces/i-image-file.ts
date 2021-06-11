export interface IImageFile {
  id: number;
  refImageCatId: number;
  file: File;
  preFile: string;
  progress: number;

  linkCoverImageUrl: string;
  oldFile: string;
}
