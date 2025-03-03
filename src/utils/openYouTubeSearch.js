// File: src/utils/openYouTubeSearch.js
export function openYouTubeSearch(exerciseName) {
    const query = encodeURIComponent(exerciseName);
    const url = `https://www.youtube.com/results?search_query=${query}`;
    window.open(url, "_blank");
  }
  