import Head from 'next/head'
import Header from '@components/Header'
import Subheader from '@components/Subheader'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Account() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const cookies = document.cookie
      .split(';')
      .reduce((acc, cookie) => {
        const [key, ...value] =
          cookie.trim().split('=')

        if (key) {
          acc[key] =
            decodeURIComponent(value.join('='))
        }

        return acc
      }, {})

    if (cookies.session) {
      setUsername(cookies.session)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Fyrhell - Account</title>
      </Head>


      <main className="account-page">

        {/* Login */}
        <div className="container login-window">
          <Header title="Login" />

          <form
            onSubmit={async (e) => {
              e.preventDefault()

              const username =
                e.target.username.value

              const password =
                e.target.password.value

              try {
                const res = await fetch(
                  `/.netlify/functions/search-user?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                  {
                    method: 'GET'
                  }
                )

                const data = await res.json()

                if (res.status === 200) {
                  document.cookie =
                    `session=${encodeURIComponent(username)}; path=/`

                  setUsername(username)
                }

                alert(
                  data.message || data.error
                )
              } catch (err) {
                console.error(err)

                alert(
                  'Unable to connect to the server.'
                )
              }
            }}
          >
            <label htmlFor="login-username">
              Character Name:
            </label>

            <br />

            <input
              type="text"
              id="login-username"
              name="username"
              required
            />

            <br />

            <label htmlFor="login-password">
              Password:
            </label>

            <br />

            <input
              type="password"
              id="login-password"
              name="password"
              required
            />

            <br />

            <div className="button">
              <button type="submit">
                Login
              </button>
            </div>
          </form>

          {username && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.5rem',
                border: '1px solid gray'
              }}
            >
              <strong>
                Logged in as:
              </strong>{' '}
              {username}

              <br />

              <button
                onClick={() => {
                  document.cookie =
                    'session=; Max-Age=0; path=/'

                  setUsername('')
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Create Character */}
        <div className="container create-window">
          <Header title="Welcome to Fyrhell!" />

          <Subheader
            title="Create a character below."
          />

          <form
            onSubmit={async (e) => {
              e.preventDefault()

              const username =
                e.target.username.value

              const password =
                e.target.password.value

              try {
                const res = await fetch(
                  '/.netlify/functions/create-user',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type':
                        'application/json'
                    },
                    body: JSON.stringify({
                      username,
                      password
                    })
                  }
                )

                const data = await res.json()

                alert(
                  data.message || data.error
                )

                if (res.status === 201) {
                  e.target.reset()
                }
              } catch (err) {
                console.error(err)

                alert(
                  'Unable to connect to the server.'
                )
              }
            }}
          >
            <label htmlFor="create-username">
              Character Name:
            </label>

            <br />

            <input
              type="text"
              id="create-username"
              name="username"
              required
            />

            <br />

            <label htmlFor="create-password">
              Password:
            </label>

            <br />

            <input
              type="password"
              id="create-password"
              name="password"
              required
            />

            <br />

            <div className="button">
              <button type="submit">
                Create Character
              </button>
            </div>
          </form>
        </div>
        <div className="stone-pillar left"></div>
        <div className="stone-pillar right"></div>   
        <div class="fire"></div> 
        <button
          className="home-button"
          onClick={() => router.push('/')}
        >
          <h3>Home</h3>
        </button>
      </main>
    </>
  )
}