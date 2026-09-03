export function getPasswordStrength(password: string): {
  level: number;
  color: string;
  textKey?: string;
} {
  if (!password) return { level: 0, color: "", textKey: undefined };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { level: 1, color: "bg-red-500", textKey: "veryWeak" },
    { level: 2, color: "bg-orange-500", textKey: "weak" },
    { level: 3, color: "bg-yellow-500", textKey: "fair" },
    { level: 4, color: "bg-blue-500", textKey: "good" },
    { level: 5, color: "bg-green-500", textKey: "strong" },
  ];

  const clamped = Math.min(Math.max(score, 1), 5);
  return levels[clamped - 1];
}
