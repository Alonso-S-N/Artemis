export const TOPICS = {

  ADL: {
    STATE: "/ADL/State",
    DECISION: "/ADL/Decision",
    INTENT: "/ADL/Intent",
  },

  VISION: {
    HAS_TARGET: "/Vision/HasTarget",
    ALIGNED: "/Vision/Aligned",
    CONFIDENCE: "/Vision/Confidence",
  },

  ROBOT: {
    BATTERY_VOLTAGE: "/Robot/BatteryVoltage",
    SPEED_LIMITED: "/Robot/SpeedLimited",
  },

  DRIVE: {
    MOVING: "/Drive/Moving",
    CHASSIS_SPEED: "/Drive/ChassisSpeed",
  },

  GAME: {
    ENDGAME: "/Game/Endgame",
  },

  MECHANISMS: {
    HAS_GAME_PIECE: "/Mechanisms/HasGamePiece",
    SHOOTER_READY: "/Mechanisms/ShooterReady",
    SHOOTER_RPM_CURRENT:
      "/Mechanisms/ShooterRPMCurrent",
    SHOOTER_RPM_TARGET:
      "/Mechanisms/ShooterRPMTarget",
  },

  STRESS: {

    BATTERY_VOLTAGE:
      "/Stress/BatteryVoltage",

    TOTAL_CURRENT:
      "/Stress/TotalCurrent",

    DRIVETRAIN_CURRENT:
      "/Stress/DrivetrainCurrent",

    SCORE:
      "/Stress/Score",

    LEVEL:
      "/Stress/Level",

    SPEED_SCALE:
      "/Stress/SpeedScale",

    CHASSIS_SPEED:
      "/Stress/ChassisSpeed",
  },

  LIMELIGHT_BACK: {
    TX: "/LimelightBack/PieceTX",
    BBOX: "/LimelightBack/BBox",
    HAS_TARGET:
      "/LimelightBack/HasTarget",
  },

  MODES: {
    ALIGN_LIME2:
      "/Modes/AlignLime2",
  }
};