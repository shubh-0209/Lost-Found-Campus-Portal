const normalize = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean);

const getScore = (a, b) => {
  let score = 0;

  const wordsA = normalize(a.itemName + " " + a.description);
  const wordsB = normalize(b.itemName + " " + b.description);

  // 🔹 Word matching
  wordsA.forEach((word) => {
    if (wordsB.includes(word)) {
      score += 5;
    }
  });

  // 🔹 Category match
  if (a.category && b.category && a.category === b.category) {
    score += 10;
  }

  // 🔹 Location match
  if (
    a.location &&
    b.location &&
    a.location !== "Unknown" &&
    a.location === b.location
  ) {
    score += 8;
  }

  return score;
};

const findMatches = (currentItem, allItems) => {
  const currentType = (currentItem.type || "").toLowerCase();

  const matches = allItems
    .filter((item) => {
      const itemType = (item.type || "").toLowerCase();

      // ❌ remove same item
      if (item._id.toString() === currentItem._id.toString()) {
        return false;
      }

      // ❌ only LOST ↔ FOUND
      if (currentType === "lost" && itemType !== "found") return false;
      if (currentType === "found" && itemType !== "lost") return false;

      return true;
    })
    .map((item) => {
      const score = getScore(currentItem, item);

      return { ...item._doc, score };
    })
    .filter((item) => {
      // 🔥 HARD FILTER (VERY IMPORTANT)

      // ✅ At least category OR strong keyword match required
      const sameCategory =
        item.category &&
        currentItem.category &&
        item.category === currentItem.category;

      const nameMatch =
        item.itemName &&
        currentItem.itemName &&
        item.itemName.toLowerCase().includes(currentItem.itemName.toLowerCase());

      // ❌ Reject totally unrelated items (like Phone vs Keys)
      if (!sameCategory && !nameMatch) return false;

      // ✅ Also require minimum score
      return item.score >= 10;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  console.log("FINAL MATCHES:", matches);

  return matches;
};

module.exports = { findMatches };