export default async function getCircuitFiles(size: number, minValue: number) {
  const files: Record<string, string> = {};
  files[`/circuits/${size}.ts`] = "";

  for (const path of Object.keys(files)) {
    const response = await fetch(path);
    let code = await response.text();
    code = code.replace("$1", minValue.toString());
    files[path] = code;
  }

  return files;
}