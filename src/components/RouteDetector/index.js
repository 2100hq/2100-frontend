import React from 'react'
import { withRouter, matchPath } from 'react-router'
import { useMediaQuery } from 'react-responsive'

const routeConfigs = {
  'profile': {
    exact: true,
    path: '/:username([$]{1,1}[a-zA-Z0-9_]+)'
  },
  'message': {
    exact: true,
    path: '/:username([$]{1,1}[a-zA-Z0-9_]+)/:messageid'
  },
  'wallet': {
    exact: true,
    path: '/wallet'
  },
  'manage': {
    exact: true,
    path: '/manage'
  },
  'main': {
    exact: true,
    path: '/'
  }
}

function RouteDetector({children, location = {pathname: '/'}, setPageName, setParams}){

 const [page, params] = Object.entries(routeConfigs).map(([page, routeConfig])=>{
   const match = matchPath(location.pathname, routeConfig)
   if (!match) return [null]
   return [page, match.params]
   }).find( ([page, params]) => page)

 page && setPageName && setPageName(page)
 params && setParams && setParams(params)
 return children
}

export default withRouter(RouteDetector)