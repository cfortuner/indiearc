import React, { useEffect, useRef, useState } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { css } from "@emotion/react"
import parse from "html-react-parser"
import sanitizeHTML from 'sanitize-html'
import ColorThief from 'colorthief'
import { rgbToHex } from "../utils/rgb-to-hex"


const CardItem = ({data, onPalette}) => {
  const imgRef = useRef(null)

  const handleLoaded = () => {
    if (imgRef && imgRef.current) {
      try {
      const colorThief = new ColorThief();

      const color = colorThief.getColor(imgRef.current)
      const palette = colorThief.getPalette(imgRef.current)

      const bgColors = palette.filter((p) => JSON.stringify(p) !== JSON.stringify(color))
      const bgColor = bgColors[Math.floor(Math.random()*bgColors.length-1)]

      // document.body.style.background = rgbToHex(...bgColor)
      onPalette(bgColors)
      } catch(e) {
      }
    }
  }

  useEffect(() => {
    if (imgRef && imgRef.current) {
      handleLoaded()
    }
  }, [imgRef])


  return (<li css={css`list-style-type:none`}>
    <h1>{data.YoutubeChannelTitle}</h1>
    <img
      css={css`
      `}
      src={data.YoutubeChannelThumbnailUrl_Lg}
      alt="channel-thumbnail"
      onChange={(e) => {
        console.log('onchange')
      }}
      crossOrigin = "Anonymous"
      ref={imgRef}
      onLoad={() => handleLoaded()}
    />
    <div css={
      css`
        color: grey;
        font-style: italic;
        display: inline-block;
        float: right;
    `}>
      <span css={css`padding-right:10px;`}>Subscribers: {data.YoutubeChannelSubscriberCount}</span>
      <span>Views: {data.YoutubeChannelViewCount}</span>
    </div>
    {data.YoutubeChannelAboutText && <h3>About</h3>}
    <pre css={css`white-space: pre-wrap;`}>
      {parse(sanitizeHTML(createTextLinks_(data.YoutubeChannelAboutText)))}
    </pre>
    <h3>Latest Devlog</h3>
    <p css={css`
      word-wrap: break-word;
      margin-bottom:4px;
    `}><a href={data.YoutubeLatestVideoUrl}>{data.YoutubeLatestVideoTitle}</a></p>
    <img src={data.YoutubeLatestVideoThumbnailURL_Med} alt="video-thumbnail"/>
    <pre css={css`white-space: pre-wrap;`}>
      {parse(sanitizeHTML(createTextLinks_(data.YoutubeLatestVideoDescriptionText)))}
    </pre>
  </li>)
}

function createTextLinks_(text) {
  return (text || "").replace(
    /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
    function(match, space, url){
      var hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
        hyperlink = 'http://' + hyperlink;
      }
      return ` <a href=${hyperlink}>${url}</a>`
    }
  );
};

export default function Discover({ data }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [boxShadow, setBoxShadow] = useState('0px 4px 8px 0px rgba(0,0,0,0.6)')

  let cards = []

  const handleNext = () => {
    console.log(currentCardIndex)
    setCurrentCardIndex((prev) => {
      if (prev === data.allAirtable.edges.length) return 0
      return prev+1
    })

  }

  const onPalette = (i, palette) => {
    let boxShadow = ""
    let pxOffset = 5
    let length = 8
    for (let i =0; i< 8;i++) {
      let color = palette[i%palette.length]
      let opacity = `0.${length-(i%palette.length)}`
      let separator = i === length-1 ? ';':','
      boxShadow += `rgba(${color[0]},${color[1]},${color[2]}, ${opacity}) ${pxOffset}px ${pxOffset}px${separator}`
      pxOffset+=5
    }
    // box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px;
    setBoxShadow(boxShadow)
  }

  cards = data.allAirtable.edges.map((edge, i) => <CardItem data={edge.node.data} onPalette={(palette) => onPalette(i, palette)} key={i}/>)

  return (
    <Layout>
      <div css={css`
        background: white;
        padding: 1rem;
        // border-radius: 20px;
        box-shadow: ${boxShadow}
      `}>
        <ul css={css`margin:0;`}>
          {cards[currentCardIndex]}
        </ul>
        <button onClick={() => handleNext()}>Next</button>
      </div>
    </Layout>
  )
}
export const query = graphql`
  query {
      allAirtable {
        edges {
          node {
            id
            data {
              YoutubeChannelTitle
              YoutubeChannelThumbnailUrl_Med
              YoutubeChannelThumbnailUrl_Lg
              YoutubeChannelId
              YoutubeChannelAboutText
              YoutubeLatestVideoUrl
              YoutubeLatestVideoThumbnailURL_Med
              YoutubeLatestVideoThumbnailURL_Lg
              YoutubeLatestVideoDescriptionText
              YoutubeLatestVideoTitle
              YoutubeLatestVideoPublishedAtTime
              YoutubeChannelSnippetPublishedAtTime
              YoutubeChannelSubscriberCount
              YoutubeChannelVideoCount
              YoutubeChannelViewCount
              LastModifiedTime
              YoutubeChannelSnippetUrlPath
            }
          }
        }
      }
  }
`
