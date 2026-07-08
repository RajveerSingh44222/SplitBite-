import { RouteNotFound } from "@/components/shared/route-not-found";

export default function NotFound() {
  return (
    <RouteNotFound
      title="This page doesn't exist"
      description="The link you followed might be broken, or the page may have moved."
    />
  );
}
