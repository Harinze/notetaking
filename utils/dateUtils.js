export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isYesterday =
      now.getDate() - date.getDate() === 1 &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear();
  
    const isToday =
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear();
  
    const options = { hour: "2-digit", minute: "2-digit" };
  
    if (isToday) return `Today at ${date.toLocaleTimeString("en-US", options)}`;
    if (isYesterday) return `Yesterday at ${date.toLocaleTimeString("en-US", options)}`;
  
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  