"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [invite, setInvite] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    const value = invite.trim();

    if (!value) return;

    // Extract code from full URL or use the entered text directly
    const code = value.includes("/")
      ? value.substring(value.lastIndexOf("/") + 1)
      : value;

    router.push(`/join/${code}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Join an Event</h1>

        <p className="text-gray-500 mb-6">
          Paste your invite link or enter the invite code.
        </p>

        <input
          type="text"
          placeholder="https://splitbite.app/join/ABC123 or ABC123"
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button
          onClick={handleJoin}
          className="w-full rounded-lg bg-black text-white p-3"
        >
          Join Event
        </button>
      </div>
    </main>
  );
}