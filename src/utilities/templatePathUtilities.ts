import Generator from 'yeoman-generator';

// That is a workaround for a bug in yeoman-generator.
// `templatePath` method returns a path to a template file
// that contains multiple joined folder and file paths when executed from a child generator.
export function getUnambiguousTemplatePath(
  generator: Generator,
  templatePath: string,
): string {
  const rawPath = generator.templatePath(templatePath);
  const paths = rawPath.split(':');
  return paths.find(path => path.includes(templatePath)) || rawPath;
}
