import React, { createContext,useEffect, useState} from 'react';
import './App.css';
import { Router,Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import Signin from './Signin';
import Signup from './Signup';
import App from './App';

type UserContextState = { name: string;
                          email: string;
                          role: string;
                          manager_email: string;
                          access_token: string; }

const UserContextDefaultValue = {
  user: { name:'', email: '', role: 'none', manager_email:'', access_token:''},
  setUser: (state: UserContextState) => {} // noop default callback
};

export const UserContext = createContext(UserContextDefaultValue);

function Root() {
  const [user, setUser] = useState<UserContextState>(UserContextDefaultValue.user);
  return (
      <UserContext.Provider value = {{user, setUser}}>
        <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><App /></PrivateRoute>} />
        </Routes>
      </UserContext.Provider>
      );
};
export default Root;