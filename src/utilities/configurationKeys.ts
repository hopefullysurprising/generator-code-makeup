import { CodeDistributionType } from "../constants/projectWideInformation";

// Configuration keys should not use "." character in their names
// because it will be treated as a path separator in the configuration file.
export enum ConfigurationKey {
  // Profile configuration keys.
  AUTHOR_NAME = 'author_name',
  AUTHOR_EMAIL = 'author_email',
  AUTHOR_URL = 'author_url',

  // Project configuration keys.
  CODE_DISTRIBUTION_TYPE = 'code_distribution_type',

  // Package.json configuration keys.
  PACKAGE_NAME = 'package_name',
}

export enum ConfigurationStorageType {
  PROFILE = 'profile',
  PROJECT = 'project',
  PACKAGE_JSON = 'packageJson',
  NONE = 'none',
}

interface ProfileStorageConfigurationSettings {
  storageType: ConfigurationStorageType.PROFILE;
}
interface ProjectStorageConfigurationSettings {
  storageType: ConfigurationStorageType.PROJECT;
}
export interface PackageJsonStorageConfigurationSettings {
  storageType: ConfigurationStorageType.PACKAGE_JSON;
  packageJsonKeyPath: string;
}
interface NoneStorageConfigurationSettings {
  storageType: ConfigurationStorageType.NONE;
}

export type StorageConfigurationSettings = 
  | ProfileStorageConfigurationSettings
  | ProjectStorageConfigurationSettings
  | PackageJsonStorageConfigurationSettings
  | NoneStorageConfigurationSettings;

export enum ConfigurationValuePromptType {
  INPUT = 'input',
  LIST = 'list',
}

interface PromptConfigurationValueSettings {
  promptMessage: string;
}
interface InputConfigurationSettings extends PromptConfigurationValueSettings {
  promptType: ConfigurationValuePromptType.INPUT;
}
interface ListConfigurationSettings extends PromptConfigurationValueSettings {
  promptType: ConfigurationValuePromptType.LIST;
  choices: { name: string; value: string; }[];
}

export type PromptConfigurationSettings =
  | InputConfigurationSettings
  | ListConfigurationSettings;

type ConfigurationValueSettings = StorageConfigurationSettings & PromptConfigurationSettings;

export const CONFIGURATION_KEYS_INFO: Record<ConfigurationKey, ConfigurationValueSettings> = {
  // Profile configuration keys.
  [ConfigurationKey.AUTHOR_NAME]: {
    promptType: ConfigurationValuePromptType.INPUT,
    promptMessage: 'Input your name for \'author.name\' field',
    storageType: ConfigurationStorageType.PROFILE,
  },
  [ConfigurationKey.AUTHOR_EMAIL]: {
    promptType: ConfigurationValuePromptType.INPUT,
    promptMessage: 'Input your email for \'author.email\' field',
    storageType: ConfigurationStorageType.PROFILE,
  },
  [ConfigurationKey.AUTHOR_URL]: {
    promptType: ConfigurationValuePromptType.INPUT,
    promptMessage: 'Input your URL for \'author.url\' field',
    storageType: ConfigurationStorageType.PROFILE,
  },

  // Project configuration keys.
  [ConfigurationKey.CODE_DISTRIBUTION_TYPE]: {
    promptType: ConfigurationValuePromptType.LIST,
    promptMessage: 'What is the code distribution type for this project?',
    storageType: ConfigurationStorageType.PROJECT,
    choices: [
      {
        name: 'Open source',
        value: CodeDistributionType.OPEN_SOURCE,
      },
      {
        name: 'Proprietary',
        value: CodeDistributionType.PROPRIETARY,
      },
    ],
  },

  // Package.json configuration keys.
  [ConfigurationKey.PACKAGE_NAME]: {
    promptType: ConfigurationValuePromptType.INPUT,
    promptMessage: 'Input your project name',
    storageType: ConfigurationStorageType.PACKAGE_JSON,
    packageJsonKeyPath: 'name',
  },
};
