import { EventType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type TrackEventInput = {
  nurseryId: string;
  userId?: string;
  type: EventType;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export async function trackEvent({ nurseryId, userId, type, metadata }: TrackEventInput) {
  await prisma.event.create({
    data: {
      nurseryId,
      userId,
      type,
      metadataJson: metadata ? JSON.stringify(metadata) : null
    }
  });
}
