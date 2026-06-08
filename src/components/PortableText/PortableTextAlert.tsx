import { Info, TriangleAlert } from "lucide-react";
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
        <Info className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <PortableText value={body} />
      </AlertDescription>
    </Alert>
  );
};
