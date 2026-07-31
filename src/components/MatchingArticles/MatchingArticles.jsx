import { useEffect, useRef, useState } from "react";
import "./MatchingArticles.css";


const SOURCE_PALETTE = [
  { bg: "#E5F1FB", text: "#0B4F8A", accent: "#2E86D8" }, // blue
  { bg: "#FDECE4", text: "#8A2A0F", accent: "#D8582E" }, // orange
  { bg: "#E1F5EE", text: "#0F6E56", accent: "#1D9E75" }, // teal
  { bg: "#F3EAFB", text: "#5B2A8A", accent: "#8A4FD8" }, // purple
  { bg: "#FBEAF0", text: "#99244B", accent: "#D4537E" }, // pink
  { bg: "#FAEEDA", text: "#7A4E06", accent: "#BA7517" }, // amber
];

function colorForSource(source = "") {
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % SOURCE_PALETTE.length;
  return SOURCE_PALETTE[idx];
}

// How many cards are visible at once, based on viewport width.
function getPerView() {
  if (typeof window === "undefined") return 3;
  const w = window.innerWidth;
  if (w <= 600) return 1;
  if (w <= 900) return 2;
  return 3;
}

const MatchingArticles = ({ result }) => {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(getPerView());
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef(null);
  const firstCardRef = useRef(null);

  const articles = result?.matchingArticles;

  useEffect(() => {
    function handleResize() {
      setPerView(getPerView());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (firstCardRef.current) {
      setCardWidth(firstCardRef.current.getBoundingClientRect().width);
    }
  }, [perView, articles]);

  if (!result || !articles) return null;

  const maxIndex = Math.max(0, articles.length - perView);
  const clampedIndex = Math.min(index, maxIndex);
  const gap = 22;
  const offset = clampedIndex * (cardWidth + gap);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const showArrows = articles.length > perView;

  return (
    <section className="matching-section">
      <div className="matching-card">
        <div className="card-header">
          <h2>Matching Articles</h2>
        </div>

        {articles.length === 0 ? (
          <p className="no-articles">No matching articles found.</p>
        ) : (
          <div className="carousel">
            {showArrows && (
              <button
                className="nav-btn prev"
                onClick={goPrev}
                disabled={clampedIndex <= 0}
                aria-label="Previous articles"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            <div className="track-viewport">
              <div
                className="articles-container"
                ref={trackRef}
                style={{ transform: `translateX(-${offset}px)` }}
              >
                {articles.map((article, idx) => {
                  const color = colorForSource(article.source);
                  return (
                    <div
                      className="article-card"
                      key={idx}
                      ref={idx === 0 ? firstCardRef : null}
                      style={{ borderLeftColor: color.accent }}
                    >
                      <div className="article-top">
                        <span
                          className="article-source"
                          style={{ background: color.bg, color: color.text }}
                        >
                          {article.source}
                        </span>

                        <span className="article-time">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="article-title">{article.title}</h3>

                      <p className="article-url">
                        {new URL(article.url).hostname.replace("www.", "")}
                      </p>

                      <button
                        className="read-btn"
                        onClick={() => window.open(article.url, "_blank")}
                      >
                        Read Article →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {showArrows && (
              <button
                className="nav-btn next"
                onClick={goNext}
                disabled={clampedIndex >= maxIndex}
                aria-label="Next articles"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MatchingArticles;