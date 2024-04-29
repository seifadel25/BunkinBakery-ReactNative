import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session, loading } = useAuth();
  if (session) {
    return <Redirect href={"/(user)"} />;
  }
  return <Stack />;
}
