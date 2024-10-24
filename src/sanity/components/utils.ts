import { Path, useFormValue as sanityUseFormValue } from "sanity";

export const useFormValue = sanityUseFormValue as <TVal>(path: Path) => TVal;
