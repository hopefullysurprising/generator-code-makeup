import os from 'os';
import path from 'path';
import Generator from 'yeoman-generator';

import { DEFAULT_PROFILE_NAME, PROFILES_FOLDER } from '@/constants/systemDefaults';
import { logInfoMessage } from '@/utilities/loggingUtilities';

type SystemConfigurationType = { [key: string]: string | number | boolean };

function getProfilePath(generator?: Generator): string {
  if (generator) {
    const specialProfilePath = generator.config.get('specialProfilePath');
    if (specialProfilePath && typeof specialProfilePath === 'string') {
      return specialProfilePath;
    }
  }

  const homeDirectory = os.homedir();
  const profilesFolderPath = path.join(homeDirectory, PROFILES_FOLDER);
  const defaultProfilePath = path.join(profilesFolderPath, DEFAULT_PROFILE_NAME);
  return defaultProfilePath;
}

export function getCurrentProfileConfiguration(generator: Generator): SystemConfigurationType {
  const defaultProfilePath = getProfilePath(generator);
  if (!generator.fs.exists(defaultProfilePath)) {
    generator.fs.writeJSON(defaultProfilePath, {});
    logInfoMessage(generator, `
      Created ${defaultProfilePath} for storing system-wide configuration.
      Please, enable backup of this file in your backup software for smooth update experience.
    `);
  }

  const fileContent = generator.fs.readJSON(defaultProfilePath);
  return fileContent;
}

export function writeCurrentProfileConfiguration(
  generator: Generator,
  configuration: SystemConfigurationType,
): void {
  const defaultProfilePath = getProfilePath(generator);
  generator.fs.writeJSON(defaultProfilePath, configuration);
}
