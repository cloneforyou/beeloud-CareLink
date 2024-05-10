import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    let title = "CareLink"; // default title for the home page

    if (router.pathname === "/login") {
      title = "Login | CareLink";
    } else if (router.pathname === "/add-voice") {
      title = "Add Voice | CareLink";
    } else if (router.pathname === "/text-to-speech") {
      title = "Text to Speech | CareLink";
    } else if (router.pathname === "/translator") {
      title = "Translator | CareLink";
    } else if (router.pathname === "/terms") {
      title = "Terms | CareLink";
    } else if (router.pathname === "/privacy") {
      title = "Privacy | CareLink";
    }

    document.title = title;
  }, [router.pathname]);

  return (
    <ChakraProvider>
      <Head>
        <link rel="icon" href="/weblogo.png" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
