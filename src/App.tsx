import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp.tsx';
import SignIn from './components/SignIn.tsx';
import Home from './components/Home.tsx';
import Gift from './components/Gift.tsx';
import Layout from './components/Layout.tsx';
import Settings from './components/Settings.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/gift" element={<Gift />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
