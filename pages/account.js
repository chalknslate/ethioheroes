import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Account() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const cookies = document.cookie
      .split(';')
      .reduce((acc, cookie) => {
        const [key, ...value] = cookie.trim().split('=')

        if (key) {
          acc[key] = decodeURIComponent(value.join('='))
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

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="account-page">
        <div className="hero"></div>
        <div className="button-container">

          <button
            className="button"
            onClick={() => router.push('/')}
          >
            Home
          </button>

          <button
            className="button"
            onClick={() => router.push('/account')}
          >
            Account Creation
          </button>

          <button
            className="button"
            onClick={() => router.push('/houses')}
          >
            Lordly Houses
          </button>

          <button
            className="button"
            onClick={() => router.push('/map')}
          >
            Map
          </button>

        </div>
        <div className="account-content">
          <div className="container login-window">

            <h2>Login</h2>

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

                  alert(data.message || data.error)

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

              <input
                type="text"
                id="login-username"
                name="username"
                required
              />

              <label htmlFor="login-password">
                Password:
              </label>

              <input
                type="password"
                id="login-password"
                name="password"
                required
              />

              <div className="form-button">
                <button type="submit">
                  Login
                </button>
              </div>

            </form>

            {username && (
              <div className="logged-in">

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
          <div className="container create-window">

            <h2>Create Character</h2>

            <p>
              Create a character below.
            </p>

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

              <input
                type="text"
                id="create-username"
                name="username"
                required
              />

              <label htmlFor="create-password">
                Password:
              </label>

              <input
                type="password"
                id="create-password"
                name="password"
                required
              />

              <div className="form-button">
                <button type="submit">
                  Create Character
                </button>
              </div>

            </form>

          </div>

        </div>

      </main>
    </>
  )
}