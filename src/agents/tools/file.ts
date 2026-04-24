import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

interface FileReadParams {
  filepath: string;
}

interface FileWriteParams {
  filepath: string;
  content: string;
}

interface FileReadResult {
  content: string;
  filepath: string;
}

interface FileWriteResult {
  success: boolean;
  filepath: string;
}

export async function fileRead(params: FileReadParams): Promise<FileReadResult> {
  const { filepath } = params;
  const resolvedPath = resolve(filepath);
  const content = await readFile(resolvedPath, 'utf-8');
  return { content, filepath: resolvedPath };
}

export async function fileWrite(params: FileWriteParams): Promise<FileWriteResult> {
  const { filepath, content } = params;
  const resolvedPath = resolve(filepath);
  await writeFile(resolvedPath, content, 'utf-8');
  return { success: true, filepath: resolvedPath };
}

export type { FileReadParams, FileWriteParams, FileReadResult, FileWriteResult };