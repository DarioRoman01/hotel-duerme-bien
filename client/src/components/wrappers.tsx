import React from "react";

export const FormWrapper: React.FC<{children: React.ReactElement}> = (props) => {
  return (
    <div className="mb-3 min-w-full">
      {props.children}
    </div>
  )
}