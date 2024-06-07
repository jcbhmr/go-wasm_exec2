import { gunzipSync } from "tinyfflate";

/** @param {Uint8Array} compressed */
export default async function gunzip(compressed: Uint8Array) {
  if (globalThis.DecompressionStream) {
    const chunks: Uint8Array[] = [];
    await new ReadableStream({
      start(controller) {
        controller.enqueue(compressed);
        controller.close();
      },
    })
      .pipeThrough(new DecompressionStream("gzip"))
      .pipeTo(
        new WritableStream({
          write(chunk, controller) {
            chunks.push(chunk);
          },
        }),
      );
    const result = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.length, 0),
    );
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return result;
  } else {
    return gunzipSync(compressed);
  }
}
