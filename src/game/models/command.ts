export interface Command {
  name?: string;
  cb?: () => boolean;
};
