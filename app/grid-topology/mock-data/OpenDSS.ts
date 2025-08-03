export const mockOpenDSSData = `! OpenDSS Transmission System Data
! Master File

! Circuit Definition
New Circuit.US_Transmission_System
Set BaseFreq=60

! Bus Coordinates (for visualization)
! BusName X Y
Bus.NYC_MAIN    -74.006   40.7128
Bus.PHL_CENTRAL -75.1652  39.9526
Bus.DC_POWER    -77.0369  38.9072
Bus.PIT_STEEL   -79.9959  40.4406
Bus.CLE_LAKE    -81.6944  41.4993
Bus.DET_MOTOR   -83.0458  42.3314
Bus.CHI_WINDY   -87.6298  41.8781
Bus.STL_GATEWAY -90.1994  38.627
Bus.MINN_TWIN   -93.265   44.9778
Bus.DAL_BIG     -96.797   32.7767
Bus.HOU_SPACE   -95.3698  29.7604
Bus.DEN_ROCKY   -104.9903 39.7392
Bus.PHX_VALLEY  -112.074  33.4484
Bus.LA_ANGEL    -118.2437 34.0522
Bus.SF_BAY      -122.4194 37.7749
Bus.SEA_EMERALD -122.3321 47.6062

! Generator Definitions
! Generator.Name BusName kV MVA
Generator.NYC_GEN NYC_MAIN 345 2000
Generator.DC_GEN DC_POWER 500 3000
Generator.CHI_GEN CHI_WINDY 500 2500
Generator.HOU_GEN HOU_SPACE 500 3000
Generator.LA_GEN LA_ANGEL 500 2500

! Load Definitions
! Load.Name BusName kV kW kvar
Load.PHL_LOAD PHL_CENTRAL 345 1500 300
Load.PIT_LOAD PIT_STEEL 230 800 160
Load.CLE_LOAD CLE_LAKE 345 1200 240
Load.DET_LOAD DET_MOTOR 230 900 180
Load.STL_LOAD STL_GATEWAY 345 1100 220
Load.MINN_LOAD MINN_TWIN 230 700 140
Load.DAL_LOAD DAL_BIG 345 1300 260
Load.DEN_LOAD DEN_ROCKY 345 1000 200
Load.PHX_LOAD PHX_VALLEY 230 600 120
Load.SF_LOAD SF_BAY 345 1400 280
Load.SEA_LOAD SEA_EMERALD 230 500 100

! Line Definitions
! Line.Name Bus1 Bus2 Length Units R1 X1 C1
Line.NYC_PHL NYC_MAIN PHL_CENTRAL 1.0 mi 0.02 0.10 0.0
Line.PHL_DC PHL_CENTRAL DC_POWER 1.0 mi 0.03 0.15 0.0
Line.NYC_PIT NYC_MAIN PIT_STEEL 1.0 mi 0.04 0.20 0.0
Line.PIT_CLE PIT_STEEL CLE_LAKE 1.0 mi 0.02 0.12 0.0
Line.CLE_DET CLE_LAKE DET_MOTOR 1.0 mi 0.03 0.18 0.0
Line.DET_CHI DET_MOTOR CHI_WINDY 1.0 mi 0.05 0.25 0.0
Line.CHI_STL CHI_WINDY STL_GATEWAY 1.0 mi 0.03 0.15 0.0
Line.CHI_MINN CHI_WINDY MINN_TWIN 1.0 mi 0.04 0.20 0.0
Line.STL_DAL STL_GATEWAY DAL_BIG 1.0 mi 0.06 0.30 0.0
Line.DAL_HOU DAL_BIG HOU_SPACE 1.0 mi 0.04 0.20 0.0
Line.DAL_DEN DAL_BIG DEN_ROCKY 1.0 mi 0.08 0.40 0.0
Line.DEN_PHX DEN_ROCKY PHX_VALLEY 1.0 mi 0.05 0.25 0.0
Line.PHX_LA PHX_VALLEY LA_ANGEL 1.0 mi 0.06 0.30 0.0
Line.LA_SF LA_ANGEL SF_BAY 1.0 mi 0.04 0.20 0.0
Line.SF_SEA SF_BAY SEA_EMERALD 1.0 mi 0.05 0.25 0.0
Line.DEN_SF DEN_ROCKY SF_BAY 1.0 mi 0.10 0.50 0.0
Line.CHI_DEN CHI_WINDY DEN_ROCKY 1.0 mi 0.07 0.35 0.0

! Transformer Definitions
! Transformer.Name Bus1 Bus2 kV1 kV2 kVA
Transformer.NYC_DC NYC_MAIN DC_POWER 345 500 2000
Transformer.DC_CHI DC_POWER CHI_WINDY 500 500 2500
Transformer.CHI_HOU CHI_WINDY HOU_SPACE 500 500 3000
Transformer.HOU_LA HOU_SPACE LA_ANGEL 500 500 2500

! Line Ratings
! Line.Name NormalRating EmergencyRating
Line.NYC_PHL 1000 1200
Line.PHL_DC 1000 1200
Line.NYC_PIT 800 960
Line.PIT_CLE 1000 1200
Line.CLE_DET 800 960
Line.DET_CHI 1500 1800
Line.CHI_STL 1000 1200
Line.CHI_MINN 800 960
Line.STL_DAL 1000 1200
Line.DAL_HOU 1500 1800
Line.DAL_DEN 1000 1200
Line.DEN_PHX 800 960
Line.PHX_LA 1500 1800
Line.LA_SF 1000 1200
Line.SF_SEA 800 960
Line.DEN_SF 1500 1800
Line.CHI_DEN 1000 1200

! Generator Settings
! Generator.Name kV MVA
Generator.NYC_GEN 345 2000
Generator.DC_GEN 500 3000
Generator.CHI_GEN 500 2500
Generator.HOU_GEN 500 3000
Generator.LA_GEN 500 2500

! Load Settings
! Load.Name kV kW kvar
Load.PHL_LOAD 345 1500 300
Load.PIT_LOAD 230 800 160
Load.CLE_LOAD 345 1200 240
Load.DET_LOAD 230 900 180
Load.STL_LOAD 345 1100 220
Load.MINN_LOAD 230 700 140
Load.DAL_LOAD 345 1300 260
Load.DEN_LOAD 345 1000 200
Load.PHX_LOAD 230 600 120
Load.SF_LOAD 345 1400 280
Load.SEA_LOAD 230 500 100

! End of OpenDSS Data`;

export const mockOpenDSSDataFormatted = {
  circuit: {
    name: "US_Transmission_System",
    baseFreq: 60,
  },
  buses: [
    { name: "NYC_MAIN", x: -74.006, y: 40.7128, voltage: 345 },
    { name: "PHL_CENTRAL", x: -75.1652, y: 39.9526, voltage: 345 },
    { name: "DC_POWER", x: -77.0369, y: 38.9072, voltage: 500 },
    { name: "PIT_STEEL", x: -79.9959, y: 40.4406, voltage: 230 },
    { name: "CLE_LAKE", x: -81.6944, y: 41.4993, voltage: 345 },
    { name: "DET_MOTOR", x: -83.0458, y: 42.3314, voltage: 230 },
    { name: "CHI_WINDY", x: -87.6298, y: 41.8781, voltage: 500 },
    { name: "STL_GATEWAY", x: -90.1994, y: 38.627, voltage: 345 },
    { name: "MINN_TWIN", x: -93.265, y: 44.9778, voltage: 230 },
    { name: "DAL_BIG", x: -96.797, y: 32.7767, voltage: 345 },
    { name: "HOU_SPACE", x: -95.3698, y: 29.7604, voltage: 500 },
    { name: "DEN_ROCKY", x: -104.9903, y: 39.7392, voltage: 345 },
    { name: "PHX_VALLEY", x: -112.074, y: 33.4484, voltage: 230 },
    { name: "LA_ANGEL", x: -118.2437, y: 34.0522, voltage: 500 },
    { name: "SF_BAY", x: -122.4194, y: 37.7749, voltage: 345 },
    { name: "SEA_EMERALD", x: -122.3321, y: 47.6062, voltage: 230 },
  ],
  generators: [
    { name: "NYC_GEN", bus: "NYC_MAIN", voltage: 345, mva: 2000 },
    { name: "DC_GEN", bus: "DC_POWER", voltage: 500, mva: 3000 },
    { name: "CHI_GEN", bus: "CHI_WINDY", voltage: 500, mva: 2500 },
    { name: "HOU_GEN", bus: "HOU_SPACE", voltage: 500, mva: 3000 },
    { name: "LA_GEN", bus: "LA_ANGEL", voltage: 500, mva: 2500 },
  ],
  loads: [
    { name: "PHL_LOAD", bus: "PHL_CENTRAL", voltage: 345, kw: 1500, kvar: 300 },
    { name: "PIT_LOAD", bus: "PIT_STEEL", voltage: 230, kw: 800, kvar: 160 },
    { name: "CLE_LOAD", bus: "CLE_LAKE", voltage: 345, kw: 1200, kvar: 240 },
    { name: "DET_LOAD", bus: "DET_MOTOR", voltage: 230, kw: 900, kvar: 180 },
    { name: "STL_LOAD", bus: "STL_GATEWAY", voltage: 345, kw: 1100, kvar: 220 },
    { name: "MINN_LOAD", bus: "MINN_TWIN", voltage: 230, kw: 700, kvar: 140 },
    { name: "DAL_LOAD", bus: "DAL_BIG", voltage: 345, kw: 1300, kvar: 260 },
    { name: "DEN_LOAD", bus: "DEN_ROCKY", voltage: 345, kw: 1000, kvar: 200 },
    { name: "PHX_LOAD", bus: "PHX_VALLEY", voltage: 230, kw: 600, kvar: 120 },
    { name: "SF_LOAD", bus: "SF_BAY", voltage: 345, kw: 1400, kvar: 280 },
    { name: "SEA_LOAD", bus: "SEA_EMERALD", voltage: 230, kw: 500, kvar: 100 },
  ],
  lines: [
    {
      name: "NYC_PHL",
      bus1: "NYC_MAIN",
      bus2: "PHL_CENTRAL",
      r1: 0.02,
      x1: 0.1,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "PHL_DC",
      bus1: "PHL_CENTRAL",
      bus2: "DC_POWER",
      r1: 0.03,
      x1: 0.15,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "NYC_PIT",
      bus1: "NYC_MAIN",
      bus2: "PIT_STEEL",
      r1: 0.04,
      x1: 0.2,
      normalRating: 800,
      emergencyRating: 960,
    },
    {
      name: "PIT_CLE",
      bus1: "PIT_STEEL",
      bus2: "CLE_LAKE",
      r1: 0.02,
      x1: 0.12,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "CLE_DET",
      bus1: "CLE_LAKE",
      bus2: "DET_MOTOR",
      r1: 0.03,
      x1: 0.18,
      normalRating: 800,
      emergencyRating: 960,
    },
    {
      name: "DET_CHI",
      bus1: "DET_MOTOR",
      bus2: "CHI_WINDY",
      r1: 0.05,
      x1: 0.25,
      normalRating: 1500,
      emergencyRating: 1800,
    },
    {
      name: "CHI_STL",
      bus1: "CHI_WINDY",
      bus2: "STL_GATEWAY",
      r1: 0.03,
      x1: 0.15,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "CHI_MINN",
      bus1: "CHI_WINDY",
      bus2: "MINN_TWIN",
      r1: 0.04,
      x1: 0.2,
      normalRating: 800,
      emergencyRating: 960,
    },
    {
      name: "STL_DAL",
      bus1: "STL_GATEWAY",
      bus2: "DAL_BIG",
      r1: 0.06,
      x1: 0.3,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "DAL_HOU",
      bus1: "DAL_BIG",
      bus2: "HOU_SPACE",
      r1: 0.04,
      x1: 0.2,
      normalRating: 1500,
      emergencyRating: 1800,
    },
    {
      name: "DAL_DEN",
      bus1: "DAL_BIG",
      bus2: "DEN_ROCKY",
      r1: 0.08,
      x1: 0.4,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "DEN_PHX",
      bus1: "DEN_ROCKY",
      bus2: "PHX_VALLEY",
      r1: 0.05,
      x1: 0.25,
      normalRating: 800,
      emergencyRating: 960,
    },
    {
      name: "PHX_LA",
      bus1: "PHX_VALLEY",
      bus2: "LA_ANGEL",
      r1: 0.06,
      x1: 0.3,
      normalRating: 1500,
      emergencyRating: 1800,
    },
    {
      name: "LA_SF",
      bus1: "LA_ANGEL",
      bus2: "SF_BAY",
      r1: 0.04,
      x1: 0.2,
      normalRating: 1000,
      emergencyRating: 1200,
    },
    {
      name: "SF_SEA",
      bus1: "SF_BAY",
      bus2: "SEA_EMERALD",
      r1: 0.05,
      x1: 0.25,
      normalRating: 800,
      emergencyRating: 960,
    },
    {
      name: "DEN_SF",
      bus1: "DEN_ROCKY",
      bus2: "SF_BAY",
      r1: 0.1,
      x1: 0.5,
      normalRating: 1500,
      emergencyRating: 1800,
    },
    {
      name: "CHI_DEN",
      bus1: "CHI_WINDY",
      bus2: "DEN_ROCKY",
      r1: 0.07,
      x1: 0.35,
      normalRating: 1000,
      emergencyRating: 1200,
    },
  ],
  transformers: [
    {
      name: "NYC_DC",
      bus1: "NYC_MAIN",
      bus2: "DC_POWER",
      kv1: 345,
      kv2: 500,
      kva: 2000,
    },
    {
      name: "DC_CHI",
      bus1: "DC_POWER",
      bus2: "CHI_WINDY",
      kv1: 500,
      kv2: 500,
      kva: 2500,
    },
    {
      name: "CHI_HOU",
      bus1: "CHI_WINDY",
      bus2: "HOU_SPACE",
      kv1: 500,
      kv2: 500,
      kva: 3000,
    },
    {
      name: "HOU_LA",
      bus1: "HOU_SPACE",
      bus2: "LA_ANGEL",
      kv1: 500,
      kv2: 500,
      kva: 2500,
    },
  ],
};
