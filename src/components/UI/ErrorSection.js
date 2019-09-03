import React from "react";
import PropTypes from "prop-types";

function ErrorSection(props) {
  const errorMessage = props.message || "General error";
  return <div className="error-section">Error: {errorMessage}</div>;
}

ErrorSection.propTypes = {
  message: PropTypes.string
};

export default ErrorSection;
