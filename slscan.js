// Custom Error Class for SLScan
class SLScanError extends Error {
  constructor(message) {
    super(message);
    this.name = "SLScanError";
  }
}

// Function to simulate checking for vulnerabilities
function checkVulnerability(vulnerable) {
  if (vulnerable) {
    throw new SLScanError("SLScan vulnerability detected! Resolution needed within SLA.");
  } else {
    console.log("No vulnerabilities found.");
  }
}

// Test error handling
function testErrorHandling() {
  try {
    // Simulate vulnerability check (set to true to trigger the error)
    checkVulnerability(true);
  } catch (error) {
    if (error instanceof SLScanError) {
      console.error("Error:", error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

// Run the test
testErrorHandling();
