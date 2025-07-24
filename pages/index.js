
import Head from 'next/head'
import Header from '@components/Header'
// import Footer from '@components/Footer'
//import { neon } from '@netlify/neon';

//const sql = neon();

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Ethio Heroes</title>
      </Head>
      <main>
        <Header title="Welcome to Ethio Heroes!" />
        <form action="/action_page.php">
          <label htmlFor="fname">First name:</label><br />
          <input type="text" id="fname" name="fname" defaultValue="John" /><br />
          
          <label htmlFor="lname">Last name:</label><br />
          <input type="text" id="lname" name="lname" defaultValue="Doe" /><br />
          
          <input type="submit" value="Submit" />
        </form>
      </main>
    </div>
  )
}

