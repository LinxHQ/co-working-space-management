// components/main_layout.js

import React from 'react';
import Navbar from './navbar';
import SideMenu from './sidemenu';
import Footer from './footer';

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SideMenu />
        <div className="flex-grow lg:pl-72">
          <main className="max-w-full h-full p-10">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};


export default AppLayout;
