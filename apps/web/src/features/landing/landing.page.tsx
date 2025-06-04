import { Link, useNavigate } from 'react-router';

import { PageLayout } from '@/components/layouts';
import { Button } from '@/components/ui';

import { signOutApi } from '@/features/auth/api';
import { useTheme } from '@/features/theme/hooks';
import { useAuth } from '@/features/auth/hooks';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOutApi.handler();

    if (result.isSuccess) {
      navigate(0);
    }
  };

  return (
    <PageLayout description="ReactJS + NestJS FullStack Template">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h1>Email: {auth?.email}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          <Link to="/signin">Sign In</Link>
          <Link to="/samples">Samples</Link>
          <Button onClick={handleSignOut}>Logout</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default LandingPage;
