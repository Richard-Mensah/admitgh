// lib/paystack.ts
// Paystack API helpers — MoMo payment initiation and webhook verification

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_BASE_URL = "https://api.paystack.co"

/** Price in kobo (Paystack uses smallest currency unit: 1 GHS = 100 pesewas) */
export const PRICE_PESEWAS = 1500 // GHS 15.00

type PaystackInitResponse = {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

/**
 * Initiate a Paystack transaction for MoMo payment.
 * Returns the hosted checkout URL to redirect the student to.
 */
export async function initiatePayment(params: {
  email: string
  checkId: string
  callbackUrl: string
}): Promise<{ authorization_url: string; reference: string }> {
  const reference = `admitgh_${params.checkId}_${Date.now()}`

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: PRICE_PESEWAS,
      reference,
      callback_url: params.callbackUrl,
      metadata: {
        checkId: params.checkId,
        custom_fields: [
          {
            display_name: "Check ID",
            variable_name: "check_id",
            value: params.checkId,
          },
        ],
      },
      channels: ["mobile_money"], // MTN MoMo, AirtelTigo, Telecel
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Paystack initiation failed: ${error}`)
  }

  const data: PaystackInitResponse = await response.json()

  if (!data.status) {
    throw new Error(`Paystack error: ${data.message}`)
  }

  return {
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  }
}

/**
 * Verify a Paystack transaction by reference.
 * Used in the webhook handler and as a fallback verification.
 */
export async function verifyPayment(reference: string): Promise<{
  success: boolean
  checkId: string | null
}> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  )

  if (!response.ok) {
    return { success: false, checkId: null }
  }

  const data = await response.json()

  if (data.status && data.data?.status === "success") {
    const checkId = data.data?.metadata?.checkId ?? null
    return { success: true, checkId }
  }

  return { success: false, checkId: null }
}

/**
 * Verify Paystack webhook signature.
 * Paystack signs webhooks with HMAC-SHA512 using the secret key.
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(PAYSTACK_SECRET)
  const msgData = encoder.encode(body)

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  )

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData)
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return expectedSignature === signature
}
