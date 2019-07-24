import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'
import './style.scss'

function Favorite ({ user, asset, actions: { toggleFav } }) {
  if (user.favorites.includes(asset.asset)) {
    return (
      <div className='favorite'>
        <FontAwesomeIcon
          icon={faStar}
          onClick={() => toggleFav(asset.username)}
        />
      </div>
    )
  } else {
    return (
      <div className='favorite'>
        <FontAwesomeIcon
          icon={faStarReg}
          onClick={() => toggleFav(asset.username)}
        />
      </div>
    )
  }
}

export default Favorite
