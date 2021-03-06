import React, { Component } from "react";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import callApi from "src/utils/callApi";

import CommitteeApplication from "src/containers/CommitteeApplication";

import FormStructure from "./FormStructure";

// State of the form
class FormContainer extends Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isMobile: false
    };
  }

  componentDidMount() {
    this.setState({ isMobile: this.state.width <= 500 });
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  toggleCommittee = name => {
    this.props.toggleCommittee(name.toLowerCase());
  };

  onCancelEdit = () => {
    this.props.toggleIsEditing();
    this.props.handleReset();
  };

  onDeleteApplication = () => {
    callApi("/application/mine/", {
      method: "DELETE"
    }).then(() => {
      this.props.toggleIsEditing();
      sessionStorage.clear();
      window.location = "/";
    });
  };

  persistState = () => {
    var selectedCommitteesJSON = JSON.stringify(this.state.selectedCommittees);
    sessionStorage.setItem("selectedCommittees", selectedCommitteesJSON);
    sessionStorage.setItem(
      "isEditingApplication",
      this.props.isEditingApplication
    );
  };

  initializeState = () => {
    var selectedCommitteesJSON = sessionStorage.getItem("selectedCommittees");
    var selectedCommittees = JSON.parse(selectedCommitteesJSON);

    if (selectedCommittees != null) {
      this.setState({
        selectedCommittees: selectedCommittees
      });
    }
  };

  handleApplicationFieldBlur = e => {
    this.props.handleBlur(e);
  };

  render() {
    const {
      admission,
      touched,
      errors,
      isSubmitting,
      committees,
      selectedCommittees,
      handleSubmit,
      isValid,
      toggleCommittee,
      toggleIsEditing,
      myApplication,
      isEditingApplication
    } = this.props;

    const hasSelected =
      committees.filter(
        committee => selectedCommittees[committee.name.toLowerCase()]
      ).length >= 1;
    const SelectedCommitteItems = committees
      .filter(committee => selectedCommittees[committee.name.toLowerCase()])
      .map(({ name, response_label }, index) => (
        <Field
          component={CommitteeApplication}
          committee={name}
          name={name.toLowerCase()}
          responseLabel={response_label}
          error={touched[name.toLowerCase()] && errors[name.toLowerCase()]}
          key={`${name.toLowerCase()} ${index}`}
          disabled={!isEditingApplication}
        />
      ));

    // This is where the actual form structure comes in.
    return (
      <FormStructure
        admission={admission}
        hasSelected={hasSelected}
        SelectedCommitteItems={SelectedCommitteItems}
        isSubmitting={isSubmitting}
        isValid={isValid}
        handleSubmit={handleSubmit}
        isMobile={this.state.isMobile}
        committees={committees}
        selectedCommittees={selectedCommittees}
        toggleCommittee={toggleCommittee}
        toggleIsEditing={toggleIsEditing}
        isEditing={isEditingApplication}
        myApplication={myApplication}
        onDeleteApplication={this.onDeleteApplication}
        onCancel={this.onCancelEdit}
      />
    );
  }
}

// Highest order component for application form.
// Handles form values, submit post and form validation.
const ApplicationForm = withFormik({
  mapPropsToValues({ myApplication = {} }) {
    const {
      text = sessionStorage.getItem("text") || "",
      phone_number = sessionStorage.getItem("phoneNumber") || "",
      committee_applications = []
    } = myApplication;

    return {
      webkom: "",
      fagkom: "",
      bedkom: "",
      readme: "",
      labamba: "",
      koskom: "",
      arrkom: "",
      pr: "",
      priorityText: text,
      phoneNumber: phone_number,
      ...committee_applications.reduce(
        (obj, a) => ({ ...obj, [a.committee.name.toLowerCase()]: a.text }),
        {}
      )
    };
  },
  handleSubmit(
    values,
    {
      props: { selectedCommittees, toggleIsEditing },
      setSubmitting
    }
  ) {
    var submission = {
      text: values.priorityText,
      applications: {},
      phone_number: values.phoneNumber
    };
    Object.keys(values)
      .filter(committee => selectedCommittees[committee])
      .forEach(name => {
        submission.applications[name] = values[name];
      });
    return callApi("/application/", {
      method: "POST",
      body: JSON.stringify(submission)
    })
      .then(() => {
        setSubmitting(false);
        toggleIsEditing();
        window.__DJANGO__.user.has_application = true;
      })
      .catch(err => {
        alert("Det skjedde en feil.... ");
        setSubmitting(false);
        throw err;
      });
  },

  validationSchema: props => {
    return Yup.lazy(values => {
      var selectedCommittees = Object.keys(values).filter(
        committee => props.selectedCommittees[committee]
      );
      const schema = {};
      selectedCommittees.forEach(name => {
        schema[name] = Yup.string().required("Søknadsteksten må fylles ut");
      });
      schema.phoneNumber = Yup.string("Skriv inn et norsk telefonnummer")
        .matches(
          /^(0047|\+47|47)?(?:\s*\d){8}$/,
          "Skriv inn et gyldig norsk telefonnummer"
        )
        .required("Skriv inn et gyldig norsk telefonnummer");
      return Yup.object().shape(schema);
    });
  },
  displayName: "ApplicationForm",
  validateOnChange: true,
  enableReinitialize: true
})(FormContainer);

export default ApplicationForm;
