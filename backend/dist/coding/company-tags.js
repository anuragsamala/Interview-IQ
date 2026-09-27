"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROBLEM_COMPANIES_MAP = void 0;
exports.getCompaniesForTitle = getCompaniesForTitle;
exports.PROBLEM_COMPANIES_MAP = {
    // Classic top problems
    "two sum": ["Google", "Amazon", "Apple", "Meta", "Microsoft", "Bloomberg"],
    "valid parentheses": ["Amazon", "Meta", "Bloomberg", "Google", "Microsoft"],
    "best time to buy and sell stock": ["Amazon", "Meta", "Apple", "Microsoft", "Goldman Sachs"],
    "merge two sorted lists": ["Amazon", "Apple", "Microsoft", "Google", "Adobe"],
    "longest substring without repeating characters": ["Amazon", "Bloomberg", "Microsoft", "Google", "Meta", "Apple"],
    "3sum": ["Amazon", "Meta", "Apple", "Microsoft", "Google", "Bloomberg"],
    "container with most water": ["Amazon", "Google", "Meta", "Apple", "Adobe"],
    "binary tree level order traversal": ["Amazon", "Microsoft", "Meta", "LinkedIn", "Google"],
    "trapping rain water": ["Google", "Amazon", "Goldman Sachs", "Meta", "Bloomberg", "Apple"],
    "merge k sorted lists": ["Amazon", "Meta", "Google", "Microsoft", "Uber", "Apple"],
    // Arrays & Matrix
    "set matrix zeroes": ["Amazon", "Microsoft", "Meta", "Apple"],
    "pascal's triangle": ["Amazon", "Google", "Apple", "Goldman Sachs"],
    "next permutation": ["Google", "Meta", "Amazon", "Microsoft"],
    "kadane's algorithm (maximum subarray)": ["Amazon", "Microsoft", "Google", "LinkedIn", "Apple"],
    "sort colors (sort 0s, 1s, and 2s)": ["Microsoft", "Amazon", "Meta", "Salesforce"],
    "rotate image": ["Amazon", "Microsoft", "Meta", "Apple", "Google"],
    "merge intervals": ["Meta", "Google", "Amazon", "Bloomberg", "Microsoft", "Uber"],
    "merge sorted array": ["Meta", "Microsoft", "Amazon", "Apple"],
    "find the duplicate number": ["Amazon", "Google", "Microsoft", "Meta"],
    "repeat and missing number array": ["Amazon", "Goldman Sachs", "Flipkart"],
    "search a 2d matrix": ["Amazon", "Microsoft", "Meta", "Apple"],
    "pow(x, n)": ["Meta", "Google", "Bloomberg", "Amazon", "LinkedIn"],
    "majority element": ["Amazon", "Google", "Microsoft", "Apple"],
    "majority element ii": ["Amazon", "Google", "Microsoft"],
    "grid unique paths": ["Google", "Amazon", "Microsoft", "Meta"],
    "reverse pairs": ["Google", "Amazon", "Microsoft"],
    "4sum": ["Amazon", "Apple", "Google", "Meta"],
    "longest consecutive sequence": ["Google", "Amazon", "Meta", "Spotify", "Microsoft"],
    "largest subarray with 0 sum": ["Amazon", "Meta", "Microsoft"],
    "subarray with given xor": ["Amazon", "Google"],
    "remove duplicates from sorted array": ["Meta", "Microsoft", "Google", "Amazon"],
    "max consecutive ones": ["Google", "Amazon", "Apple"],
    // Linked Lists
    "reverse linked list": ["Amazon", "Google", "Apple", "Meta", "Microsoft", "Bloomberg"],
    "middle of the linked list": ["Amazon", "Google", "Microsoft", "Apple"],
    "remove nth node from end of list": ["Amazon", "Meta", "Google", "Apple"],
    "add two numbers": ["Amazon", "Meta", "Google", "Apple", "Microsoft", "Bloomberg"],
    "delete node in a linked list": ["Apple", "Amazon", "Microsoft", "Adobe"],
    "intersection of two linked lists": ["Amazon", "Microsoft", "Apple", "Meta"],
    "linked list cycle": ["Amazon", "Microsoft", "Apple", "Google", "Meta"],
    "reverse nodes in k-group": ["Google", "Amazon", "Microsoft", "Meta", "ByteDance"],
    "palindrome linked list": ["Amazon", "Meta", "Microsoft", "Google"],
    "linked list cycle ii": ["Amazon", "Microsoft"],
    "flattening a linked list": ["Amazon", "Microsoft", "Goldman Sachs", "Paytm"],
    "rotate list": ["Amazon", "Microsoft", "Bloomberg"],
    "copy list with random pointer": ["Amazon", "Meta", "Microsoft", "Bloomberg"],
    // Greedy & Recursion
    "n meetings in one room": ["Amazon", "Flipkart", "Microsoft"],
    "minimum platforms": ["Amazon", "Goldman Sachs", "Flipkart", "Paytm"],
    "job sequencing problem": ["Amazon", "Microsoft"],
    "fractional knapsack": ["Amazon", "Microsoft", "Flipkart"],
    "find minimum number of coins": ["Amazon", "Morgan Stanley", "Flipkart"],
    "subset sums": ["Amazon", "Microsoft", "Google"],
    "subsets ii": ["Amazon", "Meta", "Google", "Microsoft"],
    "combination sum": ["Amazon", "Meta", "Airbnb", "Google", "Microsoft"],
    "combination sum ii": ["Amazon", "Meta", "Google"],
    "palindrome partitioning": ["Amazon", "Google", "Meta", "Apple"],
    "n-queens": ["Amazon", "Google", "Meta", "Microsoft"],
    "sudoku solver": ["Google", "Uber", "Amazon", "Microsoft"],
    "rat in a maze problem": ["Amazon", "Microsoft"],
    "word break": ["Amazon", "Meta", "Google", "Bloomberg", "Apple"],
    // Binary Search
    "binary search": ["Google", "Apple", "Amazon", "Microsoft"],
    "search in rotated sorted array": ["Amazon", "Meta", "Google", "Microsoft", "Apple", "LinkedIn"],
    "single element in a sorted array": ["Amazon", "Google", "Microsoft"],
    "median of two sorted arrays": ["Google", "Amazon", "Microsoft", "Apple", "Goldman Sachs", "Meta"],
    "k-th element of two sorted arrays": ["Google", "Amazon", "Microsoft", "Flipkart"],
    "allocate books": ["Google", "Flipkart", "Amazon"],
    "aggressive cows": ["Google", "Amazon"],
    // Heaps & Queues
    "kth largest element in an array": ["Meta", "Amazon", "Google", "Microsoft", "Apple", "Bloomberg"],
    "top k frequent elements": ["Amazon", "Meta", "Google", "Microsoft", "Uber", "Apple"],
    "find median from data stream": ["Google", "Amazon", "Apple", "Meta", "Microsoft", "Goldman Sachs"],
    "implement stack using queues": ["Amazon", "Bloomberg", "Google"],
    "implement queue using stacks": ["Amazon", "Microsoft", "Meta"],
    "next greater element i": ["Amazon", "Google"],
    "largest rectangle in histogram": ["Google", "Amazon", "Meta", "Microsoft", "ByteDance"],
    "sliding window maximum": ["Amazon", "Google", "Meta", "Microsoft", "Citadel"],
    "min stack": ["Amazon", "Bloomberg", "Google", "Microsoft", "Apple"],
    "rotting oranges": ["Amazon", "Microsoft", "Google", "Bloomberg"],
    "online stock span": ["Amazon", "Google", "Microsoft"],
    // Strings
    "reverse words in a string": ["Amazon", "Microsoft", "Apple", "Google"],
    "longest palindromic substring": ["Amazon", "Microsoft", "Meta", "Google", "Bloomberg"],
    "roman to integer": ["Amazon", "Apple", "Google", "Microsoft"],
    "integer to roman": ["Amazon", "Microsoft", "Twitter"],
    "string to integer (atoi)": ["Amazon", "Meta", "Microsoft", "Bloomberg", "Apple"],
    "longest common prefix": ["Amazon", "Apple", "Google", "Adobe"],
    // Binary Trees & BST
    "binary tree inorder traversal": ["Amazon", "Microsoft", "Google"],
    "binary tree preorder traversal": ["Google", "Amazon"],
    "binary tree postorder traversal": ["Google", "Amazon"],
    "maximum depth of binary tree": ["Amazon", "Google", "Apple", "LinkedIn", "Meta"],
    "diameter of binary tree": ["Meta", "Amazon", "Google", "Microsoft", "Bloomberg"],
    "balanced binary tree": ["Amazon", "Google", "Microsoft", "Apple"],
    "lowest common ancestor of a binary tree": ["Meta", "Amazon", "Google", "Microsoft", "Apple"],
    "same tree": ["Amazon", "Google", "Apple"],
    "binary tree zigzag level order traversal": ["Amazon", "Microsoft", "Meta", "Bloomberg"],
    "boundary traversal of binary tree": ["Amazon", "Microsoft", "Flipkart"],
    "validate binary search tree": ["Amazon", "Meta", "Bloomberg", "Microsoft", "Google"],
    "lowest common ancestor of a binary search tree": ["Amazon", "Microsoft", "Meta"],
    "kth smallest element in a bst": ["Amazon", "Meta", "Google", "Microsoft"],
    // Graphs
    "number of islands": ["Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Uber"],
    "flood fill": ["Amazon", "Google", "Apple"],
    "course schedule": ["Amazon", "Google", "Meta", "Microsoft", "Uber", "Apple"],
    "course schedule ii": ["Amazon", "Google", "Meta", "Microsoft", "Pinterest"],
    "dijkstra's shortest path": ["Google", "Amazon", "Microsoft", "Uber"],
    "cheapest flights within k stops": ["Airbnb", "Amazon", "Google"],
    "word ladder": ["Amazon", "Google", "Meta", "Microsoft", "LinkedIn"],
    // Dynamic Programming
    "climbing stairs": ["Amazon", "Google", "Apple", "Microsoft", "Adobe"],
    "house robber": ["Amazon", "Google", "Microsoft", "Apple", "Cisco"],
    "coin change": ["Amazon", "Google", "Bloomberg", "Microsoft", "Apple", "Meta"],
    "0/1 knapsack problem": ["Amazon", "Microsoft", "Flipkart", "Paytm"],
    "longest common subsequence": ["Amazon", "Google", "Microsoft", "Apple"],
    "longest increasing subsequence": ["Google", "Amazon", "Microsoft", "Meta", "Apple"],
    "edit distance": ["Google", "Amazon", "Microsoft", "Meta"],
    "maximum product subarray": ["Amazon", "Google", "Microsoft", "LinkedIn"],
    "partition equal subset sum": ["Amazon", "Meta", "Microsoft"],
    "matrix chain multiplication": ["Amazon", "Microsoft", "Flipkart"],
    "minimum path sum": ["Amazon", "Google", "Microsoft", "Apple"],
    "burst balloons": ["Google", "Amazon", "Samsung"]
};
function getCompaniesForTitle(title) {
    const normalized = title.trim().toLowerCase();
    if (exports.PROBLEM_COMPANIES_MAP[normalized]) {
        return exports.PROBLEM_COMPANIES_MAP[normalized];
    }
    for (const [key, companies] of Object.entries(exports.PROBLEM_COMPANIES_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return companies;
        }
    }
    return ["Google", "Amazon", "Microsoft"];
}
//# sourceMappingURL=company-tags.js.map