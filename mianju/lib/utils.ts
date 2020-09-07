// This file contains some really strange contortions to validate the
// environment variables. There's probably a better way.

const instanceEnvNames = ["production", "dev"] as const

export type InstanceEnv = typeof instanceEnvNames[number]

const isValidEnvVar = <T extends string>(possibleValues: T[], candidate: T | string): candidate is T => {
  const possibleValuesStrs: string[] = possibleValues.slice()
  return possibleValuesStrs.includes(candidate)
}

const getEnv = (): InstanceEnv => {
  // console.log('process.env', process.env) //
  const instanceEnv = process.env.NEXT_PUBLIC_ENV
  if (!instanceEnv) {
    throw new Error("Could not find instance environment variable: 'NEXT_PUBLIC_ENV'")
  }
  if (!isValidEnvVar(instanceEnvNames.slice(), instanceEnv)) {
    throw new Error(`Invalid instance environment variable NEXT_PUBLIC_ENV, wanted: ${instanceEnvNames}, got: ${instanceEnv}`)
  }
  return instanceEnv
}

export const ENV = getEnv()
