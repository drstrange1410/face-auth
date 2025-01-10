import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const whiteList = ['/protected'];

function Layout() {
  const location = useLocation();
  const { account } = JSON.parse(localStorage.getItem('faceAuth')) || {};

  if (!account && whiteList.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  if (account && !whiteList.includes(location.pathname)) {
    return <Navigate to="/protected" />;
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <Outlet className="grow" />
      <Footer />
    </div>
  );
}

export default Layout;

// faceAuth structure
// account: {id: "custom", fullName: "Harsh_Tiwari.jpeg", type: "CUSTOM",…}
// account->
// fullName : "Harsh_Tiwari.jpeg"
// id : "custom"
// picture : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA
// type :  "CUSTOM"
// status : true
