"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/event-store";
import { useUIStore } from "@/store/ui-store";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROUTES } from "@/constants";

export function LeaveEventModal({
  open,
  onClose,
  eventId,
  eventName,
}: {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const removeParticipant = useEventStore((s) => s.removeParticipant);
  const pushActivity = useEventStore((s) => s.pushActivity);
  const showToast = useUIStore((s) => s.showToast);
  const [leaving, setLeaving] = useState(false);

  function handleConfirm() {
    setLeaving(true);
    setTimeout(() => {
      removeParticipant(eventId, currentUser.id);
      pushActivity(eventId, {
        type: "left",
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar,
        message: "left the event",
        timestamp: new Date().toISOString(),
      });
      setLeaving(false);
      showToast({ title: `You left ${eventName}`, kind: "info" });
      router.push(ROUTES.dashboard);
    }, 500);
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-chili-light text-chili">
          <LogOut className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold">Leave this event?</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          You&apos;ll lose your spot in <span className="font-semibold text-foreground">{eventName}</span> and any
          order you&apos;ve started here. You can rejoin later with a fresh invite link.
        </p>
        <div className="mt-6 flex gap-2.5">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Stay
          </Button>
          <Button variant="destructive" className="flex-1" loading={leaving} onClick={handleConfirm}>
            Leave event
          </Button>
        </div>
      </div>
    </Modal>
  );
}
