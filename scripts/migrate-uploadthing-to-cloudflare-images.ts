import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import legacyCatalog from "~/data/gallery/legacy-uploadthing-catalog.json";
import {
  type LegacyUploadThingPhoto,
  type MigrationResult,
  buildManifest,
  buildR2Key,
  buildStableSlug,
  getUploadThingSourceUrl,
} from "./migration-helpers";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType };
}

async function uploadWithRetry(
  s3: S3Client,
  bucket: string,
  photo: LegacyUploadThingPhoto,
): Promise<MigrationResult> {
  const sourceUrl = getUploadThingSourceUrl(photo.uploadThingKey);
  const slug = buildStableSlug(photo.collection, photo.name);
  const r2Key = buildR2Key(photo.collection, slug);
  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { buffer, contentType } = await downloadImage(sourceUrl);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: r2Key,
          Body: buffer,
          ContentType: contentType,
        }),
      );

      return {
        collection: photo.collection,
        name: photo.name,
        uploadThingKey: photo.uploadThingKey,
        sourceUrl,
        r2Key,
        success: true,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  return {
    collection: photo.collection,
    name: photo.name,
    uploadThingKey: photo.uploadThingKey,
    sourceUrl,
    r2Key,
    success: false,
    error: lastError,
  };
}

async function run(): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    console.error(
      "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME",
    );
    process.exit(1);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const photos = legacyCatalog as LegacyUploadThingPhoto[];
  const results: MigrationResult[] = [];

  for (const photo of photos) {
    const result = await uploadWithRetry(s3, bucket, photo);
    results.push(result);

    if (result.success) {
      console.log(`Uploaded ${photo.name} -> ${result.r2Key}`);
    } else {
      console.error(`Failed ${photo.name}: ${result.error}`);
    }
  }

  const failedResults = results.filter((result) => !result.success);
  const manifest = buildManifest(photos, results);

  const projectRoot = resolve(import.meta.dir, "..");
  const reportDir = resolve(projectRoot, "scripts/migration-reports");
  mkdirSync(reportDir, { recursive: true });

  const reportPath = resolve(reportDir, `r2-migration-${Date.now()}.json`);
  const catalogPath = resolve(projectRoot, "src/data/gallery/photo-catalog.json");

  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totals: {
          attempted: photos.length,
          succeeded: results.length - failedResults.length,
          failed: failedResults.length,
        },
        bucket,
        results,
      },
      null,
      2,
    ),
  );

  if (failedResults.length > 0) {
    console.error(`Migration failed for ${failedResults.length} image(s). See ${reportPath}`);
    process.exit(1);
  }

  writeFileSync(catalogPath, JSON.stringify(manifest, null, 2));
  console.log(`Migration completed for ${manifest.length} image(s).`);
  console.log(`Updated catalog: ${catalogPath}`);
  console.log(`Report written: ${reportPath}`);
}

if (import.meta.main) {
  run();
}
