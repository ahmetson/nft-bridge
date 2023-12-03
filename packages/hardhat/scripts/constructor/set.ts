import fs from "fs";

export function saveConstructorArgs(networkName: string, contractName: string, params: any) {
  const path = `scripts/constructor/${networkName.toLowerCase()}_${contractName.toLowerCase()}.ts`;
  const code = `export default ${JSON.stringify(params, null, 2)}`;

  fs.writeFileSync(path, code);
}
