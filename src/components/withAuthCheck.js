import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { toast } from 'react-toastify';

const withAuthCheck = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const user = auth.currentUser;
        if (!user) {
          toast.error('You must be logged in first');
          navigate('/aday-kayit');
        }
        setCheckedAuth(true);
      };
      
      if (!checkedAuth) {
        checkAuth();
      }
    }, [checkedAuth, navigate]);

    return checkedAuth ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuthCheck;
