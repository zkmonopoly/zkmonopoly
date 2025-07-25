import * as summon from 'summon-ts';
import { Protocol } from 'mpc-framework';
import { EmpWasmEngine } from 'emp-wasm-engine';
import getCircuitFiles from './circuit';

export default async function generateProtocol(size: number, minValue: number) {
  await summon.init();

  const { circuit } = summon.compile({
    path: `/circuits/${size}.ts`,
    boolifyWidth: 16,
    files: await getCircuitFiles(size, minValue)
  });

  return new Protocol(circuit, new EmpWasmEngine());
}