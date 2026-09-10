export type CodingQuestion = {
  id: string;
  title: string;
  platform: string;
  difficulty: string;
  category: string;
  description: string;
  testcases: Array<{ input: string; expected_output: string }>;
  templates: Record<string, string>;
};

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    platform: 'LeetCode #1',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]

**Example 3:**
Input: nums = [3,3], target = 6
Output: [0,1]`,
    testcases: [
      { input: '[2, 7, 11, 15]\n9', expected_output: '[0, 1]' },
      { input: '[3, 2, 4]\n6', expected_output: '[1, 2]' },
      { input: '[3, 3]\n6', expected_output: '[0, 1]' },
      { input: '[1, 5, 8, 12, 14]\n20', expected_output: '[2, 3]' },
    ],
    templates: {
      python: `import sys, json

def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    if lines:
        nums = json.loads(lines[0])
        target = int(lines[1].strip())
        print(json.dumps(two_sum(nums, target)))
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) return {seen[diff], i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    string line; if (!getline(cin, line)) return 0;
    vector<int> nums;
    stringstream ss(line);
    char c; int n;
    while (ss >> c) {
        if (c == '[' || c == ',') {
            if (ss >> n) nums.push_back(n);
        }
    }
    int target; cin >> target;
    vector<int> res = twoSum(nums, target);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int nums[100]; int n = 0;
    char ch;
    scanf(" %c", &ch);
    int val;
    while (scanf("%d", &val) == 1) {
        nums[n++] = val;
        scanf(" %c", &ch);
        if (ch == ']') break;
    }
    int target;
    scanf("%d", &target);
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (nums[i] + nums[j] == target) {
                printf("[%d, %d]\\n", i, j);
                return 0;
            }
        }
    }
    printf("[]\\n");
    return 0;
}
`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[] { map.get(complement), i };
            map.put(nums[i], i);
        }
        return new int[]{};
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String arrStr = sc.nextLine().replaceAll("[\\[\\]\\s]", "");
        String[] parts = arrStr.split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = sc.nextInt();
        int[] ans = twoSum(nums, target);
        System.out.println("[" + ans[0] + ", " + ans[1] + "]");
    }
}
`,
    },
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    platform: 'LeetCode #20',
    difficulty: 'Easy',
    category: 'Stack',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
Input: s = "()[]{}"
Output: true

**Example 2:**
Input: s = "(]"
Output: false

**Example 3:**
Input: s = "([])"
Output: true`,
    testcases: [
      { input: '()[]{}', expected_output: 'true' },
      { input: '(]', expected_output: 'false' },
      { input: '([])', expected_output: 'true' },
      { input: '([)]', expected_output: 'false' },
      { input: '{[]}', expected_output: 'true' },
    ],
    templates: {
      python: `import sys

def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    print('true' if is_valid(raw) else 'false')
`,
      cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}

int main() {
    string s; if (!(cin >> s)) return 0;
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}
`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

bool isValid(char * s) {
    char stack[1000]; int top = -1;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        if (c == '(' || c == '{' || c == '[') stack[++top] = c;
        else {
            if (top == -1) return false;
            char t = stack[top--];
            if (c == ')' && t != '(') return false;
            if (c == '}' && t != '{') return false;
            if (c == ']' && t != '[') return false;
        }
    }
    return top == -1;
}

int main() {
    char s[1000];
    if (scanf("%s", s) == 1) {
        printf("%s\\n", isValid(s) ? "true" : "false");
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        System.out.println(isValid(sc.next()) ? "true" : "false");
    }
}
`,
    },
  },
  {
    id: 'watermelon',
    title: 'Watermelon',
    platform: 'Codeforces #4A',
    difficulty: '800 (Easy)',
    category: 'Math & Brute Force',
    description: `One hot summer day Pete and his friend Billy decided to buy a watermelon. They weighed it and found it weighed \`w\` kilos.

Pete and Billy are great fans of even numbers. They want to divide the watermelon in such a way that each of the two parts weighs an even number of kilos (> 0), not necessarily equal.

Output \`YES\` if they can divide the watermelon into two even parts; and \`NO\` otherwise.

**Example 1:**
Input: 8
Output: YES (e.g. 2 and 6 or 4 and 4)

**Example 2:**
Input: 2
Output: NO (only 1 and 1 possible, which are odd)`,
    testcases: [
      { input: '8', expected_output: 'YES' },
      { input: '2', expected_output: 'NO' },
      { input: '4', expected_output: 'YES' },
      { input: '7', expected_output: 'NO' },
      { input: '100', expected_output: 'YES' },
    ],
    templates: {
      python: `import sys

def solve():
    raw = sys.stdin.read().strip()
    if not raw: return
    w = int(raw)
    print('YES' if (w > 2 and w % 2 == 0) else 'NO')

if __name__ == '__main__':
    solve()
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int w; if (!(cin >> w)) return 0;
    cout << (w > 2 && w % 2 == 0 ? "YES" : "NO") << endl;
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    int w;
    if (scanf("%d", &w) == 1) {
        printf("%s\\n", (w > 2 && w % 2 == 0) ? "YES" : "NO");
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int w = sc.nextInt();
        System.out.println(w > 2 && w % 2 == 0 ? "YES" : "NO");
    }
}
`,
    },
  },
  {
    id: 'maximum-subarray',
    title: "Maximum Subarray (Kadane's Algorithm)",
    platform: 'LeetCode #53',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.

**Example 1:**
Input: [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

**Example 2:**
Input: [1]
Output: 1

**Example 3:**
Input: [5,4,-1,7,8]
Output: 23`,
    testcases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected_output: '6' },
      { input: '[1]', expected_output: '1' },
      { input: '[5, 4, -1, 7, 8]', expected_output: '23' },
      { input: '[-1, -2, -3]', expected_output: '-1' },
    ],
    templates: {
      python: `import sys, json

def max_sub_array(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        print(max_sub_array(json.loads(raw)))
`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0], current = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        current = max(nums[i], current + nums[i]);
        maxSum = max(maxSum, current);
    }
    return maxSum;
}

int main() {
    string line; if (!getline(cin, line)) return 0;
    vector<int> nums;
    stringstream ss(line);
    char c; int n;
    while (ss >> c) {
        if (c == '[' || c == ',') {
            if (ss >> n) nums.push_back(n);
        }
    }
    cout << maxSubArray(nums) << endl;
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    int nums[500]; int n = 0;
    char ch;
    scanf(" %c", &ch);
    int val;
    while (scanf("%d", &val) == 1) {
        nums[n++] = val;
        scanf(" %c", &ch);
        if (ch == ']') break;
    }
    int maxSum = nums[0], curr = nums[0];
    for (int i = 1; i < n; i++) {
        curr = (nums[i] > curr + nums[i]) ? nums[i] : curr + nums[i];
        if (curr > maxSum) maxSum = curr;
    }
    printf("%d\\n", maxSum);
    return 0;
}
`,
      java: `import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        int max = nums[0], curr = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            max = Math.max(max, curr);
        }
        return max;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String raw = sc.nextLine().replaceAll("[\\[\\]\\s]", "");
        String[] parts = raw.split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        System.out.println(maxSubArray(nums));
    }
}
`,
    },
  },
  {
    id: 'way-too-long-words',
    title: 'Way Too Long Words',
    platform: 'Codeforces #71A',
    difficulty: '800 (Easy)',
    category: 'Strings',
    description: `Sometimes some words like "localization" or "internationalization" are so long that writing them many times is tiresome.

A word is too long if its length is strictly more than 10 characters. All too long words should be replaced with:
first letter + count of omitted letters + last letter.

**Example:**
Input: localization
Output: l10n
Input: word
Output: word`,
    testcases: [
      { input: 'word', expected_output: 'word' },
      { input: 'localization', expected_output: 'l10n' },
      { input: 'internationalization', expected_output: 'i18n' },
      { input: 'pneumonoultramicroscopicsilicovolcanoconiosis', expected_output: 'p43s' },
    ],
    templates: {
      python: `import sys

def abbreviate(s: str) -> str:
    if len(s) > 10: return f'{s[0]}{len(s)-2}{s[-1]}'
    return s

if __name__ == '__main__':
    w = sys.stdin.read().strip()
    if w: print(abbreviate(w))
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s; if (!(cin >> s)) return 0;
    if (s.length() > 10) cout << s[0] << s.length() - 2 << s[s.length() - 1] << endl;
    else cout << s << endl;
    return 0;
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[200];
    if (scanf("%s", s) == 1) {
        int len = strlen(s);
        if (len > 10) printf("%c%d%c\\n", s[0], len - 2, s[len - 1]);
        else printf("%s\\n", s);
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        if (s.length() > 10) System.out.println("" + s.charAt(0) + (s.length() - 2) + s.charAt(s.length() - 1));
        else System.out.println(s);
    }
}
`,
    },
  },
];

export function getRandomCodingQuestion(): CodingQuestion {
  const idx = Math.floor(Math.random() * CODING_QUESTIONS.length);
  return CODING_QUESTIONS[idx];
}
