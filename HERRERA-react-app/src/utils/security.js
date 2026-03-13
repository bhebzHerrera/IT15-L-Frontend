export function sanitizeTextInput(value) {
  return value.replace(/[<>`"'\\]/g, "").trim();
}

export function sanitizeEmailInput(value) {
  return sanitizeTextInput(value).toLowerCase();
}
