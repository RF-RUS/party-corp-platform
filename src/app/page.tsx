'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth'
import { LoginForm, RegisterForm } from '@/components/AuthForms'
import { Dashboard } from '@/components/Dashboard'

function AuthPage() {
  const [showRegister, setShowRegister] = useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (user) {
    return <Dashboard />
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Party Corp</h1>
        <p className="text-gray-600 text-center mb-8">
          AI-powered e-commerce optimization platform
        </p>
        
        {showRegister ? (
          <>
            <RegisterForm />
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setShowRegister(false)} className="text-blue-600 hover:underline">
                Sign in
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <button onClick={() => setShowRegister(true)} className="text-blue-600 hover:underline">
                Create one
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  )
}