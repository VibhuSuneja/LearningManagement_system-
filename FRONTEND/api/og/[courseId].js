// Vercel Serverless Function for Dynamic OG Meta Tags
// This endpoint returns a minimal HTML page with proper meta tags for social crawlers

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const courseId = url.pathname.split('/').pop();
  
  // Your production backend URL (Render)
  const backendUrl = 'https://learningmanagementsystem-f6h0.onrender.com';
  const frontendUrl = 'https://learning-management-system-kappa-black.vercel.app';
  
  try {
    // Fetch course details from your API
    const response = await fetch(`${backendUrl}/api/course/getcourse/${courseId}`);
    
    if (!response.ok) {
      return new Response(generateHTML({
        title: 'Virtual Courses - AI-Powered Learning',
        description: 'Explore thousands of courses on Virtual Courses LMS',
        image: `${frontendUrl}/logo.jpg`,
        url: `${frontendUrl}/viewcourse/${courseId}`
      }), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const course = await response.json();
    
    const html = generateHTML({
      title: `${course.title} | Virtual Courses LMS`,
      description: course.description || `Learn ${course.title} with expert instructors. ${course.price ? `₹${course.price}` : 'Free'}`,
      image: course.thumbnail || `${frontendUrl}/logo.jpg`,
      url: `${frontendUrl}/viewcourse/${courseId}`,
      price: course.price,
      category: course.category
    });

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
    
  } catch (error) {
    console.error('OG Fetch Error:', error);
    return new Response(generateHTML({
      title: 'Virtual Courses - AI-Powered Learning',
      description: 'Master new skills with AI-powered courses and real-time mentorship.',
      image: `${frontendUrl}/logo.jpg`,
      url: `${frontendUrl}/viewcourse/${courseId}`
    }), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

function generateHTML({ title, description, image, url, price, category }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:site_name" content="Virtual Courses LMS">
  ${price ? `<meta property="product:price:amount" content="${price}">` : ''}
  ${price ? `<meta property="product:price:currency" content="INR">` : ''}
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- Redirect real users to the SPA -->
  <script>
    // Only redirect if this is a real user (not a crawler)
    if (!/bot|crawl|slurp|spider|mediapartners/i.test(navigator.userAgent)) {
      window.location.replace("${url}");
    }
  </script>
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${image}" alt="${title}">
  <a href="${url}">View Course</a>
</body>
</html>`;
}
