import styled from "styled-components";
import { Card } from "src/components/Card";

const Wrapper = styled(Card)`
  grid-area: applicationText;
  margin: 0;
  padding: 1.5em;
  font-size: 0.9em;
  font-family: var(--font-family);
  width: 100%;
`;

export default Wrapper;
