import {
  ParsedPowerSystemData,
  ParsedPowerSystemDataSchema,
} from "../../../types/power-system";

// ============================================================================
// FALLBACK PARSER (for when OpenAI is not available)
// ============================================================================

export function parseRaw(fileContent: string): ParsedPowerSystemData {
  const basePowerMatch = fileContent.match(/([0-9.]+).*MVA base/);
  const base_power = basePowerMatch ? parseFloat(basePowerMatch[1]) : undefined;

  const buses: any[] = [];
  const loads: any[] = [];
  const branches: any[] = [];

  let section = "";
  for (const line of fileContent.split("\n")) {
    section = determineSection(line, section);

    if (section === "bus" && /^[0-9]/.test(line)) {
      buses.push(parseBusLine(line));
    }
    if (section === "load" && /^[0-9]/.test(line)) {
      loads.push(parseLoadLine(line));
    }
    if (section === "branch" && /^[0-9]/.test(line)) {
      branches.push(parseBranchLine(line));
    }
  }

  const parsedData = {
    format: "PSS/E RAW",
    base_power,
    buses,
    loads,
    branches,
  };

  return ParsedPowerSystemDataSchema.parse(parsedData);
}

function determineSection(line: string, currentSection: string): string {
  if (line.includes("BEGIN BUS")) return "bus";
  if (line.includes("END BUS")) return "";
  if (line.includes("BEGIN LOAD")) return "load";
  if (line.includes("END LOAD")) return "";
  if (line.includes("BEGIN BRANCH")) return "branch";
  if (line.includes("END BRANCH")) return "";
  return currentSection;
}

function parseBusLine(line: string) {
  const [id, name, voltage, , , , , vm, va] = line.split(",");
  return {
    id: parseInt(id?.trim() || "0"),
    name: name?.replace(/'/g, "").trim() || "",
    voltage: parseFloat(voltage) || 0,
    vm: parseFloat(vm) || 0,
    va: parseFloat(va) || 0,
  };
}

function parseLoadLine(line: string) {
  const [bus_id, , mw, mvar] = line.split(",");
  return {
    bus_id: parseInt(bus_id?.trim() || "0"),
    mw: parseFloat(mw) || 0,
    mvar: parseFloat(mvar) || 0,
  };
}

function parseBranchLine(line: string) {
  const [from, to, , r, x] = line.split(",");
  return {
    from: parseInt(from?.trim() || "0"),
    to: parseInt(to?.trim() || "0"),
    r: parseFloat(r) || 0,
    x: parseFloat(x) || 0,
  };
}
