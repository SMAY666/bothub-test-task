export function like(value: string): [string, string] {
    return ['like', `'${value}'`];
}

export function ilike(value: string): [string, string] {
    return ['ilike', `'${value}'`];
}

export function gt(value: number): [string, number] {
    return ['>', value];
}

export function gte(value: number): [string, number] {
    return ['>=', value];
}

export function lt(value: number): [string, number] {
    return ['<', value];
}

export function lte(value: number): [string, number] {
    return ['<=', value];
}
