export default class Plugin {
    author: string;
    version: string;
    name: string;
    options: any;
    openScanPage(address: any): void;
    getCurrentState(snapshot: any, address: any): Promise<{
        image_url: any;
        currentState: string;
    }>;
    claim(snapshot: any, address: any): Promise<"LOADING" | "UNCLAIMED">;
}
