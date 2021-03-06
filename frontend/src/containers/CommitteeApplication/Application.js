import React, { Component } from "react";
import styled from "styled-components";
import { media } from "src/styles/mediaQueries";
import {
  FieldLabel,
  InputValidationFeedback,
  StyledTextAreaField
} from "src/components/styledFields";
import readmeIfy from "src/components/ReadmeLogo";

class Application extends Component {
  componentDidMount() {
    this.setState({
      timeout: setInterval(() => {
        sessionStorage.setItem(
          "applicationText",
          JSON.stringify({
            ...JSON.parse(sessionStorage.getItem("applicationText")),
            [this.props.committee.toLowerCase()]: this.props.field.value
          })
        );
      }, 4000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.timeout);
  }
  render() {
    const {
      responseLabel,
      committee,
      field: { name, onChange, value },
      form: { touched, errors, handleBlur },
      disabled
    } = this.props;
    const error = touched[name] && errors[name];
    return (
      <Container>
        <LogoNameWrapper>
          <Logo src={require(`assets/committee_logos/${name}.png`)} />
          <Name>{readmeIfy(committee)}</Name>
        </LogoNameWrapper>
        {responseLabel && (
          <ResponseLabel>{readmeIfy(responseLabel, true)}</ResponseLabel>
        )}
        <InputWrapper>
          <FieldLabel htmlFor={name.toLowerCase()}>Søknadstekst</FieldLabel>
          <InputArea
            className="textarea"
            type="textarea"
            name={name}
            id={name}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder="Skriv søknadstekst her..."
            value={value}
            error={error}
            rows="10"
            disabled={disabled}
          />
          <InputValidationFeedback error={error} />
        </InputWrapper>
      </Container>
    );
  }
}

export default Application;

/** Styles **/

const Container = styled.div`
  display: grid;
  grid-template-areas:
    "logoname"
    "responselabel"
    "input";
  grid-gap: 0.7rem;
  align-items: center;
  margin: 2rem 0rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--lego-gray-medium);

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
  }

  ${media.portrait`
    margin: 1em 0;
    `};
`;

export const LogoNameWrapper = styled.div`
  grid-area: logoname;
  display: flex;
  align-items: center;
`;

export const Name = styled.h3`
  grid-area: name;
  margin: 0;
  font-size: 1.5rem;
  line-height: 2rem;
  letter-spacing: 0.7px;

  ${media.portrait`
    font-size: 1.3rem;
    padding: 0
    text-align: left;
    align-self: center;
    `};
`;

export const Logo = styled.img`
  grid-area: logo;
  justify-self: start;
  object-fit: scale-down;
  max-width: 45px;
  margin-right: 1rem;
`;

export const ResponseLabel = styled.div`
  grid-area: responselabel;
  background: linear-gradient(
    180deg,
    rgba(234, 233, 232, 0.76) 0%,
    rgba(218, 218, 218, 0.56) 100%
  );
  background-repeat: repeat;
  border: 1px solid rgba(53, 138, 204, 0.22);
  border-radius: 13px;
  padding: 1rem;
  font-size: 0.8rem;
  line-height: 1rem;
  color: rgba(57, 75, 89, 0.8);
`;

export const InputWrapper = styled.div`
  grid-area: input;
  font-family: var(--font-family);
  font-size: 1rem;
`;

const InputArea = styled(StyledTextAreaField)`
  min-height: 10rem;
`;
