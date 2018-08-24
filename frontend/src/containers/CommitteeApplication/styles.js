import styled from "styled-components";
import { media } from "src/styles/mediaQueries";

export const ResponseLabelWrapper = styled.div`
  grid-area: response;

  margin: 0.5em 1em;
  font-family: Raleway, "Helvetica Neue", Arial, sans-serif;
  font-size: 0.95rem;
`;

export const WriteApplicationWrapper = styled.div`
  grid-area: input;

  margin: 0.5em 1em;
  font-family: Raleway, "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
`;

export const LogoNameWrapper = styled.div`
  grid-area: logoname;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 2em;

  ${media.handheld`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: flex-end;
    margin: 1em;
      `};
`;

export const Name = styled.label`
  font-weight: bold;
  margin-bottom: 0.5em;
  font-size: 1.5em;
  grid-area: committeeName;

  ${media.handheld`
    font-size: 1.3em;
    margin-bottom: 0;
      `};
`;

/**
 *
 * Committee logo for the committee application
 *
 */

export const Logo = styled.img`
  object-fit: scale-down;
  width: 50%;
  grid-area: logo;
  justify-content: center;
  align-self: center;
  z-index: 1;

  ${media.handheld`
    padding: 0.3em;
    width: 3em;
      `};
`;
