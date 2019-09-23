import React from "react";
import styled from "@emotion/styled";
import CountdownNow from "react-countdown-now";

import { useTheme } from "../ThemeProvider";

/* Assets */
import JapanDark from "./assets/japan-dark.svg";
import JapanLight from "./assets/japan-light.svg";
import LogoDark from "./assets/logo-dark.svg";
import LogoLight from "./assets/logo-light.svg";
import Moon from "./icons/moon.svg";
import Sun from "./icons/sun.svg";

/* Theming */
const breakpoints = [576, 768, 992, 1200];
const mq = breakpoints.map(bp => `@media (max-width: ${bp}px)`);

const Countdown = () => {
  const themeState = useTheme();

  // Message to display when the countdown is complete.
  const Completed = () => <span>One moment...</span>;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completed />;
    } else {
      // Render a countdown
      return (
        <Text>
          <Count>
            {days}
            <Label>d</Label>
            {hours}
            <Label>h</Label>
            {minutes}
            <Label>m</Label>
            {seconds}
            <Label>s</Label>
          </Count>
        </Text>
      );
    }
  };

  const Container = styled("div")`
    background-attachment: fixed;
    background-image: url(${themeState.dark ? JapanDark : JapanLight});
    background-position: right center;
    background-repeat: no-repeat;
    background-size: 60% 60%;
    display: flex;
    flex-flow: row wrap;
    height: 100%;
    padding: 5% 4% 3% 4%;
    transition: background 0.1s ease-out;
    width: 100%;
    ${[mq[0]]} {
      background-size: 100% 100%;
      background-position: center center;
    }
  `;

  const Icon = styled("div")`
    background-image: url(${themeState.dark ? Sun : Moon});
    background-size: 20px 20px;
    cursor: pointer;
    height: 20px;
    margin-left: 20px;
    transition: background-image 0.25s linear;
    width: 20px;
  `;

  const Link = styled("a")`
    color: #5b5b5b !important;
    &:hover {
      color: ${props =>
        props.color ? props.color : props.theme.body} !important;
      text-decoration: none;
      cursor: pointer;
      border-bottom: 1px solid
        ${props => (props.color ? props.color : props.theme.body)};
    }
    border-bottom: none;
  `;

  const Logo = styled("div")`
    background-image: url(${themeState.dark ? LogoDark : LogoLight});
    background-repeat: no-repeat;
    background-size: 600px 150px;
    height: 150px;
    width: 600px;
    ${[mq[1]]} {
      background-position: center center;
      background-size: 450px 100px;
      width: 450px;
    }
    ${[mq[0]]} {
      background-position: center center;
      background-size: 300px 75px;
      width: 300px;
    }
  `;
  return (
    <Wrapper>
      <Container>
        <Header>
          <Icon
            onClick={() => {
              themeState.toggle();
            }}
          />
          <Notice
            color="#5B5B5B"
            hover={themeState.dark ? "#FFFFFF" : "#000000"}
          >
            Thanks for joining the alpha. We'll be back for{" "}
            <strong>Devcon V. </strong> 🎉
          </Notice>
        </Header>
        <Break />
        <Center>
          <Logo />
        </Center>
        <Break />
        <Footer>
          <CountdownNow
            date={"Sat, 04 Oct 2019 00:00:01"}
            renderer={renderer}
          />
          <Links>
            {/* TODO(achalvs): Links are not hooked up yet... */}
            <Link>About</Link>
            <Link>Github</Link>
            <Link color="#00aced">Twitter</Link>
            <Link color="#7289DA">Discord</Link>
          </Links>
        </Footer>
      </Container>
    </Wrapper>
  );
};

const Count = styled("span")`
  color: #5b5b5b;
  font-size: 40px;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${props => props.theme.body};
  }
  ${[mq[0]]} {
    padding: 10px 10px;
    width: 100%;
  }
`;

const Label = styled("span")`
  font-size: 25px;
  font-weight: 300;
  margin-left: 2px;
  margin-right: 12px;
`;

const Wrapper = styled("div")`
  // Font imports
  @import url("https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i&display=swap");

  // Semi-global styles
  background: ${props => props.theme.background};
  font-family: "Rubik", sans-serif;
  height: 100vh;
  min-width: 100vw;
  position: fixed;

  h1 {
    color: ${props => props.theme.body};
  }

  ${[mq[0]]} {
    height: 85vh;
  }
`;

const Text = styled("div")`
  color: ${props => (props.color ? props.color : props.theme.body)};
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${props => (props.hover ? props.hover : props.theme.body)};
  }
`;

const Break = styled("div")`
  flex-basis: 100%;
  height: 0;
`;

const Footer = styled("div")`
  align-items: flex-end;
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
  margin-bottom: 1em;
  ${[mq[0]]} {
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
  }
`;

const Header = styled("div")`
  align-items: flex-start;
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
  max-height: 125px;
  ${[mq[0]]} {
    flex-flow: row wrap;
    justify-content: space-around;
    padding-top: 1em;
    text-align: center;
    width: 100%;
  }
`;

const Center = styled("div")`
  align-items: center;
  display: flex;
  flex-basis: 100%;
  justify-content: center;
`;

const Links = styled("div")`
  align-items: center;
  display: flex;
  justify-content: space-around;
  width: 26%;
  ${[mq[2]]} {
    flex-flow: row nowrap;
    padding: 10px 10px;
    width: 40%;
  }
  ${[mq[1]]} {
    flex-flow: row nowrap;
    padding: 10px 10px;
    width: 50%;
  }
  ${[mq[0]]} {
    flex-flow: row nowrap;
    padding: 10px 10px;
    width: 100%;
  }
`;

const Notice = styled(Text)`
  ${[mq[0]]} {
    padding: 0px 20px;
  }
`;

export default Countdown;
