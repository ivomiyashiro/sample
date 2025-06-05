import type { SampleDTO } from '@sample/shared';
import { useForm } from 'react-hook-form';

import { useCreateSampleMutation } from '../hooks/mutations/use-create-sample.mutation';

import { Button, Input, Label } from '@/components/ui';

const CreateSamplePage = () => {
  const { mutate: createSample, isPending } = useCreateSampleMutation();
  const { register, handleSubmit } = useForm<SampleDTO>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const onSubmit = (sample: SampleDTO) => {
    createSample({
      sampleId: '',
      name: sample.name,
      description: sample.description,
      imageUrl: sample.imageUrl ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-sm mx-auto"
    >
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input type="text" placeholder="Name" {...register('name')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Description</Label>
        <Input
          type="text"
          placeholder="Description"
          {...register('description')}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Image URL</Label>
        <Input type="text" placeholder="Image URL" {...register('imageUrl')} />
      </div>
      <Button type="submit" disabled={isPending}>
        Create
      </Button>
    </form>
  );
};

export default CreateSamplePage;
