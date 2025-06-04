import { useSuspenseQuery } from '@tanstack/react-query';
import sampleApi from '@/features/samples/sample.api';

export const useSampleQuery = () => {
  return useSuspenseQuery({
    queryKey: ['samples'],
    queryFn: async () => {
      const result = await sampleApi.getPaginatedSamples({
        params: {
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
      });

      if (result.isFailure) {
        throw result.error;
      }

      return result.value.data!;
    },
  });
};
