function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {`
          html,
          body,
          #__next {
            height: 100%;
            padding: 0;
            margin: 0;
            color: #303952;
            font-family: -apple-system, IBM Plex Sans, BlinkMacSystemFont,
              Segoe UI, Roboto, Helvetica, Arial, sans-serif;
            font-weight: 400;
          }
        `}
      </style>
    </>
  );
}

export default MyApp;
