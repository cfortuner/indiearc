import React, { useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { rgbToHex } from "../utils/rgb-to-hex"

export default function About({ data }) {
  useEffect(() => {
    document.body.style.background = rgbToHex(255,255,255)
  },[])
  return (
    <Layout>
      <h1>About</h1>
      <p>
        Aggregating indie game developers creating Dev Logs on Youtube!
      </p>
      Stay tuned for more updates. @indiearcade
    </Layout>
  )
}
export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
