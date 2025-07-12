import { Color3 } from '@babylonjs/core'
import { persistentAtom } from '@nanostores/persistent'

export type SettingsValue = {
  lightColor: Color3,
  lightIntensity: number
}

export const SettingsValueDefault: SettingsValue = {
  lightColor: new Color3(1.0, 0.95, 0.8),
  lightIntensity: 1.2
}

export const $settings = persistentAtom<SettingsValue>('settings:', SettingsValueDefault, {
  encode: JSON.stringify,
  decode: JSON.parse,
});