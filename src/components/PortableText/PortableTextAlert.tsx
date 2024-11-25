import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Alert as AlertType } from "../../../sanity.types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { PortableText } from "./PortableText";

interface PortableTextAlertProps {
  value: AlertType;
}

export const PortableTextAlert = (props: PortableTextAlertProps) => {
  const {
    value: { variant = "default", title, body },
  } = props;

  if (!title || !body) {
    return null;
  }

  return (
    <Alert
      variant={variant}
      className="[&:not(:first-child)]:mt-4 [&:not(:last-child)]:mb-4"
    >
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
