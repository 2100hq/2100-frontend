import React from "react";
import ProfileImage from "../../ProfileImage";
import { useStoreContext } from "../../../contexts/Store";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { sortBy } from "lodash";
import "./style.scss";

function Face({ name, address, index }) {
  if (name)
    return (
      <ProfileImage
        token={name}
        className={"holder-icon holder-icon-" + index}
      />
    );
  return (
    <div className={"jazzicon holder-icon holder-icon-" + index}>
      <Jazzicon diameter={12} seed={jsNumberForAddress(address)} />
    </div>
  );
}

function Faces({ addresses = [], count = 3 }) {
  const { query } = useStoreContext();
  // look up names and mix them with address, sort by names
  const data = sortBy(
    addresses.map(address => {
      if (address.indexOf("0x") !== 0) return { name: address }; // treat the address as a name
      const name = query.getUserName(address);
      return {
        name,
        address
      };
    }),
    data => data.name
  );

  return data
    .splice(0, count)
    .map((props, index) => (
      <Face key={props.name + props.address} {...props} index={index + 1} />
    ));
}

function NoHolders({ prefix, noholderstext, suffix }) {
  return (
    <div className="holders-profiles no-holders">
      {prefix}
      {noholderstext}
      {suffix}
    </div>
  );
}

function CountHolders({ prefix, count, suffix = " holders" }) {
  return (
    <div className="holders-profiles count-holders">
      {prefix}
      {count}
      {suffix}
    </div>
  );
}

export default function HoldersProfiles({
  holders,
  prefix,
  suffix,
  noholderstext,
  facesCount = 3,
  className = ""
}) {
  noholderstext = (
    <div className={"holders-profiles no-holders " + className}>
      <div>
        {prefix}no one {suffix}
      </div>
    </div>
  );

  if (holders == null) return noholderstext;

  if (typeof holders === "number")
    return <CountHolders prefix={prefix} count={holders} suffix={suffix} />;

  holders = holders.filter(
    userid => userid.indexOf("0x") !== 0 || parseInt(userid) > 0
  ); // filter out zero address
  const holdersCount = holders.length;

  if (holdersCount === 0) return noholderstext;

  const andMore =
    holdersCount > facesCount ? (
      <span> +{holdersCount - facesCount} </span>
    ) : null;

  if (suffix == null) {
    suffix =
      holdersCount > facesCount
        ? ` holder${holdersCount - facesCount > 1 ? "s" : ""}`
        : " only";
  }

  return (
    <div className={"holders-profiles has-holders " + className}>
      {prefix}
      <Faces addresses={holders} count={facesCount} />
      <div>
        <span style={{"fontWeight": "bold"}}>{andMore}</span>
        <span style={{"fontWeight": "400"}}>{suffix}</span>
      </div>
    </div>
  );
}
