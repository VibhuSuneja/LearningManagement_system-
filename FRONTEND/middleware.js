// List of known social media and search engine crawler user agents
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'WhatsApp',
  'LinkedInBot', 
  'Twitterbot',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'googlebot',
  'bingbot',
];

export const config = {
  matcher: '/viewcourse/:courseId*',
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  
  // Check if the request is from a social media crawler
  const isCrawler = CRAWLER_USER_AGENTS.some(crawler => 
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );

  // For regular users, continue to the SPA (Vercel will serve index.html)
  if (!isCrawler) return;

  // For Crawlers: Extract course ID
  const pathParts = url.pathname.split('/');
  const courseId = pathParts[pathParts.length - 1];
  
  if (!courseId || courseId === 'viewcourse') return;

  const backendUrl = 'https://learningmanagement-system.onrender.com';
  const frontendUrl = 'https://learning-management-system-kappa-black.vercel.app';

  try {
    // Fetch course details from your NEW PUBLIC API
    const response = await fetch(`${backendUrl}/api/course/getpubliccourse/${courseId}`);
    
    if (!response.ok) throw new Error('Course not found');

    const course = await response.json();
    
    // Generate the HTML with meta tags directly
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${course.title} | Virtual Courses LMS</title>
  <meta name="description" content="${course.description || 'Master new skills with our expert-led courses.'}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url.href}">
  <meta property="og:title" content="${course.title}">
  <meta property="og:description" content="${course.description || 'Join our AI-powered learning platform today!'}">
  <meta property="og:image" content="${course.thumbnail}">
  <meta property="og:site_name" content="Virtual Courses LMS">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${course.title}">
  <meta name="twitter:description" content="${course.description}">
  <meta name="twitter:image" content="${course.thumbnail}">
</head>
<body>
  <h1>${course.title}</h1>
  <p>${course.description}</p>
  <img src="${course.thumbnail}" />
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
    
  } catch (error) {
    // Fallback if API fails
    return;
  }
}
