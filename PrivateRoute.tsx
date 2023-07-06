import React, {useEffect, useState, useContext} from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import { UserContext } from  './Root'
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function PrivateRoute({ children }: {
    children: React.ReactNode
  }) {
    const {user, setUser} = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    const [is_signed, setSignined] = useState(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user.email);
        setSignined(true)
      } else {
        navigate('/signin', {state: { from: location}})
      }
    });
    return is_signed?<>{children}</>:<>Signin Checking</>
    //return user.email!==''? <>{children}</> : <Navigate to='/signin' state = {{ from: location}} replace={true}/>;
  }
