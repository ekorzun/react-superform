import * as React from 'react'
// import Head from 'next/head'
import dynamic from 'next/dynamic'
// const App = dynamic(() => import("../../demo"), {ssr: false});
import App from '../../demo'

const IndexPage = () => (
  <App />
)

export default IndexPage