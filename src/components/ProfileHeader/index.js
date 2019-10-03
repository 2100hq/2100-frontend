import React, { useState } from "react";
import {
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Sector,
  Label
} from "recharts";
import ProfileImage from "../ProfileImage";
import LinkableName from "../LinkableName";
import { toDecimals } from "../../utils";
import BigNumber from 'bignumber.js'
import { Row, Col } from "react-bootstrap";
import "./style.scss";
import * as moment from "moment";

// takes a list of data and truncates any data past the max adding it to an 'others' object
function truncateData(list=[], total="1", max=10){
  if (list.length < max) return list
  const others = {
    rank: max+1,
    name: 'others',
    value: BigNumber.sum(...list.slice(max).map(t=>t.value)).dp(4,0).toNumber()
  }

  others.percent = new BigNumber(others.value).div(total).dp(4,0).toNumber()

  const top = list.slice(0,max)
  return [...top, others]
}

const colors = ["#ADDEB5", "#BAB9FF", "#FAC2FF"];

// Data for pie charts...
const data = [
  { name: "$brttb", value: 0.00403 },
  { name: "$bnjmnr", value: 0.00138 },
  { name: "others", value: 0.003974 }
];

const data2 = [
  { rank: 1, name: "$brttb", value: 0.00403 },
  { rank: 2, name: "$bnjmnr", value: 0.00138 },
  { rank: 3, name: "others", value: 0.003974 }
];

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
let numPosts = 6;

// Profile statistics
let columns = info => [
  {
    title: "Amount Staked",
    content: <span className="feature">{info.amtStaked != null ? info.amtStaked : '-'}</span>
  },
  {
    title: "Circulating Supply",
    content: (
      <span className="feature">
        {info.supply != null ? info.supply : '-'}
        <span className="small-grey">of 2100</span>
      </span>
    )
  },
  {
    title: "Genesis",
    content: (
      <span className="feature-small">{info.created != null ? moment(info.created).fromNow() : '-'}</span>
    )
  },
  {
    title: "Stakers",
    content: <span className="feature">{info.numStakers != null ? info.numStakers : '-'}</span>
  },
  {
    title: "Holders",
    content: <span className="feature">{info.numHolders != null ? info.numHolders : '-'}</span>
  },
  {
    title: "Posts",
    content: <span className="feature">{info.numPosts != null ? info.numPosts : '-'}</span>
  }
];

export default function ProfileHeader({
  token,
  info = {}
}) {
  const truncatedHolders = info.holders != null && supply != null ? truncateData(info.holders, supply) : []
  const truncatedStakers = info.stakers != null && info.amtStaked != null ? truncateData(info.stakers, info.amtStaked) : []

  const [activeIndex, setActiveIndex] = useState({
    holders: 1,
    stakers: 1
  });

  const onStakersPieEnter = (data, idx, e) => {
    setActiveIndex({ stakers: idx });
  };

  const onHoldersPieEnter = (data, idx, e) => {
    setActiveIndex({ holders: idx });
  };

  const renderActiveShape = props => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent
    } = props;

    return (
      <g>
        <text x={cx} y={cy} dy="34%" className="username" textAnchor="middle">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy="42%" className="amount" textAnchor="middle">
          {(percent * 100).toFixed(2)}% · {(payload.value * 100).toFixed(2)} $
          {token.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="profile-header">
      <div className="photo">
        <div>
          <ProfileImage token={token} />
        </div>
        <div className="token-name mt-2">
          {token.name}{" "}
          <a className="text-muted" href={`https://twitter.com/${token.name}`}>
            <i class="fab fa-twitter"></i>
          </a>
        </div>
        <div className="fans">
          <div className="top-holder">
            <div className="photo">
              <ProfileImage token={info.holders[0]} />
            </div>
            <span className="description">
              <strong><LinkableName token={info.holders[0]} /></strong> is the #1 holder. 🐳
            </span>
          </div>
          <div className="top-staker">
            <div className="photo">
              <ProfileImage token={info.stakers[0]} />
            </div>
            <span className="description">
              <strong><LinkableName token={info.stakers[0]} /></strong> is the #1 staker. ⛏
            </span>
          </div>
        </div>
        <div className="token-url small mt-2"></div>
      </div>
      <div className="stats">
        <div className="stat-col">
          {columns(info)
            .slice(0, 3)
            .map(col => (
              <div className="item">
                <h4>{col.title}</h4>
                {col.content}
              </div>
            ))}
        </div>
        <div className="stat-col">
          {columns(info)
            .slice(3, 6)
            .map(col => (
              <div className="item">
                <h4>{col.title}</h4>
                {col.content}
              </div>
            ))}
        </div>
      </div>
      <div className="charts">
        {stakers.length > 0 && <div className="chart">
        <h3>Top Stakers</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={truncatedStakers}
                dataKey="value"
                innerRadius="25%"
                outerRadius="45%"
                activeIndex={activeIndex.stakers}
                activeShape={renderActiveShape}
                onMouseEnter={onStakersPieEnter}
                isAnimationActive={false}
              >
                {truncatedStakers.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>}
        {holders.length > 0 && <div className="chart">
        <h3>Top Holders</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={truncatedHolders}
                dataKey="value"
                innerRadius="25%"
                outerRadius="45%"
                activeIndex={activeIndex.holders}
                activeShape={renderActiveShape}
                onMouseEnter={onHoldersPieEnter}
                isAnimationActive={false}
              >
                {truncatedHolders.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>}
      </div>
    </div>
  );
}
