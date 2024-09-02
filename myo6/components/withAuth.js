import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('Login_secure'); // Redirect to the login page if the token is not found
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default withAuth;