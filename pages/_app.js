import "../styles/globals.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import toastConfig from "../utils/toastConfig";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ProNotes - Smart & Secure Note-Taking</title>
        <meta
          name="description"
          content="ProNotes is a highly efficient and secure note-taking app designed for professionals. Organize, edit, and manage notes seamlessly with a modern and business-friendly UI."
        />
        <meta name="keywords" content="Note-taking, Productivity, Business Notes, Secure Notes" />
        <meta name="author" content="ProNotes Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:title" content="ProNotes - Smart & Secure Note-Taking" />
        <meta property="og:description" content="Organize your thoughts and manage daily notes like a pro with ProNotes." />
        <meta property="og:image" content="/note-icon.png" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster toastOptions={toastConfig} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
