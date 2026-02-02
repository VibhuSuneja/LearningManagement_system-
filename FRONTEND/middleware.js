// List of known social media and search engine crawler user agents
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'LinkedInBot', 
  'Twitterbot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
];

export const config = {
  matcher: '/viewcourse/:path*',
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  
  // Check if the request is from a social media crawler
  const isCrawler = CRAWLER_USER_AGENTS.some(crawler => 
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );

  if (isCrawler) {
    // Extract course ID from the URL
    const courseId = url.pathname.split('/viewcourse/')[1];
    
    if (courseId) {
      // Rewrite to the OG endpoint for crawlers
      const ogUrl = new URL(`/api/og/${courseId}`, url.origin);
      return Response.redirect(ogUrl, 302);
    }
  }

  // For regular users, continue to the SPA by returning nothing
  return;
}
