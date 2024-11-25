import { Path, useFormValue as sanityUseFormValue } from "sanity";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const useFormValue = sanityUseFormValue as <TVal>(path: Path) => TVal;
