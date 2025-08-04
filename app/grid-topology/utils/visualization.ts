export const getVoltageColor = (voltage?: number) => {
  if (!voltage || isNaN(voltage)) return "#666";
  if (voltage >= 500) return "#ff4444"; // Red for 500kV+
  if (voltage >= 345) return "#ff8800"; // Orange for 345kV
  if (voltage >= 230) return "#ffcc00"; // Yellow for 230kV
  if (voltage >= 138) return "#00cc00"; // Green for 138kV
  return "#666"; // Gray for others
};

export const getNodeColor = (node: any) => {
  if (!node) return "#666";
  return getVoltageColor(node.voltage);
};

export const getLinkColor = (link: any) => {
  if (!link) return "#666";
  return getVoltageColor(link.voltage);
};

export const getNodeLabel = (node: any) => {
  if (!node) return "";
  const name = node.name || "Unknown";
  const id = node.id || "Unknown";
  return `${name} (${id})`;
};

export const getLinkLabel = (link: any) => {
  if (!link) return "";
  const source = link.source || "Unknown";
  const target = link.target || "Unknown";
  return `${source} → ${target}`;
};

export const exportGraphData = (parsedTopology: any) => {
  if (!parsedTopology) return;

  const dataStr = JSON.stringify(parsedTopology, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "grid-topology-data.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
