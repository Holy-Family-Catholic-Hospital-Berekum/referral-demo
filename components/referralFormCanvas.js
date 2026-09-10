const FORM_WIDTH = 1600;
const FORM_HEIGHT = 1067;

function fontFor(value, maxWidth, cursive) {
  const family = cursive
    ? '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive'
    : "Arial, sans-serif";
  const weight = cursive ? "bold" : "";
  const sizes = cursive ? [48, 44, 40, 36, 32, 28] : [31];
  const measureContext = document.createElement("canvas").getContext("2d");
  for (const size of sizes) {
    const font = `${weight} ${size}px ${family}`.trim();
    measureContext.font = font;
    if (measureContext.measureText(value).width <= maxWidth) return font;
  }
  return `${weight} ${sizes[sizes.length - 1]}px ${family}`.trim();
}

function formatDate(value) {
  if (!value) return "";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB");
}

function safeFileName(value) {
  return (
    String(value || "referral")
      .trim()
      .replace(/[<>:"/\\|?*]+/g, " ")
      .replace(/\s+/g, " ") || "referral"
  );
}
