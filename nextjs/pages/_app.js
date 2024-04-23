// pages/_app.js

import React from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../app/globals.css';
import AppLayout from '../components/main_layout';
import {AuthProvider} from '../contexts/authContext';

const MyApp = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <AppLayout>
          <ToastContainer />
          <Component {...pageProps} />
      </AppLayout>
    </AuthProvider>
  );
};

export default MyApp;
