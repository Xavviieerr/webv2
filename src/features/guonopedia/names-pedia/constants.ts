export const ROUTE_NAMES = "/dashboard/names" as const;

export const GENDER_COLORS: Record<string, string> = {
  male: "border-blue-500 bg-blue-500/10",
  female: "border-red-500 bg-red-500/10",
};

export const GENDER_DEFAULT_COLOR = "border-yellow-500 bg-yellow-500/10";

export const TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Given Name", value: "given name" },
  { label: "Surname", value: "surname" },
] as const;

export const GENDER_FILTERS = [
  { label: "all", value: "all" },
  { label: "male", value: "male" },
  { label: "female", value: "female" },
] as const;

export const EMPTY_STATE_MESSAGE =
  "We couldn't find any names that match your search criteria.";

export const NAMES_PAGE_LIMIT = "9";
