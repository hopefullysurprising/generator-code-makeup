import Generator, { Storage } from 'yeoman-generator';

import {
  ConfigurationKey,
  CONFIGURATION_KEYS_INFO,
  ConfigurationStorageType,
  ConfigurationValuePromptType,
  PromptConfigurationSettings,
  PackageJsonStorageConfigurationSettings,
} from './configurationKeys';

type ConfigurationValueType = string | number | boolean;

// This system doesn't support configuration values as objects: every string key has a single string value.
// Hence, it might be needed to store 'author.email' and 'author.name' separately.
export async function getConfigurationValue(
  generator: Generator,
  configurationKey: ConfigurationKey,
): Promise<ConfigurationValueType> {
  const configurationValueSettings = CONFIGURATION_KEYS_INFO[configurationKey];

  switch (configurationValueSettings.storageType) {
    case ConfigurationStorageType.NONE:
      return await getPromptValue(
        generator,
        configurationKey,
        configurationValueSettings,
      );
    case ConfigurationStorageType.PROFILE:
      return await getProfileConfigurationValue(
        generator,
        configurationKey,
        configurationValueSettings,
      );
    case ConfigurationStorageType.PACKAGE_JSON:
      return await getPackageJsonConfigurationValue(
        generator,
        configurationKey,
        configurationValueSettings,
      );
    case ConfigurationStorageType.PROJECT:
      return await getProjectConfigurationValue(
        generator,
        configurationKey,
        configurationValueSettings,
      );
  }
}

async function getPromptValue(
  generator: Generator,
  name: string, // Required for proper test execution (need to pass differently named defaults)
  promptSettings: PromptConfigurationSettings,
  storage?: Storage,
): Promise<ConfigurationValueType>  {
  const promptResult = await generator.prompt(
    {
      type: promptSettings.promptType,
      name,
      message: promptSettings.promptMessage,
      choices: promptSettings.promptType === ConfigurationValuePromptType.LIST
        ? promptSettings.choices
        : undefined,
    },
    storage,
  );
  return promptResult[name];
}

async function getProfileConfigurationValue(
  generator: Generator,
  configurationKey: ConfigurationKey,
  promptSettings: PromptConfigurationSettings,
): Promise<ConfigurationValueType> {
  const promptResult = await getPromptValue(
    generator,
    configurationKey,
    promptSettings,
    generator._globalConfig,
  );
  return promptResult;
}

async function getPackageJsonConfigurationValue(
  generator: Generator,
  configurationKey: ConfigurationKey,
  settings: PromptConfigurationSettings & PackageJsonStorageConfigurationSettings,
): Promise<ConfigurationValueType> {
  const currentPackageJsonValue = generator.packageJson.get(settings.packageJsonKeyPath);
  if (currentPackageJsonValue) {
    return currentPackageJsonValue as ConfigurationValueType;
  }

  const promptResult = await getPromptValue(generator, configurationKey, settings);
  return promptResult;
}

async function getProjectConfigurationValue(
  generator: Generator,
  configurationKey: ConfigurationKey,
  promptSettings: PromptConfigurationSettings,
): Promise<ConfigurationValueType> {
  const promptResult = await getPromptValue(
    generator,
    configurationKey,
    promptSettings,
    generator.config,
  );
  return promptResult;
}
