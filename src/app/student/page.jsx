import { Suspense } from "react";
import StudentClient from "./StudentClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StudentClient />
    </Suspense>
  );
}
