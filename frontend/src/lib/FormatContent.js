export const formatContent = (content) => {
  if (!content) return "";
  return content
    .replace(/<p>/g, "") // Remove opening <p>
    .replace(/<\/p>/g, "\n") // Replace closing </p> with newline
    .replace(/<[^>]*>?/gm, ""); // Remove all other tags
};
