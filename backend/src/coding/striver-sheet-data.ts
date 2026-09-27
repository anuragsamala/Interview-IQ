export interface StriverProblemData {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; expected: string }[];
  companies?: string[];
}

export const STRIVER_PROBLEMS: StriverProblemData[] = [
  // --- ARRAYS & BASICS ---
  {
    title: "Set Matrix Zeroes",
    description: "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.",
    difficulty: "MEDIUM",
    constraints: "m == matrix.length\nn == matrix[0].length\n1 <= m, n <= 200\n-2^31 <= matrix[i][j] <= 2^31 - 1",
    sampleInput: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
    sampleOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
    testCases: [{ input: "[[1,1,1],[1,0,1],[1,1,1]]", expected: "[[1,0,1],[0,0,0],[1,0,1]]" }]
  },
  {
    title: "Pascal's Triangle",
    description: "Given an integer numRows, return the first numRows of Pascal's triangle. In Pascal's triangle, each number is the sum of the two numbers directly above it.",
    difficulty: "EASY",
    constraints: "1 <= numRows <= 30",
    sampleInput: "numRows = 5",
    sampleOutput: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
    testCases: [{ input: "5", expected: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" }]
  },
  {
    title: "Next Permutation",
    description: "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation of numbers.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 100\n0 <= nums[i] <= 100",
    sampleInput: "nums = [1,2,3]",
    sampleOutput: "[1,3,2]",
    testCases: [{ input: "[1,2,3]", expected: "[1,3,2]" }]
  },
  {
    title: "Kadane's Algorithm (Maximum Subarray)",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
    sampleOutput: "6",
    testCases: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" }]
  },
  {
    title: "Sort Colors (Sort 0s, 1s, and 2s)",
    description: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue (0, 1, 2).",
    difficulty: "MEDIUM",
    constraints: "n == nums.length\n1 <= n <= 300\nnums[i] is either 0, 1, or 2.",
    sampleInput: "nums = [2,0,2,1,1,0]",
    sampleOutput: "[0,0,1,1,2,2]",
    testCases: [{ input: "[2,0,2,1,1,0]", expected: "[0,0,1,1,2,2]" }]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    difficulty: "EASY",
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    sampleInput: "prices = [7,1,5,3,6,4]",
    sampleOutput: "5",
    testCases: [{ input: "[7,1,5,3,6,4]", expected: "5" }]
  },
  {
    title: "Rotate Image",
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in place.",
    difficulty: "MEDIUM",
    constraints: "matrix.length == n == matrix[i].length\n1 <= n <= 20\n-1000 <= matrix[i][j] <= 1000",
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    sampleOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
    testCases: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", expected: "[[7,4,1],[8,5,2],[9,6,3]]" }]
  },
  {
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "MEDIUM",
    constraints: "1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= start_i <= end_i <= 10^4",
    sampleInput: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
    sampleOutput: "[[1,6],[8,10],[15,18]]",
    testCases: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" }]
  },
  {
    title: "Merge Sorted Array",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order.",
    difficulty: "EASY",
    constraints: "nums1.length == m + n\nnums2.length == n\n0 <= m, n <= 200",
    sampleInput: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
    sampleOutput: "[1,2,2,3,5,6]",
    testCases: [{ input: "[1,2,3,0,0,0], 3, [2,5,6], 3", expected: "[1,2,2,3,5,6]" }]
  },
  {
    title: "Find the Duplicate Number",
    description: "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number without modifying the array.",
    difficulty: "MEDIUM",
    constraints: "1 <= n <= 10^5\nnums.length == n + 1\n1 <= nums[i] <= n",
    sampleInput: "nums = [1,3,4,2,2]",
    sampleOutput: "2",
    testCases: [{ input: "[1,3,4,2,2]", expected: "2" }]
  },
  {
    title: "Repeat and Missing Number Array",
    description: "You are given a read only array of n integers from 1 to n. Each integer appears exactly once except A which appears twice and B which is missing. Return A and B.",
    difficulty: "MEDIUM",
    constraints: "1 <= n <= 10^5",
    sampleInput: "[3, 1, 2, 5, 3]",
    sampleOutput: "[3, 4]",
    testCases: [{ input: "[3, 1, 2, 5, 3]", expected: "[3, 4]" }]
  },
  {
    title: "Search a 2D Matrix",
    description: "You are given an m x n integer matrix with the following two properties: Each row is sorted in non-decreasing order. The first integer of each row is greater than the last integer of the previous row. Return true if target is in matrix or false otherwise.",
    difficulty: "MEDIUM",
    constraints: "m == matrix.length\nn == matrix[i].length\n1 <= m, n <= 100",
    sampleInput: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
    sampleOutput: "true",
    testCases: [{ input: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3", expected: "true" }]
  },
  {
    title: "Pow(x, n)",
    description: "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
    difficulty: "MEDIUM",
    constraints: "-100.0 < x < 100.0\n-2^31 <= n <= 2^31-1",
    sampleInput: "x = 2.00000, n = 10",
    sampleOutput: "1024.00000",
    testCases: [{ input: "2.00000, 10", expected: "1024.00000" }]
  },
  {
    title: "Majority Element",
    description: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.",
    difficulty: "EASY",
    constraints: "n == nums.length\n1 <= n <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9",
    sampleInput: "nums = [3,2,3]",
    sampleOutput: "3",
    testCases: [{ input: "[3,2,3]", expected: "3" }]
  },
  {
    title: "Majority Element II",
    description: "Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9",
    sampleInput: "nums = [3,2,3]",
    sampleOutput: "[3]",
    testCases: [{ input: "[3,2,3]", expected: "[3]" }]
  },
  {
    title: "Grid Unique Paths",
    description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. Return the number of possible unique paths.",
    difficulty: "MEDIUM",
    constraints: "1 <= m, n <= 100",
    sampleInput: "m = 3, n = 7",
    sampleOutput: "28",
    testCases: [{ input: "3, 7", expected: "28" }]
  },
  {
    title: "Reverse Pairs",
    description: "Given an integer array nums, return the number of reverse pairs in the array. A reverse pair is a pair (i, j) where 0 <= i < j < nums.length and nums[i] > 2 * nums[j].",
    difficulty: "HARD",
    constraints: "1 <= nums.length <= 5 * 10^4\n-2^31 <= nums[i] <= 2^31 - 1",
    sampleInput: "nums = [1,3,2,3,1]",
    sampleOutput: "2",
    testCases: [{ input: "[1,3,2,3,1]", expected: "2" }]
  },
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "EASY",
    constraints: "2 <= nums.length <= 10^4",
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    testCases: [{ input: "[2,7,11,15], 9", expected: "[0,1]" }]
  },
  {
    title: "4Sum",
    description: "Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, and d are distinct, and nums[a] + nums[b] + nums[c] + nums[d] == target.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 200\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
    sampleInput: "nums = [1,0,-1,0,-2,2], target = 0",
    sampleOutput: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
    testCases: [{ input: "[1,0,-1,0,-2,2], 0", expected: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" }]
  },
  {
    title: "Longest Consecutive Sequence",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    difficulty: "MEDIUM",
    constraints: "0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    sampleInput: "nums = [100,4,200,1,3,2]",
    sampleOutput: "4",
    testCases: [{ input: "[100,4,200,1,3,2]", expected: "4" }]
  },
  {
    title: "Largest Subarray with 0 Sum",
    description: "Given an array having both positive and negative integers. The task is to compute the length of the largest subarray with sum 0.",
    difficulty: "EASY",
    constraints: "1 <= N <= 10^5\n-1000 <= A[i] <= 1000",
    sampleInput: "A = [15,-2,2,-8,1,7,10,23]",
    sampleOutput: "5",
    testCases: [{ input: "[15,-2,2,-8,1,7,10,23]", expected: "5" }]
  },
  {
    title: "Subarray with Given XOR",
    description: "Given an array of integers A and an integer B. Find the total number of subarrays having bitwise XOR of all elements equal to B.",
    difficulty: "MEDIUM",
    constraints: "1 <= length of A <= 10^5\n1 <= A[i] <= 10^5\n1 <= B <= 10^5",
    sampleInput: "A = [4, 2, 2, 6, 4], B = 6",
    sampleOutput: "4",
    testCases: [{ input: "[4, 2, 2, 6, 4], 6", expected: "4" }]
  },
  {
    title: "3Sum",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    difficulty: "MEDIUM",
    constraints: "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
    sampleInput: "nums = [-1,0,1,2,-1,-4]",
    sampleOutput: "[[-1,-1,2],[-1,0,1]]",
    testCases: [{ input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" }]
  },
  {
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "HARD",
    constraints: "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
    sampleInput: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
    sampleOutput: "6",
    testCases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" }]
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return k after placing final result in first k slots.",
    difficulty: "EASY",
    constraints: "1 <= nums.length <= 3 * 10^4\n-100 <= nums[i] <= 100",
    sampleInput: "nums = [1,1,2]",
    sampleOutput: "2, nums = [1,2,_]",
    testCases: [{ input: "[1,1,2]", expected: "2" }]
  },
  {
    title: "Max Consecutive Ones",
    description: "Given a binary array nums, return the maximum number of consecutive 1's in the array.",
    difficulty: "EASY",
    constraints: "1 <= nums.length <= 10^5\nnums[i] is either 0 or 1.",
    sampleInput: "nums = [1,1,0,1,1,1]",
    sampleOutput: "3",
    testCases: [{ input: "[1,1,0,1,1,1]", expected: "3" }]
  },

  // --- LINKED LIST ---
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "EASY",
    constraints: "The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000",
    sampleInput: "head = [1,2,3,4,5]",
    sampleOutput: "[5,4,3,2,1]",
    testCases: [{ input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" }]
  },
  {
    title: "Middle of the Linked List",
    description: "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
    difficulty: "EASY",
    constraints: "The number of nodes in the list is in the range [1, 100].",
    sampleInput: "head = [1,2,3,4,5]",
    sampleOutput: "[3,4,5]",
    testCases: [{ input: "[1,2,3,4,5]", expected: "[3,4,5]" }]
  },
  {
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    difficulty: "EASY",
    constraints: "The number of nodes in both lists is in the range [0, 50].",
    sampleInput: "list1 = [1,2,4], list2 = [1,3,4]",
    sampleOutput: "[1,1,2,3,4,4]",
    testCases: [{ input: "[1,2,4], [1,3,4]", expected: "[1,1,2,3,4,4]" }]
  },
  {
    title: "Remove Nth Node From End of List",
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the list is sz.\n1 <= sz <= 30\n0 <= Node.val <= 100\n1 <= n <= sz",
    sampleInput: "head = [1,2,3,4,5], n = 2",
    sampleOutput: "[1,2,3,5]",
    testCases: [{ input: "[1,2,3,4,5], 2", expected: "[1,2,3,5]" }]
  },
  {
    title: "Add Two Numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9",
    sampleInput: "l1 = [2,4,3], l2 = [5,6,4]",
    sampleOutput: "[7,0,8]",
    testCases: [{ input: "[2,4,3], [5,6,4]", expected: "[7,0,8]" }]
  },
  {
    title: "Delete Node in a Linked List",
    description: "There is a singly-linked list head and we want to delete a node node in it. You are given the node to be deleted node. You will not be given access to the first node of head.",
    difficulty: "MEDIUM",
    constraints: "The number of the nodes in the given list is in the range [2, 1000].\nAll the values among the nodes of the list are unique.",
    sampleInput: "head = [4,5,1,9], node = 5",
    sampleOutput: "[4,1,9]",
    testCases: [{ input: "[4,5,1,9], 5", expected: "[4,1,9]" }]
  },
  {
    title: "Intersection of Two Linked Lists",
    description: "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.",
    difficulty: "EASY",
    constraints: "The number of nodes of listA is in the m.\nThe number of nodes of listB is in the n.\n1 <= m, n <= 3 * 10^4",
    sampleInput: "intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]",
    sampleOutput: "Intersected at '8'",
    testCases: [{ input: "[4,1,8,4,5], [5,6,1,8,4,5]", expected: "8" }]
  },
  {
    title: "Linked List Cycle",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle in the linked list.",
    difficulty: "EASY",
    constraints: "The number of the nodes in the list is in the range [0, 10^4].\n-10^5 <= Node.val <= 10^5",
    sampleInput: "head = [3,2,0,-4], pos = 1",
    sampleOutput: "true",
    testCases: [{ input: "[3,2,0,-4], 1", expected: "true" }]
  },
  {
    title: "Reverse Nodes in k-Group",
    description: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
    difficulty: "HARD",
    constraints: "The number of nodes in the list is n.\n1 <= k <= n <= 5000\n0 <= Node.val <= 1000",
    sampleInput: "head = [1,2,3,4,5], k = 2",
    sampleOutput: "[2,1,4,3,5]",
    testCases: [{ input: "[1,2,3,4,5], 2", expected: "[2,1,4,3,5]" }]
  },
  {
    title: "Palindrome Linked List",
    description: "Given the head of a singly linked list, return true if it is a palindrome or false otherwise.",
    difficulty: "EASY",
    constraints: "The number of nodes in the list is in the range [1, 10^5].\n0 <= Node.val <= 9",
    sampleInput: "head = [1,2,2,1]",
    sampleOutput: "true",
    testCases: [{ input: "[1,2,2,1]", expected: "true" }]
  },
  {
    title: "Linked List Cycle II",
    description: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.",
    difficulty: "MEDIUM",
    constraints: "The number of the nodes in the list is in the range [0, 10^4].\n-10^5 <= Node.val <= 10^5",
    sampleInput: "head = [3,2,0,-4], pos = 1",
    sampleOutput: "tail connects to node index 1",
    testCases: [{ input: "[3,2,0,-4], 1", expected: "1" }]
  },
  {
    title: "Flattening a Linked List",
    description: "Given a Linked List of size N, where every node represents a sub-linked-list and contains two pointers: a next pointer to the next node, and a bottom pointer to a sub-linked-list where the list is sorted. Flatten the list into a single sorted list.",
    difficulty: "MEDIUM",
    constraints: "0 <= N <= 50\n1 <= Mi <= 20\n1 <= Element values <= 10^3",
    sampleInput: "5 -> 10 -> 19 -> 28\n|     |\n7     20",
    sampleOutput: "5-> 7-> 8-> 10 -> 19-> 20-> 22-> 28-> 30-> 35-> 40-> 45-> 50",
    testCases: [{ input: "[[5,7,8,30],[10,20],[19,22,50],[28,35,40,45]]", expected: "[5,7,8,10,19,20,22,28,30,35,40,45,50]" }]
  },
  {
    title: "Rotate List",
    description: "Given the head of a linked list, rotate the list to the right by k places.",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the list is in the range [0, 500].\n-100 <= Node.val <= 100\n0 <= k <= 2 * 10^9",
    sampleInput: "head = [1,2,3,4,5], k = 2",
    sampleOutput: "[4,5,1,2,3]",
    testCases: [{ input: "[1,2,3,4,5], 2", expected: "[4,5,1,2,3]" }]
  },
  {
    title: "Copy List with Random Pointer",
    description: "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list.",
    difficulty: "MEDIUM",
    constraints: "0 <= n <= 1000\n-10^4 <= Node.val <= 10^4\nNode.random is null or is pointing to some node in the linked list.",
    sampleInput: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]",
    sampleOutput: "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
    testCases: [{ input: "[[7,null],[13,0],[11,4],[10,2],[1,0]]", expected: "[[7,null],[13,0],[11,4],[10,2],[1,0]]" }]
  },

  // --- GREEDY ALGORITHM ---
  {
    title: "N Meetings in One Room",
    description: "There is one meeting room in a firm. There are N meetings in the form of (start[i], end[i]). Find the maximum number of meetings that can be accommodated in the meeting room.",
    difficulty: "EASY",
    constraints: "1 <= N <= 10^5\n0 <= start[i] < end[i] <= 10^5",
    sampleInput: "start = [1,3,0,5,8,5], end = [2,4,6,7,9,9]",
    sampleOutput: "4",
    testCases: [{ input: "[1,3,0,5,8,5], [2,4,6,7,9,9]", expected: "4" }]
  },
  {
    title: "Minimum Platforms",
    description: "Given arrival and departure times of all trains that reach a railway station. Find the minimum number of platforms required for the railway station so that no train is kept waiting.",
    difficulty: "MEDIUM",
    constraints: "1 <= N <= 50000\n0000 <= arr[i] <= dep[i] <= 2359",
    sampleInput: "arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]",
    sampleOutput: "3",
    testCases: [{ input: "[900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]", expected: "3" }]
  },
  {
    title: "Job Sequencing Problem",
    description: "Given a set of N jobs where every job_i has a deadline and profit. Every job takes 1 unit of time. Find the number of jobs done and the maximum profit.",
    difficulty: "MEDIUM",
    constraints: "1 <= N <= 10^5\n1 <= Deadline <= 100\n1 <= Profit <= 500",
    sampleInput: "Jobs = [[1,4,20],[2,1,10],[3,1,40],[4,1,30]]",
    sampleOutput: "[2, 60]",
    testCases: [{ input: "[[1,4,20],[2,1,10],[3,1,40],[4,1,30]]", expected: "[2, 60]" }]
  },
  {
    title: "Fractional Knapsack",
    description: "Given weights and values of N items, we need to put these items in a knapsack of capacity W to get the maximum total value in the knapsack. Items can be broken into smaller units.",
    difficulty: "MEDIUM",
    constraints: "N = 3, W = 50\nvalues = [60,100,120], weight = [10,20,30]",
    sampleInput: "W = 50, values = [60,100,120], weight = [10,20,30]",
    sampleOutput: "240.00",
    testCases: [{ input: "50, [60,100,120], [10,20,30]", expected: "240.00" }]
  },
  {
    title: "Find Minimum Number of Coins",
    description: "Given a value V and infinite supply of each of the denominations in Indian currency (1, 2, 5, 10, 20, 50, 100, 500, 1000). Find the minimum number of coins/notes to make the change.",
    difficulty: "EASY",
    constraints: "1 <= V <= 10^6",
    sampleInput: "V = 49",
    sampleOutput: "[20, 20, 5, 2, 2]",
    testCases: [{ input: "49", expected: "[20, 20, 5, 2, 2]" }]
  },

  // --- RECURSION & BACKTRACKING ---
  {
    title: "Subset Sums",
    description: "Given a list N integers, print sums of all subsets in it in non-decreasing order.",
    difficulty: "EASY",
    constraints: "1 <= N <= 15\n0 <= arr[i] <= 10^4",
    sampleInput: "arr = [2, 3]",
    sampleOutput: "[0, 2, 3, 5]",
    testCases: [{ input: "[2, 3]", expected: "[0, 2, 3, 5]" }]
  },
  {
    title: "Subsets II",
    description: "Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 10\n-10 <= nums[i] <= 10",
    sampleInput: "nums = [1,2,2]",
    sampleOutput: "[[],[1],[1,2],[1,2,2],[2],[2,2]]",
    testCases: [{ input: "[1,2,2]", expected: "[[],[1],[1,2],[1,2,2],[2],[2,2]]" }]
  },
  {
    title: "Combination Sum",
    description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.",
    difficulty: "MEDIUM",
    constraints: "1 <= candidates.length <= 30\n2 <= candidates[i] <= 40\n1 <= target <= 500",
    sampleInput: "candidates = [2,3,6,7], target = 7",
    sampleOutput: "[[2,2,3],[7]]",
    testCases: [{ input: "[2,3,6,7], 7", expected: "[[2,2,3],[7]]" }]
  },
  {
    title: "Combination Sum II",
    description: "Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target. Each number in candidates may only be used once in the combination.",
    difficulty: "MEDIUM",
    constraints: "1 <= candidates.length <= 100\n1 <= candidates[i] <= 50\n1 <= target <= 30",
    sampleInput: "candidates = [10,1,2,7,6,1,5], target = 8",
    sampleOutput: "[[1,1,6],[1,2,5],[1,7],[2,6]]",
    testCases: [{ input: "[10,1,2,7,6,1,5], 8", expected: "[[1,1,6],[1,2,5],[1,7],[2,6]]" }]
  },
  {
    title: "Palindrome Partitioning",
    description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.",
    difficulty: "MEDIUM",
    constraints: "1 <= s.length <= 16\ns contains only lowercase English letters.",
    sampleInput: "s = 'aab'",
    sampleOutput: "[['a','a','b'],['aa','b']]",
    testCases: [{ input: "'aab'", expected: "[['a','a','b'],['aa','b']]" }]
  },
  {
    title: "N-Queens",
    description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
    difficulty: "HARD",
    constraints: "1 <= n <= 9",
    sampleInput: "n = 4",
    sampleOutput: "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]",
    testCases: [{ input: "4", expected: "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]" }]
  },
  {
    title: "Sudoku Solver",
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells.",
    difficulty: "HARD",
    constraints: "board.length == 9\nboard[i].length == 9\nboard[i][j] is a digit or '.'.",
    sampleInput: "board = [['5','3','.','.','7','.','.','.','.']...]",
    sampleOutput: "Sudoku Solved Board",
    testCases: [{ input: "9x9 grid", expected: "valid solved 9x9 grid" }]
  },
  {
    title: "Rat in a Maze Problem",
    description: "Consider a rat placed at (0, 0) in a square matrix of order N * N. It has to reach the destination at (N - 1, N - 1). Find all possible paths that the rat can take to reach from source to destination.",
    difficulty: "MEDIUM",
    constraints: "2 <= N <= 5\n0 <= matrix[i][j] <= 1",
    sampleInput: "N = 4, m = [[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]]",
    sampleOutput: "'DDRDRR', 'DRDDRR'",
    testCases: [{ input: "4, [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]", expected: "['DDRDRR', 'DRDDRR']" }]
  },
  {
    title: "Word Break",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    difficulty: "MEDIUM",
    constraints: "1 <= s.length <= 300\n1 <= wordDict.length <= 1000",
    sampleInput: "s = 'leetcode', wordDict = ['leet','code']",
    sampleOutput: "true",
    testCases: [{ input: "'leetcode', ['leet','code']", expected: "true" }]
  },

  // --- BINARY SEARCH ---
  {
    title: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    difficulty: "EASY",
    constraints: "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4",
    sampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    sampleOutput: "4",
    testCases: [{ input: "[-1,0,3,5,9,12], 9", expected: "4" }]
  },
  {
    title: "Search in Rotated Sorted Array",
    description: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [4,5,6,7,0,1,2], target = 0",
    sampleOutput: "4",
    testCases: [{ input: "[4,5,6,7,0,1,2], 0", expected: "4" }]
  },
  {
    title: "Single Element in a Sorted Array",
    description: "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Return the single element that appears only once in O(log n) time.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 10^5\n0 <= nums[i] <= 10^5",
    sampleInput: "nums = [1,1,2,3,3,4,4,8,8]",
    sampleOutput: "2",
    testCases: [{ input: "[1,1,2,3,3,4,4,8,8]", expected: "2" }]
  },
  {
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    difficulty: "HARD",
    constraints: "nums1.length == m\nnums2.length == n\n0 <= m, n <= 1000",
    sampleInput: "nums1 = [1,3], nums2 = [2]",
    sampleOutput: "2.00000",
    testCases: [{ input: "[1,3], [2]", expected: "2.00000" }]
  },
  {
    title: "K-th Element of Two Sorted Arrays",
    description: "Given two sorted arrays arr1 and arr2 of size N and M respectively and an element K. The task is to find the element that would be at the k-th position of the final sorted array.",
    difficulty: "MEDIUM",
    constraints: "1 <= N, M <= 10^6\n1 <= K <= N+M",
    sampleInput: "arr1 = [2, 3, 6, 7, 9], arr2 = [1, 4, 8, 10], k = 5",
    sampleOutput: "6",
    testCases: [{ input: "[2, 3, 6, 7, 9], [1, 4, 8, 10], 5", expected: "6" }]
  },
  {
    title: "Allocate Books",
    description: "Given an array of integers A of size N and an integer B. College library has N books, the ith book has A[i] number of pages. You have to allocate books to B number of students so that maximum number of pages allocated to a student is minimum.",
    difficulty: "HARD",
    constraints: "1 <= N <= 10^5\n1 <= A[i] <= 10^9\n1 <= B <= 10^5",
    sampleInput: "A = [12, 34, 67, 90], B = 2",
    sampleOutput: "113",
    testCases: [{ input: "[12, 34, 67, 90], 2", expected: "113" }]
  },
  {
    title: "Aggressive Cows",
    description: "Farmer John has built a new long barn, with N stalls. Given an array of stall locations and C cows, assign stalls to the cows such that the minimum distance between any two of them is as large as possible.",
    difficulty: "HARD",
    constraints: "2 <= N <= 10^5\n2 <= C <= N",
    sampleInput: "stalls = [1, 2, 8, 4, 9], k = 3",
    sampleOutput: "3",
    testCases: [{ input: "[1, 2, 8, 4, 9], 3", expected: "3" }]
  },

  // --- HEAPS & HASHING ---
  {
    title: "Kth Largest Element in an Array",
    description: "Given an integer array nums and an integer k, return the kth largest element in the array.",
    difficulty: "MEDIUM",
    constraints: "1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [3,2,1,5,6,4], k = 2",
    sampleOutput: "5",
    testCases: [{ input: "[3,2,1,5,6,4], 2", expected: "5" }]
  },
  {
    title: "Top K Frequent Elements",
    description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\nk is in the range [1, the number of unique elements in the array].",
    sampleInput: "nums = [1,1,1,2,2,3], k = 2",
    sampleOutput: "[1,2]",
    testCases: [{ input: "[1,1,1,2,2,3], 2", expected: "[1,2]" }]
  },
  {
    title: "Find Median from Data Stream",
    description: "Implement the MedianFinder class which supports adding integers from a data stream and finding the median of the current elements.",
    difficulty: "HARD",
    constraints: "-10^5 <= num <= 10^5\nAt most 5 * 10^4 calls will be made to addNum and findMedian.",
    sampleInput: "['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian']\n[[], [1], [2], [], [3], []]",
    sampleOutput: "[null, null, null, 1.5, null, 2.0]",
    testCases: [{ input: "[1, 2], findMedian()", expected: "1.5" }]
  },

  // --- STACK & QUEUE ---
  {
    title: "Implement Stack using Queues",
    description: "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).",
    difficulty: "EASY",
    constraints: "1 <= x <= 9\nAt most 100 calls will be made to push, pop, top, and empty.",
    sampleInput: "['MyStack', 'push', 'push', 'top', 'pop', 'empty']\n[[], [1], [2], [], [], []]",
    sampleOutput: "[null, null, null, 2, 2, false]",
    testCases: [{ input: "push(1), push(2), top()", expected: "2" }]
  },
  {
    title: "Implement Queue using Stacks",
    description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).",
    difficulty: "EASY",
    constraints: "1 <= x <= 9\nAt most 100 calls will be made to push, pop, peek, and empty.",
    sampleInput: "['MyQueue', 'push', 'push', 'peek', 'pop', 'empty']\n[[], [1], [2], [], [], []]",
    sampleOutput: "[null, null, null, 1, 1, false]",
    testCases: [{ input: "push(1), push(2), peek()", expected: "1" }]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "EASY",
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    sampleInput: "s = '()[]{}'",
    sampleOutput: "true",
    testCases: [{ input: "'()[]{}'", expected: "true" }]
  },
  {
    title: "Next Greater Element I",
    description: "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array. Given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2.",
    difficulty: "EASY",
    constraints: "1 <= nums1.length <= nums2.length <= 1000\n0 <= nums1[i], nums2[i] <= 10^4",
    sampleInput: "nums1 = [4,1,2], nums2 = [1,3,4,2]",
    sampleOutput: "[-1,3,-1]",
    testCases: [{ input: "[4,1,2], [1,3,4,2]", expected: "[-1,3,-1]" }]
  },
  {
    title: "Largest Rectangle in Histogram",
    description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    difficulty: "HARD",
    constraints: "1 <= heights.length <= 10^5\n0 <= heights[i] <= 10^4",
    sampleInput: "heights = [2,1,5,6,2,3]",
    sampleOutput: "10",
    testCases: [{ input: "[2,1,5,6,2,3]", expected: "10" }]
  },
  {
    title: "Sliding Window Maximum",
    description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.",
    difficulty: "HARD",
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length",
    sampleInput: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
    sampleOutput: "[3,3,5,5,6,7]",
    testCases: [{ input: "[1,3,-1,-3,5,3,6,7], 3", expected: "[3,3,5,5,6,7]" }]
  },
  {
    title: "Min Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
    difficulty: "MEDIUM",
    constraints: "-2^31 <= val <= 2^31 - 1\nAt most 3 * 10^4 calls will be made to push, pop, top, and getMin.",
    sampleInput: "['MinStack','push','push','push','getMin','pop','top','getMin']\n[[],[-2],[0],[-3],[],[],[],[]]",
    sampleOutput: "[null,null,null,null,-3,null,0,-2]",
    testCases: [{ input: "push(-2), push(0), push(-3), getMin()", expected: "-3" }]
  },
  {
    title: "Rotting Oranges",
    description: "You are given an m x n grid where each cell can have one of three values: 0 empty, 1 fresh orange, 2 rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If impossible, return -1.",
    difficulty: "MEDIUM",
    constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 10",
    sampleInput: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
    sampleOutput: "4",
    testCases: [{ input: "[[2,1,1],[1,1,0],[0,1,1]]", expected: "4" }]
  },
  {
    title: "Online Stock Span",
    description: "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of the stock's price today is the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to today's price.",
    difficulty: "MEDIUM",
    constraints: "1 <= price <= 10^5\nAt most 10^4 calls will be made to next.",
    sampleInput: "['StockSpanner', 'next', 'next', 'next', 'next', 'next', 'next', 'next']\n[[], [100], [80], [60], [70], [60], [75], [85]]",
    sampleOutput: "[null, 1, 1, 1, 2, 1, 4, 6]",
    testCases: [{ input: "[100, 80, 60, 70, 60, 75, 85]", expected: "[1, 1, 1, 2, 1, 4, 6]" }]
  },

  // --- STRINGS ---
  {
    title: "Reverse Words in a String",
    description: "Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space.",
    difficulty: "MEDIUM",
    constraints: "1 <= s.length <= 10^4\ns contains English letters, digits, and spaces ' '.",
    sampleInput: "s = 'the sky is blue'",
    sampleOutput: "'blue is sky the'",
    testCases: [{ input: "'the sky is blue'", expected: "'blue is sky the'" }]
  },
  {
    title: "Longest Palindromic Substring",
    description: "Given a string s, return the longest palindromic substring in s.",
    difficulty: "MEDIUM",
    constraints: "1 <= s.length <= 1000\ns consist of only digits and English letters.",
    sampleInput: "s = 'babad'",
    sampleOutput: "'bab'",
    testCases: [{ input: "'babad'", expected: "'bab'" }]
  },
  {
    title: "Roman to Integer",
    description: "Given a roman numeral, convert it to an integer.",
    difficulty: "EASY",
    constraints: "1 <= s.length <= 15\ns contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
    sampleInput: "s = 'LVIII'",
    sampleOutput: "58",
    testCases: [{ input: "'LVIII'", expected: "58" }]
  },
  {
    title: "Integer to Roman",
    description: "Given an integer, convert it to a Roman numeral.",
    difficulty: "MEDIUM",
    constraints: "1 <= num <= 3999",
    sampleInput: "num = 1994",
    sampleOutput: "'MCMXCIV'",
    testCases: [{ input: "1994", expected: "'MCMXCIV'" }]
  },
  {
    title: "String to Integer (atoi)",
    description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function).",
    difficulty: "MEDIUM",
    constraints: "0 <= s.length <= 200\ns consists of English letters, digits, ' ', '+', '-', and '.'.",
    sampleInput: "s = '   -42'",
    sampleOutput: "-42",
    testCases: [{ input: "'   -42'", expected: "-42" }]
  },
  {
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string ''.",
    difficulty: "EASY",
    constraints: "1 <= strs.length <= 200\n0 <= strs[i].length <= 200",
    sampleInput: "strs = ['flower','flow','flight']",
    sampleOutput: "'fl'",
    testCases: [{ input: "['flower','flow','flight']", expected: "'fl'" }]
  },

  // --- BINARY TREE & BST ---
  {
    title: "Binary Tree Inorder Traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "EASY",
    constraints: "The number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100",
    sampleInput: "root = [1,null,2,3]",
    sampleOutput: "[1,3,2]",
    testCases: [{ input: "[1,null,2,3]", expected: "[1,3,2]" }]
  },
  {
    title: "Binary Tree Preorder Traversal",
    description: "Given the root of a binary tree, return the preorder traversal of its nodes' values.",
    difficulty: "EASY",
    constraints: "The number of nodes in the tree is in the range [0, 100].",
    sampleInput: "root = [1,null,2,3]",
    sampleOutput: "[1,2,3]",
    testCases: [{ input: "[1,null,2,3]", expected: "[1,2,3]" }]
  },
  {
    title: "Binary Tree Postorder Traversal",
    description: "Given the root of a binary tree, return the postorder traversal of its nodes' values.",
    difficulty: "EASY",
    constraints: "The number of nodes in the tree is in the range [0, 100].",
    sampleInput: "root = [1,null,2,3]",
    sampleOutput: "[3,2,1]",
    testCases: [{ input: "[1,null,2,3]", expected: "[3,2,1]" }]
  },
  {
    title: "Maximum Depth of Binary Tree",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    difficulty: "EASY",
    constraints: "The number of nodes in the tree is in the range [0, 10^4].",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "3",
    testCases: [{ input: "[3,9,20,null,null,15,7]", expected: "3" }]
  },
  {
    title: "Diameter of Binary Tree",
    description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree.",
    difficulty: "EASY",
    constraints: "The number of nodes in the tree is in the range [1, 10^4].",
    sampleInput: "root = [1,2,3,4,5]",
    sampleOutput: "3",
    testCases: [{ input: "[1,2,3,4,5]", expected: "3" }]
  },
  {
    title: "Balanced Binary Tree",
    description: "Given a binary tree, determine if it is height-balanced (a binary tree in which the left and right subtrees of every node differ in height by no more than 1).",
    difficulty: "EASY",
    constraints: "The number of nodes in the tree is in the range [0, 5000].",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "true",
    testCases: [{ input: "[3,9,20,null,null,15,7]", expected: "true" }]
  },
  {
    title: "Lowest Common Ancestor of a Binary Tree",
    description: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the tree is in the range [2, 10^5].\nAll Node.val are unique.",
    sampleInput: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
    sampleOutput: "3",
    testCases: [{ input: "[3,5,1,6,2,0,8,null,null,7,4], 5, 1", expected: "3" }]
  },
  {
    title: "Same Tree",
    description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not.",
    difficulty: "EASY",
    constraints: "The number of nodes in both trees is in the range [0, 100].",
    sampleInput: "p = [1,2,3], q = [1,2,3]",
    sampleOutput: "true",
    testCases: [{ input: "[1,2,3], [1,2,3]", expected: "true" }]
  },
  {
    title: "Binary Tree Zigzag Level Order Traversal",
    description: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values (i.e., from left to right, then right to left for the next level and alternate between).",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the tree is in the range [0, 2000].",
    sampleInput: "root = [3,9,20,null,null,15,7]",
    sampleOutput: "[[3],[20,9],[15,7]]",
    testCases: [{ input: "[3,9,20,null,null,15,7]", expected: "[[3],[20,9],[15,7]]" }]
  },
  {
    title: "Boundary Traversal of Binary Tree",
    description: "Given a Binary Tree, find its boundary traversal in anti-clockwise direction starting from the root.",
    difficulty: "MEDIUM",
    constraints: "1 <= Number of nodes <= 10^5",
    sampleInput: "root = [1, 2, 3, 4, 5, 6, 7, null, null, 8, 9]",
    sampleOutput: "[1, 2, 4, 8, 9, 6, 7, 3]",
    testCases: [{ input: "[1,2,3,4,5,6,7,null,null,8,9]", expected: "[1,2,4,8,9,6,7,3]" }]
  },
  {
    title: "Validate Binary Search Tree",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the tree is in the range [1, 10^4].\n-2^31 <= Node.val <= 2^31 - 1",
    sampleInput: "root = [2,1,3]",
    sampleOutput: "true",
    testCases: [{ input: "[2,1,3]", expected: "true" }]
  },
  {
    title: "Lowest Common Ancestor of a Binary Search Tree",
    description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the tree is in the range [2, 10^5].",
    sampleInput: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
    sampleOutput: "6",
    testCases: [{ input: "[6,2,8,0,4,7,9,null,null,3,5], 2, 8", expected: "6" }]
  },
  {
    title: "Kth Smallest Element in a BST",
    description: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    difficulty: "MEDIUM",
    constraints: "The number of nodes in the tree is n.\n1 <= k <= n <= 10^4",
    sampleInput: "root = [3,1,4,null,2], k = 1",
    sampleOutput: "1",
    testCases: [{ input: "[3,1,4,null,2], 1", expected: "1" }]
  },

  // --- GRAPH ---
  {
    title: "Number of Islands",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    difficulty: "MEDIUM",
    constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300",
    sampleInput: "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]",
    sampleOutput: "3",
    testCases: [{ input: "[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]", expected: "3" }]
  },
  {
    title: "Flood Fill",
    description: "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].",
    difficulty: "EASY",
    constraints: "m == image.length\nn == image[i].length\n1 <= m, n <= 50",
    sampleInput: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
    sampleOutput: "[[2,2,2],[2,2,0],[2,0,1]]",
    testCases: [{ input: "[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2", expected: "[[2,2,2],[2,2,0],[2,0,1]]" }]
  },
  {
    title: "Course Schedule",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a_i, b_i] indicates that you must take course b_i first if you want to take course a_i. Return true if you can finish all courses.",
    difficulty: "MEDIUM",
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000",
    sampleInput: "numCourses = 2, prerequisites = [[1,0]]",
    sampleOutput: "true",
    testCases: [{ input: "2, [[1,0]]", expected: "true" }]
  },
  {
    title: "Course Schedule II",
    description: "Given the total number of courses numCourses and a list of prerequisite pairs, return the ordering of courses you should take to finish all courses. If impossible, return an empty array.",
    difficulty: "MEDIUM",
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= numCourses * (numCourses - 1)",
    sampleInput: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
    sampleOutput: "[0,2,1,3]",
    testCases: [{ input: "4, [[1,0],[2,0],[3,1],[3,2]]", expected: "[0,2,1,3]" }]
  },
  {
    title: "Dijkstra's Shortest Path",
    description: "Given a weighted, undirected and connected graph of V vertices and an adjacency list adj where adj[i] is a list of lists containing two integers where the first integer of each list j denotes there is an edge between i and j, and second integer denotes the weight of that edge. Find the shortest distance of all vertices from the source vertex S.",
    difficulty: "MEDIUM",
    constraints: "1 <= V <= 1000\n0 <= S < V",
    sampleInput: "V = 3, E = 3, adj = [[[1, 1], [2, 6]], [[2, 3], [0, 1]], [[1, 3], [0, 6]]], S = 2",
    sampleOutput: "[4, 3, 0]",
    testCases: [{ input: "V=3, S=2", expected: "[4, 3, 0]" }]
  },
  {
    title: "Cheapest Flights Within K Stops",
    description: "There are n cities connected by some number of flights. You are given an array flights where flights[i] = [from_i, to_i, price_i]. You are also given three integers src, dst, and k, return the cheapest price from src to dst with at most k stops. If no such route exists, return -1.",
    difficulty: "MEDIUM",
    constraints: "1 <= n <= 100\n0 <= flights.length <= (n * (n - 1) / 2)\n0 <= k < n",
    sampleInput: "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1",
    sampleOutput: "700",
    testCases: [{ input: "4, flights, 0, 3, 1", expected: "700" }]
  },
  {
    title: "Word Ladder",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    difficulty: "HARD",
    constraints: "1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000",
    sampleInput: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
    sampleOutput: "5",
    testCases: [{ input: "'hit', 'cog', ['hot','dot','dog','lot','log','cog']", expected: "5" }]
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    constraints: "1 <= n <= 45",
    sampleInput: "n = 3",
    sampleOutput: "3",
    testCases: [{ input: "3", expected: "3" }]
  },
  {
    title: "House Robber",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
    sampleInput: "nums = [1,2,3,1]",
    sampleOutput: "4",
    testCases: [{ input: "[1,2,3,1]", expected: "4" }]
  },
  {
    title: "Coin Change",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    difficulty: "MEDIUM",
    constraints: "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
    sampleInput: "coins = [1,2,5], amount = 11",
    sampleOutput: "3",
    testCases: [{ input: "[1,2,5], 11", expected: "3" }]
  },
  {
    title: "0/1 Knapsack Problem",
    description: "You are given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. Note that we have only one quantity of each item.",
    difficulty: "MEDIUM",
    constraints: "1 <= N <= 1000\n1 <= W <= 1000",
    sampleInput: "W = 4, val = [1,2,3], wt = [4,5,1]",
    sampleOutput: "3",
    testCases: [{ input: "4, [1,2,3], [4,5,1]", expected: "3" }]
  },
  {
    title: "Longest Common Subsequence",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    difficulty: "MEDIUM",
    constraints: "1 <= text1.length, text2.length <= 1000\ntext1 and text2 consist of only lowercase English characters.",
    sampleInput: "text1 = 'abcde', text2 = 'ace'",
    sampleOutput: "3",
    testCases: [{ input: "'abcde', 'ace'", expected: "3" }]
  },
  {
    title: "Longest Increasing Subsequence",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) or O(n^2) time.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [10,9,2,5,3,7,101,18]",
    sampleOutput: "4",
    testCases: [{ input: "[10,9,2,5,3,7,101,18]", expected: "4" }]
  },
  {
    title: "Edit Distance",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
    difficulty: "MEDIUM",
    constraints: "0 <= word1.length, word2.length <= 500\nword1 and word2 consist of lowercase English letters.",
    sampleInput: "word1 = 'horse', word2 = 'ros'",
    sampleOutput: "3",
    testCases: [{ input: "'horse', 'ros'", expected: "3" }]
  },
  {
    title: "Maximum Product Subarray",
    description: "Given an integer array nums, find a subarray that has the largest product, and return the product.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 2 * 10^4\n-10 <= nums[i] <= 10",
    sampleInput: "nums = [2,3,-2,4]",
    sampleOutput: "6",
    testCases: [{ input: "[2,3,-2,4]", expected: "6" }]
  },
  {
    title: "Partition Equal Subset Sum",
    description: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.",
    difficulty: "MEDIUM",
    constraints: "1 <= nums.length <= 200\n1 <= nums[i] <= 100",
    sampleInput: "nums = [1,5,11,5]",
    sampleOutput: "true",
    testCases: [{ input: "[1,5,11,5]", expected: "true" }]
  },
  {
    title: "Matrix Chain Multiplication",
    description: "Given a sequence of matrices, find the most efficient way to multiply these matrices together. The problem is not actually to perform the multiplications, but merely to decide in which order to perform the multiplications.",
    difficulty: "HARD",
    constraints: "2 <= N <= 100\n1 <= arr[i] <= 500",
    sampleInput: "N = 5, arr = [40, 20, 30, 10, 30]",
    sampleOutput: "26000",
    testCases: [{ input: "5, [40, 20, 30, 10, 30]", expected: "26000" }]
  },
  {
    title: "Minimum Path Sum",
    description: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.",
    difficulty: "MEDIUM",
    constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 200\n0 <= grid[i][j] <= 200",
    sampleInput: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
    sampleOutput: "7",
    testCases: [{ input: "[[1,3,1],[1,5,1],[4,2,1]]", expected: "7" }]
  },
  {
    title: "Burst Balloons",
    description: "You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. You are asked to burst all the balloons. Return the maximum coins you can collect by bursting the balloons wisely.",
    difficulty: "HARD",
    constraints: "n == nums.length\n1 <= n <= 300\n0 <= nums[i] <= 100",
    sampleInput: "nums = [3,1,5,8]",
    sampleOutput: "167",
    testCases: [{ input: "[3,1,5,8]", expected: "167" }]
  }
];
