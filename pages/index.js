import Head from 'next/head'
import Header from '@components/Header'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [news, setNews] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/news.md')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load news: ${res.status}`)
        }

        return res.text()
      })
      .then((text) => {
        setNews(text)
      })
      .catch((err) => {
        console.error('Unable to load news:', err)
        setNews('Unable to load news.')
      })
  }, [])

  return (
    <>
      <Head>
        <title>Fyrhell</title>
      </Head>

      <button
        className="account-button"
        onClick={() => router.push('/account')}
      >
        <h2>Account</h2>
      </button>

      <main className="home">
        <div className="container news-window">
          <Header title="Fyrhell News" />

          <div className="news">
            {news ? (
              <ReactMarkdown>
                {news}
              </ReactMarkdown>
            ) : (
              <p>Loading news...</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}