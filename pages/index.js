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
      </Head>
      <main>
        <Header title="Welcome to Ethio Heroes!" />
        <form action="/action_page.php">
          <label for="fname">First name:</label>
          <input type="text" id="fname" name="fname" value="John"></input>
          <label for="lname">Last name:</label>
          <input type="text" id="lname" name="lname" value="Doe"></input>
          <input type="submit" value="Submit"></input>
        </form>
      </main>
    </div>
    
  )
}
