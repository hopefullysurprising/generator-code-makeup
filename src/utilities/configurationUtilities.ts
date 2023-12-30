import os from 'os';
import path from 'path';
import fs from 'fs';
import Generator from 'yeoman-generator';

import { logInfoMessage } from './loggingUtilities';
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
): Promise<ConfigurationValueType>  {
  const promptResult = await generator.prompt({
    type: promptSettings.promptType,
    name,
    message: promptSettings.promptMessage,
    choices: promptSettings.promptType === ConfigurationValuePromptType.LIST
      ? promptSettings.choices
      : undefined,
  });
  return promptResult[name];
}

async function getProfileConfigurationValue(
  generator: Generator,
  configurationKey: ConfigurationKey,
  promptSettings: PromptConfigurationSettings,
): Promise<ConfigurationValueType> {
  const currentProfileConfiguration = getGeneratorSystemConfiguration(generator);
  if (currentProfileConfiguration[configurationKey]) {
    return currentProfileConfiguration[configurationKey];
  }

  const promptResult = await getPromptValue(generator, configurationKey, promptSettings);

  currentProfileConfiguration[configurationKey] = promptResult;
  writeGeneratorSystemConfiguration(currentProfileConfiguration);

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
  const currentConfig = generator.config.get(configurationKey) as ConfigurationValueType;
  if (currentConfig) {
    return currentConfig;
  }

  const promptResult = await getPromptValue(generator, configurationKey, promptSettings);
  generator.config.set(configurationKey, promptResult);
  
  return promptResult;
}

type SystemConfigurationType = { [key: string]: string | number | boolean };

const PROFILES_FOLDER = '.code_generator_profiles';
const DEFAULT_PROFILE_NAME = 'default.json';
function getGeneratorSystemConfiguration(generator: Generator): SystemConfigurationType {
  const homeDirectory = os.homedir();

  const profilesFolderPath = path.join(homeDirectory, PROFILES_FOLDER);
  if (!fs.existsSync(profilesFolderPath) || !fs.lstatSync(profilesFolderPath).isDirectory()) {
    fs.mkdirSync(profilesFolderPath);
  }

  const defaultProfilePath = path.join(profilesFolderPath, DEFAULT_PROFILE_NAME);
  if (!fs.existsSync(defaultProfilePath) || !fs.lstatSync(defaultProfilePath).isFile()) {
    fs.writeFileSync(defaultProfilePath, '{}');
    logInfoMessage(generator, `
      Created ${defaultProfilePath} for storing system-wide configuration.
      Please, enable backup of this file in your backup software for smooth update experience.
    `);
  }

  const fileContent = fs.readFileSync(defaultProfilePath, 'utf8');
  return JSON.parse(fileContent);
}

function writeGeneratorSystemConfiguration(
  newValue: SystemConfigurationType,
) {
  const homeDirectory = os.homedir();
  const profilesFolderPath = path.join(homeDirectory, PROFILES_FOLDER);
  const defaultProfilePath = path.join(profilesFolderPath, DEFAULT_PROFILE_NAME);
  fs.writeFileSync(defaultProfilePath, JSON.stringify(newValue));
}
