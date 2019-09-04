import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { compact } from 'lodash'
/* Bootstrap responsives sizes */
// Extra small devices (portrait phones, less than 576px)
// @media (max-width: 575.98px) { ... }

// Small devices (landscape phones, 576px and up)
// @media (min-width: 576px) and (max-width: 767.98px) { ... }

// Medium devices (tablets, 768px and up)
// @media (min-width: 768px) and (max-width: 991.98px) { ... }

// Large devices (desktops, 992px and up)
// @media (min-width: 992px) and (max-width: 1199.98px) { ... }

// Extra large devices (large desktops, 1200px and up)
// @media (min-width: 1200px) { ... }

const mq = {
  xs: "(max-width: 575.98px)",
  s: "(min-width: 576px) and (max-width: 767.98px)",
  md: "(min-width: 768px) and (max-width: 991.98px)",
  lg: "(min-width: 992px) and (max-width: 1199.98px)",
  xl: "(min-width: 1200px)"
}

export default function ResponsiveSizeDetector({children, setSize = (x)=>{console.log(x)}}){
 const xs = useMediaQuery({ query:mq.xs }) && 'xs'
 const s = useMediaQuery({ query:mq.s }) && 's'
 const md = useMediaQuery({ query:mq.md }) && 'md'
 const lg = useMediaQuery({ query:mq.lg }) && 'lg'
 const xl = useMediaQuery({ query:mq.xl }) && 'xl'

 const size = compact([xs,s,md,lg,xl])[0]
 if (size) setSize(size)

 return children
}