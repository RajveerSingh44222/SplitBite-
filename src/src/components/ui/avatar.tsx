import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function Avatar({ src, name, size = 40, className, ring }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-surface-muted flex items-center justify-center font-semibold text-ink-soft",
        ring && "ring-2 ring-surface",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" unoptimized />
      ) : (
        initials(name)
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string; avatar: string }[];
  max?: number;
  size?: number;
}

export function AvatarGroup({ users, max = 4, size = 32 }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((u, i) => (
        <div key={u.name + i} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
          <Avatar src={u.avatar} name={u.name} size={size} ring />
        </div>
      ))}
      {rest > 0 && (
        <div
          style={{ marginLeft: -size * 0.32, width: size, height: size, fontSize: size * 0.32 }}
          className="relative flex shrink-0 items-center justify-center rounded-full bg-ink text-paper font-semibold ring-2 ring-surface"
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
