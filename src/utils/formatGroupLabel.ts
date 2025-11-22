export function formatGroupLabel(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
  
    const diffDays = Math.floor((target.getTime() - today.getTime()) / 86400000);
  
    const day = target.getDate();
    const month = target
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "");
  
    let middleText = "";
    if (diffDays === 0) middleText = "Hoje";
    else if (diffDays === 1) middleText = "Amanhã";
    else if (diffDays === -1) middleText = "Ontem";
  
    const weekday = target
      .toLocaleString("pt-BR", { weekday: "long" })
      .replace("-feira", "")
      .replace(/^\w/, (c) => c.toUpperCase());
  
    return middleText
      ? `${day} ${month} · ${middleText} · ${weekday}`
      : `${day} ${month} · ${weekday}`;
  }
  