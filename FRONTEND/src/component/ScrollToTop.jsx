import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = (element, duration = 800) => {
      if (!element) return;
      const start = element.scrollTop;
      const change = 0 - start;
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        element.scrollTop = start + change * easeInOutQuad(progress);
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      requestAnimationFrame(animateScroll);
    };

    // Scroll the likely containers
    const scrollable = document.querySelector("#root, main, body, html");
    scrollToTop(scrollable);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
