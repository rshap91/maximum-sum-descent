# Dynamic Programming

Dynamic programming is a technique for solving problems composed of overlapping sub-problems. Instead of solving every possible subproblem from scratch, you instead start with the simplest and then use the answer of that problem to determine the next, and then the answer from that subproblem to solve the next etc... until the overall problem has been answered. This requires that the answer to any subproblem is some function of its predecessors or neighboring sub-problems. The results to sub-problems are recorded in a table as you go and then answers can be derived from the table.


# Maximum Sum Descent

Given a number pyramid with N tiers, find the path from top to bottom with the greatest sum of values. Each tier in the pyramid has one more value than the tier above it. The Nth row has N values.

The path must consist of only adjacent numbers. The ith value in tier t can go to the ith or i+1th value in tier t+1.

To solve this, we will record for each node in pyramid, the greatest sum that can be found from the tip of the pyramid to that node. In order to avoid re-calculating values for every possible poth, we must note that the maximum sum for a path to a given node in the pyramid is equal to the maximum of the greatest sum of either of its parents plus its own value. Thus we can simply update the answers for each node based on its parents.