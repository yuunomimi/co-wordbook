import React, { useState } from "react";
import "./ColorRadio.css";

type ColorRadioProps = {
  colors: string[];
  value: string;
  onColorChange: (color: string) => void;
};

export default function ColorRadio({ colors, value, onColorChange }: ColorRadioProps) {
  const handleColorChange = (color: string) => {
    onColorChange(color);
  };

  return(
    <div className="color-picker">
      {colors.map((color) => (
        <label
          key={color}
          className="color-radio"
          style={{ "--color": color } as React.CSSProperties}
      >
        <input
          type="radio"
          name="themeColor"
          value={color}
          checked={value === color}
          onChange={() => handleColorChange(color)}
        />
        <span className="color-circle" />
      </label>
    ))}
  </div>
  );
}