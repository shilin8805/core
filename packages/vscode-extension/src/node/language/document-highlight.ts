import URI from 'vscode-uri/lib/umd';
import * as vscode from 'vscode';
import { ExtensionDocumentDataManager } from '../../common';
import { Position, DocumentHighlight } from '../../common/model.api';
import * as types from '../../common/ext-types';
import * as Converter from '../../common/coverter';

export class DocumentHighlightAdapter {

    constructor(
        private readonly provider: vscode.DocumentHighlightProvider,
        private readonly documents: ExtensionDocumentDataManager) {
    }

    provideDocumentHighlights(resource: URI, position: Position, token: vscode.CancellationToken): Promise<DocumentHighlight[] | undefined> {
        const documentData = this.documents.getDocumentData(resource);
        if (!documentData) {
            return Promise.reject(new Error(`There is no document for ${resource}`));
        }

        const document = documentData.document;
        const zeroBasedPosition = Converter.toPosition(position);

        return Promise.resolve(this.provider.provideDocumentHighlights(document, zeroBasedPosition, token)).then((documentHighlights) => {
            if (!documentHighlights) {
                return undefined;
            }

            if (this.isDocumentHighlightArray(documentHighlights)) {
                const highlights: DocumentHighlight[] = [];

                for (const highlight of documentHighlights) {
                    highlights.push(Converter.fromDocumentHighlight(highlight));
                }

                return highlights;
            }
        });
    }

    /* tslint:disable-next-line:no-any */
    private isDocumentHighlightArray(array: any): array is types.DocumentHighlight[] {
        return Array.isArray(array) && array.length > 0 && array[0] instanceof types.DocumentHighlight;
    }
}
