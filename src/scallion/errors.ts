export function buildFailed(name: string, message: string) {
    return new Error(`Failed to build ${name}: ${message}`);
}
export function mountFailed(name: string, message: string) {
    return new Error(`Failed to mount ${name}: ${message}`);
}