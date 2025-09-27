import { Stack } from 'expo-router'

export default function ProtectdLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
  
}