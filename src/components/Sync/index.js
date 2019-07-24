import React, { Component } from 'react'

class Sync extends Component {
  constructor () {
    super()

    this.state = {
      card: 'add'
    }
  }

  goToCard = card => {
    this.setState({ card })
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-body'>
                <ul className='nav nav-tabs'>
                  <li className='nav-item'>
                    <span
                      className='nav-link active'
                      onClick={() => this.goToCard('add')}
                    >
                      Add Asset
                    </span>
                  </li>
                  <li className='nav-item'>
                    <span
                      className='nav-link'
                      onClick={() => this.goToCard('dispute')}
                    >
                      Dispute Asset
                    </span>
                  </li>
                  <li className='nav-item'>
                    <span
                      className='nav-link'
                      onClick={() => this.goToCard('claim')}
                    >
                      Claim Owners Reward
                    </span>
                  </li>
                  <li className='nav-item'>
                    <span
                      className='nav-link'
                      onClick={() => this.goToCard('opt-out')}
                    >
                      Opt Out
                    </span>
                  </li>
                </ul>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-6'>
                    <DisplayCard {...this.state} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function DisplayCard ({ card }) {
  switch (card) {
    case 'add':
      return <AddAsset />
    case 'dispute':
      return <DisputeAsset />
    case 'claim':
      return <ClaimAsset />
    case 'opt-out':
      return <OptOut />
    default:
      return <AddAsset />
  }
}

function AddAsset () {
  return (
    <div className='AddAsset'>
      <h5>Add an asset to the 2100 protocol</h5>
      <hr />
      <p>If an asset does not exist in 2100, you can add it yourself.</p>
      <ol>
        <li>Fill out the form below</li>
        <li>Copy and Tweet the text it generates</li>
        <li>
          After the Tweet is confirmed by our Oracle, we will @notify you.
        </li>
        <li>
          The asset will be available in the <span>Discover</span> tab
        </li>
      </ol>

      <form>
        <div className='form-group'>
          <label for='exampleInputEmail1'>Your Handle</label>
          <input
            type='email'
            className='form-control'
            id='exampleInputEmail1'
            aria-describedby='emailHelp'
            placeholder='@yourhandle'
          />
          <small id='emailHelp' className='form-text text-muted'>
            We will Tweet you when the asset has been added.
          </small>
        </div>
        <div className='form-group'>
          <label for='exampleInputPassword1'>Account to add to 2100</label>
          <input
            type='password'
            className='form-control'
            id='exampleInputPassword1'
            placeholder='@accountToAdd'
          />
        </div>
      </form>
      <h5>
        I, <span>@yourhandle</span>, would like to add{' '}
        <span>@accountToAdd</span> to the @2100hq alpha!
      </h5>
      <button className='btn btn-small btn-primary'>Copy</button>
    </div>
  )
}

function DisputeAsset () {
  return (
    <div className='DisputeAsset'>
      <h5>Dispute the validity of a 2100 asset</h5>
      <hr />
      <p>
        If a Twitter account undergoes a name-change or deletion, the
        corresponding 2100 asset must also be renamed or deleted.
      </p>
      <form>
        <div className='form-group'>
          <label for='exampleInputEmail1'>Asset Name</label>
          <input type='email' className='form-control' value='$twitter:' />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  )
}

function ClaimAsset () {
  return (
    <div className='ClaimAsset'>
      <h5>Claiming your 2100 owners reward</h5>
      <hr />
      <p>
        In 2100, each account owner is entitled to 10% of their account's
        supply. To claim the reward, they must prove ownership of the account by
        Tweeting <span>exactly</span> the following :
      </p>
      <div className='form-group'>
        <label for='exampleFormControlTextarea1' />
        <textarea
          className='form-control'
          id='exampleFormControlTextarea1'
          rows='3'
        >
          I'm Tweeting this to claim my 2100 owners reward. The reward will only
          be accessible to [Ethereum Address]
        </textarea>
      </div>
      <button type='button' className='btn btn-light'>
        Copy
      </button>
    </div>
  )
}

function OptOut () {
  return (
    <div>
      <h5>Opting out of 2100</h5>
      <hr />
      <p>
        If you don't want to participate in 2100, you may opt out of the
        protocol. If your account does not yet have a corresponding 2100 asset,
        it will be added to a blacklist so that the asset cannot be created. If
        your account already has a 2100 asset, the assets identifier will be
        scrambled so that it no longer references your account.
      </p>
      <p>
        Warning: Opting out of your account is permanent. Once you blacklist
        your account from 2100 it can never be added again. Only the owner of an
        account can opt out of 2100.
      </p>
      <p>
        To opt out of 2100, please Tweet exactly the following from the relevant
        account:
      </p>
      <div className='form-group'>
        <label for='exampleFormControlTextarea1' />
        <textarea
          className='form-control'
          id='exampleFormControlTextarea1'
          rows='3'
        >
          I would like to permanently opt out of 2100 and blacklist or destroy
          $twitter:[your_account_identifier].
        </textarea>
      </div>
      <button type='button' className='btn btn-light'>
        Copy
      </button>
    </div>
  )
}

export default Sync
