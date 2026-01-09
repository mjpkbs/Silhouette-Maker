import '@/styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>실루엣 생성기 - AI 뒷모습 이미지 생성</title>
        <meta name="description" content="AI 기반 뒷모습 인물 이미지 생성 도구" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Base64 인라인 favicon - 별도 파일 불필요 */}
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234F46E5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%237C3AED;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad)'/%3E%3Cellipse cx='50' cy='30' rx='12' ry='14' fill='white'/%3E%3Crect x='38' y='42' width='24' height='40' rx='2' fill='white'/%3E%3Crect x='28' y='45' width='10' height='25' rx='2' fill='white'/%3E%3Crect x='62' y='45' width='10' height='25' rx='2' fill='white'/%3E%3C/svg%3E" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
