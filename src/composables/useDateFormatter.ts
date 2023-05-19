import { format } from "date-fns";

export function useDateFormatter() {
  
  function formatDateAndTime(date: string) {
    const dateObj = new Date(date);
    return format(dateObj, 'dd.MM.yyyy HH:mm');
  }

  return {
    formatDateAndTime
  };
}