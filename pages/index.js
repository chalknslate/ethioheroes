import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Fyrhell - Homepage</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main>
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
      </main>
    </>
  )
}
