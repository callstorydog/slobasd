import React from "react";
import { TextField } from "@material-ui/core";

export const PhoneNumberInput = React.forwardRef((props, ref) => (
  <TextField
    inputRef={ref}
    InputProps={{
      style: {
        marginTop: 0
      }
    }}
    InputLabelProps={{
      style: {
        top: -16
      }
    }}
    {...props}
  />
));
