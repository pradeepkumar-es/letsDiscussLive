import { useEffect, useState } from "react";

export function useRelativeTime(dateString: string | Date) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);

      let text = "";
      if (diffSec < 60) {
        text = "just now";
      } else if (diffSec < 3600) {
        const mins = Math.floor(diffSec / 60);
        text = `${mins} min${mins > 1 ? "s" : ""} ago`;
      } else if (diffSec < 86400) {
        const hrs = Math.floor(diffSec / 3600);
        text = `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
      } else {
        const days = Math.floor(diffSec / 86400);
        text = `${days} day${days > 1 ? "s" : ""} ago`;
      }
      setRelativeTime(text);
    }

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [dateString]);

  return relativeTime;
}
