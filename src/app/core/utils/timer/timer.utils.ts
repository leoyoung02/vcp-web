function padLeft(text:string, padChar:string, size:number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
}

function transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return padLeft(minutes?.toString(), '0', 2) + ':' + padLeft((value - minutes * 60)?.toString(), '0', 2);
}

export const timer = {
    transform,
};