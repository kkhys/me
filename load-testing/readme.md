# Load Testing System

Comprehensive load testing suite for the blog site using k6.

## File Structure

```
load-testing/
├── config.ts            # Common configuration (URLs, thresholds, scenarios)
├── utils.ts             # Utility functions and helpers
├── basic-load-test.ts   # Basic load test (normal usage)
├── api-load-test.ts     # API load test (external APIs)
├── stress-test.ts       # Stress test (extreme load)
├── monitoring.ts        # Advanced monitoring features
└── readme.md            # This file
```

## Quick Start

### Prerequisites

```bash
# Install k6
brew install k6

# Or download directly
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-macos-amd64.zip -L | tar xvs --strip-components 1
```

### Basic Execution

```bash
# Basic load test (recommended)
pnpm load-test

# API test
pnpm load-test:api

# Stress test
pnpm load-test:stress

# Run all tests
pnpm load-test:all
```

## Test Types

### 1. Basic Load Test (`basic-load-test.ts`)
**Purpose**: Performance validation under normal usage
- **Load**: 10 concurrent users × 9 minutes
- **Target**: Homepage, blog posts, static pages
- **Thresholds**: 95th percentile < 500ms, error rate < 1%

**Execution:**
```bash
k6 run load-testing/basic-load-test.ts
```

### 2. API Load Test (`api-load-test.ts`)
**Purpose**: API endpoint stability validation
- **Load**: 5 concurrent users × 5 minutes
- **Target**: OG image generation, error handling
- **Thresholds**: 95th percentile < 1000ms, error rate < 5%

**Execution:**
```bash
k6 run load-testing/api-load-test.ts
```

**Note**: GitHub/Spotify API tests are commented out due to rate limiting

### 3. Stress Test (`stress-test.ts`)
**Purpose**: Behavior verification under extreme load
- **Load**: Up to 200 concurrent users × 21 minutes
- **Pattern**: Gradual load increase + spike testing
- **Thresholds**: 95th percentile < 2000ms, error rate < 10%

**Execution:**
```bash
k6 run load-testing/stress-test.ts
```

## Configuration

### Environment Variables

```bash
# Basic configuration
export BASE_URL="http://localhost:4321"   # Target URL
export TEST_ENV="test"                    # Environment (test/staging/production)

# Monitoring configuration (optional)
export PUSHGATEWAY_URL="http://localhost:9091"
export PUSHGATEWAY_ENABLED="true"
```

### Main Configuration in config.ts

```typescript
// Performance thresholds
THRESHOLDS: {
  basic: {
    http_req_duration: ["p(95)<500"],   // Basic test
    http_req_failed: ["rate<0.01"]
  },
  api: {
    http_req_duration: ["p(95)<1000"],  // API test  
    http_req_failed: ["rate<0.05"]
  },
  stress: {
    http_req_duration: ["p(95)<2000"],  // Stress test
    http_req_failed: ["rate<0.1"]
  }
}

// User behavior patterns
USER_BEHAVIOR: {
  probabilities: {
    read_blog_post: 0.7,              // Blog post reading rate
    view_additional_page: 0.3         // Additional page viewing rate
  }
}
```

## Utility Features

### Main Functions in utils.ts

```typescript
// Basic checks
basicChecks(response, "Homepage", 200, 1000)

// API response validation
apiChecks(response, "API_Name", validatorFunction)

// Weighted random selection
weightedRandom([
  { item: "/", weight: 5 },
  { item: "/blog", weight: 3 }
])

// Retry functionality
retryRequest(() => http.get(url), 3, 1)

// Error logging
logError(response, url, "context")
```

### Advanced Features

- **Weighted URL Selection**: Higher weights for popular pages
- **Retry Functionality**: Automatic retry on server errors
- **Validators**: API response structure validation
- **Custom Metrics**: Business metric measurement

## Result Output

### Basic Output
```bash
# Console output (default)
k6 run load-testing/basic-load-test.ts

# Save as JSON
k6 run --out json=results.json load-testing/basic-load-test.ts

# Save as CSV
k6 run --out csv=results.csv load-testing/basic-load-test.ts
```

### Advanced Monitoring (monitoring.ts)

```typescript
import { metricsCollector } from "./monitoring.ts";

// Record HTTP request details
metricsCollector.recordHttpRequest(response, "/api/test", "operation");

// Check performance thresholds
metricsCollector.checkPerformanceThresholds(response, "/slow-page");

// Print summary on test completion
metricsCollector.printSummary();
```

## Real-world Use Cases

### Development Testing
```bash
# Performance check for new features
BASE_URL="http://localhost:4321" pnpm load-test
```

### Pre-deployment Testing
```bash
# Staging environment verification
BASE_URL="https://staging.example.com" pnpm load-test:all
```

### Production Monitoring
```bash
# Regular production environment checks
BASE_URL="https://example.com" TEST_ENV="production" pnpm load-test
```

## Troubleshooting

### Common Errors

**1. Module not found**
```
ERRO[0000] GoError: The moduleSpecifier "./config" couldn't be found
```
**Solution**: Specify file extension `import CONFIG from "./config.ts"`

**2. InfluxDB connection error**
```
ERRO[0009] Couldn't write stats ... connection refused
```
**Solution**: Run without InfluxDB `k6 run load-testing/basic-load-test.ts`

**3. Timeout error**
```
ERRO[0030] Request timeout
```
**Solution**: Adjust `timeout` setting in `config.ts`

### Debugging Methods

```bash
# Verbose log output
k6 run --verbose load-testing/basic-load-test.ts

# HTTP trace logging
k6 run --http-debug="full" load-testing/basic-load-test.ts

# Reduce VU count for verification
k6 run --vus=1 --duration=1m load-testing/basic-load-test.ts
```

## References

- [k6 Official Documentation](https://k6.io/docs/)

## Continuous Improvement

This test suite is continuously improving with:

- [ ] GitHub Actions workflow integration
- [ ] External API dependency resolution for API tests
- [ ] Grafana dashboard construction
- [ ] Automated performance regression testing
- [ ] Detailed reporting functionality

---

**Tip**: It is recommended to start with `pnpm load-test` for the first run.
