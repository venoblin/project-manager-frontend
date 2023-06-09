/// <reference types="react-scripts" />
import { PropsWithChildren, ReactNode } from "react"

interface Payload {
  email: string,
  password: string
}

interface UiProps extends PropsWithChildren {
  className?: string
}