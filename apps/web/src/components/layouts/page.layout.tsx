export const PageLayout = ({
  title,
  description,
  children,
}: {
  title?: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <title>{title ? `${title} - Sample` : 'Sample'}</title>
      <meta name="description" content={description} />
      {children}
    </>
  );
};
