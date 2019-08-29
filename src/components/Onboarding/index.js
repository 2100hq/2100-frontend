import React from 'react'

export default function Onboarding(){
  return (
    <figure>
        <audio
            id='myAudio'
            controls
            src="audio/script-demo.mp3">
                Your browser does not support the
                <code>audio</code> element.
        </audio>
    </figure>
  )
}