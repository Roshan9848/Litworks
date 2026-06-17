// Using built-in fetch in Node.js 18+

async function testLiveApi() {
  console.log('Sending test booking request to https://litworks.vercel.app/api/bookings...');
  try {
    const response = await fetch('https://litworks.vercel.app/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Live Connection',
        phone: '9866571801',
        email: 'litworks.media@gmail.com',
        state: 'Telangana',
        city: 'Hyderabad',
        service: 'Instant Reel',
        notes: 'Test query',
        dynamicFields: {
          occasion: 'Birthday',
          shootArea: 'Madhapur',
          numberOfReels: '1'
        }
      })
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

testLiveApi();
