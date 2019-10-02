import React from "react";
import ProfileImage from "../ProfileImage";
import { toDecimals } from "../../utils";
import { Row, Col } from "react-bootstrap";
import "./style.scss";
import * as moment from "moment";

// An ordered list of tokens corresponding to the holders of $this.
let holders = [
  {
    _id: "brttb",
    created: 1568664521858,
    createdBlock: 8562559,
    creatorAddress: "0x0",
    creatorReward: "21000000000000000",
    decimals: 18,
    description: null,
    id: "brttb",
    minimumStake: "10000000000000000",
    name: "brttb",
    ownerAddress: "0x450ea68a04088c378efaa63f2306a0417145682e",
    ownerShare: 0.1,
    reward: "210000000000000",
    source: "internal",
    supply: "2100000000000000000000",
    stakes: "Object",
    totalStakes: "21449990000000000000",
    myStake: "2290000000000000000",
    level: 5,
    balances: "Object",
    rank: 11
  },
  {
    _id: "fehrsam",
    created: 1568928339424,
    createdBlock: 8582179,
    creatorAddress: "0x0",
    creatorReward: "21000000000000000",
    decimals: 18,
    description: "",
    id: "fehrsam",
    minimumStake: "10000000000000000",
    name: "fehrsam",
    ownerAddress: "0xa37102e1ba0f090f2390f71bec7b102c74e62363",
    ownerShare: 0.1,
    reward: "210000000000000",
    source: "twitter:2100",
    supply: "2100000000000000000000",
    stakes: "Object",
    totalStakes: "29860000000000000000",
    myStake: "410000000000000000",
    level: 1,
    balances: "Object",
    rank: 8
  }
];

// An ordered list of tokens corresponding to the stakers of $this.
let stakers = [
  {
    _id: "brttb",
    created: 1568664521858,
    createdBlock: 8562559,
    creatorAddress: "0x0",
    creatorReward: "21000000000000000",
    decimals: 18,
    description: null,
    id: "brttb",
    minimumStake: "10000000000000000",
    name: "brttb",
    ownerAddress: "0x450ea68a04088c378efaa63f2306a0417145682e",
    ownerShare: 0.1,
    reward: "210000000000000",
    source: "internal",
    supply: "2100000000000000000000",
    stakes: "Object",
    totalStakes: "21449990000000000000",
    myStake: "2290000000000000000",
    level: 5,
    balances: "Object",
    rank: 11
  },
  {
    _id: "fehrsam",
    created: 1568928339424,
    createdBlock: 8582179,
    creatorAddress: "0x0",
    creatorReward: "21000000000000000",
    decimals: 18,
    description: "",
    id: "fehrsam",
    minimumStake: "10000000000000000",
    name: "fehrsam",
    ownerAddress: "0xa37102e1ba0f090f2390f71bec7b102c74e62363",
    ownerShare: 0.1,
    reward: "210000000000000",
    source: "twitter:2100",
    supply: "2100000000000000000000",
    stakes: "Object",
    totalStakes: "29860000000000000000",
    myStake: "410000000000000000",
    level: 1,
    balances: "Object",
    rank: 8
  }
];

// Represents the total amount of DAI staked on this asset.
let amtStaked = 34.39;

// Other statistics...
let numStakers = 34;
let numHolders = 5;
let supply = 0.009384;
let created = new Date();
let posts = 6;

// Profile statistics
let columns = info => [
  {
    title: "Amount Staked",
    content: <span className="feature">{info.amtStaked}</span>
  },
  {
    title: "Circulating Supply",
    content: (
      <span className="feature">
        {info.supply}
        <span className="small-grey">of 2100</span>
      </span>
    )
  },
  {
    title: "Genesis",
    content: (<span className="feature-small">
    {moment(info.created).fromNow()}
  </span>)
  },
  {
    title: "Stakers",
    content: (<span className="feature">{info.numStakers}</span>)
  },
  {
    title: "Holders",
    content: (<span className="feature">{info.numHolders}</span>)
  },
  {
    title: "Posts",
    content: (<span className="feature">{info.posts}</span>)
  }
];

export default function ProfileHeader({
  token,
  info = {
    holders,
    stakers,
    amtStaked,
    numStakers,
    supply,
    numHolders,
    created,
    posts
  }
}) {
  return (
    <div className="profile-header">
      <Row className="align-items-center">
        <Col md="7" className="image-area">
          <div className="module">
            <ProfileImage token={token} />
          </div>
          <div className="token-name mt-2">
            {token.name}{" "}
            <a
              className="text-muted"
              href={`https://twitter.com/${token.name}`}
            >
              <i class="fab fa-twitter"></i>
            </a>
          </div>
          <div className="fans">
            <div className="top-holder">
              <div className="photo">
                <ProfileImage token={holders[0]} />
              </div>
              <span className="description">
                <strong>${holders[0].name}</strong> is the #1 holder. 🐳
              </span>
            </div>
            <div className="top-staker">
              <div className="photo">
                <ProfileImage token={stakers[0]} />
              </div>
              <span className="description">
                <strong>${stakers[0].name}</strong> is the #1 staker. ⛏
              </span>
            </div>
          </div>
          <div className="token-url small mt-2"></div>
        </Col>
        <Col className="stat">
          <div className="stat-col">
            {columns(info).slice(0, 3).map(col => 
              <div className="item">
                <h4>{col.title}</h4>
                {col.content}
              </div>
            )}
          </div>
          <div className="stat-col">
            {columns(info).slice(3, 6).map(col => 
              <div className="item">
                <h4>{col.title}</h4>
                {col.content}
              </div>
            )}
          </div>
        </Col>
        {/* <Col md="5" className="stakeholders-area">
          <div className="top-holders">
            <div className="top-label">Top Holders</div>
            {holders.slice(0, 5).map(holder => (
              <ProfileImage token={holder} />
            ))}
          </div>
          <hr />
          <div className="top-stakers">
            <div className="top-label">Top Stakers</div>
            {holders.slice(0, 5).map(holder => (
              <ProfileImage token={holder} />
            ))}
          </div>
        </Col> */}
      </Row>
    </div>
  );
}
