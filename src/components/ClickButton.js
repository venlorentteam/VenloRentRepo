import React from "react";
import "./ClickButton.css";

const ClickButton = ({
  text = "Click Me",
  onClick,
  type = "button",
  width = "auto",
  disabled = false,
  isLoading = false,
  icon, // optional icon before text
  variant = "primary", // 'primary', 'outline', 'secondary', 'danger'
  size = "medium", // 'small', 'medium', 'large'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`click-button ${variant} ${size} ${disabled || isLoading ? "disabled" : ""}`}
      style={{ width }}
    >
      {isLoading ? (
        <>
          <span className="button-spinner-small"></span>
          <span className="button-text">Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          <span className="button-text">{text}</span>
        </>
      )}
    </button>
  );
};

export default ClickButton;