export function formatNameType(nameType: string): string {
  return nameType?.toLowerCase().includes("given") ? "Given Name" : "Surname";
}

export function getGenderColor(gender: string): string {
  const colors: Record<string, string> = {
    male: "border-blue-500 bg-blue-500/10",
    female: "border-red-500 bg-red-500/10",
  };
  return colors[gender] ?? "border-yellow-500 bg-yellow-500/10";
}
