import "../styles/globals.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import toastConfig from "../utils/toastConfig";
import ErrorBoundary from "../components/ErrorBoundary";
import Loader from "../components/Loader";
import { AnimatePresence, motion } from "framer-motion";


function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <Head>
        <title>Note Master - Smart & Secure Note-Taking</title>
        <meta
          name="description"
          content="Note Master is a highly efficient and secure note-taking app designed for professionals. Organize, edit, and manage notes seamlessly with a modern and business-friendly UI."
        />
        <meta name="keywords" content="Note-taking, Productivity, Business Notes, Secure Notes" />
        <meta name="author" content="Note Master Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Note Master - Smart & Secure Note-Taking" />
        <meta property="og:description" content="Organize your thoughts and manage daily notes like a pro with Note Master." />
        <meta property="og:image" content="/note-icon.png" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster toastOptions={toastConfig} />
    
       
          {loading && <Loader />}
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
       
    </ErrorBoundary>
  );
}

export default MyApp;
