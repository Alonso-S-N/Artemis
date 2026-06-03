"use strict";

export const TOPICS = {

  ADL: {
    STATE:    "/ADL/state",
    DECISION: "/ADL/decision",
    INTENT:   "/ADL/intent",
  },

  VISION: {
    HAS_TARGET:  "/Vision/HasTarget",
    ALIGNED:     "/Vision/Aligned",
    CONFIDENCE:  "/Vision/Confidence",
  },

  MECHANISMS: {
    SHOOTER_READY:   "/Mechanisms/ShooterReady",
    HAS_GAME_PIECE:  "/Mechanisms/HasGamePiece",
    INTAKE_ACTIVE:   "/Mechanisms/IntakeActive",
    CLIMB_AVAILABLE: "/Mechanisms/ClimbAvailable",
  },

  SHOOTER: {
    RPM_CURRENT: "/Shooter/CurrentRPM",
    RPM_TARGET:  "/Shooter/TargetRPM",
  },

  DRIVE: {
    MOVING: "/Drive/Moving",
  },

  ROBOT: {
    BATTERY:       "/Robot/BatteryVoltage",
    SPEED_LIMITED: "/Robot/SpeedLimited",
  },

  GAME: {
    ENDGAME: "/Game/Endgame",
  },

  STRESS: {
    BATTERY_VOLTAGE:    "/RobotStress/batteryVoltage",
    TOTAL_CURRENT:      "/RobotStress/totalCurrent",
    DRIVETRAIN_CURRENT: "/RobotStress/drivetrainCurrent",
    SCORE:              "/RobotStress/stressScore",
    LEVEL:              "/RobotStress/stressLevel",
    SPEED_SCALE:        "/RobotStress/speedScale",
    CHASSIS_SPEED:      "/RobotStress/chassisSpeed",
  },

  LIMELIGHT_BACK: {
    TX:         "/limelight-back/piece_tx",
    TA:         "/limelight-back/ta",
    DISTANCE:   "/limelight-back/piece_distance",
    HAS_TARGET: "/limelight-back/has_target",
    BBOX:       "/limelight-back/bbox",
    HW:         "/limelight-back/hw",
  },

  LIMELIGHT_FRONT: {
    TX: "/limelight-front/tx",
    TV: "/limelight-front/tv",
    TA: "/limelight-front/ta",
    HW: "/limelight-front/hw",
  },

  LIMELIGHT_LIME2PLUS: {
    HW: "/limelight-lime2plus/hw",
  },

  MODES: {
    AIMLOCK_LIME4:  "/Modes/AimLockLime4",
    AIMLOCK_LIME2:  "/Modes/AimLockLime2",
    ALIGN_LIME2:    "/Modes/AlignLime2",
    AIMLOCK_LIME2P: "/Modes/AimLockLime2Plus",
    SHOOTER_LIME2P: "/Modes/ShooterLime2Plus",
    ALIGN_PIECE:    "/Modes/AlignPiece",
  },

  STREAMDECK: {
    INTAKE_ANGLE_TOGGLE:   "/StreamDeck/IntakeAngle/toggleCount",
    INTAKE_ANGLE_ZERO:     "/StreamDeck/IntakeAngle/calibrateZero",
    INTAKE_ANGLE_TARGET:   "/StreamDeck/IntakeAngle/calibrateTarget",
    INTAKE_ROLLER_ON:      "/StreamDeck/IntakeRoller/intakeToggle",
    INTAKE_ROLLER_OFF:     "/StreamDeck/IntakeRoller/outtakeToggle",
  },

};