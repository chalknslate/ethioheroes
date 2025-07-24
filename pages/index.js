import Head from 'next/head'
import Header from '@components/Header'
//import Footer from '@components/Footer'
import { neon } from '@netlify/neon';
const sql = neon();
export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Ethio Heroes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to Ethio Heroes!" />
      </main>
    </div>
  )
}
