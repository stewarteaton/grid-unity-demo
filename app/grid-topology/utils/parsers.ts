import {
  ParsedTopology,
  Substation,
  TransmissionLine,
  GraphNode,
  GraphLink,
} from "../types";

export const detectFormat = (data: string): string => {
  try {
    const jsonData = JSON.parse(data);
    if (jsonData.type === "FeatureCollection") {
      return "GeoJSON";
    }
    if (jsonData.substations && jsonData.lines) {
      return "Custom JSON";
    }
  } catch {
    // Not JSON, check other formats
  }

  if (data.includes("C PSLF") || data.includes("Bus# Type Area Zone")) {
    return "PSLF";
  }

  if (
    data.includes("New Circuit") ||
    data.includes("Generator.") ||
    data.includes("Load.")
  ) {
    return "OpenDSS";
  }

  return "Unknown";
};

export const parseTopologyData = (data: string): ParsedTopology => {
  try {
    // Try to parse as JSON first (GeoJSON or custom format)
    try {
      const jsonData = JSON.parse(data);

      // Handle GeoJSON format
      if (jsonData.type === "FeatureCollection") {
        return parseGeoJSONData(jsonData);
      }

      // Handle custom format
      if (jsonData.substations && jsonData.lines) {
        return parseCustomJSONData(jsonData);
      }
    } catch {
      // Not JSON, try other formats
    }

    // Handle PSLF format
    if (data.includes("C PSLF") || data.includes("Bus# Type Area Zone")) {
      return parsePSLFData(data);
    }

    // Handle OpenDSS format
    if (
      data.includes("New Circuit") ||
      data.includes("Generator.") ||
      data.includes("Load.")
    ) {
      return parseOpenDSSData(data);
    }

    throw new Error(
      "Unsupported data format. Supported formats: GeoJSON, PSLF, OpenDSS"
    );
  } catch (error) {
    console.error("Error parsing topology data:", error);
    throw new Error("Failed to parse topology data");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseGeoJSONData = (jsonData: any): ParsedTopology => {
  const substations: Substation[] = [];
  const lines: TransmissionLine[] = [];
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonData.features.forEach((feature: any, index: number) => {
    if (feature.geometry.type === "Point") {
      // Substation
      const substation: Substation = {
        id: feature.properties.id || `substation_${index}`,
        name: feature.properties.name || `Substation ${index}`,
        voltage: feature.properties.voltage,
        coordinates: feature.geometry.coordinates,
      };
      substations.push(substation);

      nodes.push({
        id: substation.id,
        name: substation.name,
        voltage: substation.voltage,
        x: substation.coordinates?.[0],
        y: substation.coordinates?.[1],
        type: "substation",
      });
    } else if (feature.geometry.type === "LineString") {
      // Transmission line
      const line: TransmissionLine = {
        id: feature.properties.id || `line_${index}`,
        from: feature.properties.from,
        to: feature.properties.to,
        voltage: feature.properties.voltage,
        lineType: feature.properties.lineType,
      };
      lines.push(line);

      links.push({
        id: line.id,
        source: line.from,
        target: line.to,
        voltage: line.voltage,
        lineType: line.lineType,
      });
    }
  });

  return {
    substations,
    lines,
    graphData: { nodes, links },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseCustomJSONData = (jsonData: any): ParsedTopology => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes = jsonData.substations.map((sub: any) => ({
    id: sub.id,
    name: sub.name,
    voltage: sub.voltage,
    x: sub.coordinates?.[0],
    y: sub.coordinates?.[1],
    type: "substation" as const,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links = jsonData.lines.map((line: any) => ({
    id: line.id,
    source: line.from,
    target: line.to,
    voltage: line.voltage,
    lineType: line.lineType,
  }));

  return {
    substations: jsonData.substations,
    lines: jsonData.lines,
    graphData: { nodes, links },
  };
};

const parsePSLFData = (data: string): ParsedTopology => {
  const lines = data.split("\n");
  const substations: Substation[] = [];
  const transmissionLines: TransmissionLine[] = [];
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Extract bus data - look for lines that match the bus data format
  const busLines = lines.filter(
    (line) =>
      line.trim().startsWith("C") &&
      line.includes("Bus#") === false &&
      line.includes("Type") === false &&
      line.includes("Area") === false &&
      line.includes("Zone") === false &&
      line.includes("Transmission Line Data") === false &&
      line.includes("Generator Data") === false &&
      line.includes("Load Data") === false &&
      line.includes("Transformer Data") === false &&
      line.includes("End of PSLF") === false &&
      line.trim().length > 10 &&
      // Look for lines that match bus data format: C Bus# Type Area Zone Name BaseKV Angle
      /^\s*C\s+\d+\s+\d+\s+\d+\s+\d+\s+\w+/.test(line)
  );

  busLines.forEach((line, index) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 7) {
      const busId = parts[1];
      const busName = parts[5];
      const voltage = parseFloat(parts[4]);

      // Only create nodes for valid bus data
      if (busId && busName && !isNaN(voltage) && voltage > 0) {
        // Create a simple grid layout for PSLF nodes
        const gridSize = Math.ceil(Math.sqrt(busLines.length));
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize / 2) * 100;
        const y = (row - gridSize / 2) * 100;

        const substation: Substation = {
          id: busId,
          name: busName,
          voltage: voltage,
          coordinates: [x, y],
        };
        substations.push(substation);

        nodes.push({
          id: busId,
          name: busName,
          voltage: voltage,
          x: x,
          y: y,
          type: "substation",
        });
      }
    }
  });

  // Find the transmission line data section
  let inTransmissionSection = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Check for section headers
    if (trimmedLine.includes("Transmission Line Data")) {
      inTransmissionSection = true;
      return;
    }

    if (trimmedLine.includes("Transformer Data")) {
      inTransmissionSection = false;
      return;
    }

    if (
      trimmedLine.includes("Area Data") ||
      trimmedLine.includes("Zone Data") ||
      trimmedLine.includes("End of PSLF")
    ) {
      inTransmissionSection = false;
      return;
    }

    // Process transmission lines (not transformers)
    if (
      inTransmissionSection &&
      trimmedLine.startsWith("C") &&
      !trimmedLine.includes("FromBus") &&
      !trimmedLine.includes("ToBus")
    ) {
      const parts = trimmedLine.split(/\s+/);
      if (parts.length >= 8) {
        const fromBus = parts[1];
        const toBus = parts[2];
        const lineId = `line_${fromBus}_${toBus}`;

        // Find the source node to get voltage
        const sourceNode = nodes.find((n) => n.id === fromBus);
        const targetNode = nodes.find((n) => n.id === toBus);

        if (sourceNode && targetNode) {
          const transmissionLine: TransmissionLine = {
            id: lineId,
            from: fromBus,
            to: toBus,
            voltage: sourceNode.voltage,
          };
          transmissionLines.push(transmissionLine);

          links.push({
            id: lineId,
            source: fromBus,
            target: toBus,
            voltage: transmissionLine.voltage,
          });
        }
      }
    }
  });

  console.log("PSLF Parsed Data:", {
    nodes: nodes.map((n) => ({ id: n.id, name: n.name, voltage: n.voltage })),
    links: links.map((l) => ({
      id: l.id,
      source: l.source,
      target: l.target,
      voltage: l.voltage,
    })),
    substations: substations.length,
    transmissionLines: transmissionLines.length,
  });

  return {
    substations,
    lines: transmissionLines,
    graphData: { nodes, links },
  };
};

const parseOpenDSSData = (data: string): ParsedTopology => {
  const lines = data.split("\n");
  const substations: Substation[] = [];
  const transmissionLines: TransmissionLine[] = [];
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Create a set to track all referenced buses
  const referencedBuses = new Set<string>();

  // Extract line data first to get all referenced buses
  const lineLines = lines.filter(
    (line) => line.trim().startsWith("Line.") && !line.includes("!")
  );

  lineLines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 4) {
      const bus1 = parts[1];
      const bus2 = parts[2];
      referencedBuses.add(bus1);
      referencedBuses.add(bus2);
    }
  });

  // Extract bus data
  const busLines = lines.filter(
    (line) => line.trim().startsWith("Bus.") && !line.includes("!")
  );

  busLines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 4) {
      const busName = parts[0].replace("Bus.", "");
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);

      // Estimate voltage based on bus name patterns
      let voltage = 345; // default
      if (
        busName.includes("500") ||
        busName.includes("DC_POWER") ||
        busName.includes("CHI_WINDY") ||
        busName.includes("HOU_SPACE") ||
        busName.includes("LA_ANGEL")
      ) {
        voltage = 500;
      } else if (
        busName.includes("230") ||
        busName.includes("PIT_STEEL") ||
        busName.includes("DET_MOTOR") ||
        busName.includes("MINN_TWIN") ||
        busName.includes("PHX_VALLEY") ||
        busName.includes("SEA_EMERALD")
      ) {
        voltage = 230;
      }

      const substation: Substation = {
        id: busName,
        name: busName,
        voltage: voltage,
        coordinates: [x, y],
      };
      substations.push(substation);

      nodes.push({
        id: busName,
        name: busName,
        voltage: voltage,
        x: x,
        y: y,
        type: "substation",
      });
    }
  });

  // Create nodes for any buses that are referenced in lines but not defined
  referencedBuses.forEach((busName) => {
    if (!nodes.find((n) => n.id === busName)) {
      // Create a default node for referenced but undefined buses
      const defaultNode = {
        id: busName,
        name: busName,
        voltage: 345, // default voltage
        x: 0, // default coordinates
        y: 0,
        type: "substation" as const,
      };
      nodes.push(defaultNode);

      const defaultSubstation: Substation = {
        id: busName,
        name: busName,
        voltage: 345,
        coordinates: [0, 0],
      };
      substations.push(defaultSubstation);
    }
  });

  // Now process the lines
  lineLines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 4) {
      const lineName = parts[0].replace("Line.", "");
      const bus1 = parts[1];
      const bus2 = parts[2];

      // Ensure both buses exist in nodes
      const sourceNode = nodes.find((n) => n.id === bus1);
      const targetNode = nodes.find((n) => n.id === bus2);

      if (sourceNode && targetNode) {
        const transmissionLine: TransmissionLine = {
          id: lineName,
          from: bus1,
          to: bus2,
          voltage: sourceNode.voltage,
        };
        transmissionLines.push(transmissionLine);

        links.push({
          id: lineName,
          source: bus1,
          target: bus2,
          voltage: transmissionLine.voltage,
        });
      } else {
        console.warn(`Missing nodes for line ${lineName}: ${bus1} -> ${bus2}`);
      }
    }
  });

  console.log("OpenDSS Parsed Data:", {
    nodes: nodes.map((n) => ({ id: n.id, name: n.name })),
    links: links.map((l) => ({
      id: l.id,
      source: l.source,
      target: l.target,
    })),
    substations: substations.length,
    transmissionLines: transmissionLines.length,
  });

  return {
    substations,
    lines: transmissionLines,
    graphData: { nodes, links },
  };
};
