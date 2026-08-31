'use client';import { AuthProvider } from '@/components/auth-context';export default function Providers({children}:{children:React.ReactNode}){return <AuthProvider>{children}</AuthProvider>}
