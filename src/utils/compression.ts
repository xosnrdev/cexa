import { gzip, constants, gunzip } from "zlib";
import { LRUCache } from "lru-cache";

interface CacheOptions {
  max: number;
  maxAge: number;
}

const cacheOptions: CacheOptions = {
  max: 500,
  maxAge: 1000 * 60 * 5,
};

/**
 * Class representing a payload compressor.
 */
class PayloadCompressor {
  private compressedDataCache: LRUCache<string, Buffer>;

  /**
   * Create a PayloadCompressor.
   * @param options - The options for the cache.
   */
  constructor(options: CacheOptions) {
    this.compressedDataCache = new LRUCache<string, Buffer>(options);
  }

  /**
   * Compresses the payload data.
   * @param inputData - The input data to compress.
   * @param compressionLevel - The compression level (optional, defaults to Z_DEFAULT_COMPRESSION).
   * @returns A promise that resolves with the compressed data as a Buffer.
   * @throws An error if compression fails.
   */
  async compressPayload(
    inputData: string,
    compressionLevel: number = constants.Z_DEFAULT_COMPRESSION
  ): Promise<Buffer> {
    const cachedData = this.compressedDataCache.get(inputData);
    if (cachedData) {
      return cachedData;
    }

    const compressedData = await new Promise<Buffer>((resolve, reject) => {
      gzip(inputData, { level: compressionLevel }, (error, result) => {
        if (error) {
          reject(new Error("Compression failed"));
        } else {
          this.compressedDataCache.set(inputData, result);
          resolve(result);
        }
      });
    });

    return compressedData;
  }

  /**
   * Decompresses the payload data.
   * @param compressedData - The compressed data to decompress.
   * @returns A promise that resolves with the decompressed data as a string.
   * @throws An error if the compressed data is missing or invalid.
   */
  async decompressPayload(
    compressedData: Buffer | undefined | null | string
  ): Promise<string> {
    if (!compressedData) {
      throw new Error("Compressed data is missing");
    }

    if (
      typeof compressedData !== "string" &&
      !Buffer.isBuffer(compressedData)
    ) {
      throw new Error("Invalid compressed data type");
    }

    const bufferData =
      typeof compressedData === "string"
        ? Buffer.from(compressedData, "base64")
        : compressedData;

    const decompressedData = await new Promise<string>((resolve, reject) => {
      gunzip(bufferData, (error, decompressedData) => {
        if (error) {
          reject(new Error("Decompression failed"));
        } else {
          resolve(decompressedData.toString());
        }
      });
    });

    return decompressedData;
  }
}

export default new PayloadCompressor(cacheOptions);
