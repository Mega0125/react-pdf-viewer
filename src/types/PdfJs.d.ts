/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

declare module 'pdfjs-dist' {
    // Worker
    const GlobalWorkerOptions: GlobalWorker;
    interface GlobalWorker {
        workerSrc: string;
    }

    // Loading task
    const PasswordResponses: PasswordResponsesValue;
    interface PasswordResponsesValue {
        NEED_PASSWORD: string;
        INCORRECT_PASSWORD: string;
    }

    type VerifyPassword = (password: string) => void;
    type FileData = string | Uint8Array;

    interface LoadingTask {
        onPassword: (verifyPassword: VerifyPassword, reason: string) => void;
        promise: Promise<PdfDocument>;
        destroy(): void;
    }
    interface PdfDocument {
        numPages: number;
        getAttachments(): Promise<{[filename: string]: Attachment}>;
        getDestination(dest: string): Promise<OutlineDestination>;
        getDownloadInfo(): Promise<{ length: number }>;
        getMetadata(): Promise<MetaData>;
        getOutline(): Promise<Outline[]>;
        getPage(pageIndex: number): Promise<Page>;
        getPageIndex(ref: OutlineRef): Promise<number>;
    }
    function getDocument(file: FileData): LoadingTask;

    // Attachment
    interface Attachment {
        content: Uint8Array;
        filename: string;
    }

    // Metadata
    interface MetaData {
        contentDispositionFilename?: string;
        info: MetaDataInfo;
    }
    interface MetaDataInfo {
        Author: string;
        CreationDate: string;
        Creator: string;
        Keywords: string;
        ModDate: string;
        PDFFormatVersion: string;
        Producer: string;
        Subject: string;
        Title: string;
    }

    // Outline
    type OutlineDestinationType = string | OutlineDestination;
    interface Outline {
        dest: OutlineDestinationType;
        items: Outline[];
        title: string;
    }
    type OutlineDestination = [
        OutlineRef,
        OutlineDestinationName,
        ...any[],
    ];
    interface OutlineDestinationName {
        name: string;   // Can be 'WYZ', 'Fit', ...
    }
    interface OutlineRef {
        gen: number;
        num: number;
    }

    // View port
    interface ViewPortParams {
        rotation?: number;
        scale: number;
    }
    interface ViewPortCloneParams {
        dontFlip: boolean;
    }
    interface ViewPort {
        height: number;
        width: number;
        clone(params: ViewPortCloneParams): ViewPort;
    }

    // Render task
    interface PageRenderTask {
        promise: Promise<any>;
        cancel(): void;
    }

    // Render text layer
    interface RenderTextLayerParams {
        textContent: PageTextContent;
        container: HTMLDivElement;
        viewport: ViewPort;
    }
    interface PageTextContent {
        items: PageTextItem[];
    }
    interface PageTextItem {
        str: string;
    }
    function renderTextLayer(params: RenderTextLayerParams): PageRenderTask;

    // Annotations layer
    interface AnnotationsParams {
        // Can be 'display' or 'print'
        intent: string;
    }
    interface Annotation {
        dest: string;
        subtype: string;    // Can be 'Link'
    }
    const AnnotationLayer: PdfAnnotationLayer;
    interface RenderAnnotationLayerParams {
        annotations: Annotation[];
        div: HTMLDivElement | null;
        linkService: LinkService;
        page: Page;
        viewport: ViewPort;
    }
    interface PdfAnnotationLayer {
        render(params: RenderAnnotationLayerParams): void;
        update(params: RenderAnnotationLayerParams): void;
    }

    // Link service
    interface LinkService {
        externalLinkTarget?: number | null;
        getDestinationHash(dest: OutlineDestinationType): string;
        navigateTo(dest: OutlineDestinationType): void;
    }

    // Render page
    interface PageRenderParams {
        canvasContext: CanvasRenderingContext2D;
        viewport: ViewPort;
    }
    interface Page {
        getAnnotations(params: AnnotationsParams): Promise<Annotation[]>;
        getTextContent(): Promise<PageTextContent>;
        getViewport(params: ViewPortParams): ViewPort;
        render(params: PageRenderParams): PageRenderTask;
    }
}
