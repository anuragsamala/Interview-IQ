import vm from 'node:vm';

export interface ExecutionResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED';
  runtime: number; // ms
  memory: number; // kb
  testResults: {
    input: string;
    expected: string;
    actual?: string;
    passed: boolean;
    error?: string;
  }[];
  errorMessage?: string;
}

export class CodeExecutor {
  /**
   * Executes JavaScript/TypeScript code against test cases in a sandboxed V8 context
   */
  static executeJs(
    code: string,
    testCases: Array<{ input: string; expected: string }>
  ): ExecutionResult {
    const startTime = Date.now();
    const testResults: ExecutionResult['testResults'] = [];

    // Clean up TypeScript annotations if any (simple stripping for execution)
    const cleanedCode = code
      .replace(/:\s*[A-Z][a-zA-Z0-9<>\[\]]*(?=\s*[,)=;])/g, '')
      .replace(/interface\s+\w+[\s\S]*?}/g, '')
      .replace(/type\s+\w+\s*=[\s\S]*?;/g, '');

    // Setup safe sandbox
    const sandbox: Record<string, any> = {
      console: { log: () => {}, warn: () => {}, error: () => {} },
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      Map,
      Set,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
    };

    const context = vm.createContext(sandbox);

    try {
      // 1. Run the user's code in the context to define their function
      const script = new vm.Script(cleanedCode);
      script.runInContext(context, { timeout: 2000 });

      // Find the main function defined by user
      const definedFunctions = Object.keys(sandbox).filter(
        (key) => typeof sandbox[key] === 'function' && !['parseInt', 'parseFloat', 'isNaN', 'isFinite'].includes(key)
      );

      if (definedFunctions.length === 0) {
        return {
          status: 'RUNTIME_ERROR',
          runtime: Date.now() - startTime,
          memory: Math.floor(process.memoryUsage().heapUsed / 1024),
          testResults: [],
          errorMessage: 'No function found in your code. Please declare a function (e.g. function solution(...) { ... }).',
        };
      }

      // Pick the user's function (prefer non-anonymous or the first one defined)
      const functionName = definedFunctions[definedFunctions.length - 1];
      const fn = sandbox[functionName];

      let allPassed = true;

      for (const tc of testCases) {
        try {
          // Parse test case input: e.g. "nums = [2,7,11,15], target = 9" or "[2,7,11,15], 9" or "5"
          const parsedArgs = this.parseInputArgs(tc.input, context);

          // Execute with timeout
          const testStart = Date.now();
          const rawResult = fn.apply(null, parsedArgs);
          const elapsed = Date.now() - testStart;

          if (elapsed > 1500) {
            allPassed = false;
            testResults.push({
              input: tc.input,
              expected: tc.expected,
              passed: false,
              error: 'Time Limit Exceeded (> 1.5s)',
            });
            return {
              status: 'TIME_LIMIT_EXCEEDED',
              runtime: elapsed,
              memory: Math.floor(process.memoryUsage().heapUsed / 1024),
              testResults,
              errorMessage: 'Time Limit Exceeded on test case: ' + tc.input,
            };
          }

          const actualStr = this.normalizeOutput(rawResult);
          const expectedStr = this.normalizeExpected(tc.expected);

          const passed = this.compareOutputs(actualStr, expectedStr);
          if (!passed) allPassed = false;

          testResults.push({
            input: tc.input,
            expected: tc.expected,
            actual: actualStr,
            passed,
          });
        } catch (tcErr: any) {
          allPassed = false;
          testResults.push({
            input: tc.input,
            expected: tc.expected,
            passed: false,
            error: tcErr.message || 'Execution error',
          });
        }
      }

      const totalRuntime = Math.max(1, Date.now() - startTime);
      const memoryUsage = Math.floor(process.memoryUsage().heapUsed / 1024);

      return {
        status: allPassed ? 'ACCEPTED' : 'WRONG_ANSWER',
        runtime: totalRuntime,
        memory: memoryUsage,
        testResults,
      };
    } catch (err: any) {
      return {
        status: 'RUNTIME_ERROR',
        runtime: Date.now() - startTime,
        memory: Math.floor(process.memoryUsage().heapUsed / 1024),
        testResults: [],
        errorMessage: err.message || 'Syntax or evaluation error in your code',
      };
    }
  }

  private static parseInputArgs(inputStr: string, context: vm.Context): any[] {
    try {
      // If formatted as variable assignments: "nums = [2,7,11,15], target = 9"
      if (inputStr.includes('=')) {
        // Strip parameter names: e.g. "nums = [2,7,11,15], target = 9" -> "[[2,7,11,15], 9]"
        const assignments = inputStr.split(/,\s*(?=[a-zA-Z_]\w*\s*=)/);
        const evalCode = `[ ${assignments.map((a) => a.replace(/^[a-zA-Z_]\w*\s*=\s*/, '')).join(', ')} ]`;
        return vm.runInContext(evalCode, context, { timeout: 500 });
      }

      // If formatted as a single json array or value
      const evalCode = `[ ${inputStr} ]`;
      return vm.runInContext(evalCode, context, { timeout: 500 });
    } catch {
      // Fallback: return raw string as single argument
      return [inputStr];
    }
  }

  private static normalizeOutput(val: any): string {
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch {
        return String(val);
      }
    }
    return String(val);
  }

  private static normalizeExpected(val: string): string {
    return val.trim().replace(/\s+/g, '');
  }

  private static compareOutputs(actual: string, expected: string): boolean {
    const normActual = actual.trim().replace(/\s+/g, '');
    const normExpected = expected.trim().replace(/\s+/g, '');

    if (normActual === normExpected) return true;

    // Check JSON parsed equality
    try {
      const parsedActual = JSON.parse(normActual);
      const parsedExpected = JSON.parse(normExpected);
      return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
    } catch {
      return false;
    }
  }
}
