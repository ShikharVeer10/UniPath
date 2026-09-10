"""
Coding Assessment Service for UniPath AI Interview.
Provides LeetCode and Codeforces style curated algorithmic questions across
Python, C, C++, and Java with automated compilation and testcase verification.
"""
import os
import sys
import shutil
import tempfile
import subprocess
import time
import random
from typing import Dict, List, Any, Optional

CODING_QUESTIONS: List[Dict[str, Any]] = [
    {
        "id": "two-sum",
        "title": "Two Sum",
        "platform": "LeetCode #1",
        "difficulty": "Easy",
        "category": "Arrays & Hashing",
        "description": (
            "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\n"
            "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n"
            "**Example 1:**\n"
            "Input: nums = [2,7,11,15], target = 9\n"
            "Output: [0,1]\n\n"
            "**Example 2:**\n"
            "Input: nums = [3,2,4], target = 6\n"
            "Output: [1,2]"
        ),
        "testcases": [
            {"input": "[2, 7, 11, 15]\n9", "expected_output": "[0, 1]"},
            {"input": "[3, 2, 4]\n6", "expected_output": "[1, 2]"},
            {"input": "[3, 3]\n6", "expected_output": "[0, 1]"},
            {"input": "[1, 5, 8, 12, 14]\n20", "expected_output": "[2, 3]"}
        ],
        "templates": {
            "python": (
                "import sys, json\n\n"
                "def two_sum(nums: list[int], target: int) -> list[int]:\n"
                "    seen = {}\n"
                "    for i, n in enumerate(nums):\n"
                "        diff = target - n\n"
                "        if diff in seen:\n"
                "            return [seen[diff], i]\n"
                "        seen[n] = i\n"
                "    return []\n\n"
                "if __name__ == '__main__':\n"
                "    lines = sys.stdin.read().splitlines()\n"
                "    if lines:\n"
                "        nums = json.loads(lines[0])\n"
                "        target = int(lines[1].strip())\n"
                "        print(json.dumps(two_sum(nums, target)))\n"
            ),
            "cpp": (
                "#include <iostream>\n"
                "#include <vector>\n"
                "#include <unordered_map>\n"
                "#include <sstream>\n"
                "using namespace std;\n\n"
                "vector<int> twoSum(vector<int>& nums, int target) {\n"
                "    unordered_map<int, int> seen;\n"
                "    for (int i = 0; i < nums.size(); ++i) {\n"
                "        int diff = target - nums[i];\n"
                "        if (seen.find(diff) != seen.end()) return {seen[diff], i};\n"
                "        seen[nums[i]] = i;\n"
                "    }\n"
                "    return {};\n"
                "}\n\n"
                "int main() {\n"
                "    string line; if (!getline(cin, line)) return 0;\n"
                "    vector<int> nums;\n"
                "    stringstream ss(line);\n"
                "    char c; int n;\n"
                "    while (ss >> c) {\n"
                "        if (c == '[' || c == ',') {\n"
                "            if (ss >> n) nums.push_back(n);\n"
                "        }\n"
                "    }\n"
                "    int target; cin >> target;\n"
                "    vector<int> res = twoSum(nums, target);\n"
                "    cout << \"[\" << res[0] << \", \" << res[1] << \"]\" << endl;\n"
                "    return 0;\n"
                "}\n"
            ),
            "c": (
                "#include <stdio.h>\n"
                "#include <stdlib.h>\n\n"
                "int main() {\n"
                "    int nums[100]; int n = 0;\n"
                "    char ch;\n"
                "    scanf(\" %c\", &ch);\n"
                "    int val;\n"
                "    while (scanf(\"%d\", &val) == 1) {\n"
                "        nums[n++] = val;\n"
                "        scanf(\" %c\", &ch);\n"
                "        if (ch == ']') break;\n"
                "    }\n"
                "    int target;\n"
                "    scanf(\"%d\", &target);\n"
                "    for (int i = 0; i < n; ++i) {\n"
                "        for (int j = i + 1; j < n; ++j) {\n"
                "            if (nums[i] + nums[j] == target) {\n"
                "                printf(\"[%d, %d]\\n\", i, j);\n"
                "                return 0;\n"
                "            }\n"
                "        }\n"
                "    }\n"
                "    printf(\"[]\\n\");\n"
                "    return 0;\n"
                "}\n"
            ),
            "java": (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public static int[] twoSum(int[] nums, int target) {\n"
                "        Map<Integer, Integer> map = new HashMap<>();\n"
                "        for (int i = 0; i < nums.length; i++) {\n"
                "            int complement = target - nums[i];\n"
                "            if (map.containsKey(complement)) return new int[] { map.get(complement), i };\n"
                "            map.put(nums[i], i);\n"
                "        }\n"
                "        return new int[]{};\n"
                "    }\n"
                "    public static void main(String[] args) {\n"
                "        Scanner sc = new Scanner(System.in);\n"
                "        if (!sc.hasNextLine()) return;\n"
                "        String arrStr = sc.nextLine().replaceAll(\"[\\\\[\\\\]\\\\s]\", \"\");\n"
                "        String[] parts = arrStr.split(\",\");\n"
                "        int[] nums = new int[parts.length];\n"
                "        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n"
                "        int target = sc.nextInt();\n"
                "        int[] ans = twoSum(nums, target);\n"
                "        System.out.println(\"[\" + ans[0] + \", \" + ans[1] + \"]\");\n"
                "    }\n"
                "}\n"
            )
        }
    },
    {
        "id": "valid-parentheses",
        "title": "Valid Parentheses",
        "platform": "LeetCode #20",
        "difficulty": "Easy",
        "category": "Stack",
        "description": (
            "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\n"
            "Open brackets must be closed by the same type of brackets, in correct order.\n\n"
            "**Example 1:**\n"
            "Input: s = \"()[]{}\"\n"
            "Output: true\n\n"
            "**Example 2:**\n"
            "Input: s = \"(]\"\n"
            "Output: false"
        ),
        "testcases": [
            {"input": "()[]{}", "expected_output": "true"},
            {"input": "(]", "expected_output": "false"},
            {"input": "([])", "expected_output": "true"},
            {"input": "([)]", "expected_output": "false"},
            {"input": "{[]}", "expected_output": "true"}
        ],
        "templates": {
            "python": (
                "import sys\n\n"
                "def is_valid(s: str) -> bool:\n"
                "    stack = []\n"
                "    mapping = {')': '(', '}': '{', ']': '['}\n"
                "    for char in s:\n"
                "        if char in mapping:\n"
                "            top = stack.pop() if stack else '#'\n"
                "            if mapping[char] != top:\n"
                "                return False\n"
                "        else:\n"
                "            stack.append(char)\n"
                "    return len(stack) == 0\n\n"
                "if __name__ == '__main__':\n"
                "    raw = sys.stdin.read().strip()\n"
                "    print('true' if is_valid(raw) else 'false')\n"
            ),
            "cpp": (
                "#include <iostream>\n"
                "#include <stack>\n"
                "#include <string>\n"
                "using namespace std;\n\n"
                "bool isValid(string s) {\n"
                "    stack<char> st;\n"
                "    for (char c : s) {\n"
                "        if (c == '(' || c == '{' || c == '[') st.push(c);\n"
                "        else {\n"
                "            if (st.empty()) return false;\n"
                "            char top = st.top(); st.pop();\n"
                "            if (c == ')' && top != '(') return false;\n"
                "            if (c == '}' && top != '{') return false;\n"
                "            if (c == ']' && top != '[') return false;\n"
                "        }\n"
                "    }\n"
                "    return st.empty();\n"
                "}\n\n"
                "int main() {\n"
                "    string s; if (!(cin >> s)) return 0;\n"
                "    cout << (isValid(s) ? \"true\" : \"false\") << endl;\n"
                "    return 0;\n"
                "}\n"
            ),
            "c": (
                "#include <stdio.h>\n"
                "#include <stdbool>\n"
                "#include <string.h>\n\n"
                "bool isValid(char * s) {\n"
                "    char stack[1000]; int top = -1;\n"
                "    for (int i = 0; s[i] != '\\0'; i++) {\n"
                "        char c = s[i];\n"
                "        if (c == '(' || c == '{' || c == '[') stack[++top] = c;\n"
                "        else {\n"
                "            if (top == -1) return false;\n"
                "            char t = stack[top--];\n"
                "            if (c == ')' && t != '(') return false;\n"
                "            if (c == '}' && t != '{') return false;\n"
                "            if (c == ']' && t != '[') return false;\n"
                "        }\n"
                "    }\n"
                "    return top == -1;\n"
                "}\n\n"
                "int main() {\n"
                "    char s[1000];\n"
                "    if (scanf(\"%s\", s) == 1) {\n"
                "        printf(\"%s\\n\", isValid(s) ? \"true\" : \"false\");\n"
                "    }\n"
                "    return 0;\n"
                "}\n"
            ),
            "java": (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public static boolean isValid(String s) {\n"
                "        Deque<Character> stack = new ArrayDeque<>();\n"
                "        for (char c : s.toCharArray()) {\n"
                "            if (c == '(') stack.push(')');\n"
                "            else if (c == '{') stack.push('}');\n"
                "            else if (c == '[') stack.push(']');\n"
                "            else if (stack.isEmpty() || stack.pop() != c) return false;\n"
                "        }\n"
                "        return stack.isEmpty();\n"
                "    }\n"
                "    public static void main(String[] args) {\n"
                "        Scanner sc = new Scanner(System.in);\n"
                "        if (!sc.hasNext()) return;\n"
                "        System.out.println(isValid(sc.next()) ? \"true\" : \"false\");\n"
                "    }\n"
                "}\n"
            )
        }
    },
    {
        "id": "watermelon",
        "title": "Watermelon",
        "platform": "Codeforces #4A",
        "difficulty": "800 (Easy)",
        "category": "Math & Brute Force",
        "description": (
            "Pete and Billy want to divide a watermelon weighing `w` kilos into two parts, each weighing an even number of kilos (> 0).\n\n"
            "Output `YES` if possible, `NO` otherwise.\n\n"
            "**Example 1:**\n"
            "Input: 8\n"
            "Output: YES\n\n"
            "**Example 2:**\n"
            "Input: 2\n"
            "Output: NO"
        ),
        "testcases": [
            {"input": "8", "expected_output": "YES"},
            {"input": "2", "expected_output": "NO"},
            {"input": "4", "expected_output": "YES"},
            {"input": "7", "expected_output": "NO"},
            {"input": "100", "expected_output": "YES"}
        ],
        "templates": {
            "python": (
                "import sys\n\n"
                "def solve():\n"
                "    raw = sys.stdin.read().strip()\n"
                "    if not raw: return\n"
                "    w = int(raw)\n"
                "    print('YES' if (w > 2 and w % 2 == 0) else 'NO')\n\n"
                "if __name__ == '__main__':\n"
                "    solve()\n"
            ),
            "cpp": (
                "#include <iostream>\n"
                "using namespace std;\n\n"
                "int main() {\n"
                "    int w; if (!(cin >> w)) return 0;\n"
                "    cout << (w > 2 && w % 2 == 0 ? \"YES\" : \"NO\") << endl;\n"
                "    return 0;\n"
                "}\n"
            ),
            "c": (
                "#include <stdio.h>\n\n"
                "int main() {\n"
                "    int w;\n"
                "    if (scanf(\"%d\", &w) == 1) {\n"
                "        printf(\"%s\\n\", (w > 2 && w % 2 == 0) ? \"YES\" : \"NO\");\n"
                "    }\n"
                "    return 0;\n"
                "}\n"
            ),
            "java": (
                "import java.util.Scanner;\n\n"
                "public class Solution {\n"
                "    public static void main(String[] args) {\n"
                "        Scanner sc = new Scanner(System.in);\n"
                "        if (!sc.hasNextInt()) return;\n"
                "        int w = sc.nextInt();\n"
                "        System.out.println(w > 2 && w % 2 == 0 ? \"YES\" : \"NO\");\n"
                "    }\n"
                "}\n"
            )
        }
    },
    {
        "id": "maximum-subarray",
        "title": "Maximum Subarray (Kadane's)",
        "platform": "LeetCode #53",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "description": (
            "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n"
            "**Example 1:**\n"
            "Input: [-2,1,-3,4,-1,2,1,-5,4]\n"
            "Output: 6\n"
            "Explanation: The subarray [4,-1,2,1] has the largest sum 6.\n\n"
            "**Example 2:**\n"
            "Input: [1]\n"
            "Output: 1"
        ),
        "testcases": [
            {"input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", "expected_output": "6"},
            {"input": "[1]", "expected_output": "1"},
            {"input": "[5, 4, -1, 7, 8]", "expected_output": "23"},
            {"input": "[-1, -2, -3]", "expected_output": "-1"}
        ],
        "templates": {
            "python": (
                "import sys, json\n\n"
                "def max_sub_array(nums: list[int]) -> int:\n"
                "    max_sum = current_sum = nums[0]\n"
                "    for x in nums[1:]:\n"
                "        current_sum = max(x, current_sum + x)\n"
                "        max_sum = max(max_sum, current_sum)\n"
                "    return max_sum\n\n"
                "if __name__ == '__main__':\n"
                "    raw = sys.stdin.read().strip()\n"
                "    if raw:\n"
                "        print(max_sub_array(json.loads(raw)))\n"
            ),
            "cpp": (
                "#include <iostream>\n"
                "#include <vector>\n"
                "#include <sstream>\n"
                "#include <algorithm>\n"
                "using namespace std;\n\n"
                "int maxSubArray(vector<int>& nums) {\n"
                "    int maxSum = nums[0], current = nums[0];\n"
                "    for (size_t i = 1; i < nums.size(); ++i) {\n"
                "        current = max(nums[i], current + nums[i]);\n"
                "        maxSum = max(maxSum, current);\n"
                "    }\n"
                "    return maxSum;\n"
                "}\n\n"
                "int main() {\n"
                "    string line; if (!getline(cin, line)) return 0;\n"
                "    vector<int> nums;\n"
                "    stringstream ss(line);\n"
                "    char c; int n;\n"
                "    while (ss >> c) {\n"
                "        if (c == '[' || c == ',') {\n"
                "            if (ss >> n) nums.push_back(n);\n"
                "        }\n"
                "    }\n"
                "    cout << maxSubArray(nums) << endl;\n"
                "    return 0;\n"
                "}\n"
            ),
            "c": (
                "#include <stdio.h>\n\n"
                "int main() {\n"
                "    int nums[500]; int n = 0;\n"
                "    char ch;\n"
                "    scanf(\" %c\", &ch);\n"
                "    int val;\n"
                "    while (scanf(\"%d\", &val) == 1) {\n"
                "        nums[n++] = val;\n"
                "        scanf(\" %c\", &ch);\n"
                "        if (ch == ']') break;\n"
                "    }\n"
                "    int maxSum = nums[0], curr = nums[0];\n"
                "    for (int i = 1; i < n; i++) {\n"
                "        curr = (nums[i] > curr + nums[i]) ? nums[i] : curr + nums[i];\n"
                "        if (curr > maxSum) maxSum = curr;\n"
                "    }\n"
                "    printf(\"%d\\n\", maxSum);\n"
                "    return 0;\n"
                "}\n"
            ),
            "java": (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public static int maxSubArray(int[] nums) {\n"
                "        int max = nums[0], curr = nums[0];\n"
                "        for (int i = 1; i < nums.length; i++) {\n"
                "            curr = Math.max(nums[i], curr + nums[i]);\n"
                "            max = Math.max(max, curr);\n"
                "        }\n"
                "        return max;\n"
                "    }\n"
                "    public static void main(String[] args) {\n"
                "        Scanner sc = new Scanner(System.in);\n"
                "        if (!sc.hasNextLine()) return;\n"
                "        String raw = sc.nextLine().replaceAll(\"[\\\\[\\\\]\\\\s]\", \"\");\n"
                "        String[] parts = raw.split(\",\");\n"
                "        int[] nums = new int[parts.length];\n"
                "        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n"
                "        System.out.println(maxSubArray(nums));\n"
                "    }\n"
                "}\n"
            )
        }
    },
    {
        "id": "way-too-long-words",
        "title": "Way Too Long Words",
        "platform": "Codeforces #71A",
        "difficulty": "800 (Easy)",
        "category": "Strings",
        "description": (
            "If a word's length is strictly more than 10 characters, replace it with: first letter, count of omitted letters, last letter.\n\n"
            "**Example:**\n"
            "Input: localization\n"
            "Output: l10n"
        ),
        "testcases": [
            {"input": "word", "expected_output": "word"},
            {"input": "localization", "expected_output": "l10n"},
            {"input": "internationalization", "expected_output": "i18n"},
            {"input": "pneumonoultramicroscopicsilicovolcanoconiosis", "expected_output": "p43s"}
        ],
        "templates": {
            "python": (
                "import sys\n\n"
                "def abbreviate(s: str) -> str:\n"
                "    if len(s) > 10:\n"
                "        return f'{s[0]}{len(s) - 2}{s[-1]}'\n"
                "    return s\n\n"
                "if __name__ == '__main__':\n"
                "    w = sys.stdin.read().strip()\n"
                "    if w:\n"
                "        print(abbreviate(w))\n"
            ),
            "cpp": (
                "#include <iostream>\n"
                "#include <string>\n"
                "using namespace std;\n\n"
                "int main() {\n"
                "    string s; if (!(cin >> s)) return 0;\n"
                "    if (s.length() > 10) cout << s[0] << s.length() - 2 << s[s.length() - 1] << endl;\n"
                "    else cout << s << endl;\n"
                "    return 0;\n"
                "}\n"
            ),
            "c": (
                "#include <stdio.h>\n"
                "#include <string.h>\n\n"
                "int main() {\n"
                "    char s[200];\n"
                "    if (scanf(\"%s\", s) == 1) {\n"
                "        int len = strlen(s);\n"
                "        if (len > 10) printf(\"%c%d%c\\n\", s[0], len - 2, s[len - 1]);\n"
                "        else printf(\"%s\\n\", s);\n"
                "    }\n"
                "    return 0;\n"
                "}\n"
            ),
            "java": (
                "import java.util.Scanner;\n\n"
                "public class Solution {\n"
                "    public static void main(String[] args) {\n"
                "        Scanner sc = new Scanner(System.in);\n"
                "        if (!sc.hasNext()) return;\n"
                "        String s = sc.next();\n"
                "        if (s.length() > 10) System.out.println(\"\" + s.charAt(0) + (s.length() - 2) + s.charAt(s.length() - 1));\n"
                "        else System.out.println(s);\n"
                "    }\n"
                "}\n"
            )
        }
    }
]

class CodingPlatformService:
    def get_all_questions(self) -> List[Dict[str, Any]]:
        return CODING_QUESTIONS

    def get_random_question(self) -> Dict[str, Any]:
        return random.choice(CODING_QUESTIONS)

    def get_question_by_id(self, question_id: str) -> Optional[Dict[str, Any]]:
        for q in CODING_QUESTIONS:
            if q["id"] == question_id:
                return q
        return None

    def execute_and_verify(
        self,
        language: str,
        code: str,
        question_id: str,
        custom_input: Optional[str] = None
    ) -> Dict[str, Any]:
        target_q = self.get_question_by_id(question_id)
        if not target_q:
            return {"error": f"Question '{question_id}' not found."}

        lang = language.lower().strip()
        testcases = target_q["testcases"]
        if custom_input is not None:
            testcases = [{"input": custom_input, "expected_output": ""}]

        results = []
        all_passed = True
        total_time_ms = 0.0
        temp_dir = tempfile.mkdtemp(prefix="unipath_exec_")

        try:
            compiled_bin = None
            if lang == "python":
                source_file = os.path.join(temp_dir, "solution.py")
                with open(source_file, "w", encoding="utf-8") as f:
                    f.write(code)
            elif lang in ("c", "c++", "cpp"):
                ext = ".cpp" if lang in ("c++", "cpp") else ".c"
                source_file = os.path.join(temp_dir, f"solution{ext}")
                with open(source_file, "w", encoding="utf-8") as f:
                    f.write(code)
                compiled_bin = os.path.join(temp_dir, "solution.exe" if os.name == "nt" else "solution")
                compiler = "g++" if lang in ("c++", "cpp") else "gcc"
                compile_cmd = [compiler, source_file, "-O2", "-o", compiled_bin]
                c_proc = subprocess.run(compile_cmd, capture_output=True, text=True, timeout=8)
                if c_proc.returncode != 0:
                    return {
                        "status": "Compilation Error",
                        "passed": False,
                        "error_message": c_proc.stderr,
                        "total_testcases": len(testcases),
                        "passed_testcases": 0,
                        "results": []
                    }
            elif lang == "java":
                source_file = os.path.join(temp_dir, "Solution.java")
                with open(source_file, "w", encoding="utf-8") as f:
                    f.write(code)
                compile_cmd = ["javac", source_file]
                j_proc = subprocess.run(compile_cmd, capture_output=True, text=True, timeout=10)
                if j_proc.returncode != 0:
                    return {
                        "status": "Compilation Error",
                        "passed": False,
                        "error_message": j_proc.stderr,
                        "total_testcases": len(testcases),
                        "passed_testcases": 0,
                        "results": []
                    }

            for idx, tc in enumerate(testcases):
                test_input = tc["input"]
                expected = tc.get("expected_output", "").strip()
                start_t = time.perf_counter()
                try:
                    if lang == "python":
                        exec_cmd = [sys.executable, source_file]
                    elif lang in ("c", "c++", "cpp"):
                        exec_cmd = [compiled_bin]
                    elif lang == "java":
                        exec_cmd = ["java", "-cp", temp_dir, "Solution"]
                    else:
                        return {"error": f"Unsupported language '{language}'"}

                    proc = subprocess.run(
                        exec_cmd,
                        input=test_input,
                        capture_output=True,
                        text=True,
                        timeout=3.5
                    )
                    runtime_ms = round((time.perf_counter() - start_t) * 1000, 2)
                    total_time_ms += runtime_ms

                    if proc.returncode != 0:
                        all_passed = False
                        results.append({
                            "testcase": idx + 1,
                            "input": test_input,
                            "expected": expected,
                            "actual": proc.stderr.strip() or f"Runtime error: exit code {proc.returncode}",
                            "passed": False,
                            "runtime_ms": runtime_ms,
                            "error": "Runtime Error"
                        })
                        continue

                    actual = proc.stdout.strip()
                    passed = (actual.replace("\r\n", "\n") == expected.replace("\r\n", "\n")) if expected else True
                    if not passed:
                        all_passed = False

                    results.append({
                        "testcase": idx + 1,
                        "input": test_input,
                        "expected": expected,
                        "actual": actual,
                        "passed": passed,
                        "runtime_ms": runtime_ms
                    })
                except subprocess.TimeoutExpired:
                    all_passed = False
                    results.append({
                        "testcase": idx + 1,
                        "input": test_input,
                        "expected": expected,
                        "actual": "Time Limit Exceeded (> 3.5s)",
                        "passed": False,
                        "runtime_ms": 3500.0,
                        "error": "Time Limit Exceeded"
                    })
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

        passed_count = sum(1 for r in results if r.get("passed", False))
        status = "Accepted" if (all_passed and passed_count == len(testcases)) else "Wrong Answer"
        if any(r.get("error") == "Time Limit Exceeded" for r in results):
            status = "Time Limit Exceeded"
        elif any(r.get("error") == "Runtime Error" for r in results):
            status = "Runtime Error"

        return {
            "status": status,
            "passed": all_passed,
            "total_testcases": len(testcases),
            "passed_testcases": passed_count,
            "runtime_ms": round(total_time_ms, 2),
            "results": results
        }

coding_service = CodingPlatformService()
