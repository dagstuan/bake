import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { PortableText } from "./PortableText";
import { isPortableTextAlert } from "./types";

interface PortableTextAlertProps {
  value: unknown;
}

export const PortableTextAlert = (props: PortableTextAlertProps) => {
  if (!isPortableTextAlert(props.value)) {
    return null;
  }

  const {
    value: { variant = "default", title, body },
  } = props;

  if (!title || !body) {
    return null;
  }

  return (
    <Alert variant={variant} className="not-first:mt-4 not-last:mb-4">
      {variant === "default" ? (
        <InfoCircledIcon />
      ) : (
        <ExclamationTriangleIcon />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <PortableText value={body} />
      </AlertDescription>
    </Alert>
  );
};
