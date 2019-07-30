import React, { Component } from 'react'
export default function Discover () {
  return (
    <div className='row'>
      <div className='col-md-8' style={{ paddingTop: '1rem' }}>
        <div className='card' style={{ marginBottom: '1rem' }}>
          <h5 className='card-header'>Discover</h5>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-4'>
                <form className='form-inline'>
                  <label
                    className='sr-only'
                    for='inlineFormInputGroupUsername2'
                  >
                    Username
                  </label>
                  <div className='input-group mb-2 mr-sm-2'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>$</div>
                    </div>
                    <input
                      type='text'
                      className='form-control'
                      id='inlineFormInputGroupUsername2'
                      placeholder='by username'
                    />
                  </div>
                </form>
              </div>
              <div className='col-md-8'>
                <ul className='nav nav-pills inline'>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      All
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link active' href='#'>
                      Crypto Twitter
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      Favorites
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      Pending
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      Disputed
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>Rank</th>
              <th scope='col'>Asset</th>
              <th scope='col' />
              <th scope='col'>Minting</th>
              <th scope='col'>Allocate</th>
              <th scope='col' />
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>1</th>
              <td>
                <a href='account.html'>$vitalikbuterin</a>
              </td>
              <td>
                <i className='fas fa-check text-success' />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 30,000
              </td>
              <td>
                <form style={{ width: '50%' }}>
                  <div className='form-group'>
                    <input
                      type='range'
                      className='form-control-range'
                      value='0'
                      id='formControlRange'
                    />
                  </div>
                </form>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr>
              <th scope='row'>2</th>
              <td>
                <a href=''>$el33th4xor</a>
              </td>
              <td>
                <i className='fas fa-random text-danger' />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 30,000
              </td>
              <td>
                <small>
                  <a href=''>Name change pending</a>
                </small>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr>
              <th scope='row'>2</th>
              <td>
                <a href=''>$gakonst</a>
              </td>
              <td>
                <i className='fas fa-check text-success' />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 28,000
              </td>
              <td>
                <form style={{ width: '50%' }}>
                  <div className='form-group'>
                    <input
                      type='range'
                      className='form-control-range'
                      value='0'
                      id='formControlRange'
                    />
                  </div>
                </form>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr>
              <th scope='row'>3</th>
              <td>
                <a href=''>$maurelian_</a>
              </td>
              <td>
                <i className='fas fa-check text-success' />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 26,000
              </td>
              <td>
                {' '}
                <form style={{ width: '50%' }}>
                  <div className='form-group'>
                    <input
                      type='range'
                      className='form-control-range'
                      value='0'
                      id='formControlRange'
                    />
                  </div>
                </form>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr>
              <th scope='row'>4</th>
              <td>
                <a href=''>$econoar</a>
              </td>
              <td>
                <i className='fas fa-check text-success' />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 25,000
              </td>
              <td>
                <form style={{ width: '50%' }}>
                  <div className='form-group'>
                    <input
                      type='range'
                      className='form-control-range'
                      value='0'
                      id='formControlRange'
                    />
                  </div>
                </form>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr>
              <th scope='row'>5</th>
              <td>
                <a href=''>$tonysheng</a>
              </td>
              <td>
                <i
                  className='fas fa-check text-success'
                  data-toggle='tooltip'
                  data-html='true'
                  title='<small>Undisputed <br/>Owners Reward Claimed</small>'
                />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 21,000
              </td>
              <td>
                <form style={{ width: '50%' }}>
                  <div className='form-group'>
                    <input
                      type='range'
                      className='form-control-range'
                      value='0'
                      id='formControlRange'
                    />
                  </div>
                </form>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr>
              <th scope='row'>6</th>
              <td>
                <a href=''>$mattgcondon</a>
              </td>
              <td>
                <i
                  className='fas fa-sync-alt text-warning'
                  data-toggle='tooltip'
                  data-html='true'
                  title='<em>Asset is a valid Twitter handle but is awaiting contract creation.</em>'
                />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 19,000
              </td>
              <td>
                <form style={{ width: '50%' }}>
                  <a href=''>
                    <small
                      data-toggle='tooltip'
                      data-html='true'
                      title='<em>Pay for contract creation and earn the first 1% of total supply!</em>'
                    >
                      Initialize and Earn
                    </small>
                  </a>
                </form>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
            <tr className='table-light'>
              <th scope='row'>7</th>
              <td>
                <a href=''>$a8l4f0j2</a>
              </td>
              <td>
                <i className='fas fa-skull' />
              </td>
              <td>
                <img src='../img/dai.png' style={{ width: '16px' }} /> 0
              </td>
              <td>
                <small>
                  <a href=''>User has opted out</a>
                </small>
              </td>
              <td>
                <i className='far fa-star' />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='col-md-4' style={{ paddingTop: '1rem' }}>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <img
                className='card-img-top'
                src='../img/vitalik.jpg'
                alt='Card image cap'
              />
              <div className='card-body'>
                <h5 className='card-title'>$vitalikbuterin</h5>
                <p className='card-text'>
                  Creator of the Ethereum smart contract platform.
                </p>
              </div>
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>1000 Followers</li>
                <li className='list-group-item'>6,000 Minting</li>
              </ul>
              <div className='card-body'>
                <a href='#' className='card-link'>
                  Stake $twitter:vitalikbuterin
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-body'>
                <div className='small'>
                  <div>
                    <i className='fas fa-circle' style={{ color: 'green' }} />{' '}
                    Connected
                  </div>
                  <hr />
                  <div>Ethereum Mainnet</div>
                  <div>Block #8220171</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
