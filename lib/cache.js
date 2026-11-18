import { revalidatePath, revalidateTag } from 'next/cache'

export const PLATFORM_DATA_TAG = 'platform-data'

export function revalidatePlatformData() {
  try {
    revalidateTag(PLATFORM_DATA_TAG)
    revalidatePath('/', 'layout')
  } catch (err) {
    console.error('[Cache] Revalidation skipped:', err?.message || err)
  }
}
