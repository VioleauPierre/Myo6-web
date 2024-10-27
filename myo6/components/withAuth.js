import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const WithAuth = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // For handling the loading state

    useEffect(() => {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      const id_user = sessionStorage.getItem('id_user');

      if (!token) {
        // Redirect to the login page if the token is not found
        router.replace('/Login_secure');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // If the user's role is not allowed for the page, redirect based on their role
        if (role === 'athlete') {
          router.replace(`/coachPage5?id_user=${id_user}`);
        } else {
          router.replace('/'); // Default fallback for other roles (e.g., intern)
        }
      } else {
        // If the token is valid and the role is allowed, render the page
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // Optionally display a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  // Define the display name for debugging purposes
  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default withAuth;


