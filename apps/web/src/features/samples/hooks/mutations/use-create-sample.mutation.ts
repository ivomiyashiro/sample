import type { ErrorResponse, SampleDTO } from '@sample/shared';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import sampleApi from '@/features/samples/sample.api';

export const useCreateSampleMutation = () => {
  return useMutation({
    mutationFn: async (sample: SampleDTO) => {
      const result = await sampleApi.createSample(sample);

      if (result.isFailure) {
        throw result.error;
      }

      return result.value.data!;
    },
    onSuccess: () => {
      toast.success('Sample created successfully');
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.error.message);
    },
  });
};
