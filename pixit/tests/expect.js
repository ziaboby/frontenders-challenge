export function expectForNoObjects(description, output, expected) {
  if (output == expected) {
    console.log("[SUCCEED]", description);
  } else
    console.error(
      "[FAILED]",
      description,
      `expected: ${expected}, but received: ${output}`
    );
}
