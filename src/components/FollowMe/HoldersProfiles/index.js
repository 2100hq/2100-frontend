import React from 'react'
import ProfileImage from '../../ProfileImage'
import { useStoreContext } from '../../../contexts/Store'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import {sortBy} from 'lodash'
import './style.scss'

function Face({name, address}){
  if (name) return <ProfileImage token={name}/>
  return <div className='jazzicon'><Jazzicon diameter={25} seed={jsNumberForAddress(address)} /></div>
}

function Faces({addresses=[], count=3}){
  const {query} = useStoreContext()
  // look up names and mix them with address, sort by names
  const data = sortBy(addresses.map( address => {
    const name = query.getUserName(address)
    return {
      name,
      address
    }
  }), data => data.name)

  return data.splice(0, count).map(Face)
}

function NoHolders({prefix,noholderstext,suffix}){
  return (
    <div className='holders-profiles no-holders'>
      {prefix}{noholderstext}{suffix}
    </div>
  )
}

function CountHolders({prefix,count,suffix=' holders'}){
  return (
    <div className='holders-profiles count-holders'>
      {prefix}{count}{suffix}
    </div>
  )
}

export default function HoldersProfiles({holders, prefix, suffix, noholderstext='no one', facesCount=3}) {

  if (holders == null) return <NoHolders prefix={prefix} noholderstext={noholderstext} suffix={suffix} />

  if (typeof holders === 'number') return <CountHolders prefix={prefix} count={holders} suffix={suffix} />

  holders = holders.filter(userid => parseInt(userid) > 0) // filter out zero address
  const holdersCount = holders.length

  if (holdersCount === 0) return <NoHolders prefix={prefix} noholderstext={noholderstext} suffix={suffix} />

  const andMore = holdersCount > facesCount ? `and ${holdersCount-facesCount} more` : null

  return(
      <div className='holders-profiles'>
        {prefix}
        <Faces addresses={holders} count={facesCount} />
        {andMore}
        {suffix}
      </div>
  )
}
