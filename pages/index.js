
import Head from 'next/head'
import Header from '@components/Header'
import Subheader from '@components/Subheader'
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
        <div class="wrapper">
          <div class="wave"></div>
        </div>
        <div className="box">
          <Header title="Welcome to Ethio Heroes!" />
          <Subheader title = "Create a persona below."/>
                  <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = {
              fname: e.target.fname.value,
              lname: e.target.lname.value
            };

            const res = await fetch('/.netlify/functions/create-user', {
              method: 'POST',
              body: JSON.stringify(formData)
            });

            const data = await res.json();
            alert(data.message || data.error);
          }}>
            <label htmlFor="fname">Character Name:</label><br />
            <input type="text" id="fname" name="fname" required /><br />

            <label htmlFor="lname">Password:</label><br />
            <input type="password" id="lname" name="lname" required /><br />

            <input type="submit" value="Submit" />
          </form>
        </div>
      </main>
        
    </div>
  )
}

