Run `npm install` and `npm start`

# Dynamic Programming

Dynamic programming is a technique for solving problems composed of overlapping sub-problems. Instead of solving every possible subproblem from scratch, you instead start with the simplest and then use the answer of that problem to determine the next, and then the answer from that subproblem to solve the next etc... until the overall problem has been answered. This requires that the answer to any subproblem is some function of its predecessors or neighboring sub-problems. The results to sub-problems are recorded in a table as you go and then answers can be derived from the table.


# Maximum Sum Descent

Given a number pyramid with N tiers, find the path from top to bottom with the greatest sum of values. Each tier in the pyramid has one more value than the tier above it. The Nth row has N values.

The path must consist of only adjacent numbers. The ith value in tier t can go to the ith or i+1th value in tier t+1.

To solve this, we will record for each node in pyramid, the greatest sum that can be found from the tip of the pyramid to that node. In order to avoid re-calculating values for every possible poth, we must note that the maximum sum for a path to a given node in the pyramid is equal to the maximum of the greatest sum of either of its parents plus its own value. Thus we can simply update the answers for each node based on its parents.

Dynamic Programming is about breaking a problem down into overlapping subproblems, in which each subproblem can be solved using the answer from a previous sub-problem. This involves solving each sub-problem, recording the result, and then using that result to solve the next subproblem.

In this case, the subproblem is finding the path with the greatest sum of values from the tip to _any other node_, not just the bottom. The key part is that for any node, the maximum sum is equal to the greater of the maximum sums of the path to either of the nodes parents, plus the value of the node. 

Finding the maximum sum from the tip of the pyramid to the second tier is trivial since there is only 1 possible path for each node. 

Record the answers in an answer table for each node in the 2nd tier and then determine the answers for each node in the third tier by selecting the greatest value from each nodes direct parent, then add the nodes value.

If the node only has 1 parent, which is the case for any nodes lying on the outside edges of the pyramid (furthest left or furthest right), then the the maximum sum will be the maximum sum for the parent plus the value of the node. Reference the recorded answers in the answer table to deterimine the maximum sum of the parent nodes.

Continue this process for every node in the pyramid. The final answer is the largest value in the last row of the answer table.