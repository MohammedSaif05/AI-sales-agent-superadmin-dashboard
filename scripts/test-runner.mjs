// Real Integration Test Runner for Feature 01 Super Admin Dashboard
const BACKEND_URL = 'http://localhost:3000/api/v1';

const SUPER_ADMIN_PHONE = '+918148387156';
const SUPER_ADMIN_PASSWORD = 'saif@2005';

async function runTests() {
  const results = [];
  let normalUserToken = null;

  function record(id, scenario, steps, expected, actual, pass, status, issue = null) {
    results.push({ id, scenario, steps, expected, actual, pass, status, issue });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${id}: ${scenario} (${status || 'N/A'})`);
    if (issue) console.log(`       Issue: ${issue}`);
  }

  // --- TC-01: Backend Health Check ---
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    const data = await res.json();
    const pass = res.status === 200 && data.success === true && data.data?.status === 'ok';
    record(
      'TC-01',
      'Backend Health Check',
      'GET /api/v1/health',
      'HTTP 200 with success: true and status: "ok"',
      `Status: ${res.status}, status: ${data.data?.status}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-01', 'Backend Health Check', 'GET /api/v1/health', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-02: Super Admin Login (Valid Credentials) ---
  let adminTokens = null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: SUPER_ADMIN_PHONE,
        password: SUPER_ADMIN_PASSWORD,
        deviceInfo: 'Test Runner / Integration',
      }),
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      data.data?.tokens?.accessToken &&
      data.data?.tokens?.refreshToken &&
      data.data?.user?.systemRole === 'SUPER_ADMIN';

    if (pass) {
      adminTokens = data.data.tokens;
    }

    record(
      'TC-02',
      'Super Admin Authentication with Valid Credentials',
      'POST /api/v1/auth/login with phone & password',
      'HTTP 200, JWT accessToken, refreshToken, user.systemRole === SUPER_ADMIN',
      `Status: ${res.status}, role: ${data.data?.user?.systemRole}, hasAccessToken: ${!!data.data?.tokens?.accessToken}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-02', 'Super Admin Authentication', 'POST /api/v1/auth/login', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-03: Invalid Credentials Rejection ---
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: SUPER_ADMIN_PHONE,
        password: 'wrong-password-12345',
      }),
    });
    const data = await res.json();
    const pass = res.status === 401 && data.errorCode === 'INVALID_CREDENTIALS';
    record(
      'TC-03',
      'Invalid Credentials Rejection',
      'POST /api/v1/auth/login with incorrect password',
      'HTTP 401, errorCode: INVALID_CREDENTIALS',
      `Status: ${res.status}, errorCode: ${data.errorCode}, message: ${data.message}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-03', 'Invalid Credentials', 'POST /api/v1/auth/login', 'HTTP 401', err.message, false, 0, err.message);
  }

  // --- TC-04: Non-SuperAdmin User Role Rejection (403 Forbidden) ---
  try {
    // Register a normal business owner / user
    const testUserPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
    const regRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testUserPhone,
        password: 'UserPass@123',
        name: 'Normal Test User',
        businessName: 'Test Normal Store',
        businessAddress: '123 Test Street',
        businessCity: 'Mumbai',
        businessState: 'Maharashtra',
        businessPincode: '400001',
      }),
    });

    const regData = await regRes.json();
    const userToken = regData.data?.tokens?.accessToken;
    if (userToken) {
      normalUserToken = userToken;
      // Attempt to access admin dashboard with normal user token
      const adminRes = await fetch(`${BACKEND_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const adminData = await adminRes.json();
      const pass = adminRes.status === 403 && adminData.errorCode === 'FORBIDDEN';
      record(
        'TC-04',
        'Non-SuperAdmin Role Rejection on Admin Endpoints',
        'GET /api/v1/admin/dashboard using normal USER role token',
        'HTTP 403 Forbidden, errorCode: FORBIDDEN',
        `Status: ${adminRes.status}, errorCode: ${adminData.errorCode}`,
        pass,
        adminRes.status,
      );
    } else {
      record('TC-04', 'Non-SuperAdmin Role Rejection', 'Register normal user', 'User token generated', JSON.stringify(regData), false, regRes.status);
    }
  } catch (err) {
    record('TC-04', 'Non-SuperAdmin Role Rejection', 'GET /api/v1/admin/dashboard', 'HTTP 403', err.message, false, 0, err.message);
  }

  if (!adminTokens) {
    console.error('Cannot continue admin tests without valid admin token.');
    return results;
  }

  const authHeaders = {
    Authorization: `Bearer ${adminTokens.accessToken}`,
    'Content-Type': 'application/json',
  };

  // --- TC-05: Platform Statistics (GET /admin/dashboard) ---
  try {
    const res = await fetch(`${BACKEND_URL}/admin/dashboard`, { headers: authHeaders });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      typeof data.data?.totalBusinesses === 'number' &&
      typeof data.data?.totalCustomers === 'number' &&
      typeof data.data?.totalImports === 'number' &&
      typeof data.data?.totalFiles === 'number';

    record(
      'TC-05',
      'Platform Overview Metrics Retrieval',
      'GET /api/v1/admin/dashboard with Super Admin token',
      'HTTP 200, returns totalBusinesses, totalUsers, totalCustomers, totalImports, totalFiles',
      `Status: ${res.status}, businesses: ${data.data?.totalBusinesses}, customers: ${data.data?.totalCustomers}, imports: ${data.data?.totalImports}, files: ${data.data?.totalFiles}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-05', 'Platform Overview Metrics', 'GET /admin/dashboard', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-06: Business Directory Listing & Pagination ---
  let firstBusinessId = null;
  let firstBusinessName = null;
  try {
    const res = await fetch(`${BACKEND_URL}/admin/businesses?page=1&limit=5`, { headers: authHeaders });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.meta?.total !== undefined &&
      data.meta?.page === 1;

    if (pass && data.data.length > 0) {
      firstBusinessId = data.data[0].id;
      firstBusinessName = data.data[0].name;
    }

    record(
      'TC-06',
      'Business Directory Listing & Pagination',
      'GET /api/v1/admin/businesses?page=1&limit=5',
      'HTTP 200, array of businesses with owner and stats objects, meta pagination',
      `Status: ${res.status}, items returned: ${data.data?.length}, total in db: ${data.meta?.total}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-06', 'Business Directory Listing', 'GET /admin/businesses', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-07: Business Directory Search Filtering ---
  try {
    const searchTerm = firstBusinessName ? firstBusinessName.slice(0, 4) : 'Test';
    const res = await fetch(`${BACKEND_URL}/admin/businesses?search=${encodeURIComponent(searchTerm)}`, {
      headers: authHeaders,
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.data.every((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm) ||
        (b.city && b.city.toLowerCase().includes(searchTerm.toLowerCase())),
      );

    record(
      'TC-07',
      'Business Directory Backend Search Filtering',
      `GET /api/v1/admin/businesses?search=${searchTerm}`,
      `HTTP 200, matches filtered by term "${searchTerm}"`,
      `Status: ${res.status}, matched items: ${data.data?.length}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-07', 'Business Directory Search', 'GET /admin/businesses?search=', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-08: Business Deep Inspection (Profile & Operating Hours) ---
  if (firstBusinessId) {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}`, { headers: authHeaders });
      const data = await res.json();
      const pass =
        res.status === 200 &&
        data.success === true &&
        data.data?.id === firstBusinessId &&
        Array.isArray(data.data?.hours) &&
        data.data?._count !== undefined;

      record(
        'TC-08',
        'Business Deep Inspection (Profile & Hours)',
        `GET /api/v1/admin/businesses/${firstBusinessId}`,
        'HTTP 200, business profile, hours array with 7 days, _count statistics',
        `Status: ${res.status}, name: ${data.data?.name}, hours entries: ${data.data?.hours?.length}, customers count: ${data.data?._count?.customers}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-08', 'Business Deep Inspection', `GET /admin/businesses/${firstBusinessId}`, 'HTTP 200', err.message, false, 0, err.message);
    }

    // --- TC-09: Customer Inspection for Specific Business ---
    try {
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}/customers?page=1&limit=10`, {
        headers: authHeaders,
      });
      const data = await res.json();
      const pass =
        res.status === 200 &&
        data.success === true &&
        Array.isArray(data.data) &&
        data.meta !== undefined;

      record(
        'TC-09',
        'Business Customer Inspection Table',
        `GET /api/v1/admin/businesses/${firstBusinessId}/customers?page=1&limit=10`,
        'HTTP 200, array of customers with normalizedPhone and marketing preferences, meta pagination',
        `Status: ${res.status}, customers found: ${data.data?.length}, total: ${data.meta?.total}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-09', 'Customer Inspection', `GET /admin/businesses/${firstBusinessId}/customers`, 'HTTP 200', err.message, false, 0, err.message);
    }
  }

  // --- TC-10: Global Import Monitoring Listing ---
  let firstImportId = null;
  try {
    const res = await fetch(`${BACKEND_URL}/admin/imports?page=1&limit=5`, { headers: authHeaders });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.meta !== undefined;

    if (pass && data.data.length > 0) {
      firstImportId = data.data[0].id;
    }

    record(
      'TC-10',
      'Global Import Monitoring Listing',
      'GET /api/v1/admin/imports?page=1&limit=5',
      'HTTP 200, array of imports with status, business info, row counts, and file metadata',
      `Status: ${res.status}, imports returned: ${data.data?.length}, total in db: ${data.meta?.total}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-10', 'Global Import Monitoring', 'GET /admin/imports', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-11: Import Job Deep Inspection & Error Diagnostics ---
  if (firstImportId) {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/imports/${firstImportId}`, { headers: authHeaders });
      const data = await res.json();
      const pass =
        res.status === 200 &&
        data.success === true &&
        data.data?.id === firstImportId &&
        data.data?.totalRows !== undefined &&
        data.data?.validRows !== undefined;

      record(
        'TC-11',
        'Import Job Detailed Breakdown',
        `GET /api/v1/admin/imports/${firstImportId}`,
        'HTTP 200, import status, row stats (valid/invalid/duplicates), file information',
        `Status: ${res.status}, job status: ${data.data?.status}, total: ${data.data?.totalRows}, valid: ${data.data?.validRows}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-11', 'Import Job Detailed Breakdown', `GET /admin/imports/${firstImportId}`, 'HTTP 200', err.message, false, 0, err.message);
    }
  }

  // --- TC-12: Silent Token Refresh & Rotation (POST /auth/refresh) ---
  let rotatedAccessToken = null;
  let rotatedRefreshToken = null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: adminTokens.refreshToken,
      }),
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      data.data?.accessToken &&
      data.data?.refreshToken;

    if (pass) {
      rotatedAccessToken = data.data.accessToken;
      rotatedRefreshToken = data.data.refreshToken;
    }

    record(
      'TC-12',
      'Silent Token Refresh & Rotation',
      'POST /api/v1/auth/refresh with valid refreshToken in JSON body',
      'HTTP 200, rotated accessToken and new rotated refreshToken returned in JSON response',
      `Status: ${res.status}, rotatedAccess: ${!!rotatedAccessToken}, rotatedRefresh: ${!!rotatedRefreshToken}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-12', 'Silent Token Refresh', 'POST /auth/refresh', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-13: Re-executing Protected Request with Rotated Token ---
  if (rotatedAccessToken) {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${rotatedAccessToken}` },
      });
      const data = await res.json();
      const pass = res.status === 200 && data.success === true;
      record(
        'TC-13',
        'Re-executing Protected Request with Rotated Access Token',
        'GET /api/v1/admin/dashboard using newly rotated access token',
        'HTTP 200, verified token rotation succeeds for privileged calls',
        `Status: ${res.status}, success: ${data.success}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-13', 'Re-executing with Rotated Token', 'GET /admin/dashboard', 'HTTP 200', err.message, false, 0, err.message);
    }
  }

  // --- TC-14: Refresh Failure Handling (Invalid Refresh Token) ---
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: 'invalid-expired-or-revoked-token-string',
      }),
    });
    const data = await res.json();
    const pass = res.status === 401 && (data.errorCode === 'SESSION_EXPIRED' || data.errorCode === 'UNAUTHORIZED');
    record(
      'TC-14',
      'Invalid Refresh Token Rejection',
      'POST /api/v1/auth/refresh with corrupted or revoked refresh token',
      'HTTP 401 Unauthorized, errorCode: SESSION_EXPIRED or UNAUTHORIZED',
      `Status: ${res.status}, errorCode: ${data.errorCode}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-14', 'Invalid Refresh Token', 'POST /auth/refresh', 'HTTP 401', err.message, false, 0, err.message);
  }

  // --- TC-15: Non-Existent Entity Error Handling (404 NOT_FOUND) ---
  try {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await fetch(`${BACKEND_URL}/admin/businesses/${fakeId}`, {
      headers: { Authorization: `Bearer ${rotatedAccessToken || adminTokens.accessToken}` },
    });
    const data = await res.json();
    const pass = res.status === 404 && data.errorCode === 'BUSINESS_NOT_FOUND';
    record(
      'TC-15',
      'Non-Existent Business Inspection (404 Error State)',
      `GET /api/v1/admin/businesses/${fakeId}`,
      'HTTP 404 Not Found, errorCode: BUSINESS_NOT_FOUND',
      `Status: ${res.status}, errorCode: ${data.errorCode}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-15', 'Non-Existent Business 404', 'GET /admin/businesses/:id', 'HTTP 404', err.message, false, 0, err.message);
  }

  // --- TC-16: Non-Existent Import Error Handling (404 NOT_FOUND) ---
  try {
    const fakeImportId = '00000000-0000-0000-0000-000000000000';
    const res = await fetch(`${BACKEND_URL}/admin/imports/${fakeImportId}`, {
      headers: { Authorization: `Bearer ${rotatedAccessToken || adminTokens.accessToken}` },
    });
    const data = await res.json();
    const pass = res.status === 404 && data.errorCode === 'IMPORT_NOT_FOUND';
    record(
      'TC-16',
      'Non-Existent Import Inspection (404 Error State)',
      `GET /api/v1/admin/imports/${fakeImportId}`,
      'HTTP 404 Not Found, errorCode: IMPORT_NOT_FOUND',
      `Status: ${res.status}, errorCode: ${data.errorCode}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-16', 'Non-Existent Import 404', 'GET /admin/imports/:id', 'HTTP 404', err.message, false, 0, err.message);
  }

  // --- TC-17: Trailing 30-Day AI Business Analyst Summary ---
  const activeAuthToken = rotatedAccessToken || adminTokens.accessToken;
  const analystHeaders = {
    Authorization: `Bearer ${activeAuthToken}`,
    'Content-Type': 'application/json',
  };

  if (firstBusinessId) {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}/analyst-summary`, {
        headers: analystHeaders,
      });
      const data = await res.json();
      const hasSafeContract =
        res.status === 200 &&
        data.success === true &&
        data.data?.period?.from &&
        data.data?.period?.to &&
        typeof data.data?.summary === 'string' &&
        Array.isArray(data.data?.metrics) &&
        Array.isArray(data.data?.insights) &&
        Array.isArray(data.data?.recommendations) &&
        Array.isArray(data.data?.dataLimitations) &&
        data.data?.executionMode === undefined &&
        data.data?.isAsync === undefined &&
        data.data?.dataSnapshotJson === undefined &&
        data.data?.contextJson === undefined;

      record(
        'TC-17',
        'AI Business Analyst 30-Day Summary Retrieval & Contract Safety',
        `GET /api/v1/admin/businesses/${firstBusinessId}/analyst-summary`,
        'HTTP 200, period, summary, metrics, insights, recommendations, limitations; zero unsupported/raw fields',
        `Status: ${res.status}, metrics: ${data.data?.metrics?.length}, insights: ${data.data?.insights?.length}, recs: ${data.data?.recommendations?.length}`,
        hasSafeContract,
        res.status,
      );
    } catch (err) {
      record('TC-17', 'Analyst Summary Retrieval', 'GET /admin/businesses/:id/analyst-summary', 'HTTP 200', err.message, false, 0, err.message);
    }

    // --- TC-18: Business Historical Analyses Listing & Pagination ---
    try {
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}/analyses?page=1&limit=10`, {
        headers: analystHeaders,
      });
      const data = await res.json();
      const pass =
        res.status === 200 &&
        data.success === true &&
        (Array.isArray(data.data) || Array.isArray(data.data?.data)) &&
        (data.meta !== undefined || data.data?.meta !== undefined);

      record(
        'TC-18',
        'Historical Analyses Listing & Pagination Structure',
        `GET /api/v1/admin/businesses/${firstBusinessId}/analyses?page=1&limit=10`,
        'HTTP 200, paginated analyses array, meta pagination',
        `Status: ${res.status}, items: ${Array.isArray(data.data) ? data.data.length : data.data?.data?.length}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-18', 'Historical Analyses Listing', 'GET /admin/businesses/:id/analyses', 'HTTP 200', err.message, false, 0, err.message);
    }

    // --- TC-19: Historical Analyses Query Filtering ---
    try {
      const res = await fetch(
        `${BACKEND_URL}/admin/businesses/${firstBusinessId}/analyses?status=COMPLETED&analysisType=BUSINESS_SUMMARY`,
        { headers: analystHeaders },
      );
      const data = await res.json();
      const pass = res.status === 200 && data.success === true;

      record(
        'TC-19',
        'Historical Analyses Query Parameter Filtering',
        `GET /api/v1/admin/businesses/${firstBusinessId}/analyses?status=COMPLETED&analysisType=BUSINESS_SUMMARY`,
        'HTTP 200 with filtered analyses response',
        `Status: ${res.status}, success: ${data.success}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-19', 'Historical Analyses Filtering', 'GET /admin/businesses/:id/analyses?filter', 'HTTP 200', err.message, false, 0, err.message);
    }

    // --- TC-20: Non-Existent Analysis Inspection (404 Error State) ---
    try {
      const fakeAnalysisId = '00000000-0000-0000-0000-000000000000';
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}/analyses/${fakeAnalysisId}`, {
        headers: analystHeaders,
      });
      const data = await res.json();
      const pass = res.status === 404 && data.errorCode === 'ANALYSIS_NOT_FOUND';

      record(
        'TC-20',
        'Non-Existent Analysis Inspection Error Handling',
        `GET /api/v1/admin/businesses/${firstBusinessId}/analyses/${fakeAnalysisId}`,
        'HTTP 404 Not Found, errorCode: ANALYSIS_NOT_FOUND',
        `Status: ${res.status}, errorCode: ${data.errorCode}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-20', 'Non-Existent Analysis 404', 'GET /admin/businesses/:id/analyses/:analysisId', 'HTTP 404', err.message, false, 0, err.message);
    }

    // --- TC-21: Business Questions & Answers Audit History ---
    try {
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}/questions?page=1&limit=10`, {
        headers: analystHeaders,
      });
      const data = await res.json();
      const pass =
        res.status === 200 &&
        data.success === true &&
        (Array.isArray(data.data) || Array.isArray(data.data?.data));

      record(
        'TC-21',
        'Business Questions & Answers History Listing',
        `GET /api/v1/admin/businesses/${firstBusinessId}/questions?page=1&limit=10`,
        'HTTP 200, array of questions with status, answer, createdAt',
        `Status: ${res.status}, items: ${Array.isArray(data.data) ? data.data.length : data.data?.data?.length}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-21', 'Questions History Listing', 'GET /admin/businesses/:id/questions', 'HTTP 200', err.message, false, 0, err.message);
    }

    // --- TC-22: Business Questions Filtering by Status ---
    try {
      const res = await fetch(`${BACKEND_URL}/admin/businesses/${firstBusinessId}/questions?status=COMPLETED`, {
        headers: analystHeaders,
      });
      const data = await res.json();
      const pass = res.status === 200 && data.success === true;

      record(
        'TC-22',
        'Business Questions Status Parameter Filtering',
        `GET /api/v1/admin/businesses/${firstBusinessId}/questions?status=COMPLETED`,
        'HTTP 200 with status-filtered questions',
        `Status: ${res.status}, success: ${data.success}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-22', 'Questions Status Filtering', 'GET /admin/businesses/:id/questions?status=', 'HTTP 200', err.message, false, 0, err.message);
    }
  }

  // --- TC-23: Non-Existent Business Analyst Summary Error Handling (404) ---
  try {
    const fakeBizId = '00000000-0000-0000-0000-000000000000';
    const res = await fetch(`${BACKEND_URL}/admin/businesses/${fakeBizId}/analyst-summary`, {
      headers: analystHeaders,
    });
    const data = await res.json();
    const pass = res.status === 404 && data.errorCode === 'BUSINESS_NOT_FOUND';

    record(
      'TC-23',
      'Non-Existent Business Analyst Summary Error Handling',
      `GET /api/v1/admin/businesses/${fakeBizId}/analyst-summary`,
      'HTTP 404 Not Found, errorCode: BUSINESS_NOT_FOUND',
      `Status: ${res.status}, errorCode: ${data.errorCode}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-23', 'Non-Existent Business Summary 404', 'GET /admin/businesses/:id/analyst-summary', 'HTTP 404', err.message, false, 0, err.message);
  }

  // --- TC-24: Non-Existent Business Analyses Listing Error Handling (404) ---
  try {
    const fakeBizId = '00000000-0000-0000-0000-000000000000';
    const res = await fetch(`${BACKEND_URL}/admin/businesses/${fakeBizId}/analyses`, {
      headers: analystHeaders,
    });
    const data = await res.json();
    const pass = res.status === 404 && data.errorCode === 'BUSINESS_NOT_FOUND';

    record(
      'TC-24',
      'Non-Existent Business Historical Analyses Error Handling',
      `GET /api/v1/admin/businesses/${fakeBizId}/analyses`,
      'HTTP 404 Not Found, errorCode: BUSINESS_NOT_FOUND',
      `Status: ${res.status}, errorCode: ${data.errorCode}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-24', 'Non-Existent Business Analyses 404', 'GET /admin/businesses/:id/analyses', 'HTTP 404', err.message, false, 0, err.message);
  }

  // --- TC-25: WhatsApp Connections List Retrieval & Token Sanitization ---
  try {
    const res = await fetch(`${BACKEND_URL}/admin/whatsapp/connections`, {
      headers: {
        Authorization: `Bearer ${activeAuthToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.data.every(
        (conn) =>
          conn.encryptedAccessToken === undefined &&
          conn.accessToken === undefined &&
          conn.id &&
          conn.businessId &&
          conn.wabaId &&
          conn.phoneNumberId &&
          conn.displayPhoneNumber &&
          conn.status &&
          conn.business &&
          typeof conn.business.name === 'string',
      );

    record(
      'TC-25',
      'WhatsApp Connections List Retrieval & Token Stripping',
      'GET /api/v1/admin/whatsapp/connections',
      'HTTP 200, array of connections with business summary, encryptedAccessToken omitted',
      `Status: ${res.status}, count: ${data.data?.length}, tokensStripped: ${data.data?.every((c) => c.encryptedAccessToken === undefined)}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-25', 'WhatsApp Connections Retrieval', 'GET /admin/whatsapp/connections', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-26: WhatsApp Webhook Events Listing & Limit Parameter ---
  try {
    const res = await fetch(`${BACKEND_URL}/admin/whatsapp/webhook-events?limit=25`, {
      headers: {
        Authorization: `Bearer ${activeAuthToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.data.length <= 25;

    record(
      'TC-26',
      'WhatsApp Webhook Events Listing & Limit Parameter',
      'GET /api/v1/admin/whatsapp/webhook-events?limit=25',
      'HTTP 200, array of webhook events with length <= 25',
      `Status: ${res.status}, count: ${data.data?.length}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-26', 'Webhook Events Listing', 'GET /admin/whatsapp/webhook-events?limit=25', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-27: WhatsApp Webhook Events Status Filtering (status=QUEUED) ---
  try {
    const res = await fetch(`${BACKEND_URL}/admin/whatsapp/webhook-events?status=QUEUED&limit=10`, {
      headers: {
        Authorization: `Bearer ${activeAuthToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.data.every((evt) => evt.status === 'QUEUED');

    record(
      'TC-27',
      'WhatsApp Webhook Events Status Filtering (status=QUEUED)',
      'GET /api/v1/admin/whatsapp/webhook-events?status=QUEUED',
      'HTTP 200, array of events all having status QUEUED',
      `Status: ${res.status}, count: ${data.data?.length}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-27', 'Webhook Events Status Filter (QUEUED)', 'GET /admin/whatsapp/webhook-events?status=QUEUED', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-28: WhatsApp Webhook Events Status Filtering (status=FAILED) ---
  try {
    const res = await fetch(`${BACKEND_URL}/admin/whatsapp/webhook-events?status=FAILED&limit=10`, {
      headers: {
        Authorization: `Bearer ${activeAuthToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    const pass =
      res.status === 200 &&
      data.success === true &&
      Array.isArray(data.data) &&
      data.data.every((evt) => evt.status === 'FAILED');

    record(
      'TC-28',
      'WhatsApp Webhook Events Status Filtering (status=FAILED)',
      'GET /api/v1/admin/whatsapp/webhook-events?status=FAILED',
      'HTTP 200, array of events all having status FAILED',
      `Status: ${res.status}, count: ${data.data?.length}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-28', 'Webhook Events Status Filter (FAILED)', 'GET /admin/whatsapp/webhook-events?status=FAILED', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-29: Webhook Event Retry with Non-Existent ID (404 Error State) ---
  try {
    const fakeEventId = '00000000-0000-0000-0000-000000000000';
    const res = await fetch(`${BACKEND_URL}/admin/whatsapp/webhook-events/${fakeEventId}/retry`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${activeAuthToken}`,
        'Content-Type': 'application/json',
      },
    });
    const pass = res.status === 404;

    record(
      'TC-29',
      'Webhook Event Retry with Non-Existent ID (404)',
      `POST /api/v1/admin/whatsapp/webhook-events/${fakeEventId}/retry`,
      'HTTP 404 Not Found for non-existent event retry',
      `Status: ${res.status}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-29', 'Webhook Event Retry 404', 'POST /admin/whatsapp/webhook-events/:id/retry', 'HTTP 404', err.message, false, 0, err.message);
  }

  // --- TC-30: Non-SuperAdmin Role Rejection on WhatsApp Admin Endpoints ---
  if (normalUserToken) {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/whatsapp/connections`, {
        headers: {
          Authorization: `Bearer ${normalUserToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const pass = res.status === 403 && data.errorCode === 'FORBIDDEN';

      record(
        'TC-30',
        'Non-SuperAdmin Role Rejection on WhatsApp Admin Endpoints',
        'GET /api/v1/admin/whatsapp/connections using USER role token',
        'HTTP 403 Forbidden, errorCode: FORBIDDEN',
        `Status: ${res.status}, errorCode: ${data.errorCode}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-30', 'Non-SuperAdmin Rejection on WhatsApp', 'GET /admin/whatsapp/connections', 'HTTP 403', err.message, false, 0, err.message);
    }
  }

  // --- TC-31: Session Logout (POST /auth/logout) ---
  try {
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${activeAuthToken}` },
    });
    const data = await res.json();
    const pass = res.status === 200 && data.success === true;
    record(
      'TC-31',
      'Session Logout & Server-Side Revocation',
      'POST /api/v1/auth/logout with active bearer token',
      'HTTP 200, message: "Logged out successfully"',
      `Status: ${res.status}, message: ${data.data?.message}`,
      pass,
      res.status,
    );
  } catch (err) {
    record('TC-31', 'Session Logout', 'POST /auth/logout', 'HTTP 200', err.message, false, 0, err.message);
  }

  // --- TC-32: Refresh Token Re-use Detection / Revoked Session Check ---
  if (rotatedRefreshToken) {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: rotatedRefreshToken,
        }),
      });
      const data = await res.json();
      // Since session was logged out, refresh should be rejected as revoked
      const pass = res.status === 401 && (data.errorCode === 'SESSION_EXPIRED' || data.errorCode === 'TOKEN_REUSE_DETECTED');
      record(
        'TC-32',
        'Revoked Session Refresh Rejection',
        'POST /api/v1/auth/refresh with token from revoked session',
        'HTTP 401 Unauthorized, session revoked',
        `Status: ${res.status}, errorCode: ${data.errorCode}`,
        pass,
        res.status,
      );
    } catch (err) {
      record('TC-32', 'Revoked Session Refresh', 'POST /auth/refresh', 'HTTP 401', err.message, false, 0, err.message);
    }
  }

  return results;
}

runTests().then((res) => {
  console.log('\n--- Test Summary ---');
  const passed = res.filter((r) => r.pass).length;
  console.log(`Total Tests: ${res.length} | Passed: ${passed} | Failed: ${res.length - passed}`);
});
