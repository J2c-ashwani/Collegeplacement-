// Storage Service — abstraction over S3-compatible object storage
// Supports: AWS S3, Cloudflare R2, MinIO, or local filesystem for development

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'

export interface StorageService {
  getUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>
  getDownloadUrl(key: string, expiresIn?: number): Promise<string>
  deleteFile(key: string): Promise<void>
  uploadFile(key: string, buffer: Buffer, contentType: string): Promise<void>
}

// Generate a unique storage key for a file
export function generateStorageKey(
  entityType: string,
  entityId: string,
  filename: string
): string {
  const ext = path.extname(filename).toLowerCase()
  const uniqueId = crypto.randomUUID()
  return `${entityType}/${entityId}/${uniqueId}${ext}`
}

// Validate file before upload
export function validateFile(
  file: { type: string; size: number; name: string }
): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` }
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])) {
    return { valid: false, error: `File type ${file.type} is not allowed` }
  }

  return { valid: true }
}

// S3-compatible storage implementation
class S3StorageService implements StorageService {
  private client: S3Client
  private bucket: string

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET || 'placementconnect-documents'
    this.client = new S3Client({
      region: process.env.STORAGE_REGION || 'us-east-1',
      endpoint: process.env.STORAGE_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
        secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
      },
      forcePathStyle: true, // Required for MinIO
    })
  }

  async getUploadUrl(key: string, contentType: string, expiresIn = 300): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    })
    return getSignedUrl(this.client, command, { expiresIn })
  }

  async getDownloadUrl(key: string, expiresIn = 60): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    return getSignedUrl(this.client, command, { expiresIn })
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    await this.client.send(command)
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
    await this.client.send(command)
  }
}

// Local filesystem storage for development
class LocalStorageService implements StorageService {
  private basePath: string

  constructor() {
    this.basePath = path.join(process.cwd(), '.storage')
  }

  async getUploadUrl(key: string): Promise<string> {
    // For local dev, return an API endpoint that handles the upload
    return `/api/documents/upload?key=${encodeURIComponent(key)}`
  }

  async getDownloadUrl(key: string): Promise<string> {
    return `/api/documents/download?key=${encodeURIComponent(key)}`
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key)
    try {
      await fs.unlink(filePath)
    } catch {
      // File may not exist
    }
  }

  async uploadFile(key: string, buffer: Buffer): Promise<void> {
    const filePath = path.join(this.basePath, key)
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, buffer)
  }
}

// Factory
let storageInstance: StorageService | null = null

export function getStorageService(): StorageService {
  if (!storageInstance) {
    const provider = process.env.STORAGE_PROVIDER || 'local'
    storageInstance = provider === 'local' ? new LocalStorageService() : new S3StorageService()
  }
  return storageInstance
}
