import React, { Component } from "react";
import { FieldLabel, StyledTextAreaField } from "src/components/styledFields";
import styled from "styled-components";
import { media } from "src/styles/mediaQueries";

class PriorityTextField extends Component {
  componentDidMount() {
    this.setState({
      timeout: setInterval(() => {
        sessionStorage.setItem("text", this.props.field.value);
      }, 4000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.timeout);
  }
  render() {
    const {
      label,
      optional = false,
      field: { name, onChange, value },
      form: { handleBlur },
      disabled
    } = this.props;
    return (
      <Wrapper>
        <LabelWrapper>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {optional && <Optional>(valgfritt)</Optional>}
        </LabelWrapper>
        <StyledTextAreaField
          type="textarea"
          name={name}
          id={name}
          disabled={disabled}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder="Skriv dine kommentarer her..."
          value={value}
          rows="5"
        />
      </Wrapper>
    );
  }
}

export default PriorityTextField;

/** Styles **/

const Wrapper = styled.div`
  grid-area: prioritytext;

  ${media.portrait`
    margin-top: 0.5rem;
  `};
`;

const LabelWrapper = styled.span`
  display: flex;

  ${media.handheld`
    flex-direction: column;
    margin-bottom: 5px;
  `};
`;

const Optional = styled.span`
  font-size: 0.8rem;
  color: rgba(57, 75, 89, 0.75);
  font-weight: 500;
  margin-left: 0.3rem;
  line-height: 1rem;
`;
