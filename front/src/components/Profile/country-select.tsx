import React from "react";
import { Select, MenuItem } from "@material-ui/core";
import { getCountryCallingCode } from "react-phone-number-input";

export const CountrySelect = React.forwardRef((props: any, ref) => (
  <Select
    inputRef={ref}
    {...props}
    onChange={e => {
      props.onChange(e.target.value);
    }}
    renderValue={value => (
      <div style={{ display: "flex" }}>
        <props.iconComponent country={value} />{" "}
        <span style={{ marginLeft: 10 }}>{`+${!!value &&
          getCountryCallingCode(value)}`}</span>{" "}
      </div>
    )}
  >
    {props.options.slice(1).map((option: any) => (
      <MenuItem key={`menu-item-${option.value}`} value={option.value}>
        <props.iconComponent country={option.value} />{" "}
        <span style={{ marginLeft: 10 }}>{`+${!!option.value &&
          getCountryCallingCode(option.value)}`}</span>
      </MenuItem>
    ))}
  </Select>
));
