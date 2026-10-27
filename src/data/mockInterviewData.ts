import { AptitudeQuestion, CodingQuestion, ConceptualQuestion, MockInterviewTemplate } from '../types';

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'apt-1',
    category: 'Quantitative Aptitude',
    topic: 'Time & Work',
    difficulty: 'Medium',
    question: 'A can complete a full software migration in 12 days, and B can complete the same migration in 16 days. If they work together for 4 days, what fraction of the total migration remains unfinished?',
    options: [
      '7/12',
      '5/12',
      '7/48',
      '1/3'
    ],
    correctAnswerIndex: 1, // 5/12
    formulaOrHint: 'Work done per day = (1/A + 1/B). Total work done in 4 days = 4 * (1/A + 1/B). Remaining = 1 - Work done.',
    explanation: 'A\'s 1-day work = 1/12. B\'s 1-day work = 1/16.\nCombined 1-day work = (1/12 + 1/16) = (4 + 3)/48 = 7/48.\nIn 4 days, work completed = 4 * (7/48) = 28/48 = 7/12.\nRemaining work = 1 - 7/12 = 5/12.'
  },
  {
    id: 'apt-2',
    category: 'Quantitative Aptitude',
    topic: 'Percentages & Profit Margins',
    difficulty: 'Easy',
    question: 'A cloud SaaS platform increases its monthly subscription price by 25%. By what percentage must a customer reduce their consumed compute units so that their total expenditure remains unchanged?',
    options: [
      '25%',
      '20%',
      '16.67%',
      '30%'
    ],
    correctAnswerIndex: 1, // 20%
    formulaOrHint: 'Reduction % = [r / (100 + r)] * 100%, where r is the percentage increase.',
    explanation: 'Using the standard expenditure formula: If price increases by r%, consumption must decrease by [r / (100 + r)] * 100.\nHere r = 25:\nReduction = [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 1/5 * 100 = 20%.'
  },
  {
    id: 'apt-3',
    category: 'Quantitative Aptitude',
    topic: 'Probability & Combinatorics',
    difficulty: 'Medium',
    question: 'In a microservice deployment pipeline, 3 independent servers handle requests. The probability of server failure is 0.1, 0.2, and 0.05 respectively. What is the probability that at least one server remains operational?',
    options: [
      '0.999',
      '0.950',
      '0.998',
      '0.985'
    ],
    correctAnswerIndex: 0, // 0.999 (P(all fail) = 0.1 * 0.2 * 0.05 = 0.001. P(at least one up) = 1 - 0.001 = 0.999)
    formulaOrHint: 'P(At least one operational) = 1 - P(All servers fail simultaneously).',
    explanation: 'P(Server 1 fails) = 0.1\nP(Server 2 fails) = 0.2\nP(Server 3 fails) = 0.05\nP(All 3 fail) = 0.1 * 0.2 * 0.05 = 0.001\nP(At least 1 works) = 1 - 0.001 = 0.999 (99.9% uptime).'
  },
  {
    id: 'apt-4',
    category: 'Logical & Analytical Reasoning',
    topic: 'Series & Pattern Recognition',
    difficulty: 'Medium',
    question: 'Identify the missing number in the sequence: 4, 12, 36, 108, ?, 972',
    options: [
      '216',
      '324',
      '432',
      '512'
    ],
    correctAnswerIndex: 1, // 324
    formulaOrHint: 'Each term is multiplied by a constant ratio (Geometric Progression).',
    explanation: '4 * 3 = 12\n12 * 3 = 36\n36 * 3 = 108\n108 * 3 = 324\n324 * 3 = 972.\nThe missing number is 324.'
  },
  {
    id: 'apt-5',
    category: 'Logical & Analytical Reasoning',
    topic: 'Syllogisms & Logic Flow',
    difficulty: 'Hard',
    question: 'Statements:\n1. All high-throughput databases use caching.\n2. Some caching systems are in-memory key-value stores.\n3. No in-memory key-value stores persist data to tape drives.\n\nConclusions:\nI. Some high-throughput databases are in-memory key-value stores.\nII. No database caching system persists data to tape drives.\nIII. Some in-memory key-value stores are caching systems.',
    options: [
      'Only Conclusion I follows',
      'Only Conclusion III follows',
      'Both I and III follow',
      'All I, II, and III follow'
    ],
    correctAnswerIndex: 1, // Only Conclusion III follows
    formulaOrHint: 'Check converse of "Some A are B" -> "Some B are A". Avoid unwarranted universal generalizations.',
    explanation: 'Statement 2: "Some caching systems are in-memory key-value stores." The valid converse is "Some in-memory key-value stores are caching systems" (Conclusion III is definitely TRUE).\nConclusion I is not necessarily true because "all databases use caching" does not force intersection with in-memory stores specifically.\nConclusion II falsely generalizes to ALL caching systems.'
  },
  {
    id: 'apt-6',
    category: 'Data Interpretation',
    topic: 'Cohort & Funnel Analytics',
    difficulty: 'Medium',
    question: 'An e-commerce product funnel reports:\n• Total Visitors: 50,000\n• Product Viewers: 60% of Visitors\n• Cart Additions: 30% of Product Viewers\n• Completed Checkout: 40% of Cart Additions\n\nWhat is the overall visitor-to-purchase conversion rate?',
    options: [
      '7.2%',
      '3.6%',
      '5.4%',
      '9.0%'
    ],
    correctAnswerIndex: 1, // 3.6%
    formulaOrHint: 'Overall Rate = Product View Rate * Cart Add Rate * Checkout Rate.',
    explanation: 'Product Viewers = 50,000 * 0.60 = 30,000\nCart Additions = 30,000 * 0.30 = 9,000\nCompleted Checkout = 9,000 * 0.40 = 3,600\nOverall Conversion Rate = (3,600 / 50,000) * 100 = 7.2 / 2 = 3.6%.\n(Alternative: 0.6 * 0.3 * 0.4 = 0.072 = 7.2% of product viewers, or 0.6 * 0.3 * 0.4 = 0.036 = 3.6% of all visitors).'
  },
  {
    id: 'apt-7',
    category: 'Quantitative Aptitude',
    topic: 'Speed, Distance & Latency',
    difficulty: 'Hard',
    question: 'A distributed file synchronization worker uploads data at 40 MB/s during peak hours and 60 MB/s during off-peak hours. If it transfers equal data volumes during both periods, what is the harmonic average transfer speed?',
    options: [
      '50.0 MB/s',
      '48.0 MB/s',
      '46.5 MB/s',
      '52.0 MB/s'
    ],
    correctAnswerIndex: 1, // 48 MB/s
    formulaOrHint: 'Average Speed for equal distances/volumes = (2 * v1 * v2) / (v1 + v2).',
    explanation: 'When transferring equal volumes at speeds v1 and v2, the average speed is given by the Harmonic Mean:\nAvg = (2 * 40 * 60) / (40 + 60) = 4800 / 100 = 48.0 MB/s.'
  },
  {
    id: 'apt-8',
    category: 'Logical & Analytical Reasoning',
    topic: 'Arrangement & Dependencies',
    difficulty: 'Medium',
    question: 'Five deployment tasks (P, Q, R, S, T) must be executed in order following these rules:\n1. P must run before Q.\n2. R must run immediately after T.\n3. S cannot be the first or last task.\n4. Q must run after R.\nIf T is the 2nd task executed, which task MUST be executed first?',
    options: [
      'P',
      'S',
      'R',
      'Q'
    ],
    correctAnswerIndex: 0, // P
    formulaOrHint: 'Place known positions: _ , T, R, _ , _. Then satisfy P before Q and S not last.',
    explanation: 'Position 2 is T. Since R immediately follows T, Position 3 is R.\nCurrent layout: [1: ? , 2: T, 3: R, 4: ?, 5: ?].\nRules: P must run before Q, Q must run after R, S cannot be last (so S is at 4, Q is at 5, P is at 1).\nSequence: P -> T -> R -> S -> Q.\nTherefore, Task P MUST execute first.'
  },
  {
    id: 'apt-9',
    category: 'Quantitative Aptitude',
    topic: 'Compound Growth & Server Sizing',
    difficulty: 'Medium',
    question: 'A company\'s monthly API request volume is 10 million and grows at a compound rate of 20% every quarter (every 3 months). What will the monthly request volume be after 9 months?',
    options: [
      '17.28 Million',
      '16.00 Million',
      '18.40 Million',
      '15.50 Million'
    ],
    correctAnswerIndex: 0, // 17.28M
    formulaOrHint: 'Future Volume = Initial * (1 + r)^n where n = 9/3 = 3 quarters.',
    explanation: 'After 3 quarters (9 months) at 20% quarterly growth:\nMonth 3: 10 * 1.2 = 12M\nMonth 6: 12 * 1.2 = 14.4M\nMonth 9: 14.4 * 1.2 = 17.28M.\nFormula: 10 * (1.20)^3 = 10 * 1.728 = 17.28 Million.'
  },
  {
    id: 'apt-10',
    category: 'Logical & Analytical Reasoning',
    topic: 'Set Theory & Microservice Venn Logic',
    difficulty: 'Hard',
    question: 'In an engineering department of 100 developers:\n• 65 know Python\n• 50 know TypeScript\n• 25 know both Python and TypeScript\nHow many developers know NEITHER Python nor TypeScript?',
    options: [
      '10',
      '15',
      '20',
      '5'
    ],
    correctAnswerIndex: 0, // 10
    formulaOrHint: '|A ∪ B| = |A| + |B| - |A ∩ B|. Neither = Total - |A ∪ B|.',
    explanation: 'Total knowing Python or TypeScript = 65 + 50 - 25 = 90.\nDevelopers knowing neither = Total (100) - 90 = 10 developers.'
  },
  {
    id: 'apt-11',
    category: 'Quantitative Aptitude',
    topic: 'Ratio & Proportions (Read/Write Replicas)',
    difficulty: 'Easy',
    question: 'A distributed database cluster maintains a Read-to-Write traffic ratio of 7 : 3. If the database receives 42,000 read queries per minute, what is the total queries (Read + Write) handled per minute?',
    options: [
      '60,000 QPM',
      '56,000 QPM',
      '64,000 QPM',
      '70,000 QPM'
    ],
    correctAnswerIndex: 0, // 60,000
    formulaOrHint: 'If Read = 7 parts = 42,000, 1 part = 6,000. Total = 10 parts = 60,000.',
    explanation: 'Read parts = 7 -> 7 units = 42,000 -> 1 unit = 6,000.\nWrite queries = 3 * 6,000 = 18,000.\nTotal queries = 42,000 + 18,000 = 60,000 QPM.'
  },
  {
    id: 'apt-12',
    category: 'Data Interpretation',
    topic: 'System Error Rates & SLA Availability',
    difficulty: 'Medium',
    question: 'A payment gateway processes 1,000,000 transactions daily with a "Three Nines" (99.9%) success SLA. During an incident, 2,500 transactions failed. By how many failures did the incident exceed the SLA tolerance?',
    options: [
      '1,500 failures',
      '1,000 failures',
      '2,000 failures',
      '500 failures'
    ],
    correctAnswerIndex: 0, // 1,500
    formulaOrHint: 'Permissible failures for 99.9% = 0.1% of 1,000,000 = 1,000.',
    explanation: '99.9% SLA allows a 0.1% failure rate.\nAllowed failures = 1,000,000 * 0.001 = 1,000 failures.\nActual failures = 2,500.\nExceeded tolerance = 2,500 - 1,000 = 1,500 failures.'
  },
  {
    id: 'apt-13',
    category: 'Logical & Analytical Reasoning',
    topic: 'Bitwise & Binary Subnetting Logic',
    difficulty: 'Hard',
    question: 'An IPv4 subnet mask is /27 (255.255.255.224). How many usable host IP addresses can be allocated in this subnet (excluding the Network ID and Broadcast IP)?',
    options: [
      '30',
      '32',
      '28',
      '62'
    ],
    correctAnswerIndex: 0, // 30
    formulaOrHint: 'Host bits = 32 - 27 = 5. Usable hosts = (2^5) - 2.',
    explanation: 'In a /27 subnet, 32 - 27 = 5 bits remain for host addressing.\nTotal IP addresses = 2^5 = 32.\nSubtracting 1 for Network Address and 1 for Broadcast Address gives 32 - 2 = 30 usable host IPs.'
  },
  {
    id: 'apt-14',
    category: 'Quantitative Aptitude',
    topic: 'Combinatorics & Password Entropy',
    difficulty: 'Medium',
    question: 'How many distinct 4-character authorization tokens can be formed using digits (0-9) where repetitions are NOT allowed and the first digit cannot be 0?',
    options: [
      '4,536',
      '5,040',
      '3,024',
      '4,000'
    ],
    correctAnswerIndex: 0, // 4536
    formulaOrHint: '1st digit: 9 choices (1-9). 2nd digit: 9 choices (0-9 except 1st). 3rd digit: 8 choices. 4th digit: 7 choices.',
    explanation: 'Choices for 1st digit (1-9): 9.\nChoices for 2nd digit (remaining digits including 0): 9.\nChoices for 3rd digit: 8.\nChoices for 4th digit: 7.\nTotal permutations = 9 * 9 * 8 * 7 = 4,536.'
  },
  {
    id: 'apt-15',
    category: 'Logical & Analytical Reasoning',
    topic: 'Data Sufficiency: Pipeline Bottleneck',
    difficulty: 'Hard',
    question: 'Question: Can Worker C finish a batch processing job in less than 5 hours?\nStatement 1: Workers A and C together finish the job in 3 hours.\nStatement 2: Worker A alone finishes the job in 6 hours.\nWhich statements are sufficient to answer?',
    options: [
      'BOTH statements TOGETHER are sufficient, but neither alone',
      'Statement 1 ALONE is sufficient',
      'Statement 2 ALONE is sufficient',
      'Statements 1 and 2 together are NOT sufficient'
    ],
    correctAnswerIndex: 0,
    formulaOrHint: 'Use 1/A + 1/C = 1/3 and 1/A = 1/6 to compute C.',
    explanation: 'From Statement 1: 1/A + 1/C = 1/3.\nFrom Statement 2: 1/A = 1/6.\nCombining both: 1/6 + 1/C = 1/3 => 1/C = 1/3 - 1/6 = 1/6 => C takes 6 hours.\nSince 6 hours is NOT less than 5 hours, we can conclusively answer "NO".\nBoth statements together are sufficient.'
  },
  {
    id: 'apt-16',
    category: 'Logical & Analytical Reasoning',
    topic: 'Clocks & Angles',
    difficulty: 'Easy',
    question: 'What is the acute angle between the hour hand and the minute hand of an analog server room clock at 3:30?',
    options: [
      '75°',
      '80°',
      '90°',
      '70°'
    ],
    correctAnswerIndex: 0, // 75 degrees
    formulaOrHint: 'Angle = |30*H - 5.5*M| where H=3 and M=30.',
    explanation: 'Using the clock formula:\nAngle = |30 * 3 - 5.5 * 30| = |90 - 165| = |-75| = 75°.'
  }
];

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: 'code-1',
    title: 'Two Sum / Target KPI Pair',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    targetRoles: ['Data Analyst', 'Frontend Engineer', 'Backend Engineer', 'Full-Stack Developer'],
    description: `Given an array of integer metric values \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.

### Objectives:
- Achieve optimal **O(N)** runtime using a Hash Map / Dictionary.
- Handle positive, negative, and zero integers gracefully.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 3 + 3 == 6.'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`
    },
    referenceSolution: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [lookup[complement], i]
        lookup[num] = i
    return []`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[2, 7, 11, 15], 9',
        expectedOutput: '[0, 1]',
        explanation: 'Standard positive array lookup'
      },
      {
        id: 'tc-2',
        input: '[3, 2, 4], 6',
        expectedOutput: '[1, 2]',
        explanation: 'Non-adjacent indices'
      },
      {
        id: 'tc-3',
        input: '[-1, -2, -3, -4, -5], -8',
        expectedOutput: '[2, 4]',
        explanation: 'Negative integer handling (-3 + -5 = -8)'
      },
      {
        id: 'tc-4',
        input: '[0, 4, 3, 0], 0',
        expectedOutput: '[0, 3]',
        explanation: 'Duplicate zero edge case'
      }
    ],
    solutionExplanation: `### Optimal Hash Map Approach (O(N) Time, O(N) Space)
Instead of checking all pairs using nested loops (which costs O(N^2) time), we iterate through the list once.
For each element \`x\`, we calculate its required counterpart: \`complement = target - x\`.
We check if \`complement\` is already stored in our Map:
1. If yes, we found the pair! Return \`[map.get(complement), currentIndex]\`.
2. If no, insert the current number and its index into the map \`map.set(x, currentIndex)\`.`,
    optimalTimeComplexity: 'O(N) single-pass scan',
    optimalSpaceComplexity: 'O(N) to store values in hash table',
    hints: [
      'Can you solve this in a single pass using a hash table instead of nested loops?',
      'Store each number alongside its index as you iterate through the list.',
      'Check if (target - currentNumber) has already been seen in the map.'
    ]
  },
  {
    id: 'code-2',
    title: 'Top Department Earners & SQL Window Ranking',
    difficulty: 'Medium',
    category: 'Data Manipulation & SQL',
    targetRoles: ['Data Analyst', 'Backend Engineer', 'Data Engineer'],
    description: `A company maintains an \`Employee\` dataset with \`{ id, name, salary, departmentId, departmentName }\`.

Write a query / function that returns the **top 2 highest earners** in each department. If there are ties in salary, both employees should share the rank.

### Expected Output:
Array of records sorted by \`departmentName\` ascending, then \`salary\` descending:
\`\`\`json
[
  { "department": "Engineering", "employee": "Alice", "salary": 140000, "rank": 1 },
  { "department": "Engineering", "employee": "Bob", "salary": 130000, "rank": 2 },
  { "department": "Marketing", "employee": "Carol", "salary": 95000, "rank": 1 }
]
\`\`\``,
    examples: [
      {
        input: `employees = [
  { id: 1, name: 'Alice', salary: 140000, department: 'Engineering' },
  { id: 2, name: 'Bob', salary: 130000, department: 'Engineering' },
  { id: 3, name: 'Charlie', salary: 110000, department: 'Engineering' },
  { id: 4, name: 'Diana', salary: 105000, department: 'Marketing' },
  { id: 5, name: 'Evan', salary: 95000, department: 'Marketing' }
]`,
        output: `[
  { department: 'Engineering', employee: 'Alice', salary: 140000, rank: 1 },
  { department: 'Engineering', employee: 'Bob', salary: 130000, rank: 2 },
  { department: 'Marketing', employee: 'Diana', salary: 105000, rank: 1 },
  { department: 'Marketing', employee: 'Evan', salary: 95000, rank: 2 }
]`
      }
    ],
    constraints: [
      'Number of employees: 1 <= N <= 10^5',
      'Salary: 30000 <= salary <= 500000',
      'Handle multiple departments and rank ties correctly.'
    ],
    starterCode: {
      javascript: `/**
 * @param {Array<{id: number, name: string, salary: number, department: string}>} employees
 * @param {number} topN
 * @return {Array<{department: string, employee: string, salary: number, rank: number}>}
 */
function getTopDepartmentEarners(employees, topN = 2) {
  // Write your solution here
  
}`,
      typescript: `interface Employee {
  id: number;
  name: string;
  salary: number;
  department: string;
}

interface RankedEarner {
  department: string;
  employee: string;
  salary: number;
  rank: number;
}

function getTopDepartmentEarners(employees: Employee[], topN: number = 2): RankedEarner[] {
  // Write your solution here
  
}`,
      python: `def get_top_department_earners(employees: list[dict], top_n: int = 2) -> list[dict]:
    # Write your solution here
    pass`,
      sql: `-- Write your SQL query to find the top 2 highest earners in each department
-- You may use DENSE_RANK() or JOINs

SELECT 
  -- Write your query logic here
;`
    },
    referenceSolution: {
      javascript: `function getTopDepartmentEarners(employees, topN = 2) {
  const deptMap = new Map();
  for (const emp of employees) {
    if (!deptMap.has(emp.department)) {
      deptMap.set(emp.department, []);
    }
    deptMap.get(emp.department).push(emp);
  }

  const result = [];
  const sortedDepts = Array.from(deptMap.keys()).sort();

  for (const dept of sortedDepts) {
    const list = deptMap.get(dept).sort((a, b) => b.salary - a.salary);
    let rank = 1;
    for (let i = 0; i < list.length; i++) {
      if (i > 0 && list[i].salary < list[i - 1].salary) {
        rank++;
      }
      if (rank <= topN) {
        result.push({
          department: dept,
          employee: list[i].name,
          salary: list[i].salary,
          rank: rank
        });
      }
    }
  }

  return result;
}`,
      typescript: `function getTopDepartmentEarners(employees: Employee[], topN: number = 2): RankedEarner[] {
  const deptMap = new Map<string, Employee[]>();
  for (const emp of employees) {
    if (!deptMap.has(emp.department)) {
      deptMap.set(emp.department, []);
    }
    deptMap.get(emp.department)!.push(emp);
  }

  const result: RankedEarner[] = [];
  const sortedDepts = Array.from(deptMap.keys()).sort();

  for (const dept of sortedDepts) {
    const list = deptMap.get(dept)!.sort((a, b) => b.salary - a.salary);
    let rank = 1;
    for (let i = 0; i < list.length; i++) {
      if (i > 0 && list[i].salary < list[i - 1].salary) {
        rank++;
      }
      if (rank <= topN) {
        result.push({
          department: dept,
          employee: list[i].name,
          salary: list[i].salary,
          rank
        });
      }
    }
  }

  return result;
}`,
      python: `def get_top_department_earners(employees: list[dict], top_n: int = 2) -> list[dict]:
    from collections import defaultdict
    dept_groups = defaultdict(list)
    for emp in employees:
        dept_groups[emp['department']].append(emp)
    
    result = []
    for dept in sorted(dept_groups.keys()):
        sorted_emps = sorted(dept_groups[dept], key=lambda x: x['salary'], reverse=True)
        rank = 1
        for i, emp in enumerate(sorted_emps):
            if i > 0 and emp['salary'] < sorted_emps[i - 1]['salary']:
                rank += 1
            if rank <= top_n:
                result.append({
                    "department": dept,
                    "employee": emp['name'],
                    "salary": emp['salary'],
                    "rank": rank
                })
    return result`,
      sql: `WITH RankedSalaries AS (
  SELECT 
    d.name AS department,
    e.name AS employee,
    e.salary,
    DENSE_RANK() OVER(PARTITION BY e.department_id ORDER BY e.salary DESC) as ranking
  FROM Employee e
  JOIN Department d ON e.department_id = d.id
)
SELECT department, employee, salary, ranking as rank
FROM RankedSalaries
WHERE ranking <= 2
ORDER BY department ASC, salary DESC;`
    },
    testCases: [
      {
        id: 'tc-2-1',
        input: 'Standard 2 departments with 3 employees each',
        expectedOutput: '4 total ranked records (2 per department)',
        explanation: 'Correct grouping and ranking without ties'
      },
      {
        id: 'tc-2-2',
        input: 'Department with equal salaries (ties)',
        expectedOutput: 'Shared rank 1 for both tied employees',
        explanation: 'Dense ranking behavior verified'
      }
    ],
    solutionExplanation: `### Analytical Ranking & Window Functions
In SQL, this is solved elegantly via \`DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC)\`.
In JavaScript/Python, we partition the dataset by department using a Hash Map, sort each bucket by salary descending, and compute continuous or dense rank before filtering up to \`topN\`.`,
    optimalTimeComplexity: 'O(N log K) where K is max employees per department',
    optimalSpaceComplexity: 'O(N) for partitioning',
    hints: [
      'Group entries by department first.',
      'Sort salaries within each department in descending order.',
      'Remember that tied salaries should receive the exact same rank.'
    ]
  },
  {
    id: 'code-3',
    title: 'Valid Parentheses & Code Syntax Validator',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    targetRoles: ['Frontend Engineer', 'Backend Engineer', 'Full-Stack Developer'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      },
      {
        input: 's = "([)]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValidParentheses(s) {
  // Write your solution here
  
}`,
      typescript: `function isValidParentheses(s: string): boolean {
  // Write your solution here
  
}`,
      python: `def is_valid_parentheses(s: str) -> bool:
    # Write your solution here
    pass`
    },
    referenceSolution: {
      javascript: `function isValidParentheses(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
      typescript: `function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
      python: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`
    },
    testCases: [
      {
        id: 'tc-3-1',
        input: '"()[]{}"',
        expectedOutput: 'true',
        explanation: 'All closed in order'
      },
      {
        id: 'tc-3-2',
        input: '"(]"',
        expectedOutput: 'false',
        explanation: 'Mismatched type'
      },
      {
        id: 'tc-3-3',
        input: '"{[()()]}"',
        expectedOutput: 'true',
        explanation: 'Nested correctly'
      },
      {
        id: 'tc-3-4',
        input: '"["',
        expectedOutput: 'false',
        explanation: 'Unclosed open bracket'
      }
    ],
    solutionExplanation: `### Classic Stack Pattern (LIFO)
Whenever we encounter an opening bracket, we push it onto our stack.
When we encounter a closing bracket, we check if the stack's top element matches its corresponding opening pair.
If it doesn't match or the stack is empty, return false.
At the end of the string, the stack must be completely empty.`,
    optimalTimeComplexity: 'O(N) single pass',
    optimalSpaceComplexity: 'O(N) for the stack',
    hints: [
      'Use a Stack data structure to track unmatched opening brackets.',
      'A closing bracket must match the most recently added open bracket.'
    ]
  },
  {
    id: 'code-4',
    title: 'Async Rate Limiter & Concurrency Queue',
    difficulty: 'Hard',
    category: 'Objects & Async Logic',
    targetRoles: ['Frontend Engineer', 'Backend Engineer', 'Full-Stack Developer'],
    description: `Design a batch task runner \`runConcurrentTasks(tasks, concurrencyLimit)\` that executes an array of asynchronous functions \`tasks\` with a maximum concurrency threshold of \`concurrencyLimit\`.

### Requirements:
- At any point in time, no more than \`concurrencyLimit\` promises may be actively pending.
- Returns a Promise resolving to an array of results in the **exact original order** of the input tasks.
- If any task rejects, reject the master promise with that error immediately.`,
    examples: [
      {
        input: 'tasks = [() => fetch(A), () => fetch(B), () => fetch(C)], limit = 2',
        output: '[resultA, resultB, resultC]',
        explanation: 'Executes A and B in parallel. Once either completes, begins C.'
      }
    ],
    constraints: [
      '1 <= tasks.length <= 100',
      '1 <= concurrencyLimit <= 20'
    ],
    starterCode: {
      javascript: `/**
 * @param {Array<() => Promise<any>>} tasks
 * @param {number} limit
 * @return {Promise<any[]>}
 */
async function runConcurrentTasks(tasks, limit = 2) {
  // Write your solution here
  
}`,
      typescript: `async function runConcurrentTasks<T>(
  tasks: Array<() => Promise<T>>,
  limit: number = 2
): Promise<T[]> {
  // Write your solution here
  
}`,
      python: `import asyncio

async def run_concurrent_tasks(tasks, limit: int = 2):
    # Write your solution here
    pass`
    },
    referenceSolution: {
      javascript: `async function runConcurrentTasks(tasks, limit = 2) {
  const results = new Array(tasks.length);
  let nextTaskIndex = 0;

  async function worker() {
    while (nextTaskIndex < tasks.length) {
      const index = nextTaskIndex++;
      results[index] = await tasks[index]();
    }
  }

  const workerPool = [];
  const poolSize = Math.min(limit, tasks.length);
  for (let i = 0; i < poolSize; i++) {
    workerPool.push(worker());
  }

  await Promise.all(workerPool);
  return results;
}`,
      typescript: `async function runConcurrentTasks<T>(
  tasks: Array<() => Promise<T>>,
  limit: number = 2
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextTaskIndex = 0;

  async function worker(): Promise<void> {
    while (nextTaskIndex < tasks.length) {
      const index = nextTaskIndex++;
      results[index] = await tasks[index]();
    }
  }

  const workerPool: Promise<void>[] = [];
  const poolSize = Math.min(limit, tasks.length);
  for (let i = 0; i < poolSize; i++) {
    workerPool.push(worker());
  }

  await Promise.all(workerPool);
  return results;
}`,
      python: `import asyncio

async def run_concurrent_tasks(tasks, limit: int = 2):
    semaphore = asyncio.Semaphore(limit)
    
    async def worker(task):
        async with semaphore:
            return await task()
            
    return await asyncio.gather(*(worker(t) for t in tasks))`
    },
    testCases: [
      {
        id: 'tc-4-1',
        input: '5 async tasks with delay [100ms, 50ms, 80ms, 20ms, 40ms], limit = 2',
        expectedOutput: 'All 5 tasks completed in order with max concurrency 2',
        explanation: 'Concurrency limit strictly respected'
      }
    ],
    solutionExplanation: `### Worker Pool Pattern
We instantiate \`limit\` parallel worker functions that continuously dequeue and execute tasks from the shared queue until all items are completed.
Using a predefined index ensures outputs land in their original sequence without race conditions.`,
    optimalTimeComplexity: 'O(N) where N is total tasks',
    optimalSpaceComplexity: 'O(limit) for active concurrent promises',
    hints: [
      'Create a fixed pool of async workers that pull work from a shared index cursor.',
      'Assign results to their original indices in a pre-allocated array.'
    ]
  },
  {
    id: 'code-5',
    title: 'Merge Overlapping Intervals / Time Slots',
    difficulty: 'Medium',
    category: 'Arrays & Intervals',
    targetRoles: ['Data Analyst', 'Software Engineer', 'Full-Stack Developer'],
    description: `Given an array of meeting or schedule \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Example:
\`\`\`js
intervals = [[1,3],[2,6],[8,10],[15,18]]
output = [[1,6],[8,10],[15,18]]
\`\`\`
Since intervals \`[1,3]\` and \`[2,6]\` overlap, they merge into \`[1,6]\`.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Intervals [1,3] and [2,6] overlap, merging into [1,6].'
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping at point 4.'
      }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function mergeIntervals(intervals) {
  // Write your solution here
  
}`,
      typescript: `function mergeIntervals(intervals: number[][]): number[][] {
  // Write your solution here
  
}`,
      python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    # Write your solution here
    pass`
    },
    referenceSolution: {
      javascript: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
      typescript: `function mergeIntervals(intervals: number[][]): number[][] {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
      python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    return merged`
    },
    testCases: [
      {
        id: 'tc-5-1',
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
        explanation: '[1,3] and [2,6] merge into [1,6]'
      },
      {
        id: 'tc-5-2',
        input: '[[1,4],[4,5]]',
        expectedOutput: '[[1,5]]',
        explanation: 'Adjacent touching intervals merge'
      }
    ],
    solutionExplanation: `### Sort and Linear Scan Pattern
1. Sort intervals by their start time ($O(N \\log N)$).
2. Maintain a \`merged\` list. For each subsequent interval, if its start is $\\le$ the previous end, extend the end with $\\max(\\text{prev.end}, \\text{curr.end})$.
3. Otherwise, append the current interval as a new segment.`,
    optimalTimeComplexity: 'O(N log N) due to sorting',
    optimalSpaceComplexity: 'O(N) for storing merged output',
    hints: [
      'Sort the intervals by their start times first.',
      'Compare each interval start with the previous interval end.'
    ]
  },
  {
    id: 'code-6',
    title: 'Group Anagrams / Log Token Buckets',
    difficulty: 'Medium',
    category: 'Strings & Hash Map',
    targetRoles: ['Software Engineer', 'Backend Engineer', 'Full-Stack Developer'],
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'All anagrams grouped into distinct nested arrays.'
      }
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    starterCode: {
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Write your solution here
  
}`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Write your solution here
  
}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Write your solution here
    pass`
    },
    referenceSolution: {
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(s);
  }
  return Array.from(map.values());
}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    from collections import defaultdict
    ans = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        ans[key].append(s)
    return list(ans.values())`
    },
    testCases: [
      {
        id: 'tc-6-1',
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '3 groups of anagrams',
        explanation: 'eat/tea/ate, tan/nat, and bat'
      },
      {
        id: 'tc-6-2',
        input: '["a"]',
        expectedOutput: '[["a"]]',
        explanation: 'Single element array'
      }
    ],
    solutionExplanation: `### Canonical Hash Map Key Pattern
Every anagram shares the exact same sorted character sequence.
By sorting each word and using it as a Hash Map key, we can group all anagrams in $O(N \\cdot K \\log K)$ time where $K$ is max word length.`,
    optimalTimeComplexity: 'O(N * K log K)',
    optimalSpaceComplexity: 'O(N * K)',
    hints: [
      'Sort each string alphabetically to form a canonical key.',
      'Store matching words in a Hash Map indexed by the sorted key.'
    ]
  }
];

export const CONCEPTUAL_QUESTIONS: ConceptualQuestion[] = [
  {
    id: 'conc-1',
    topic: 'Database Indexing & Performance',
    targetRole: 'Data Analyst & Backend Engineer',
    difficulty: 'Medium',
    question: 'How do B-Tree and Hash indexes differ in relational databases (PostgreSQL/MySQL), and when would an index degrade query performance rather than accelerate it?',
    keyPointsExpected: [
      'B-Tree supports range queries (BETWEEN, <, >, ORDER BY) whereas Hash index is O(1) equality only.',
      'Write overhead: Every INSERT/UPDATE/DELETE requires updating index pages on disk.',
      'Low cardinality columns (e.g. boolean flags) can cause table scan to be cheaper than index scan.'
    ],
    sampleIdealAnswer: `B-Tree indexes maintain a balanced tree hierarchy suitable for both point lookups and range scans (like BETWEEN, <, >, and ORDER BY). Hash indexes only support O(1) exact equality matching.

Indexes can degrade performance when:
1. High write-heavy tables: Every INSERT, UPDATE, or DELETE requires additional I/O to rebalance and write index pages.
2. Low cardinality columns (like Gender or Boolean flags): The query planner may perform better with a sequential scan due to page cache locality.
3. Excessive indexes on small tables: Overhead of index storage and memory exceeds the table scan cost.`
  },
  {
    id: 'conc-2',
    topic: 'System Architecture & Resiliency',
    targetRole: 'Full-Stack & Frontend Engineer',
    difficulty: 'Medium',
    question: 'Explain the difference between optimistic UI updates and pessimistic UI updates in web applications. How should error rollbacks be handled gracefully?',
    keyPointsExpected: [
      'Optimistic updates reflect state change immediately in the client UI before server confirmation.',
      'Pessimistic updates wait for HTTP 200/201 response before modifying UI with loading spinner.',
      'Rollback strategy: Cache snapshot of previous state, restore on catch/error, and display non-intrusive toast alert.'
    ],
    sampleIdealAnswer: `Optimistic UI updates modify the client-side state and view immediately upon user interaction (e.g. liking a post or adding a todo item), assuming the server request will succeed. This provides zero perceived latency.

Pessimistic UI updates display a loading indicator and only update the UI once the server returns a successful confirmation status code.

Graceful error rollback requires:
1. Snapshotting the previous state before dispatching the async network request.
2. If the API returns a 4xx/5xx error or times out, seamlessly reverting the local state to the snapshot.
3. Notifying the user with an actionable toast alert (e.g. "Failed to save, tap to retry").`
  },
  {
    id: 'conc-3',
    topic: 'API Protocol Design & Trade-offs',
    targetRole: 'Full-Stack & Backend Engineer',
    difficulty: 'Medium',
    question: 'Compare REST, GraphQL, and gRPC in terms of payload serialization, network overhead, type safety, and real-time streaming suitability.',
    keyPointsExpected: [
      'REST uses JSON over HTTP/1.1 or HTTP/2, easy caching via HTTP verbs, but prone to over/under-fetching.',
      'GraphQL allows client-specified queries avoiding over-fetching, but complex caching and query parsing overhead.',
      'gRPC uses Protocol Buffers (binary serialization) over HTTP/2 with bidirectional streaming and strict compile-time types.'
    ],
    sampleIdealAnswer: `1. REST: Standardized JSON over HTTP/1.1 or HTTP/2. Ideal for public web APIs and caching with CDNs, but can cause over/under-fetching.
2. GraphQL: Client-driven query language over single HTTP POST endpoint. Eliminates over-fetching for complex frontends, but shifts complexity to backend query resolution and complicates edge HTTP caching.
3. gRPC: Binary protocol buffers over HTTP/2 with multiplexed bidirectional streaming and strongly-typed contracts. Ideal for high-performance internal microservice communication.`
  },
  {
    id: 'conc-4',
    topic: 'Distributed Caching & Cache Invalidation',
    targetRole: 'Backend Engineer & System Architect',
    difficulty: 'Hard',
    question: 'What are the trade-offs between Cache-Aside (Lazy Loading), Write-Through, and Write-Behind caching strategies? How do you prevent Cache Stampedes (Thundering Herd)?',
    keyPointsExpected: [
      'Cache-Aside only loads data on request; cache misses incur latency but cache is lean.',
      'Write-Through writes to cache and DB simultaneously, ensuring consistency at the cost of higher write latency.',
      'Cache Stampede prevention: Distributed mutex locking, probabilistic early expiration (XFetch), or background cache warmers.'
    ],
    sampleIdealAnswer: `• Cache-Aside: App reads from cache; on miss, reads DB and populates cache. Pro: only requested data is cached. Con: cache miss penalty and potential stale reads.
• Write-Through: App writes to cache, which synchronously writes to DB. Pro: cache always fresh. Con: higher write latency.
• Write-Behind: App writes to cache and acknowledges immediately; cache asynchronously writes to DB. Pro: lightning-fast writes. Con: risk of data loss on cache crash.

Preventing Cache Stampedes:
1. Distributed Mutex Lock: Only one worker queries the database on cache miss while others wait for the cache key to populate.
2. Probabilistic Early Recomputation (XFetch): Proactively refresh hot keys before they expire based on read frequency.`
  },
  {
    id: 'conc-5',
    topic: 'Database Scalability & Partitioning',
    targetRole: 'Data Engineer & Backend Engineer',
    difficulty: 'Hard',
    question: 'How do Horizontal Partitioning (Sharding) and Vertical Partitioning differ? What are the challenges introduced by cross-shard joins and distributed transactions?',
    keyPointsExpected: [
      'Horizontal Sharding splits rows across multiple database nodes using a shard key.',
      'Vertical Partitioning splits columns (e.g. BLOBs or large text into separate tables/drives).',
      'Challenges: Cross-shard joins require distributed scatter-gather queries, two-phase commit (2PC) or Saga patterns for atomicity.'
    ],
    sampleIdealAnswer: `• Horizontal Partitioning (Sharding): Divides rows of a table across multiple database servers based on a shard key (e.g. Hash(tenant_id) % N). Enables linear storage and query scaling.
• Vertical Partitioning: Divides columns into distinct tables, separating frequently accessed hot columns from rarely queried heavy columns (e.g. user profile text vs avatar blobs).

Distributed Challenges:
1. Cross-shard joins are computationally expensive as data must be transferred over the internal network to a coordinator node.
2. Distributed Transactions: ACID transactions across multiple physical shards require Two-Phase Commit (2PC) or event-driven Saga choreography to maintain eventual consistency.`
  }
];

export const MOCK_INTERVIEW_TEMPLATES: MockInterviewTemplate[] = [
  {
    id: 'template-data-analyst',
    title: 'Data Analyst Technical & Analytical Assessment',
    description: 'Comprehensive evaluation covering Quantitative & Business Aptitude, SQL & Data Manipulation, and Data Modeling Concepts.',
    role: 'Data Analyst',
    durationMinutes: 30,
    aptitudeQuestionIds: ['apt-1', 'apt-2', 'apt-6', 'apt-7', 'apt-9', 'apt-11', 'apt-12'],
    codingQuestionIds: ['code-1', 'code-2', 'code-5'],
    conceptualQuestionIds: ['conc-1', 'conc-5'],
    difficulty: 'Medium',
    skillsEvaluated: ['SQL & Queries', 'Quantitative Reasoning', 'Data Interpretation', 'Analytical Problem Solving']
  },
  {
    id: 'template-software-engineer',
    title: 'Full Stack & Software Engineer Live Assessment',
    description: 'Timed assessment blending Logical Reasoning, Core Algorithms (Two Sum & Parentheses), Async Concurrency, and System Architecture.',
    role: 'Full-Stack Developer',
    durationMinutes: 45,
    aptitudeQuestionIds: ['apt-3', 'apt-4', 'apt-5', 'apt-8', 'apt-10', 'apt-13', 'apt-14', 'apt-15'],
    codingQuestionIds: ['code-1', 'code-3', 'code-4', 'code-5', 'code-6'],
    conceptualQuestionIds: ['conc-2', 'conc-3', 'conc-4'],
    difficulty: 'Medium',
    skillsEvaluated: ['Data Structures & Algorithms', 'Async JavaScript/TypeScript', 'Logical Deduction', 'Clean Code Architecture']
  },
  {
    id: 'template-speed-aptitude',
    title: 'Speed Aptitude & Logical Reasoning Diagnostic',
    description: 'Fast-paced drill focusing purely on Quantitative Aptitude, Combinatorics, Logic Flow, and Data Funnels.',
    role: 'All Tech Roles',
    durationMinutes: 15,
    aptitudeQuestionIds: ['apt-1', 'apt-2', 'apt-3', 'apt-4', 'apt-5', 'apt-6', 'apt-7', 'apt-8', 'apt-9', 'apt-10', 'apt-11', 'apt-12', 'apt-13', 'apt-14', 'apt-15', 'apt-16'],
    codingQuestionIds: [],
    conceptualQuestionIds: [],
    difficulty: 'Easy',
    skillsEvaluated: ['Speed Math', 'Probability', 'Analytical Logic', 'Data Literacy']
  },
  {
    id: 'template-coding-arena',
    title: 'Technical Coding Arena & DSA Challenge',
    description: 'Dedicated coding challenges testing Arrays, Hash Maps, SQL Window Functions, Stack Parsers, and Concurrent Queues with live test runner.',
    role: 'Software Engineer',
    durationMinutes: 40,
    aptitudeQuestionIds: [],
    codingQuestionIds: ['code-1', 'code-2', 'code-3', 'code-4', 'code-5', 'code-6'],
    conceptualQuestionIds: ['conc-1', 'conc-2', 'conc-3', 'conc-4', 'conc-5'],
    difficulty: 'Hard',
    skillsEvaluated: ['Algorithms', 'Time & Space Complexity', 'SQL Optimization', 'Concurrency & Queues']
  }
];

// -------------------------------------------------------------
// Randomization & Question Shuffling Utilities
// -------------------------------------------------------------

/**
 * Fisher-Yates array shuffle (in-place clone)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/**
 * Shuffles an aptitude question's multiple choice options while accurately
 * remapping the correctAnswerIndex so scoring is preserved.
 */
export function shuffleAptitudeQuestion(q: AptitudeQuestion): AptitudeQuestion {
  const originalCorrectOption = q.options[q.correctAnswerIndex];
  const shuffledOptions = shuffleArray(q.options);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0
  };
}

/**
 * Retrieves shuffled aptitude questions and shuffles their multiple choice options.
 */
export function getShuffledAptitudeQuestions(ids?: string[], count?: number): AptitudeQuestion[] {
  let pool = ids && ids.length > 0 
    ? APTITUDE_QUESTIONS.filter(q => ids.includes(q.id))
    : [...APTITUDE_QUESTIONS];
  
  if (pool.length === 0) pool = [...APTITUDE_QUESTIONS];

  const shuffled = shuffleArray(pool).map(q => shuffleAptitudeQuestion(q));
  return count ? shuffled.slice(0, count) : shuffled;
}

/**
 * Retrieves coding questions with randomized order.
 */
export function getShuffledCodingQuestions(ids?: string[], count?: number): CodingQuestion[] {
  let pool = ids && ids.length > 0
    ? CODING_QUESTIONS.filter(q => ids.includes(q.id))
    : [...CODING_QUESTIONS];

  if (pool.length === 0) pool = [...CODING_QUESTIONS];

  const shuffled = shuffleArray(pool);
  return count ? shuffled.slice(0, count) : shuffled;
}

/**
 * Retrieves conceptual questions with randomized order.
 */
export function getShuffledConceptualQuestions(ids?: string[], count?: number): ConceptualQuestion[] {
  let pool = ids && ids.length > 0
    ? CONCEPTUAL_QUESTIONS.filter(q => ids.includes(q.id))
    : [...CONCEPTUAL_QUESTIONS];

  if (pool.length === 0) pool = [...CONCEPTUAL_QUESTIONS];

  const shuffled = shuffleArray(pool);
  return count ? shuffled.slice(0, count) : shuffled;
}

