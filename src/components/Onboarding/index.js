import React from 'react';
import {Modal,Button,Col,Row,Carousel} from 'react-bootstrap';
import ProfileImage from '../ProfileImage';
import MessageCard from '../FollowMe/MessageCard';
import './style.scss';

function HiddenMessageExample(){
  const message_id = '0f2e0687-65d7-4372-a18b-0270b94abbc9'
  const id = message_id.replace(/-/g,'').toUpperCase().split('').map( c => <span className={`char-${c}`}>{c} </span>)

  return(
    <div className='hidden-message-block'>
      <div className='pretend-encryption'>
        {id} {id}
      </div>
    </div>
  )
}

function OnboardingTwitterProfile({token}){
  return(
  <div style={{
    width: '5rem',
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: '1rem'
  }}>
    <ProfileImage token={token} style={{width: '5rem'}} />
    <div>2100</div>
  </div>
  )
}

function Section1(){
  return(
      <div className='section section1'>
      <Row>
        <Col md='12'><img src='img/logo3.png' /></Col>
      </Row>
      <Row>
        <Col md='12'>
          <h3 className='mt-5'>Welcome to 2100</h3>
        </Col>
      </Row>
      </div>
    )
}

function Section2(){
  return(
          <div className='section section2'>
            <Row>
              <Col md='3'></Col>
              <Col md='1'>
                <OnboardingTwitterProfile token={'benjmnr'}/>
              </Col>
              <Col md='1'>
                <OnboardingTwitterProfile token={'brttb'}/>
              </Col>
              <Col md='1'>
                <OnboardingTwitterProfile token={'vitalikbuterin'}/>
              </Col>
              <Col md='1'>
                <OnboardingTwitterProfile token={'bwertz'}/>
              </Col>
              <Col md='1'>
                <OnboardingTwitterProfile token={'angelatytran'}/>
              </Col>
              <Col md='1'>
                <OnboardingTwitterProfile token={'brttb'}/>
              </Col>
              <Col md='3'></Col>
            </Row>
            <Row>
              <Col md='12'>
                <h3 className='mt-5'>Your Twitter account has 2100 tokens</h3>
              </Col>
            </Row>
          </div>
    )
}

function Section3(){
  return(
      <div className='section section3'>
        <Row>
          <Col md='12'>
            <img src='img/group-stake2.png' style={{width: '33%'}}/>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <h3 className='mt-5'>Others stake DAI to earn your tokens...</h3>
          </Col>
        </Row>
      </div>
    )
}

const onehour = 1000*60*60
const cardData = [
  {
    message: {
      type: 'text',
      created: Date.now()-(2*onehour),
      threshold: 0.02*10**18,
      id: '2b13855d-f2ea-410b-afda-f379b3f081d6',
      hidden: true
    },
    token: {
      name: 'benjmnr'
    },
  },
  {
    message: {
      type: 'text',
      created: Date.now()-onehour/2,
      threshold:0.3*10**18,
      id: 'ce0131a8-968b-45df-8a2b-edb367034837',
      hidden: true,
      recipients: ['balajis', 'conniechan', 'benedictevans', 'xyy', 'zyz', 'zzz', 'zzzz', 'zzzzzz', 'zzz3zzz', 'zzz777z', 'zzzzz888', 'xyz', 'yyy']
    },
    token: {
      name: 'bwertz'
    },
  },
  {
    message: {
      type: 'text',
      created: Date.now()-(12*onehour),
      threshold:1*10**18,
      id: 'ea545242-779c-4733-b520-688b018ea55e',
      hidden: true
    },
    token: {
      name: 'angelatytran'
    },
  }
]

function Section4(){
  const fakeCards = cardData.map( props => {
    return (
      <Col md='4'>
        <Row>
          <MessageCard {...props} canCopyUrl={false} canLinkToProfile={false}/>
        </Row>
      </Col>
    )
  })
  return(
      <div className='section section4'>
        <Row>
          <Col md='12'>
            <h3 className='mb-5'>Because you post content that only <em>your</em> token holders can see!</h3>
          </Col>
        </Row>
        <Row>
          {fakeCards}
        </Row>
        <Row>
          <Col>
            <h4 className='mt-5'><a href='/'>Let's try it out</a></h4>
          </Col>
        </Row>
      </div>
    )
}

export default function Onboarding(){
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={true}
        className='onboarding'
      >
        <Modal.Body>
        <div className='container'>
          <Row className='onboarding-body'>
            <Col md='12'>
              <Section1 />
              <Section2 />
              <Section3 />
              <Section4 />
{/*
            <Section2 />*/}
{/*            <Section3 />*/}


           {/* <div className='section section3'>
              <h4>Let's try it out</h4>
              <p>Below is a hidden message from <span>$vitalik</span>. <br/>Add some stake and earn enough $vitalik to reveal the message.</p>
              <div>
                <img src='../img/dai.png' style={{ width: '14px','vertical-align': 'baseline' }} />
                10 DAI
                [][][][][][][][][]
              </div>
              <div>0 $vitalik</div>
                <HiddenMessageExample />
            </div>
            <div className='section section4'>
            <h4>Great job!</h4>
            <p>You're such an efficient capital allocator that we've credited 10 testnet DAI to your account.</p>
            <a href='/'>Sign in with Metamask</a>
            <p>to claim it and be among the first to experience 2100.</p>
            </div>*/}
            </Col>
          </Row>
        </div>
        </Modal.Body>
      </Modal>
  )
}