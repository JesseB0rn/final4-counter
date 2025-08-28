export function useOPFS() {
  // Store a file in OPFS and return its filename
  const saveFile = async (file: File): Promise<string> => {
    if (!("showDirectoryPicker" in window)) {
      throw new Error("File System Access API not supported");
    }
    // Get the OPFS root directory
    // @ts-ignore
    const root = await navigator.storage.getDirectory();
    const handle = await root.getFileHandle(file.name, { create: true });
    const writable = await handle.createWritable();
    await writable.write(file);
    await writable.close();
    return file.name;
  };

  // Read a file from OPFS by filename
  const readFile = async (filename: string): Promise<Blob | null> => {
    // @ts-ignore
    const root = await navigator.storage.getDirectory();
    try {
      const handle = await root.getFileHandle(filename);
      const file = await handle.getFile();
      return file;
    } catch (e) {
      return null;
    }
  };

  return { saveFile, readFile };
}
