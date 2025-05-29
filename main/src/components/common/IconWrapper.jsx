// containing the hover style for buttons
import React from "react";

const HOVER_STYLE = "text-base-content/75 hover:text-base-content transition-colors duration-200 cursor-pointer";

const IconWrapper = ({ children, className = "" }) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      // merging className
      className: `${HOVER_STYLE} ${children.props.className ?? ""} ${className}`,    })
  }

  // Fallback: Invalid elem
  return (
    <span className={`${HOVER_STYLE} ${className}`}>
      {children}
    </span>
  )
};

export default IconWrapper;