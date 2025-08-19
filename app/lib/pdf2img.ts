export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        // Checking for error:
        console.log("PDF loaded, total pages:", pdf.numPages);
        const page = await pdf.getPage(1);
        // Checking for error:
        console.log("Got page 1");

        const viewport = page.getViewport({ scale: 4 });
        // Checking for error:
        console.log("Viewport:", viewport.width, viewport.height);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        // Checking for error:
        if (!context) {
            throw new Error("Failed to get 2D context from canvas");
        }

        // Checking for error:
        if (!(file instanceof File)) {
            throw new Error("convertPdfToImage received a non-File object: " + typeof file);
        }
        // Checking for error:
        console.log("convertPdfToImage called with:", file.name);

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        // Checking for error:
        console.log("Rendering page...");
        await page.render({ canvasContext: context!, viewport }).promise;
        console.log("Page rendered, creating blob...");

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    } // Checking error:
                    console.log("Rendering done, creating blob...");
                },
                "image/png",
                1.0
            ); // Set quality to maximum (1.0)
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            /// Checking error:
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : JSON.stringify(err)}`
        };
    }
}