export function parseUserAgent(ua: string): string {
  if (!ua) return "Unknown device";

  const browserPatterns = [
    { pattern: /Edg\//, name: "Edge" },
    { pattern: /Chrome\//, name: "Chrome" },
    { pattern: /Firefox\//, name: "Firefox" },
    { pattern: /Safari\//, name: "Safari" },
    { pattern: /Opera|OPR\//, name: "Opera" },
  ];

  const osPatterns = [
    { pattern: /Windows/, name: "Windows" },
    { pattern: /Mac OS X/, name: "macOS" },
    { pattern: /Linux/, name: "Linux" },
    { pattern: /Android/, name: "Android" },
    { pattern: /iPhone|iPad/, name: "iOS" },
  ];

  let browser = "Unknown browser";
  for (const { pattern, name } of browserPatterns) {
    if (pattern.test(ua)) {
      browser = name;
      break;
    }
  }

  let os = "Unknown OS";
  for (const { pattern, name } of osPatterns) {
    if (pattern.test(ua)) {
      os = name;
      break;
    }
  }

  return `${os} · ${browser}`;
}
