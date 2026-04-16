/**
 * Placeholder for SMS / push / email to donors when a new blood request is filed.
 * Wire to your provider (e.g. Twilio, FCM) here.
 */
export async function notifyMatchingDonorsForRequest(
  requestId: string,
  matchingDonorCount: number,
): Promise<void> {
  console.log(
    `[blood] notify placeholder: request ${requestId} would reach ${matchingDonorCount} donor(s)`,
  );
}
