import React, {useState, useEffect} from 'react'
import ResponsiveSizeDetector from '../ResponsiveSizeDetector'
import RouteDetector from '../RouteDetector'

export default function BrowserClasses({children, location}){
  const [size, setSize] = useState()
  const [pageName, setPageName] = useState()

  const className = `screen-size-${size} page-name-${pageName}`

  return (
    <div className={className}>
      <ResponsiveSizeDetector setSize={setSize}>
        <RouteDetector setPageName={setPageName} location={location}>
            {!size || !pageName ? null : children}
          </RouteDetector>
        </ResponsiveSizeDetector>
    </div>
  )
}