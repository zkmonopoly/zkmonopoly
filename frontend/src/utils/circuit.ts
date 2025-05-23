export default async function getCircuitFiles() {
  const files: Record<string, string> = {
    "/circuits/main.ts": ""
  };

  for (const path of Object.keys(files)) {
    const response = await fetch(path);
    const code = await response.text();
    files[path] = code;
  }

  return files;
}