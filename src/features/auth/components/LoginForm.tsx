'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePathname, useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/format'
import { useLogin, useRegister } from '@/lib/hooks/useAuth'

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z
      .boolean()
      .refine((v) => v === true, 'You must agree to the terms to continue'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type LoginFields = z.infer<typeof loginSchema>
type RegisterFields = z.infer<typeof registerSchema>

// ─── Shared field components ──────────────────────────────────────────────────

interface FieldProps {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}

function Field({ label, id, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-[12px] font-medium text-[#666666]">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[#EF4444] mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function Input({ hasError, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'sf-input h-12 px-4 text-sm',
        'placeholder:text-[#444444]',
        hasError
          ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
          : '',
        className
      )}
      {...props}
    />
  )
}

function PasswordInput({
  hasError,
  ...props
}: InputProps) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} hasError={hasError} {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
      </button>
    </div>
  )
}

// ─── Sign In form ─────────────────────────────────────────────────────────────

function SignInForm() {
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => login(data))}
      className="flex flex-col gap-4 px-0 py-6"
      noValidate
    >
      <Field label="Email Address" id="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          hasError={!!errors.email}
          autoComplete="email"
          {...register('email')}
        />
      </Field>

      <Field label="Password" id="password" error={errors.password?.message}>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          hasError={!!errors.password}
          autoComplete="current-password"
          {...register('password')}
        />
      </Field>

      <div className="flex items-center justify-end">
        <Link
          href="/auth/forget-password"
          className="text-xs text-[#F97316] hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isPending}
        rightIcon={!isPending ? <FaArrowRight size={13} /> : undefined}
      >
        SIGN IN
      </Button>
    </form>
  )
}

// ─── Sign Up form ─────────────────────────────────────────────────────────────

function SignUpForm() {
  const { mutate: register_, isPending } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  })

  return (
    <form
      onSubmit={handleSubmit((data) =>
        register_({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.password
        })
      )}
      className="flex flex-col gap-4 px-0 py-6"
      noValidate
    >
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name" id="firstName" error={errors.firstName?.message}>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            hasError={!!errors.firstName}
            autoComplete="given-name"
            {...register('firstName')}
          />
        </Field>
        <Field label="Last Name" id="lastName" error={errors.lastName?.message}>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            hasError={!!errors.lastName}
            autoComplete="family-name"
            {...register('lastName')}
          />
        </Field>
      </div>

      <Field label="Email Address" id="reg-email" error={errors.email?.message}>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          hasError={!!errors.email}
          autoComplete="email"
          {...register('email')}
        />
      </Field>

      <Field label="Password" id="reg-password" error={errors.password?.message}>
        <PasswordInput
          id="reg-password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          hasError={!!errors.password}
          autoComplete="new-password"
          {...register('password')}
        />
      </Field>

      <Field label="Confirm Password" id="confirmPassword" error={errors.confirmPassword?.message}>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter password"
          hasError={!!errors.confirmPassword}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
      </Field>

      {/* Terms checkbox */}
      <div className="flex gap-2.5 items-start">
        <input
          type="checkbox"
          id="agreeToTerms"
          className="mt-0.5 w-4 h-4 accent-[#F97316] cursor-pointer shrink-0"
          {...register('agreeToTerms')}
        />
        <div>
          <label htmlFor="agreeToTerms" className="text-xs text-[#666666] leading-relaxed cursor-pointer">
            I agree to ShopFresherz{' '}
            <Link href="/terms" className="text-[#F97316] hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#F97316] hover:underline font-medium">
              Privacy Policy
            </Link>
          </label>
          {errors.agreeToTerms && (
            <p className="text-xs text-[#EF4444] mt-0.5" role="alert">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isPending}
        rightIcon={!isPending ? <FaArrowRight size={13} /> : undefined}
      >
        SIGN UP
      </Button>
    </form>
  )
}

// ─── Main LoginForm ────────────────────────────────────────────────────────────

const LoginForm = () => {
  const path = usePathname()
  const router = useRouter()

  // Derive active tab from route — your original pattern, kept intact
  const isSignIn = path.endsWith('login')

  return (
    <div className="w-full max-w-[420px] px-6 py-4">

      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-2 rounded-[10px] border border-white/[0.08] bg-[#141414] p-1">
        <button
          onClick={() => router.push('/auth/login')}
          className={cn(
            'flex-1 flex items-center justify-center rounded-[8px] py-3 text-sm font-semibold transition-colors',
            isSignIn
              ? 'bg-[#242424] text-white'
              : 'text-[#666666] hover:text-white'
          )}
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/auth/register')}
          className={cn(
            'flex-1 flex items-center justify-center rounded-[8px] py-3 text-sm font-semibold transition-colors',
            !isSignIn
              ? 'bg-[#242424] text-white'
              : 'text-[#666666] hover:text-white'
          )}
        >
          Sign Up
        </button>
      </div>

      {/* Active form */}
      {isSignIn ? <SignInForm /> : <SignUpForm />}
    </div>
  )
}

export default LoginForm
