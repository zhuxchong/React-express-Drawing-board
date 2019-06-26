import React from "react";

import Radio from "@material-ui/core/Radio";

function RadioButtons(props) {
  return (
    <div>
      <Radio
        style={{ color: props.color }}
        checked={props.color === props.selected}
        onChange={() => {
          props.handleColorChange(props.color);
        }}
        value={props.color}
      />
    </div>
  );
}
export default RadioButtons;
