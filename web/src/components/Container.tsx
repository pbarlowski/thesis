import styled from "styled-components";

type ContainerProps = {
  direction: "row" | "column";
  position: "center";
};

const Container = styled.div<ContainerProps>`
  height: 100%;
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: ${(props) => props.position};
  align-items: ${(props) => props.position};
`;

export default Container;
