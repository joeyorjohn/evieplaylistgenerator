import "../styles/globals.css";
import { AppWrapper } from "../context/state"; // import based on where you put it

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />;
    </AppWrapper>
  );
}

export default MyApp;
