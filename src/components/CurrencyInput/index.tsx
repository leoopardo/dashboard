import React, {useState} from "react";
import CurrencyInputField from "react-currency-input-field";

interface CurrencyInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
}) => {
const [isHovered, setIsHovered] = useState(false)

const handleChange = (value: number | undefined | any) => {
    onChange(value);
};

const formattedValue = value !== undefined ? value.toString() : '0';

const handleMouseEnter = () => {
  setIsHovered(true);
};

const handleMouseLeave = () => {
  setIsHovered(false);
};

const inputStyle = {
  width: '100%',
  height: '38px',
  paddingLeft: '10px',
  borderRadius: '6px',
  borderStyle: 'solid',
  border: '0.5px solid',
  outline: 'none',
  borderColor: isHovered ? '#5bc4bc' : '#d9d9d9',
};

return (
  <CurrencyInputField
    prefix="R$"
    decimalSeparator=","
    groupSeparator="."
    value={formattedValue}
    onValueChange={handleChange}
    style={inputStyle}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  />
)
}
