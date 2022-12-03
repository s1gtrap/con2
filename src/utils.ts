export function join(parts: string | string[]) {
    if (!Array.isArray(parts)) {
        return parts;
    } else if (parts.length === 1) {
        return parts[0];
    } else if (parts.length > 1) {
        const sorted = parts.sort();
        return `${sorted.slice(0, parts.length - 1).join(', ')} and ${sorted[parts.length - 1]}`;
    } else {
        console.error('join empty array');
        return '<none>';
    }
}