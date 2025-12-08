import Mainlayout from '@/layout'
import Home from '@/pages/home';
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgetPassword />} />
      </Route> */}
      <Route  element={<Mainlayout />}>
        <Route index element={<Home/>}/>
      </Route>
    </Routes>
  );
}

export default AppRoutes