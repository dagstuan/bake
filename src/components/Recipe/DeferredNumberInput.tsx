"use client";

import React, { ComponentProps, useState } from "react";
import { Input } from "../ui/input";
import { OmitStrict } from "@/utils/types";

type DeferredNumberInputProps = OmitStrict<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "type"
> & {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export const DeferredNumberInput = ({
  value,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  onChange,
  ...rest
}: DeferredNumberInputProps) => {
  const stringValue = String(value);
  const [inputValue, setInputValue] = useState(stringValue);
  const [prevPropValue, setPrevPropValue] = useState(stringValue);

  if (stringValue !== prevPropValue) {
    setPrevPropValue(stringValue);
    setInputValue(stringValue);
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value);

    const numberValue = Number(evt.target.value);
    if (numberValue >= min && numberValue <= max) {
      onChange(numberValue);
    }
  };

  const handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;

    if (newValue === "" || newValue === "0") {
      setInputValue(prevPropValue);
    }

    const numberValue = Number(newValue);
    if (numberValue >= min && numberValue <= max) {
      onChange(numberValue);
    } else {
      setInputValue(prevPropValue);
    }
  };

  return (
    <Input
      {...rest}
      type="number"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={(evt) => evt.target.select()}
    />
  );
};
