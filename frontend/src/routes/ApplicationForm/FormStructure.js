import React from "react";
import styled from "styled-components";
import { Form, Field } from "formik";
import { media } from "src/styles/mediaQueries";
import Moment from "react-moment";
import "moment/locale/nb";
Moment.globalLocale = "nb";

import Icon from "src/components/Icon";
import LegoButton from "src/components/LegoButton";
import ConfirmModal from "src/components/ConfirmModal";
import PriorityTextField from "./PriorityTextField";
import PhoneNumberField from "./PhoneNumberField";
import ToggleCommittees from "./ToggleCommittees";
import ErrorFocus from "./ErrorFocus";
import djangoData from "src/utils/djangoData";

const FormStructure = ({
  admission,
  committees,
  selectedCommittees,
  toggleCommittee,
  toggleIsEditing,
  hasSelected,
  SelectedCommitteItems,
  handleSubmit,
  isSubmitting,
  isValid,
  isEditing,
  myApplication,
  onDeleteApplication,
  onCancel
}) => (
  <PageWrapper>
    {!isEditing && (
      <RecieptInfo>
        <Title>Kvittering for sendt søknad</Title>
        <RecievedApplicationBanner>
          Vi har mottatt søknaden din!
        </RecievedApplicationBanner>
        <TimeStamp>
          <Icon name="time" />
          Søknaden ble sist oppdatert
          {myApplication && (
            <StyledSpan bold>
              <Moment format="dddd Do MMMM , \k\l. HH:mm:ss">
                {myApplication.updated_at}
              </Moment>
            </StyledSpan>
          )}
        </TimeStamp>
        <LegoButton
          icon="arrow-forward"
          iconPrefix="ios"
          onClick={toggleIsEditing}
        >
          Endre søknad
        </LegoButton>
        <p>
          Du kan
          <StyledSpan bold> endre søknaden</StyledSpan> din frem til{" "}
          {admission && (
            <StyledSpan bold red>
              <Moment format="dddd Do MMMM">
                {admission.application_deadline}
              </Moment>
            </StyledSpan>
          )}
        </p>
        <HelpText>
          Du kan endre en søknad så mange ganger du vil, og komiteene vil kun se
          de siste endringene.
        </HelpText>

        <ConfirmModal
          title="Slett søknad"
          message="Er du sikker på at du vil slette søknaden din?"
          onConfirm={() => onDeleteApplication()}
        />
      </RecieptInfo>
    )}
    <FormHeader>
      <Title>
        {isEditing ? "Skriv din søknad og send inn!" : "Innsendt data"}
      </Title>
      {isEditing && djangoData.user.has_application && (
        <CancelButtonContainer>
          <LegoButton
            icon="arrow-back"
            iconPrefix="ios"
            onClick={onCancel}
            valid={isValid}
            buttonStyle="primary"
          >
            Avbryt
          </LegoButton>
        </CancelButtonContainer>
      )}
    </FormHeader>
    <Form>
      <SeparatorLine />
      <GeneralInfoSection>
        <SectionHeader>Generelt</SectionHeader>
        <HelpText>
          <Icon name="information-circle-outline" />
          Mobilnummeret vil bli brukt til å kalle deg inn på intervju av
          komitéledere.
        </HelpText>
        <Field
          name="phoneNumber"
          component={PhoneNumberField}
          disabled={!isEditing}
        />

        <HelpText>
          <Icon name="information-circle-outline" />
          Kun leder av Abakus kan se det du skriver inn i prioriterings- og
          kommentarfeltet.
        </HelpText>
        <Field
          name="priorityText"
          component={PriorityTextField}
          label="Prioriteringer, og andre kommentarer"
          optional
          disabled={!isEditing}
        />
      </GeneralInfoSection>
      <SeparatorLine />
      <CommitteesSection>
        <Sidebar>
          <div>
            <SectionHeader>Komiteer</SectionHeader>
            <HelpText>
              <Icon name="information-circle-outline" />
              Her skriver du søknaden til komiteen(e) du har valgt. Hver komité
              kan kun se søknaden til sin egen komité.
            </HelpText>

            {isEditing && (
              <ToggleCommittees
                committees={committees}
                selectedCommittees={selectedCommittees}
                toggleCommittee={toggleCommittee}
              />
            )}
          </div>
        </Sidebar>
        {hasSelected ? (
          <Applications>{SelectedCommitteItems}</Applications>
        ) : (
          <NoChosenCommitteesWrapper>
            <NoChosenTitle>Du har ikke valgt noen komiteer.</NoChosenTitle>
            <NoChosenSubTitle>
              Velg i sidemargen eller gå til komiteoversikten
            </NoChosenSubTitle>
            <LegoButton
              icon="arrow-forward"
              iconPrefix="ios"
              to="/velg-komiteer"
            >
              Velg komiteer
            </LegoButton>
          </NoChosenCommitteesWrapper>
        )}
      </CommitteesSection>
      <SeparatorLine />

      {isEditing && (
        <SubmitSection>
          <div>
            {admission && (
              <div>
                <ApplicationDateInfo>
                  <StyledSpan bold>Søknadsfristen</StyledSpan> er{" "}
                  <StyledSpan bold red>
                    <Moment format="dddd Do MMMM">
                      {admission.public_deadline}
                    </Moment>
                  </StyledSpan>
                  <StyledSpan red>
                    <Moment format=", \k\l. HH:mm:ss">
                      {admission.public_deadline}
                    </Moment>
                  </StyledSpan>
                  .
                </ApplicationDateInfo>
                <ApplicationDateInfo>
                  Etter dette kan du <StyledSpan bold>endre den</StyledSpan>{" "}
                  frem til{" "}
                  <StyledSpan bold red>
                    <Moment format="dddd Do MMMM">
                      {admission.application_deadline}
                    </Moment>
                  </StyledSpan>
                  <StyledSpan red>
                    <Moment format=", \k\l. HH:mm:ss">
                      {admission.application_deadline}
                    </Moment>
                  </StyledSpan>
                </ApplicationDateInfo>
              </div>
            )}
            <SubmitInfo>
              Oppdateringer etter endringsfristen kan ikke garanteres å bli sett
              av komiteen(e) du søker deg til.
            </SubmitInfo>
            <SubmitInfo>
              Din søknad til hver komité kan kun ses av den aktuelle komiteen og
              leder av Abakus. All søknadsinformasjon slettes etter opptaket er
              gjennomført.
            </SubmitInfo>
            <SubmitInfo>Du kan når som helst trekke søknaden din.</SubmitInfo>
          </div>
          {hasSelected && (
            <div>
              <LegoButton
                icon="arrow-forward"
                iconPrefix="ios"
                onClick={handleSubmit}
                type="submit"
                disabled={isSubmitting}
                valid={isValid}
                buttonStyle="tertiary"
              >
                Send inn søknad
              </LegoButton>
            </div>
          )}
        </SubmitSection>
      )}
      <ErrorFocus />
    </Form>
  </PageWrapper>
);

export default FormStructure;

/** Styles **/

const PageWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
  margin: 0 auto 4em auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  form {
    max-width: 100%;
  }

  ${media.portrait`
    max-width: 500px;
  `};

  ${media.handheld`
    max-width: 100%;
  `};
`;

const Title = styled.h1`
  color: rgba(129, 129, 129, 0.59);
  font-size: 1.3rem;
  margin: 1.6rem 0 1.3rem;
  line-height: 1.5em;

  ${media.handheld`
    margin: 1.5rem 1rem;
    font-size: 1.2rem;
    line-height: 1.2em;
  `};
`;

const SeparatorLine = styled.div`
  display: block;
  background: var(--lego-gray-medium);
  height: 1px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 750px;
  margin: 1em 0 1em 0;

  ${media.handheld`
    max-width: 100%;
    margin-bottom: 1em;
    flex-direction: column;
  `};
`;

const CancelButtonContainer = styled.div`
  display: flex;
  align-items: center;
  ${media.handheld`
  justify-content: center;`};
`;

/* General info section, mobile number, priorities */
const GeneralInfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  grid-template-areas:
    "header header"
    "phonenumberinfo phonenumber"
    "prioritytextinfo prioritytext";
  grid-gap: 1rem 2rem;
  max-width: 750px;
  margin-bottom: 1.5rem;

  > h2 {
    grid-area: header;
    margin-bottom: -1.5rem;
  }

  > span {
    margin-top: calc(1rem + 16px);
  }

  span:nth-of-type(1) {
    grid-area: phonenumberinfo;
  }

  span:nth-of-type(2) {
    grid-area: prioritytextinfo;
  }

  ${media.portrait`
    grid-template-columns: 100%;
    grid-template-areas:
    "header"
    "phonenumber"
    "phonenumberinfo"
    "prioritytext"
    "prioritytextinfo";
    grid-gap: 0.5rem ;

    > span {
      margin-top: 0;
    }
  `};
`;

const SectionHeader = styled.h2`
  font-size: 1.3rem;
  margin: 1rem 0 0;
  letter-spacing: 1px;
`;

const HelpText = styled.span`
  color: rgba(57, 75, 89, 0.75);
  font-size: 0.9rem;
  line-height: 1.2rem;
  display: flex;
  margin-left: calc(-2.6rem + 4px);

  i {
    color: var(--lego-gray-medium);
    font-size: 1.6rem;
    margin-right: 1rem;
  }

  ${media.portrait`
    margin-left: 0;
    font-size: 0.8rem;

    i {
      margin-right: 0.5rem;
      font-size: 1.3rem;

    }
  `};
`;

/* Committees section */

const CommitteesSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  grid-template-areas: "sidebar applications";
  grid-gap: 1rem 2rem;
  max-width: 750px;

  ${media.portrait`
    grid-template-columns: 100%;
    grid-template-areas:
      "sidebar"
      "applications";
    grid-gap: 0.5rem ;

    > span {
      margin-top: 1.5rem;;
    }
  `};
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  margin-bottom: 2rem;

  > div {
    position: sticky;
    top: 2rem;

    > h2 {
      margin-bottom: -1.5rem;
    }

    > span {
      margin-top: calc(1rem + 16px);
      margin-bottom: 2rem;
    }
  }
  ${media.portrait`
    margin-bottom: 1rem;
    > div {
      > span {
        margin-bottom: 1.5rem;
      }
    }
  `};
`;

const Applications = styled.div`
  grid-area: applications;
`;

/* Submit section, privacy and data notice */

const SubmitSection = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  max-width: 750px;
  margin-top: 2rem;
  align-items: center;

  ${media.portrait`
    grid-template-columns: 100%;

    button {
      margin-top: 2rem;
    }
  `};
`;

const StyledSpan = styled.span.attrs(props => ({
  red: props.red ? true : false,
  bold: props.bold ? "600" : "normal"
}))`
  color: ${props => (props.red ? "var(--lego-red)" : "inherit")};
  font-weight: ${props => props.bold};
`;

const ApplicationDateInfo = styled.p`
  font-size: 0.95rem;
  line-height: 1.3rem;
  margin-top: 0rem;
`;

const SubmitInfo = styled.p`
  font-size: 0.9rem;
  color: rgba(57, 75, 89, 0.75);
  line-height: 1.3rem;
  padding-right: 3rem;

  ${media.portrait`
    padding-right: 0;
  `};
`;

/* (Committees section) No chosen committes */

const NoChosenCommitteesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  text-align: center;

  ${media.portrait`
    margin: 0 0 4rem 0;
  `};
`;

const NoChosenTitle = Title.withComponent("h3");

const NoChosenSubTitle = styled.span`
  font-size: 1rem;
  font-family: var(--font-family);
  font-weight: 500;
  color: rgba(129, 129, 129, 0.4);
  max-width: 50%;
  text-align: center;
  line-height: 1rem;
  margin-bottom: 3rem;

  ${media.portrait`
    margin-bottom: 2rem;
  `};
`;

/* Reciept info (in top of page after sending in application) */

const RecieptInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const RecievedApplicationBanner = styled.div`
  background: linear-gradient(
    180deg,
    rgba(203, 232, 128, 0.97) 0%,
    #a1c34a 100%
  );
  border: 1px solid #809e33;
  border-radius: 13px;
  padding: 0.8rem 2rem;
  color: var(--lego-white);
  font-weight: 600;
  font-size: 1.2rem;

  ${media.handheld`
  font-size: 1rem;
  `};
`;

const TimeStamp = styled.p`
  text-align: center;
  display: flex;
  align-items: center;
  font-size: 1.1rem;

  span {
    margin-left: 0.3rem;
  }

  i {
    margin-right: 1rem;
    font-size: 1.4rem;
  }

  ${media.handheld`
    flex-direction: column;
    margin-bottom: 2rem;
    i {
      display: none;
    }
  `};
`;
