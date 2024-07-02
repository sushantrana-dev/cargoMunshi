export function getTotalDestinationCost(destinationCost) {
    // Use Object.values to extract all values from the object and reduce them to a single sum.
    return Object.values(destinationCost).reduce((total, current) => total + current, 0);
}