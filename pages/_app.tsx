import '../styles/globals.css'
import type { AppProps } from 'next/app'
import axios from "axios";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE;