import Head from 'next/head'
import Header from '@components/Header'
import Subheader from '@components/Subheader'
import Draggable from 'react-draggable'  // ✅ Add this import
import { useEffect, useState } from 'react'
export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Parse cookies on load
  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, val] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(val);
      return acc;
    }, {});
    
    if (cookies.session) setUsername(cookies.session);
    if (cookies.pass) setPassword(cookies.pass);
  }, []);
  return (
    <div>
      <Draggable handle=".drag-handle">
        <div className="container" style={{ position: 'absolute' }}>
          <Head>
            <title>Ethio Heroes</title>
          </Head>
          <main>
            <div className="drag-handle"> 
              <Header title="Already got a character?" />
              <Subheader title="Login to your persona." />
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = {
                  fname: e.target.fname.value,
                  lname: e.target.lname.value
                };

                const res = await fetch(
                  `/.netlify/functions/search-user?fname=${encodeURIComponent(formData.fname)}&lname=${encodeURIComponent(formData.lname)}`,
                  {
                    method: 'GET',
                  }
                );

                const data = await res.json();
                alert(data.message || data.error);
              }}>
                <label htmlFor="fname">Character Name:</label><br />
                <input type="text" id="fname" name="fname" required /><br />

                <label htmlFor="lname">Password:</label><br />
                <input type="password" id="lname" name="lname" required /><br />
                <div className="button">
                  <button type="submit">Login</button>
                </div>
                <br />
                {username && (
                  <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid gray' }}>
                    <strong>Logged in as:</strong> {username} <br />
                    <button onClick={() => {
                      document.cookie = 'session=; Max-Age=0; path=/';
                      document.cookie = 'pass=; Max-Age=0; path=/';
                      setUsername('');
                      setPassword('');
                    }}>
                      Logout
                    </button>
                  </div>
                )}
                
              </form>
            </div>
          </main>
        </div>
      </Draggable>
      <Draggable handle=".drag-handle">
        <div className="container" style={{ position: 'absolute' }}>
          <main>
            <div className="drag-handle"> 
              <Header title="Welcome to Ethio Heroes!" />
              <Subheader title="Create a persona below." />
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
                <div className="button">
                  <button type="submit">Create Character</button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </Draggable>
    </div>
    
  )
}
