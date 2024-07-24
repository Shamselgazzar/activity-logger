import { EventsResponse,  } from "../models/EventsResponse";

export const handleExport = (filteredData: EventsResponse) => {
  if (filteredData.events.length === 0) {
    console.warn("Nothing to export");
    return;
  }
  const json2csv = (json : any) => {
    const fields = [
      "id", "object", "location", "occurredAt",
      "actor.id", "actor.name", "actor.email", "actor.group", 
      "action.id", "action.name", "action.object",
      "target.id", "target.name", "target.email", "target.group",
    ];
    const replacer = (key: any, value: any) => value === null ? '' : value;
    let csv = json.map((row : any) => fields.map(fieldName => {
      const value = fieldName.split('.').reduce((acc, key) => acc && acc[key], row);
      return JSON.stringify(value, replacer);
    }).join(','));
    csv.unshift(fields.join(','));
    csv = csv.join('\r\n');
    return csv;
  };

  const csv = json2csv(filteredData.events);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  // download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", getFileName());
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const getFileName = () => {
  const now = new Date();
  const year = now.getFullYear().toString().padStart(4, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `event-logs-${year}-${month}-${day}-T${hour}${minutes}.csv`;
}
