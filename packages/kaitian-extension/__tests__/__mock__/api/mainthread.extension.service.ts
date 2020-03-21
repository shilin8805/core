import { VSCodeExtensionService } from '../../../src/common/vscode';

import { mockExtensionProps } from '../extensions';

export class MainthreadExtensionService implements VSCodeExtensionService {
  $getExtensions() {
    return Promise.resolve([mockExtensionProps]);
  }

  $activateExtension(extensionPath: string) {
    return Promise.resolve();
  }
}
