export type WebpackRequireContext = {
  (id: string): any; // call signature
  keys: () => string[];
  resolve: (id: string) => string;
  id: string;
};

export interface WebpackRequire extends NodeJS.Require {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
  ): WebpackRequireContext;
}
