export type CreateSampleDTO = {
  name: string;
  description: string | null;
  image: {
    base64: string;
    extension: string;
    fileName: string;
    mimeType: string;
  };
};
