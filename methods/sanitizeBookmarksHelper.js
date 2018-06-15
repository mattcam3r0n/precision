sanitizeBookmarks = function(drill) {
  if (!drill.bookmarks) return;

  drill.bookmarks.forEach((b) => {
    delete b.$$hashKey;
  });
};
