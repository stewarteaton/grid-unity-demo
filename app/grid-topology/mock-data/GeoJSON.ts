export const mockGeoJSONData = {
  type: "FeatureCollection",
  features: [
    // Substations (Point features)
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-74.006, 40.7128], // New York City
      },
      properties: {
        id: "NYC_MAIN",
        name: "New York City Main",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-75.1652, 39.9526], // Philadelphia
      },
      properties: {
        id: "PHL_CENTRAL",
        name: "Philadelphia Central",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-77.0369, 38.9072], // Washington DC
      },
      properties: {
        id: "DC_POWER",
        name: "Washington DC Power",
        voltage: 500,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-79.9959, 40.4406], // Pittsburgh
      },
      properties: {
        id: "PIT_STEEL",
        name: "Pittsburgh Steel",
        voltage: 230,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-81.6944, 41.4993], // Cleveland
      },
      properties: {
        id: "CLE_LAKE",
        name: "Cleveland Lake",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-83.0458, 42.3314], // Detroit
      },
      properties: {
        id: "DET_MOTOR",
        name: "Detroit Motor",
        voltage: 230,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-87.6298, 41.8781], // Chicago
      },
      properties: {
        id: "CHI_WINDY",
        name: "Chicago Windy",
        voltage: 500,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-90.1994, 38.627], // St. Louis
      },
      properties: {
        id: "STL_GATEWAY",
        name: "St. Louis Gateway",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-93.265, 44.9778], // Minneapolis
      },
      properties: {
        id: "MINN_TWIN",
        name: "Minneapolis Twin",
        voltage: 230,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-96.797, 32.7767], // Dallas
      },
      properties: {
        id: "DAL_BIG",
        name: "Dallas Big D",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-95.3698, 29.7604], // Houston
      },
      properties: {
        id: "HOU_SPACE",
        name: "Houston Space",
        voltage: 500,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-104.9903, 39.7392], // Denver
      },
      properties: {
        id: "DEN_ROCKY",
        name: "Denver Rocky",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-112.074, 33.4484], // Phoenix
      },
      properties: {
        id: "PHX_VALLEY",
        name: "Phoenix Valley",
        voltage: 230,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-118.2437, 34.0522], // Los Angeles
      },
      properties: {
        id: "LA_ANGEL",
        name: "Los Angeles Angel",
        voltage: 500,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-122.4194, 37.7749], // San Francisco
      },
      properties: {
        id: "SF_BAY",
        name: "San Francisco Bay",
        voltage: 345,
        type: "substation",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-122.3321, 47.6062], // Seattle
      },
      properties: {
        id: "SEA_EMERALD",
        name: "Seattle Emerald",
        voltage: 230,
        type: "substation",
      },
    },

    // Transmission Lines (LineString features)
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.006, 40.7128], // NYC
          [-75.1652, 39.9526], // Philadelphia
        ],
      },
      properties: {
        id: "NYC_PHL_345",
        from: "NYC_MAIN",
        to: "PHL_CENTRAL",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-75.1652, 39.9526], // Philadelphia
          [-77.0369, 38.9072], // Washington DC
        ],
      },
      properties: {
        id: "PHL_DC_345",
        from: "PHL_CENTRAL",
        to: "DC_POWER",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.006, 40.7128], // NYC
          [-79.9959, 40.4406], // Pittsburgh
        ],
      },
      properties: {
        id: "NYC_PIT_230",
        from: "NYC_MAIN",
        to: "PIT_STEEL",
        voltage: 230,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.9959, 40.4406], // Pittsburgh
          [-81.6944, 41.4993], // Cleveland
        ],
      },
      properties: {
        id: "PIT_CLE_345",
        from: "PIT_STEEL",
        to: "CLE_LAKE",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-81.6944, 41.4993], // Cleveland
          [-83.0458, 42.3314], // Detroit
        ],
      },
      properties: {
        id: "CLE_DET_230",
        from: "CLE_LAKE",
        to: "DET_MOTOR",
        voltage: 230,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-83.0458, 42.3314], // Detroit
          [-87.6298, 41.8781], // Chicago
        ],
      },
      properties: {
        id: "DET_CHI_500",
        from: "DET_MOTOR",
        to: "CHI_WINDY",
        voltage: 500,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-87.6298, 41.8781], // Chicago
          [-90.1994, 38.627], // St. Louis
        ],
      },
      properties: {
        id: "CHI_STL_345",
        from: "CHI_WINDY",
        to: "STL_GATEWAY",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-87.6298, 41.8781], // Chicago
          [-93.265, 44.9778], // Minneapolis
        ],
      },
      properties: {
        id: "CHI_MINN_230",
        from: "CHI_WINDY",
        to: "MINN_TWIN",
        voltage: 230,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-90.1994, 38.627], // St. Louis
          [-96.797, 32.7767], // Dallas
        ],
      },
      properties: {
        id: "STL_DAL_345",
        from: "STL_GATEWAY",
        to: "DAL_BIG",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-96.797, 32.7767], // Dallas
          [-95.3698, 29.7604], // Houston
        ],
      },
      properties: {
        id: "DAL_HOU_500",
        from: "DAL_BIG",
        to: "HOU_SPACE",
        voltage: 500,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-96.797, 32.7767], // Dallas
          [-104.9903, 39.7392], // Denver
        ],
      },
      properties: {
        id: "DAL_DEN_345",
        from: "DAL_BIG",
        to: "DEN_ROCKY",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-104.9903, 39.7392], // Denver
          [-112.074, 33.4484], // Phoenix
        ],
      },
      properties: {
        id: "DEN_PHX_230",
        from: "DEN_ROCKY",
        to: "PHX_VALLEY",
        voltage: 230,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-112.074, 33.4484], // Phoenix
          [-118.2437, 34.0522], // Los Angeles
        ],
      },
      properties: {
        id: "PHX_LA_500",
        from: "PHX_VALLEY",
        to: "LA_ANGEL",
        voltage: 500,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-118.2437, 34.0522], // Los Angeles
          [-122.4194, 37.7749], // San Francisco
        ],
      },
      properties: {
        id: "LA_SF_345",
        from: "LA_ANGEL",
        to: "SF_BAY",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.4194, 37.7749], // San Francisco
          [-122.3321, 47.6062], // Seattle
        ],
      },
      properties: {
        id: "SF_SEA_230",
        from: "SF_BAY",
        to: "SEA_EMERALD",
        voltage: 230,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-104.9903, 39.7392], // Denver
          [-122.4194, 37.7749], // San Francisco
        ],
      },
      properties: {
        id: "DEN_SF_500",
        from: "DEN_ROCKY",
        to: "SF_BAY",
        voltage: 500,
        lineType: "AC",
        type: "transmission_line",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-87.6298, 41.8781], // Chicago
          [-104.9903, 39.7392], // Denver
        ],
      },
      properties: {
        id: "CHI_DEN_345",
        from: "CHI_WINDY",
        to: "DEN_ROCKY",
        voltage: 345,
        lineType: "AC",
        type: "transmission_line",
      },
    },
  ],
};
