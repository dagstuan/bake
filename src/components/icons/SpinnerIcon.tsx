import { IconProps } from "./types";

export const SpinnerIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <path
        d="M4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
