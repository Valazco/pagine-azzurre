import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    infuraUrl: process.env.NEXT_PUBLIC_INFURA_URL || '',
    networkId: parseInt(process.env.WEB3_NETWORK_ID || '5', 10),
  });
}
