async function getDiagnostics() {
  console.log('Fetching diagnostics from https://litworks.vercel.app/api/bookings...');
  try {
    const response = await fetch('https://litworks.vercel.app/api/bookings');
    const data = await response.json();
    console.log('Status Code:', response.status);
    console.log('Diagnostics:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch Error:', error.message);
  }
}

getDiagnostics();
