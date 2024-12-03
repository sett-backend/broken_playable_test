export function leadingZeros(value: number, base = 5) {
    let stringNumber = value.toString();
    while (stringNumber.length < base) {
        stringNumber = '0' + stringNumber;
    }
    return stringNumber;
}
