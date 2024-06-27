// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ToastContainer position="top-right" autoClose={2000} pauseOnHover={false} />
      <Component {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;
