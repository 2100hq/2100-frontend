import React from 'react';
import ReactAudioPlayer from 'react-audio-player';



export default function Onboarding(){
  let counter = 0
  function myAlert(){
    counter += 1
    // alert(counter)
  }
  return (
  <ReactAudioPlayer
    src="audio/script-demo.mp3"
    autoplay='true'
    listenInterval={1000}
    onListen={myAlert}
  />
  )
}