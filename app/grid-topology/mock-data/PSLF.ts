export const mockPSLFData = `C PSLF Transmission System Data
C Bus Data
C Bus# Type Area Zone Name BaseKV Angle
C    1    2    1    1 NYC_MAIN    345.0   0.0
C    2    2    1    1 PHL_CENTRAL 345.0   0.0
C    3    2    1    1 DC_POWER     500.0   0.0
C    4    2    1    1 PIT_STEEL    230.0   0.0
C    5    2    1    1 CLE_LAKE     345.0   0.0
C    6    2    1    1 DET_MOTOR    230.0   0.0
C    7    2    1    1 CHI_WINDY    500.0   0.0
C    8    2    1    1 STL_GATEWAY  345.0   0.0
C    9    2    1    1 MINN_TWIN    230.0   0.0
C   10    2    1    1 DAL_BIG      345.0   0.0
C   11    2    1    1 HOU_SPACE    500.0   0.0
C   12    2    1    1 DEN_ROCKY    345.0   0.0
C   13    2    1    1 PHX_VALLEY   230.0   0.0
C   14    2    1    1 LA_ANGEL     500.0   0.0
C   15    2    1    1 SF_BAY       345.0   0.0
C   16    2    1    1 SEA_EMERALD  230.0   0.0

C Generator Data
C Bus# Type PG QG QT QM VS RemoteBus Name
C    1    1  2000.0  500.0  1000.0  1000.0  1.05  0 NYC_GEN
C    3    1  3000.0  750.0  1500.0  1500.0  1.05  0 DC_GEN
C    7    1  2500.0  625.0  1250.0  1250.0  1.05  0 CHI_GEN
C   11    1  3000.0  750.0  1500.0  1500.0  1.05  0 HOU_GEN
C   14    1  2500.0  625.0  1250.0  1250.0  1.05  0 LA_GEN

C Load Data
C Bus# Type PL QL IP IQ YP YQ
C    2    1  1500.0  300.0  0.0  0.0  0.0  0.0
C    4    1  800.0   160.0  0.0  0.0  0.0  0.0
C    5    1  1200.0  240.0  0.0  0.0  0.0  0.0
C    6    1  900.0   180.0  0.0  0.0  0.0  0.0
C    8    1  1100.0  220.0  0.0  0.0  0.0  0.0
C    9    1  700.0   140.0  0.0  0.0  0.0  0.0
C   10    1  1300.0  260.0  0.0  0.0  0.0  0.0
C   12    1  1000.0  200.0  0.0  0.0  0.0  0.0
C   13    1  600.0   120.0  0.0  0.0  0.0  0.0
C   15    1  1400.0  280.0  0.0  0.0  0.0  0.0
C   16    1  500.0   100.0  0.0  0.0  0.0  0.0

C Transmission Line Data
C FromBus ToBus Circuit R X B RateA RateB RateC Status
C    1      2      1     0.02  0.10  0.0  1000.0  1200.0  1400.0  1
C    2      3      1     0.03  0.15  0.0  1000.0  1200.0  1400.0  1
C    1      4      1     0.04  0.20  0.0   800.0   960.0  1120.0  1
C    4      5      1     0.02  0.12  0.0  1000.0  1200.0  1400.0  1
C    5      6      1     0.03  0.18  0.0   800.0   960.0  1120.0  1
C    6      7      1     0.05  0.25  0.0  1500.0  1800.0  2100.0  1
C    7      8      1     0.03  0.15  0.0  1000.0  1200.0  1400.0  1
C    7      9      1     0.04  0.20  0.0   800.0   960.0  1120.0  1
C    8     10      1     0.06  0.30  0.0  1000.0  1200.0  1400.0  1
C   10     11      1     0.04  0.20  0.0  1500.0  1800.0  2100.0  1
C   10     12      1     0.08  0.40  0.0  1000.0  1200.0  1400.0  1
C   12     13      1     0.05  0.25  0.0   800.0   960.0  1120.0  1
C   13     14      1     0.06  0.30  0.0  1500.0  1800.0  2100.0  1
C   14     15      1     0.04  0.20  0.0  1000.0  1200.0  1400.0  1
C   15     16      1     0.05  0.25  0.0   800.0   960.0  1120.0  1
C   12     15      1     0.10  0.50  0.0  1500.0  1800.0  2100.0  1
C    7     12      1     0.07  0.35  0.0  1000.0  1200.0  1400.0  1

C Transformer Data
C FromBus ToBus Circuit R X Tap Status
C    1      3      1     0.01  0.05  1.0  1
C    3      7      1     0.02  0.10  1.0  1
C    7     11      1     0.02  0.10  1.0  1
C   11     14      1     0.01  0.05  1.0  1

C Area Data
C Area SlackBus
C    1      1

C Zone Data
C Zone Name
C    1 EAST_COAST
C    2 MIDWEST
C    3 WEST_COAST

C End of PSLF Data`;

export const mockPSLFDataFormatted = {
  buses: [
    { id: 1, name: "NYC_MAIN", voltage: 345, type: "PV", area: 1, zone: 1 },
    { id: 2, name: "PHL_CENTRAL", voltage: 345, type: "PQ", area: 1, zone: 1 },
    { id: 3, name: "DC_POWER", voltage: 500, type: "PV", area: 1, zone: 1 },
    { id: 4, name: "PIT_STEEL", voltage: 230, type: "PQ", area: 1, zone: 1 },
    { id: 5, name: "CLE_LAKE", voltage: 345, type: "PQ", area: 1, zone: 1 },
    { id: 6, name: "DET_MOTOR", voltage: 230, type: "PQ", area: 1, zone: 1 },
    { id: 7, name: "CHI_WINDY", voltage: 500, type: "PV", area: 1, zone: 1 },
    { id: 8, name: "STL_GATEWAY", voltage: 345, type: "PQ", area: 1, zone: 1 },
    { id: 9, name: "MINN_TWIN", voltage: 230, type: "PQ", area: 1, zone: 1 },
    { id: 10, name: "DAL_BIG", voltage: 345, type: "PQ", area: 1, zone: 1 },
    { id: 11, name: "HOU_SPACE", voltage: 500, type: "PV", area: 1, zone: 1 },
    { id: 12, name: "DEN_ROCKY", voltage: 345, type: "PQ", area: 1, zone: 1 },
    { id: 13, name: "PHX_VALLEY", voltage: 230, type: "PQ", area: 1, zone: 1 },
    { id: 14, name: "LA_ANGEL", voltage: 500, type: "PV", area: 1, zone: 1 },
    { id: 15, name: "SF_BAY", voltage: 345, type: "PQ", area: 1, zone: 1 },
    { id: 16, name: "SEA_EMERALD", voltage: 230, type: "PQ", area: 1, zone: 1 },
  ],
  generators: [
    { bus: 1, name: "NYC_GEN", pg: 2000, qg: 500, voltage: 1.05 },
    { bus: 3, name: "DC_GEN", pg: 3000, qg: 750, voltage: 1.05 },
    { bus: 7, name: "CHI_GEN", pg: 2500, qg: 625, voltage: 1.05 },
    { bus: 11, name: "HOU_GEN", pg: 3000, qg: 750, voltage: 1.05 },
    { bus: 14, name: "LA_GEN", pg: 2500, qg: 625, voltage: 1.05 },
  ],
  loads: [
    { bus: 2, name: "PHL_LOAD", pl: 1500, ql: 300 },
    { bus: 4, name: "PIT_LOAD", pl: 800, ql: 160 },
    { bus: 5, name: "CLE_LOAD", pl: 1200, ql: 240 },
    { bus: 6, name: "DET_LOAD", pl: 900, ql: 180 },
    { bus: 8, name: "STL_LOAD", pl: 1100, ql: 220 },
    { bus: 9, name: "MINN_LOAD", pl: 700, ql: 140 },
    { bus: 10, name: "DAL_LOAD", pl: 1300, ql: 260 },
    { bus: 12, name: "DEN_LOAD", pl: 1000, ql: 200 },
    { bus: 13, name: "PHX_LOAD", pl: 600, ql: 120 },
    { bus: 15, name: "SF_LOAD", pl: 1400, ql: 280 },
    { bus: 16, name: "SEA_LOAD", pl: 500, ql: 100 },
  ],
  lines: [
    {
      from: 1,
      to: 2,
      circuit: 1,
      r: 0.02,
      x: 0.1,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 2,
      to: 3,
      circuit: 1,
      r: 0.03,
      x: 0.15,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 1,
      to: 4,
      circuit: 1,
      r: 0.04,
      x: 0.2,
      rateA: 800,
      rateB: 960,
      rateC: 1120,
    },
    {
      from: 4,
      to: 5,
      circuit: 1,
      r: 0.02,
      x: 0.12,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 5,
      to: 6,
      circuit: 1,
      r: 0.03,
      x: 0.18,
      rateA: 800,
      rateB: 960,
      rateC: 1120,
    },
    {
      from: 6,
      to: 7,
      circuit: 1,
      r: 0.05,
      x: 0.25,
      rateA: 1500,
      rateB: 1800,
      rateC: 2100,
    },
    {
      from: 7,
      to: 8,
      circuit: 1,
      r: 0.03,
      x: 0.15,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 7,
      to: 9,
      circuit: 1,
      r: 0.04,
      x: 0.2,
      rateA: 800,
      rateB: 960,
      rateC: 1120,
    },
    {
      from: 8,
      to: 10,
      circuit: 1,
      r: 0.06,
      x: 0.3,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 10,
      to: 11,
      circuit: 1,
      r: 0.04,
      x: 0.2,
      rateA: 1500,
      rateB: 1800,
      rateC: 2100,
    },
    {
      from: 10,
      to: 12,
      circuit: 1,
      r: 0.08,
      x: 0.4,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 12,
      to: 13,
      circuit: 1,
      r: 0.05,
      x: 0.25,
      rateA: 800,
      rateB: 960,
      rateC: 1120,
    },
    {
      from: 13,
      to: 14,
      circuit: 1,
      r: 0.06,
      x: 0.3,
      rateA: 1500,
      rateB: 1800,
      rateC: 2100,
    },
    {
      from: 14,
      to: 15,
      circuit: 1,
      r: 0.04,
      x: 0.2,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
    {
      from: 15,
      to: 16,
      circuit: 1,
      r: 0.05,
      x: 0.25,
      rateA: 800,
      rateB: 960,
      rateC: 1120,
    },
    {
      from: 12,
      to: 15,
      circuit: 1,
      r: 0.1,
      x: 0.5,
      rateA: 1500,
      rateB: 1800,
      rateC: 2100,
    },
    {
      from: 7,
      to: 12,
      circuit: 1,
      r: 0.07,
      x: 0.35,
      rateA: 1000,
      rateB: 1200,
      rateC: 1400,
    },
  ],
  transformers: [
    { from: 1, to: 3, circuit: 1, r: 0.01, x: 0.05, tap: 1.0 },
    { from: 3, to: 7, circuit: 1, r: 0.02, x: 0.1, tap: 1.0 },
    { from: 7, to: 11, circuit: 1, r: 0.02, x: 0.1, tap: 1.0 },
    { from: 11, to: 14, circuit: 1, r: 0.01, x: 0.05, tap: 1.0 },
  ],
};
