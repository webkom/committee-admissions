import React from "react";
import {
  FieldLabel,
  InputValidationFeedback,
  StyledField
} from "src/components/styledFields";
import styled from "styled-components";
import { media } from "src/styles/mediaQueries";

const PhoneNumberField = ({
  field: { name },
  form: { touched, errors, handleBlur },
  disabled
}) => {
  const error = touched[name] && errors[name];

  return (
    <Wrapper>
      <FieldLabel htmlFor={name}>Mobilnummer</FieldLabel>

      <StyledField
        type="tel"
        name={name}
        disabled={disabled}
        id={name}
        onBlur={e => {
          sessionStorage.setItem("phoneNumber", e.target.value);
          handleBlur();
        }}
        placeholder="Fyll inn mobilnummer..."
        error={error}
      />
      <InputValidationFeedback error={error} />
    </Wrapper>
  );
};

export default PhoneNumberField;

/** Styles **/

const Wrapper = styled.div`
  grid-area: phonenumber;

  ${media.portrait`
    margin-top: 1.5rem;
  `};
`;
