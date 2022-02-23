/**
 * when used with await, sleep for the specified time in ms
 * 
 * @param ms The time in ms to sleep
 */
 export function delay(ms: number){
    return new Promise(res => setTimeout(res, ms));
}

/**
 * 
 * Checks if the object given is defined but has no keys.
 * 
 * @param obj The object to check.
 * 
 * @returns true if the object is defined but empty and false otherwise.
 */
export function isEmpty(obj: object): boolean {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
}