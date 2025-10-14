import React from "react";
import "./ClickButton.css";

const ClickButton = ({
  text = "Click Me",
  onClick,
  type = "button",
  width = "auto",
  disabled = false,
  icon, // optional icon before text
  variant = "primary", // can extend later e.g. 'outline', 'danger', etc.
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`click-button ${variant} ${disabled ? "disabled" : ""}`}
      style={{ width }}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{text}</span>
    </button>
  );
};

export default ClickButton;
