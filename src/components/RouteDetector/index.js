import React from 'react'
import { withRouter, matchPath } from 'react-router'
import { useMediaQuery } from 'react-responsive'

import {routeConfigs} from '../../utils'

function RouteDetector({children, location = {pathname: '/'}, setPageName, setParams}){

 const result = Object.entries(routeConfigs).map(([page, routeConfig])=>{
   const match = matchPath(location.pathname, routeConfig)
   if (!match) return [null]
   return [page, match.params]
   }).find( ([page]) => page)

 if (result){
   const [page, params] = result
   page && setPageName && setPageName(page)
   params && setParams && setParams(params)
 } else {
   setParams(null)
   setPageName('unknown')
 }

 return children
}

export default withRouter(RouteDetector)