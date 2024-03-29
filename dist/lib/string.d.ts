export declare class Str extends String {
    get text(): string;
    static uFirst(str: string): string;
    static lFirst(str: string): string;
    static toCapitalize(str: string, ignoreNoneWord?: boolean): string;
    static toCamelCase(str: string): string;
    static camelToSnackCase(str: string): string;
    static snackToCamelCase(str: string): string;
    static truncate(str: string, options?: {
        maxLength?: number;
        wordCount?: boolean;
        pad?: string;
    }): string;
    static from(strLike: any): Str;
    static repeat(char: string, level?: number): string;
    uFirst(): string;
    lFirst(): string;
    toCapitalize(ignoreNoneWord?: boolean): string;
    toCamelCase(): string;
    camelToSnackCase(): string;
    snackToCamelCase(): string;
    truncate(options?: {
        maxLength?: number;
        wordCount?: boolean;
        pad?: string;
    }): string;
    [Symbol.iterator](): Generator<string, void, unknown>;
}
