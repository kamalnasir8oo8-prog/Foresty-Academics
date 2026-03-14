import { Suspense } from "react";
import TeacherClient from "./TeacherClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TeacherClient />
    </Suspense>
  );
}
