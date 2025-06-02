'use client'

import { Button } from '@/components/button'
import { TextField } from '@/components/textfield'
import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { toast } = useToast()
  const router = useRouter() // may be null or a NextRouter instance

  const [isLogin, setIsLogin] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [userError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    if (username === '') {
      setUsernameError('Please enter a username')
      return
    } else {
      setUsernameError('')
    }
    if (password === '') {
      setPasswordError('Please enter a password')
      return
    } else {
      setPasswordError('')
    }
    e.preventDefault()
    if (isLogin) {
      const response = await fetch('http://localhost:3002/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password }),
      })
      const data = await response.json()
      if (data.error) {
        setUsernameError(data.error)
        return
      } else {
        localStorage.setItem('chain-tracing:account', username)
        toast({
          title: 'Login successful',
          description: 'We are redirecting you to the main page',
        })
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } else {
      const response = await fetch('http://localhost:3002/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password }),
      })
      const data = await response.json()
      if (data.error) {
        setUsernameError(data.error)
        return
      } else {
        localStorage.setItem('chain-tracing:account', username)
        toast({
          title: 'Account created',
          description: 'We are redirecting you to the main page',
        })
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }
  }
  return (
    <div className="w-full flex items-center justify-center pt-20">
      <div className="w-full max-w-md p-8 text-center rounded-2xl border ">
        <h1 className="text-label-xl-sec font-bold mb-6 font-sans">Chain Tracing</h1>
        <h2 className="text-label-sm-sec font-semibold mb-4">
          {isLogin ? 'Login to Chain Tracing' : 'Create an account'}
        </h2>
        <div className="space-y-4">
          <TextField
            label="Name"
            value={username}
            isError={!!userError}
            hintText={userError}
            required={true}
            cls={{ label: 'text-label-sm-pri' }}
            placeholder="Enter your name"
            onChange={(e) => setUsername(e)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            isError={!!passwordError}
            hintText={passwordError}
            required={true}
            cls={{ label: 'text-label-sm-pri' }}
            onChange={(e) => setPassword(e)}
          />

          <Button variant="secondary" onClick={handleSubmit} isFullWidth={true}>
            {isLogin ? 'Continue' : 'Create Account'}
          </Button>
        </div>
        <p className="mt-6 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`ml-1 ${isLogin ? 'text-blue-600' : 'text-green-600'} hover:underline`}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
