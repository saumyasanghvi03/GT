function parseUnitTestOutput(output) {
  const lines = output.split('\n');
  const testResults = [];

  let currentTest = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('FAIL')) {
      const match = line.match(/FAIL: (.*)/);
      if (match) {
        const testName = match[1].split(') ... ')[0];
        currentTest = { name: testName, status: 'failed', reason: '' };
        testResults.push(currentTest);
      }
    } else if (line.match(/(.*) \((.*)\) ... ok/)) {
      const match = line.match(/(.*) \((.*)\) ... ok/);
      const testName = match[1];
      currentTest = { name: testName, status: 'passed' };
      testResults.push(currentTest);
    } else if (line.startsWith('AssertionError')) {
      if (currentTest) {
        const reason = line.trim();
        currentTest.reason = reason;
      }
    }
  }

  return testResults;
}

const fs = require('fs');

let sampleOutput = fs.readFileSync('gocodeo_test.out', 'utf8')

const testResults = parseUnitTestOutput(sampleOutput);

// Display the test results
testResults.forEach((test) => {
  console.log(`Test: ${test.name}`);
  console.log(`Status: ${test.status}`);
  if (test.status === 'failed') {
    console.log(`Reason: ${test.reason}`);
  }
  console.log('-------------------');
});
