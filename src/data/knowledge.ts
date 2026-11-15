import type { Difficulty, Question } from "@/types";

type RawQ = Omit<Question, "id" | "topicId" | "subjectId">;
const mcq = (q: string, options: string[], ans: number, explanation: string, difficulty: Difficulty = "easy"): RawQ => ({
  type: "mcq", q, options, answer: options[ans], explanation, difficulty,
});
const tf = (q: string, ans: boolean, explanation: string, difficulty: Difficulty = "easy"): RawQ => ({
  type: "tf", q, options: ["True", "False"], answer: ans ? "True" : "False", explanation, difficulty,
});
const fill = (q: string, answer: string, explanation: string, difficulty: Difficulty = "medium"): RawQ => ({
  type: "fill", q, answer, explanation, difficulty,
});
const short = (q: string, keywords: string[], answer: string, explanation: string, difficulty: Difficulty = "hard"): RawQ => ({
  type: "short", q, keywords, answer, explanation, difficulty,
});

interface RawTopic {
  id: string;
  subjectId: string;
  title: string;
  keywords: string[];
  direct: string;
  concept: string;
  steps: string[];
  example: string;
  takeaways: string[];
  related: string[];
  followups: string[];
  definitions: [string, string][];
  formulas?: string[];
  questions: RawQ[];
}
export interface KBTopic extends Omit<RawTopic, "questions"> { questions: Question[] }

const raw: RawTopic[] = [
  {
    id: "py-loops", subjectId: "python", title: "Python Loops",
    keywords: ["loop", "loops", "for loop", "while loop", "iteration", "range", "break", "continue", "python loop"],
    direct: "A loop repeats a block of code. Python's `for` loop iterates over a sequence, while `while` repeats as long as a condition stays true.",
    concept: "Loops remove repetition. A `for` loop walks through any iterable (list, string, range) one item at a time, while a `while` loop re-checks a Boolean condition before every pass. `break` exits early, `continue` skips to the next pass, and `else` on a loop runs only if no `break` happened.",
    steps: ["Decide whether you know the number of repetitions (use for) or only a stopping condition (use while).", "Write the loop header: `for item in iterable:` or `while condition:`.", "Indent the body — Python uses indentation to define the block.", "Make sure something inside a while loop changes the condition, otherwise it never ends.", "Use break/continue only when they make the logic clearer."],
    example: "Summing marks: `total = 0` then `for m in [72, 88, 91]: total += m`. After the loop total is 251. A while version: `n = 3` then `while n > 0: print(n); n -= 1` counts down 3, 2, 1.",
    takeaways: ["Use for when iterating over known collections.", "Use while when the end depends on a condition.", "range(n) produces 0 to n-1.", "Always update the loop variable in while loops."],
    related: ["Python Functions", "Lists and Dictionaries", "List comprehensions"],
    followups: ["What is the difference between break and continue?", "How does range(start, stop, step) work?", "When would I use a loop-else block?"],
    definitions: [["Iterable", "An object that can return its items one at a time, e.g. list, tuple, string."], ["Iteration", "One pass through the body of a loop."], ["Infinite loop", "A loop whose condition never becomes false."]],
    questions: [
      mcq("What does `range(3)` generate?", ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3 only"], 1, "range(n) starts at 0 and stops before n.", "easy"),
      mcq("Which keyword skips the rest of the current iteration?", ["break", "pass", "continue", "exit"], 2, "continue jumps to the next iteration; break leaves the loop entirely.", "medium"),
      tf("A while loop with a condition that never becomes False runs forever.", true, "Without a change to the condition (or a break), the loop is infinite.", "easy"),
      fill("The keyword used to exit a loop immediately is ____.", "break", "break terminates the nearest enclosing loop.", "easy"),
      short("Explain when you would choose a for loop over a while loop.", ["known", "iterate", "sequence", "collection", "iterable", "range"], "Use a for loop to iterate over a known sequence or a fixed number of times; use while when the number of repetitions depends on a condition.", "For loops fit iteration over collections; while loops fit condition-driven repetition.", "medium"),
    ],
  },
  {
    id: "py-functions", subjectId: "python", title: "Python Functions",
    keywords: ["function", "functions", "def", "return", "parameter", "argument", "lambda", "scope"],
    direct: "A function is a named, reusable block of code defined with `def` that can take inputs (parameters) and give back an output with `return`.",
    concept: "Functions package logic so you can call it many times. Parameters receive values at call time; default values and keyword arguments make calls flexible. Variables created inside a function are local to it. A function without `return` gives back `None`.",
    steps: ["Choose a descriptive name using verbs, e.g. `calculate_average`.", "Define it: `def name(params):`.", "Write the body, indented.", "Return the result with `return`.", "Call it with arguments: `name(10, 20)`."],
    example: "`def average(nums): return sum(nums) / len(nums)` — calling `average([70, 80, 90])` returns 80.0. The same function can be reused for any list of marks.",
    takeaways: ["Functions improve reuse and readability.", "return sends a value back; print only displays it.", "Parameters can have defaults.", "Local variables disappear when the function ends."],
    related: ["Python Loops", "Lambda expressions", "Recursion"],
    followups: ["What is the difference between a parameter and an argument?", "What does a function return without a return statement?", "What is variable scope?"],
    definitions: [["Parameter", "A variable named in the function definition."], ["Argument", "The actual value passed when calling the function."], ["Scope", "The region of code where a variable is accessible."]],
    questions: [
      mcq("Which keyword defines a function in Python?", ["func", "def", "function", "lambda only"], 1, "Functions are defined using the def keyword.", "easy"),
      mcq("What does a function return if it has no return statement?", ["0", "An empty string", "None", "It raises an error"], 2, "Python returns None implicitly.", "medium"),
      tf("Variables defined inside a function are accessible everywhere in the program.", false, "They are local to the function unless declared global.", "easy"),
      fill("The value passed to a function when it is called is called an ____.", "argument", "Parameters are in the definition; arguments are the values supplied.", "medium"),
      short("Why is it useful to break a program into functions?", ["reuse", "readable", "readability", "modular", "test", "maintain"], "Functions make code reusable, easier to read, test and maintain.", "Modularity reduces duplication and isolates logic for testing.", "medium"),
    ],
  },
  {
    id: "py-collections", subjectId: "python", title: "Lists and Dictionaries",
    keywords: ["list", "lists", "dictionary", "dictionaries", "dict", "tuple", "set", "comprehension", "collection"],
    direct: "A list is an ordered, changeable sequence of items; a dictionary stores key-value pairs for fast lookup by key.",
    concept: "Lists keep order and allow duplicates, accessed by index. Dictionaries map unique keys to values and are accessed by key in near-constant time. Both are mutable, so they can be changed after creation.",
    steps: ["Create a list with `[1, 2, 3]` and a dict with `{'name': 'Alex'}`.", "Access list items by index `items[0]` and dict values by key `d['name']`.", "Modify using append/remove for lists and assignment for dicts.", "Loop through lists directly and through dicts using `.items()`.", "Use comprehensions for concise transformations."],
    example: "`marks = {'Python': 88, 'DBMS': 74}`; `marks['Maths'] = 81` adds a pair. `[m for m in marks.values() if m > 80]` gives [88, 81].",
    takeaways: ["Lists are index-based; dicts are key-based.", "Dict keys must be unique and hashable.", "Use .get(key, default) to avoid KeyError.", "Comprehensions build collections in one line."],
    related: ["Python Loops", "Hash tables", "Sets and tuples"],
    followups: ["How do I avoid KeyError in a dictionary?", "What is a list comprehension?", "Tuple vs list?"],
    definitions: [["Mutable", "Can be modified after creation."], ["Key", "A unique identifier used to look up a value in a dictionary."], ["Index", "Position of an item in a sequence, starting at 0."]],
    questions: [
      mcq("What is the index of the first item in a Python list?", ["1", "0", "-1", "Depends on the list"], 1, "Python lists are zero-indexed.", "easy"),
      mcq("Which method safely reads a dict key with a default?", ["d.read()", "d.fetch()", "d.get()", "d.find()"], 2, "d.get(key, default) returns default instead of raising KeyError.", "medium"),
      tf("Dictionary keys can be duplicated.", false, "Keys must be unique; a duplicate overwrites the earlier value.", "easy"),
      fill("The list method that adds an item to the end is ____.", "append", "list.append(x) adds x at the end.", "easy"),
      short("Give one difference between a list and a dictionary.", ["index", "key", "order", "pair", "value"], "Lists are accessed by position; dictionaries are accessed by unique keys that map to values.", "The access mechanism differs: position vs. key.", "medium"),
    ],
  },
  {
    id: "dbms-normalization", subjectId: "dbms", title: "Database Normalization",
    keywords: ["normalization", "normalisation", "normal form", "1nf", "2nf", "3nf", "bcnf", "redundancy", "anomaly", "functional dependency"],
    direct: "Normalization organises a database into well-structured tables to reduce redundancy and avoid insert, update and delete anomalies.",
    concept: "Each normal form removes a specific kind of problem. 1NF requires atomic values and no repeating groups. 2NF removes partial dependency on part of a composite key. 3NF removes transitive dependency between non-key attributes. BCNF tightens 3NF so every determinant is a candidate key.",
    steps: ["List all attributes and identify the primary key.", "1NF: split multi-valued or repeating columns into separate rows.", "2NF: move attributes that depend on only part of a composite key to their own table.", "3NF: move attributes that depend on other non-key attributes into a new table.", "Check BCNF: every determinant must be a candidate key."],
    example: "A table Orders(OrderID, ProductID, ProductName, CustomerCity) repeats ProductName in every order line. ProductName depends only on ProductID (partial dependency), so 2NF moves it to Products(ProductID, ProductName).",
    takeaways: ["Normalization reduces redundancy and anomalies.", "Each higher form builds on the previous one.", "Over-normalizing can hurt read performance — sometimes denormalize on purpose.", "Functional dependencies drive the whole process."],
    related: ["Functional dependencies", "SQL Joins", "ER diagrams"],
    followups: ["What is the difference between 3NF and BCNF?", "What is a partial dependency?", "When should I denormalize?"],
    definitions: [["Functional dependency", "A → B means each value of A determines exactly one value of B."], ["Partial dependency", "A non-key attribute depends on only part of a composite key."], ["Transitive dependency", "A → B and B → C, so A indirectly determines C."]],
    questions: [
      mcq("Which normal form removes partial dependencies?", ["1NF", "2NF", "3NF", "BCNF"], 1, "2NF eliminates attributes depending on only part of a composite primary key.", "medium"),
      mcq("A table with a column storing 'Math, Physics' in one cell violates:", ["1NF", "2NF", "3NF", "BCNF"], 0, "1NF requires atomic (single) values per cell.", "easy"),
      tf("3NF removes transitive dependencies of non-key attributes on the primary key.", true, "That is the defining rule of 3NF.", "medium"),
      fill("A → B and B → C implies a ____ dependency of C on A.", "transitive", "Indirect dependency through a non-key attribute is transitive.", "medium"),
      short("State two problems caused by data redundancy.", ["anomal", "inconsisten", "storage", "update", "insert", "delete"], "Redundancy wastes storage and causes update, insertion and deletion anomalies that lead to inconsistent data.", "Normalization addresses these anomalies by storing each fact once.", "hard"),
    ],
  },
  {
    id: "dbms-joins", subjectId: "dbms", title: "SQL Joins",
    keywords: ["join", "joins", "inner join", "left join", "right join", "full join", "sql join", "outer join"],
    direct: "A JOIN combines rows from two tables based on a related column, letting you query connected data in one result.",
    concept: "INNER JOIN keeps only matching rows. LEFT JOIN keeps all rows from the left table and fills unmatched right-side columns with NULL. RIGHT JOIN mirrors that; FULL JOIN keeps everything from both. The ON clause defines how rows match.",
    steps: ["Identify the two tables and the shared key (e.g. student_id).", "Choose the join type based on which unmatched rows you need.", "Write `FROM A JOIN B ON A.key = B.key`.", "Select columns, qualifying names when ambiguous.", "Filter with WHERE after verifying the join row count."],
    example: "`SELECT s.name, c.title FROM students s LEFT JOIN enrollments e ON s.id = e.student_id LEFT JOIN courses c ON e.course_id = c.id;` lists every student, even those not enrolled (title is NULL).",
    takeaways: ["INNER keeps matches only.", "LEFT keeps every left row.", "Join conditions go in ON.", "Unmatched outer-join columns become NULL."],
    related: ["Normalization", "Primary and foreign keys", "Subqueries"],
    followups: ["INNER vs LEFT JOIN — when do I use which?", "What is a self join?", "Why do I get duplicate rows after a join?"],
    definitions: [["Foreign key", "A column referencing the primary key of another table."], ["NULL", "A marker for missing or unknown data."], ["Cartesian product", "Every row of A paired with every row of B (join without a condition)."]],
    questions: [
      mcq("Which join returns only rows with matches in both tables?", ["LEFT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN"], 1, "INNER JOIN drops unmatched rows.", "easy"),
      mcq("In a LEFT JOIN, unmatched right-table columns appear as:", ["0", "Empty string", "NULL", "The row is dropped"], 2, "Missing matches produce NULL values.", "medium"),
      tf("A JOIN without a join condition produces a Cartesian product.", true, "Every row of the first table pairs with every row of the second.", "medium"),
      fill("The clause that specifies how two tables are matched in a JOIN is ____.", "ON", "JOIN ... ON a.key = b.key defines matching.", "easy"),
      short("When would you use LEFT JOIN instead of INNER JOIN?", ["all", "unmatched", "every", "left", "null", "keep"], "Use LEFT JOIN when you need all rows from the left table even if there is no matching row in the right table.", "LEFT JOIN preserves unmatched left rows.", "medium"),
    ],
  },
  {
    id: "dbms-transactions", subjectId: "dbms", title: "Transactions and ACID",
    keywords: ["transaction", "transactions", "acid", "commit", "rollback", "atomicity", "isolation", "durability", "consistency", "concurrency"],
    direct: "A transaction is a group of database operations treated as one unit — either all succeed (commit) or none do (rollback). ACID describes its guarantees.",
    concept: "Atomicity: all-or-nothing. Consistency: data moves from one valid state to another. Isolation: concurrent transactions do not see each other's partial work. Durability: committed data survives crashes.",
    steps: ["BEGIN a transaction.", "Run the related statements (e.g. debit and credit).", "If every step succeeds, COMMIT.", "If anything fails, ROLLBACK to restore the previous state.", "The DBMS uses logs and locks to enforce ACID."],
    example: "Transferring ₹500: debit account A, credit account B. If the credit fails after the debit, ROLLBACK restores A's balance, preventing lost money.",
    takeaways: ["ACID = Atomicity, Consistency, Isolation, Durability.", "COMMIT makes changes permanent.", "ROLLBACK undoes uncommitted changes.", "Isolation levels trade off safety and speed."],
    related: ["Concurrency control", "Locks and deadlocks", "Normalization"],
    followups: ["What are isolation levels?", "What is a deadlock?", "What is a dirty read?"],
    definitions: [["Commit", "Permanently saves all changes in the transaction."], ["Rollback", "Undoes all changes since the transaction began."], ["Deadlock", "Two transactions waiting on each other's locks forever."]],
    questions: [
      mcq("In ACID, the 'A' stands for:", ["Availability", "Atomicity", "Accuracy", "Authorization"], 1, "Atomicity: all operations succeed or none do.", "easy"),
      mcq("Which property ensures committed data survives a crash?", ["Isolation", "Atomicity", "Durability", "Consistency"], 2, "Durability is persisted through logging.", "medium"),
      tf("ROLLBACK makes the changes of a transaction permanent.", false, "COMMIT makes changes permanent; ROLLBACK undoes them.", "easy"),
      fill("Two transactions waiting forever on each other's locks cause a ____.", "deadlock", "Deadlocks are resolved by aborting one transaction.", "medium"),
      short("Why is atomicity important in a bank transfer?", ["all", "none", "debit", "credit", "partial", "unit"], "A transfer needs both debit and credit to happen together; atomicity prevents partial updates that lose or create money.", "Atomicity treats related changes as an indivisible unit.", "medium"),
    ],
  },
  {
    id: "math-derivatives", subjectId: "math", title: "Derivatives",
    keywords: ["derivative", "derivatives", "differentiation", "differentiate", "calculus", "slope", "rate of change", "chain rule", "product rule"],
    direct: "A derivative measures how fast a function's output changes as its input changes — the slope of the curve at a point.",
    concept: "The derivative f'(x) is the limit of the change in f divided by the change in x as that change shrinks to zero. Rules like the power, product, quotient and chain rules let you differentiate without using limits every time.",
    steps: ["Identify the structure: sum, product, quotient or composition.", "Apply the matching rule (power rule for xⁿ).", "Differentiate each part.", "Simplify the result.", "Evaluate at a point to get the slope there."],
    example: "For f(x) = 3x² + 5x, f'(x) = 6x + 5. At x = 2 the slope is 17, meaning f grows by roughly 17 units per unit of x there.",
    takeaways: ["Derivative = instantaneous rate of change.", "Power rule: d/dx xⁿ = n·xⁿ⁻¹.", "Chain rule handles nested functions.", "Zero derivative marks possible maxima or minima."],
    related: ["Limits", "Integration", "Gradient descent"],
    followups: ["How does the chain rule work?", "What do second derivatives tell us?", "How is this used in machine learning?"],
    definitions: [["Derivative", "The rate of change of a function with respect to its variable."], ["Critical point", "A point where f'(x) = 0 or is undefined."], ["Chain rule", "d/dx f(g(x)) = f'(g(x))·g'(x)."]],
    formulas: ["d/dx (xⁿ) = n·xⁿ⁻¹", "d/dx (uv) = u'v + uv'", "d/dx f(g(x)) = f'(g(x))·g'(x)"],
    questions: [
      mcq("What is the derivative of x³?", ["x²", "3x²", "3x", "x³/3"], 1, "Power rule: bring down 3, reduce power by 1.", "easy"),
      mcq("The derivative of a constant is:", ["1", "The constant", "0", "Undefined"], 2, "A constant does not change, so its rate of change is 0.", "easy"),
      tf("The chain rule is used to differentiate composite functions.", true, "d/dx f(g(x)) = f'(g(x))·g'(x).", "medium"),
      fill("The derivative of sin(x) is ____.", "cos(x)|cos x|cosx", "d/dx sin x = cos x.", "medium"),
      short("What does a derivative of zero at a point suggest?", ["maximum", "minimum", "stationary", "critical", "flat", "turning"], "A zero derivative marks a stationary (critical) point, possibly a local maximum, minimum or inflection.", "Check the second derivative to classify it.", "hard"),
    ],
  },
  {
    id: "math-matrices", subjectId: "math", title: "Matrices",
    keywords: ["matrix", "matrices", "determinant", "inverse", "eigenvalue", "linear algebra", "transpose", "multiplication"],
    direct: "A matrix is a rectangular grid of numbers used to represent linear transformations and systems of equations.",
    concept: "Matrices are added element-wise (same size) and multiplied row-by-column (inner dimensions must match). The determinant tells whether a square matrix is invertible. Matrix multiplication is generally not commutative.",
    steps: ["Check dimensions: A is m×n, B is n×p to multiply.", "Take row i of A and column j of B.", "Multiply pairwise and sum to get entry (i, j).", "Repeat for all entries.", "For a 2×2 matrix, det = ad − bc."],
    example: "A = [[1,2],[3,4]], det(A) = 1·4 − 2·3 = −2, which is non-zero, so A has an inverse.",
    takeaways: ["Multiplication needs matching inner dimensions.", "AB ≠ BA in general.", "det ≠ 0 means invertible.", "Matrices power ML and graphics."],
    related: ["Vectors", "Eigenvalues", "Neural Networks"],
    followups: ["How do I find the inverse of a 2×2 matrix?", "What is an eigenvector?", "How are matrices used in AI?"],
    definitions: [["Determinant", "A scalar from a square matrix that indicates invertibility."], ["Identity matrix", "Square matrix with 1s on the diagonal and 0s elsewhere."], ["Transpose", "Flips rows and columns."]],
    formulas: ["det [[a,b],[c,d]] = ad − bc", "(AB)ᵀ = BᵀAᵀ"],
    questions: [
      mcq("Can a 2×3 matrix be multiplied by a 2×3 matrix?", ["Yes", "No", "Only if square", "Only if identity"], 1, "Inner dimensions (3 and 2) do not match.", "medium"),
      mcq("Determinant of [[1,2],[3,4]] is:", ["10", "-2", "2", "0"], 1, "1·4 − 2·3 = −2.", "easy"),
      tf("Matrix multiplication is always commutative.", false, "In general AB ≠ BA.", "easy"),
      fill("A square matrix with determinant zero is called ____ (not invertible).", "singular", "Singular matrices have no inverse.", "medium"),
      short("Why does a zero determinant matter?", ["inverse", "invertible", "singular", "no inverse", "linearly dependent"], "A zero determinant means the matrix is singular: it has no inverse and its rows/columns are linearly dependent.", "Determinant tests invertibility.", "hard"),
    ],
  },
  {
    id: "math-probability", subjectId: "math", title: "Probability Basics",
    keywords: ["probability", "bayes", "random", "event", "independent", "conditional", "expected value", "chance"],
    direct: "Probability measures how likely an event is, as a number between 0 (impossible) and 1 (certain).",
    concept: "For equally likely outcomes, P(event) = favourable outcomes ÷ total outcomes. Independent events multiply; mutually exclusive events add. Conditional probability P(A|B) is the chance of A given B has occurred, and Bayes' theorem reverses the conditioning.",
    steps: ["Define the sample space.", "Count favourable outcomes.", "Divide favourable by total.", "For two events decide: independent (multiply) or exclusive (add).", "For conditional questions use P(A|B) = P(A∩B)/P(B)."],
    example: "Rolling a fair die: P(even) = 3/6 = 0.5. Rolling two dice, P(both 6) = 1/6 × 1/6 = 1/36.",
    takeaways: ["0 ≤ P ≤ 1.", "Independent: P(A∩B) = P(A)P(B).", "Complement: P(not A) = 1 − P(A).", "Bayes' theorem updates beliefs with evidence."],
    related: ["Statistics", "Bayes' theorem", "Machine Learning Basics"],
    followups: ["What is Bayes' theorem?", "Independent vs mutually exclusive?", "What is expected value?"],
    definitions: [["Sample space", "The set of all possible outcomes."], ["Independent events", "The outcome of one does not affect the other."], ["Conditional probability", "Probability of A given that B occurred."]],
    formulas: ["P(A|B) = P(A∩B) / P(B)", "P(A∪B) = P(A) + P(B) − P(A∩B)"],
    questions: [
      mcq("Probability of getting a head in a fair coin toss:", ["1", "0.25", "0.5", "2"], 2, "Two equally likely outcomes.", "easy"),
      mcq("For independent events A and B, P(A∩B) =", ["P(A)+P(B)", "P(A)·P(B)", "P(A)−P(B)", "P(A)/P(B)"], 1, "Independent probabilities multiply.", "medium"),
      tf("A probability can be greater than 1.", false, "Probabilities lie between 0 and 1 inclusive.", "easy"),
      fill("P(not A) = 1 − ____.", "P(A)", "The complement rule.", "easy"),
      short("Explain the difference between independent and mutually exclusive events.", ["independent", "exclusive", "both", "cannot", "affect", "overlap"], "Independent events do not affect each other's probability; mutually exclusive events cannot happen together.", "Exclusive events with non-zero probability are actually dependent.", "hard"),
    ],
  },
  {
    id: "ds-stacks-queues", subjectId: "ds", title: "Stacks and Queues",
    keywords: ["stack", "stacks", "queue", "queues", "lifo", "fifo", "push", "pop", "enqueue", "dequeue", "deque"],
    direct: "A stack is a Last-In-First-Out (LIFO) structure; a queue is First-In-First-Out (FIFO).",
    concept: "Stacks add and remove from the same end (push/pop) and power undo, function calls and expression parsing. Queues add at the rear and remove from the front (enqueue/dequeue) and power scheduling, buffering and breadth-first search.",
    steps: ["Pick the access pattern you need: most recent first (stack) or oldest first (queue).", "Stack: push adds on top, pop removes the top.", "Queue: enqueue adds at the rear, dequeue removes at the front.", "Check for overflow/underflow on empty or full structures.", "Implement with arrays or linked lists; all core operations are O(1)."],
    example: "Browser back button = stack of visited pages. A printer queue = documents printed in the order they were submitted.",
    takeaways: ["Stack = LIFO, Queue = FIFO.", "Core operations run in O(1).", "Stacks support recursion and backtracking.", "Queues support BFS and scheduling."],
    related: ["Linked lists", "Recursion", "Binary Trees"],
    followups: ["What is a circular queue?", "How do I check balanced parentheses with a stack?", "What is a priority queue?"],
    definitions: [["LIFO", "Last in, first out."], ["FIFO", "First in, first out."], ["Underflow", "Removing from an empty structure."]],
    questions: [
      mcq("Which structure follows LIFO?", ["Queue", "Stack", "Array", "Graph"], 1, "Stacks remove the most recently added item first.", "easy"),
      mcq("BFS typically uses a:", ["Stack", "Queue", "Heap", "Tree"], 1, "BFS visits nodes level by level using a queue.", "medium"),
      tf("Dequeue removes an element from the rear of a queue.", false, "Dequeue removes from the front.", "easy"),
      fill("Removing the top element of a stack is called ____.", "pop", "pop removes and returns the top item.", "easy"),
      short("Name one real-world use of a stack and explain why LIFO fits.", ["undo", "back", "call", "recursion", "parenthes", "latest", "recent"], "The undo feature: the most recent action must be reversed first, matching LIFO.", "Any 'most recent first' behaviour suits stacks.", "medium"),
    ],
  },
  {
    id: "ds-trees", subjectId: "ds", title: "Binary Trees",
    keywords: ["tree", "trees", "binary tree", "bst", "binary search tree", "traversal", "inorder", "preorder", "postorder", "node", "height"],
    direct: "A binary tree is a hierarchical structure where each node has at most two children, called left and right.",
    concept: "A binary search tree (BST) keeps smaller values in the left subtree and larger in the right, giving average O(log n) search, insert and delete. Traversals visit nodes in different orders: inorder (L, root, R) yields sorted order in a BST, preorder (root, L, R), postorder (L, R, root).",
    steps: ["Start at the root.", "For search/insert compare the key with the current node.", "Go left if smaller, right if larger.", "Insert at the first empty spot.", "Traverse recursively in the desired order."],
    example: "Insert 50, 30, 70, 20, 40: 30 goes left of 50, 70 right, 20 left of 30, 40 right of 30. Inorder traversal gives 20, 30, 40, 50, 70.",
    takeaways: ["Inorder traversal of a BST is sorted.", "Balanced trees keep operations at O(log n).", "Skewed trees degrade to O(n).", "Height = longest root-to-leaf path."],
    related: ["Stacks and Queues", "Graphs", "AVL trees"],
    followups: ["What is a balanced tree?", "How do I delete a node from a BST?", "Preorder vs postorder uses?"],
    definitions: [["Root", "Top node of the tree."], ["Leaf", "A node with no children."], ["Height", "Number of edges on the longest path from root to a leaf."]],
    questions: [
      mcq("Inorder traversal of a BST produces values in:", ["Random order", "Sorted order", "Reverse order", "Level order"], 1, "Left, root, right visits keys in ascending order.", "medium"),
      mcq("Maximum children of a binary tree node:", ["1", "2", "3", "Unlimited"], 1, "Binary means at most two.", "easy"),
      tf("A skewed BST can degrade search to O(n).", true, "It behaves like a linked list.", "medium"),
      fill("A node with no children is called a ____ node.", "leaf", "Leaves sit at the bottom of the tree.", "easy"),
      short("Why do we prefer balanced binary search trees?", ["log", "height", "balanced", "fast", "efficient", "o(log"], "Balanced trees keep height around log n, so search, insert and delete stay O(log n).", "Imbalance increases height and slows operations.", "hard"),
    ],
  },
  {
    id: "ds-sorting", subjectId: "ds", title: "Sorting Algorithms",
    keywords: ["sort", "sorting", "bubble sort", "merge sort", "quick sort", "quicksort", "insertion sort", "selection sort", "complexity", "big o"],
    direct: "Sorting algorithms arrange items in order. Simple ones like bubble sort run in O(n²); efficient ones like merge sort run in O(n log n).",
    concept: "Bubble, selection and insertion sort compare many pairs and are O(n²) in general. Merge sort divides the array, sorts halves and merges (O(n log n), stable, extra memory). Quick sort partitions around a pivot (average O(n log n), worst O(n²)).",
    steps: ["Choose an algorithm by input size and memory limits.", "Divide-and-conquer: split the array in halves (merge sort).", "Sort each half recursively.", "Merge sorted halves by repeatedly taking the smaller front element.", "Analyse time and space complexity."],
    example: "Merge sort on [5, 2, 4, 1]: split to [5,2] [4,1] → sort to [2,5] [1,4] → merge to [1,2,4,5].",
    takeaways: ["Merge sort is always O(n log n).", "Quick sort is usually fastest in practice.", "Insertion sort is great for nearly sorted data.", "Stable sorts preserve the order of equal elements."],
    related: ["Binary Trees", "Recursion", "Big-O notation"],
    followups: ["Why is quick sort worst-case O(n²)?", "What does stable sorting mean?", "Which sort for small arrays?"],
    definitions: [["Stable sort", "Equal elements keep their original relative order."], ["Pivot", "Element used to partition in quick sort."], ["In-place", "Uses only O(1) extra memory."]],
    questions: [
      mcq("Worst-case time of merge sort:", ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], 1, "Splitting gives log n levels, merging costs n per level.", "medium"),
      mcq("Which sort is typically best for nearly sorted data?", ["Insertion sort", "Merge sort", "Quick sort", "Heap sort"], 0, "Insertion sort approaches O(n) on nearly sorted input.", "hard"),
      tf("Bubble sort has an average time complexity of O(n²).", true, "It compares adjacent pairs repeatedly.", "easy"),
      fill("Quick sort partitions the array around a ____.", "pivot", "Elements smaller go left, larger go right.", "easy"),
      short("What does it mean for a sorting algorithm to be stable?", ["equal", "order", "relative", "preserve", "same"], "A stable sort keeps equal elements in their original relative order.", "Stability matters when sorting by multiple keys.", "medium"),
    ],
  },
  {
    id: "ai-ml-basics", subjectId: "ai", title: "Machine Learning Basics",
    keywords: ["machine learning", "ml", "supervised", "unsupervised", "training", "overfitting", "classification", "regression", "model", "dataset", "bias", "variance"],
    direct: "Machine learning lets computers learn patterns from data instead of following hand-written rules, so they can make predictions on new data.",
    concept: "In supervised learning the model learns from labelled examples (regression predicts numbers, classification predicts categories). Unsupervised learning finds structure in unlabelled data (e.g. clustering). Models must generalise: overfitting means memorising training data and failing on unseen data.",
    steps: ["Collect and clean data.", "Split into training and test sets.", "Choose a model and train it on the training set.", "Evaluate on the test set with suitable metrics.", "Tune, avoid overfitting and deploy."],
    example: "Predicting house prices from area and location is regression. Detecting spam emails from labelled examples is classification.",
    takeaways: ["Supervised needs labels; unsupervised does not.", "Always evaluate on unseen data.", "Overfitting = great training score, poor test score.", "More quality data usually helps more than a fancier model."],
    related: ["Neural Networks", "Probability Basics", "Gradient descent"],
    followups: ["How do I detect overfitting?", "What is cross-validation?", "Classification vs regression?"],
    definitions: [["Feature", "An input variable used by the model."], ["Label", "The correct output for a training example."], ["Overfitting", "When a model learns noise in the training data and generalises poorly."]],
    questions: [
      mcq("Predicting a continuous value (e.g. price) is:", ["Classification", "Regression", "Clustering", "Reinforcement"], 1, "Regression outputs numbers.", "easy"),
      mcq("A model with 99% training accuracy but 60% test accuracy is likely:", ["Underfitting", "Overfitting", "Perfect", "Unbiased"], 1, "A large gap signals overfitting.", "medium"),
      tf("Unsupervised learning uses labelled data.", false, "Unsupervised learning works with unlabelled data.", "easy"),
      fill("The input variables fed into a model are called ____.", "features", "Features describe each example.", "easy"),
      short("Why do we split data into training and test sets?", ["unseen", "generalis", "generaliz", "evaluate", "overfit", "new data"], "To evaluate how well the model generalises to unseen data and detect overfitting.", "Testing on training data would give misleading scores.", "medium"),
    ],
  },
  {
    id: "ai-neural-networks", subjectId: "ai", title: "Neural Networks",
    keywords: ["neural network", "neural networks", "neuron", "deep learning", "backpropagation", "activation", "relu", "layer", "perceptron", "gradient descent", "weights"],
    direct: "A neural network is a stack of connected layers of simple units (neurons) that learn weights from data to approximate complex functions.",
    concept: "Each neuron computes a weighted sum of inputs plus a bias and passes it through an activation function such as ReLU or sigmoid. Training uses a loss function to measure error, backpropagation to compute gradients, and gradient descent to update weights.",
    steps: ["Feed input through the layers (forward pass).", "Compute the loss between prediction and label.", "Backpropagate to compute each weight's gradient.", "Update weights: w ← w − η·∂L/∂w.", "Repeat for many epochs until the loss stops improving."],
    example: "A digit-recognition network takes 784 pixel values, passes them through hidden layers with ReLU, and outputs 10 probabilities, one per digit.",
    takeaways: ["Activation functions add non-linearity.", "Backpropagation uses the chain rule.", "Learning rate controls update size.", "Deeper networks learn more abstract features."],
    related: ["Machine Learning Basics", "Derivatives", "Matrices"],
    followups: ["Why do we need activation functions?", "What is the vanishing gradient problem?", "What is an epoch?"],
    definitions: [["Activation function", "A non-linear function applied to a neuron's output."], ["Epoch", "One full pass through the training dataset."], ["Learning rate", "Step size of weight updates."]],
    formulas: ["z = w·x + b", "w ← w − η · ∂L/∂w"],
    questions: [
      mcq("Which algorithm computes gradients in neural networks?", ["Backpropagation", "Binary search", "Dijkstra", "K-means"], 0, "Backpropagation applies the chain rule layer by layer.", "medium"),
      mcq("Why are activation functions used?", ["To add non-linearity", "To reduce data size", "To store weights", "To shuffle data"], 0, "Without them the network collapses into a linear model.", "medium"),
      tf("A very large learning rate can make training diverge.", true, "Steps overshoot the minimum.", "medium"),
      fill("One complete pass through the training data is called an ____.", "epoch", "Training usually runs for many epochs.", "easy"),
      short("Describe what gradient descent does.", ["minimi", "loss", "gradient", "weights", "update", "error"], "Gradient descent iteratively updates weights in the direction that reduces the loss.", "Each step moves against the gradient.", "hard"),
    ],
  },
  {
    id: "ai-search", subjectId: "ai", title: "Search Algorithms in AI",
    keywords: ["search algorithm", "bfs", "dfs", "a*", "a star", "heuristic", "breadth first", "depth first", "uninformed", "informed", "state space"],
    direct: "AI search algorithms explore a state space to find a path from a start state to a goal. Uninformed methods (BFS, DFS) use no extra knowledge; informed methods (A*) use heuristics.",
    concept: "BFS expands level by level and finds the shortest path in unweighted graphs but uses lots of memory. DFS goes deep first with low memory but may miss the shortest path. A* orders nodes by f(n) = g(n) + h(n), combining cost so far with a heuristic estimate; it is optimal if h never overestimates.",
    steps: ["Define states, actions and the goal test.", "Start with the initial node in the frontier.", "Pick the next node (queue for BFS, stack for DFS, priority queue for A*).", "Expand it and add new states.", "Stop when the goal is reached."],
    example: "Route finding: A* on a map uses straight-line distance to the destination as h(n), exploring fewer cities than BFS.",
    takeaways: ["BFS = queue, DFS = stack, A* = priority queue.", "Admissible heuristics never overestimate.", "A* = cost so far + estimated cost to go.", "State-space size drives complexity."],
    related: ["Stacks and Queues", "Binary Trees", "Machine Learning Basics"],
    followups: ["What makes a heuristic admissible?", "BFS vs DFS memory use?", "What is greedy best-first search?"],
    definitions: [["Heuristic", "An estimate of the remaining cost to the goal."], ["Frontier", "The set of nodes waiting to be expanded."], ["Admissible", "Never overestimates the true cost."]],
    formulas: ["f(n) = g(n) + h(n)"],
    questions: [
      mcq("Which data structure does BFS use?", ["Stack", "Queue", "Priority queue", "Hash map"], 1, "FIFO ordering expands level by level.", "easy"),
      mcq("In A*, f(n) equals:", ["g(n)", "h(n)", "g(n) + h(n)", "g(n) − h(n)"], 2, "Cost so far plus heuristic estimate.", "medium"),
      tf("A* is optimal when its heuristic is admissible.", true, "Admissible heuristics never overestimate.", "hard"),
      fill("A heuristic that never overestimates the true cost is called ____.", "admissible", "Admissibility guarantees optimality for A*.", "medium"),
      short("Compare BFS and DFS in terms of memory use.", ["memory", "level", "deep", "breadth", "branch", "frontier"], "BFS stores a whole level of nodes so uses much more memory; DFS stores only the current path so uses far less.", "Memory differs due to frontier size.", "hard"),
    ],
  },
  {
    id: "sci-photosynthesis", subjectId: "sci", title: "Photosynthesis",
    keywords: ["photosynthesis", "chlorophyll", "chloroplast", "calvin cycle", "light reaction", "plant", "glucose", "stomata"],
    direct: "Photosynthesis is how plants, algae and some bacteria convert light energy, water and carbon dioxide into glucose and oxygen.",
    concept: "In the chloroplast's thylakoids, the light-dependent reactions capture sunlight with chlorophyll, split water and produce oxygen, ATP and NADPH. In the stroma, the Calvin cycle uses ATP and NADPH to fix CO₂ into glucose.",
    steps: ["Chlorophyll absorbs sunlight (mostly red and blue light).", "Water is split, releasing oxygen, electrons and protons.", "Light reactions produce ATP and NADPH.", "CO₂ enters through stomata and is fixed in the Calvin cycle.", "Glucose is built and used for energy or stored as starch."],
    example: "Practical example: place a healthy aquatic plant in water under a lamp — tiny oxygen bubbles rise from the leaves. Move the lamp farther away and the bubble rate drops, showing light intensity limits photosynthesis.",
    takeaways: ["6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.", "Light reactions happen in thylakoids; Calvin cycle in the stroma.", "Light, CO₂ and temperature limit the rate.", "Oxygen released comes from water."],
    related: ["Cellular respiration", "Chloroplast structure", "Limiting factors"],
    followups: ["Where does the oxygen come from?", "What are limiting factors?", "How does photosynthesis differ from respiration?"],
    definitions: [["Chlorophyll", "The green pigment that absorbs light energy."], ["Stomata", "Leaf pores that let CO₂ in and O₂ out."], ["ATP", "The cell's energy currency."]],
    formulas: ["6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂"],
    questions: [
      mcq("Which pigment captures light in photosynthesis?", ["Haemoglobin", "Chlorophyll", "Melanin", "Keratin"], 1, "Chlorophyll absorbs red and blue light.", "easy"),
      mcq("The Calvin cycle takes place in the:", ["Thylakoid membrane", "Stroma", "Nucleus", "Mitochondria"], 1, "The stroma is the fluid of the chloroplast.", "medium"),
      tf("The oxygen released in photosynthesis comes from water.", true, "Water is split in the light-dependent reactions.", "medium"),
      fill("Leaf pores through which CO₂ enters are called ____.", "stomata", "Singular: stoma.", "easy"),
      short("Name two factors that limit the rate of photosynthesis.", ["light", "co2", "carbon dioxide", "temperature", "water"], "Light intensity, carbon dioxide concentration and temperature.", "Whichever is scarcest limits the rate.", "medium"),
    ],
  },
];

export const KB: KBTopic[] = raw.map((t) => ({
  ...t,
  questions: t.questions.map((q, i) => ({ ...q, id: `${t.id}-q${i + 1}`, topicId: t.id, subjectId: t.subjectId })),
}));
export const getKB = (id: string) => KB.find((t) => t.id === id);
export const KB_SUBJECT_TOPICS = (subjectId: string) => KB.filter((t) => t.subjectId === subjectId);

export function findTopic(text: string, subjectId?: string): KBTopic | undefined {
  const lower = text.toLowerCase();
  let best: KBTopic | undefined;
  let bestScore = 0;
  for (const t of KB) {
    let score = 0;
    for (const k of t.keywords) {
      if (lower.includes(k)) score += k.length > 4 ? 3 : 2;
    }
    if (lower.includes(t.title.toLowerCase())) score += 6;
    if (subjectId && t.subjectId === subjectId) score += 1;
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return bestScore >= 2 ? best : undefined;
}
