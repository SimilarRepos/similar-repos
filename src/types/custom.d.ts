declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.css' {
  const value: string
  export default value
}

declare module '*.css?inline' {
  const value: string
  export default value
}

interface ImportMetaEnv {
  readonly WXT_GA_API_SECRET: string
  readonly WXT_GA_MEASUREMENT_ID: string
}
