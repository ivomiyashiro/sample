import { useSampleQuery } from '../hooks/queries/use-sample.query';

const SamplePage = () => {
  const { data, isLoading } = useSampleQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Samples</h1>
      <ul>
        {data.items.map((sample) => (
          <li key={sample.sampleId}>{sample.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SamplePage;
