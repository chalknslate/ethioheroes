import Head from 'next/head'
import Header from '@components/Header'
import Subheader from '@components/Subheader'
import Draggable from 'react-draggable'
import { useEffect, useState } from 'react'

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      {/* Login Form */}
      <Draggable handle=".login-handle">
        <div className="container" style={{ position: 'absolute', top: 0, left: 0 }}>
          <Head>
            <title>Ethio Heroes</title>
          </Head>
          <main>
            <div className="login-handle" style={{ cursor: 'move' }}>
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
                  { method: 'GET' }
                );

                const data = await res.json();

                if (res.status === 200) {
                  // Save cookies
                  document.cookie = `session=${formData.fname}; path=/`;
                  document.cookie = `pass=${formData.lname}; path=/`;
                  setUsername(formData.fname);
                  setPassword(formData.lname);
                }

                alert(data.message || data.error);
              }}>
                <label htmlFor="fname">Character Name:</label><br />
                <input type="text" id="fname" name="fname" required /><br />

                <label htmlFor="lname">Password:</label><br />
                <input type="password" id="lname" name="lname" required /><br />

                <div className="button">
                  <button type="submit">Login</button>
                </div>
              </form>

              {username && (
                <div style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid gray' }}>
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
            </div>
          </main>
        </div>
      </Draggable>

      {/* Create Character Form */}
      <Draggable handle=".create-handle">
        <div className="container" style={{ position: 'absolute', top: 0, left: 400 }}>
          <main>
            <div className="create-handle" style={{ cursor: 'move' }}>
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
