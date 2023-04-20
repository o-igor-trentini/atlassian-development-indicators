export const formatFloatPrecision = (value: number, precision: number): number => Number(value.toFixed(precision));

export const cutWithEllipsis = (text: string, limit: number): string => {
    if (limit >= text.length) return text;

    return text.substring(0, limit) + '...';
};
