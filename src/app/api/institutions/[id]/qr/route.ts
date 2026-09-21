import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notFoundError, handleApiError } from '@/lib/errors'
import QRCode from 'qrcode'

// GET /api/institutions/[id]/qr - Generates high-res PNG or SVG QR code pointing to /register/[code]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const institution = await prisma.institution.findUnique({
      where: { id },
      select: { id: true, name: true, registrationCode: true },
    })

    if (!institution) {
      return notFoundError('Institution not found')
    }

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const registrationUrl = `${protocol}://${host}/register/${institution.registrationCode}`

    const qrDataUrl = await QRCode.toDataURL(registrationUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#4F46E5', // Platform primary indigo
        light: '#FFFFFF',
      },
    })

    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '')
    const imgBuffer = Buffer.from(base64Data, 'base64')

    return new NextResponse(imgBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="qr-${institution.registrationCode}.png"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
