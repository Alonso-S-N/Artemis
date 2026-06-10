"use strict";
export const CONFIG = {};
export const TOPICS = {
  STRESS: {
    BATTERY_VOLTAGE: "/RobotStress/batteryVoltage",
    TOTAL_CURRENT: "/RobotStress/totalCurrent",
    DRIVETRAIN_CURRENT: "/RobotStress/drivetrainCurrent",
    SCORE: "/RobotStress/stressScore",
    LEVEL: "/RobotStress/stressLevel",
    SPEED_SCALE: "/RobotStress/speedScale",
    CHASSIS_SPEED: "/RobotStress/chassisSpeed"
  },
  ADL: {
    STATE: "/ADL/state",
    DECISION: "/ADL/decision",
    INTENT: "/ADL/intent"
  }
};