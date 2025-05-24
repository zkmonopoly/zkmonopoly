export default async function getCircuitFiles(size: number) {
  const files: Record<string, string> = {};
  files[`/circuits/${size}.ts`] = "";

  for (const path of Object.keys(files)) {
    const response = await fetch(path);
    const code = await response.text();
    files[path] = code;
  }

  return files;
}