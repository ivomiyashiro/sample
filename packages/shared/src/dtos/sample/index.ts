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

export type UpdateSampleDTO = {
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export type SampleDTO = {
  sampleId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
