import AppClient from "@/components/AppClient";

// NOTE:
// Our ear_outline.svg has this viewBox. If you replace the SVG, update this.
const VIEW_BOX = "0 0 744.09 1052.4";

export default function Page() {
  return <AppClient viewBox={VIEW_BOX} />;
}
