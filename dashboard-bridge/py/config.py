ROBOT_IP  = "10.91.63.2"
WS_PORT   = 5901
NT_TIMEOUT = 2          
POLL_INTERVAL = 0.1     


PULSE_TIME = 0.2       


TABLES = {
    "RobotStress": [
        "batteryVoltage",
        "totalCurrent",
        "drivetrainCurrent",
        "stressScore",
        "stressLevel",
        "speedScale",
        "chassisSpeed",
    ],
    "ADL": [
        "state",
        "decision",
        "intent",
    ],
    "Vision": [
        "HasTarget",
        "Aligned",
        "Confidence",
    ],
    "Mechanisms": [
        "ShooterReady",
        "HasGamePiece",
        "IntakeActive",
        "ClimbAvailable",
    ],
    "Shooter": [
        "CurrentRPM",
        "TargetRPM",
    ],
    "Drive": [
        "Moving",
    ],
    "Robot": [
        "BatteryVoltage",
        "SpeedLimited",
    ],
    "Game": [
        "Endgame",
    ],
    "StreamDeck/IntakeAngle": [
        "toggleCount",
        "calibrateZero",
        "calibrateTarget",
    ],
    "StreamDeck/IntakeRoller": [
        "intakeToggle",
        "outtakeToggle",
    ],
    "limelight-back": [
        "piece_tx",
        "ta",
        "piece_distance",
        "has_target",
        "bbox",
        "hw",
    ],
    "limelight-front": [
        "tx",
        "tv",
        "ta",
        "hw",
    ],
    "limelight-lime2plus": [
        "hw",
    ],
    "Modes": [
        "AimLockLime4",
        "AimLockLime2",
        "AlignLime2",
        "AimLockLime2Plus",
        "ShooterLime2Plus",
        "AlignPiece",
    ],
}

DEFAULT_VALUES: dict = {
  
    "bbox":  [0.0, 0.0, 0.0, 0.0],
    "hw":    [0.0, 0.0, 0.0, 0.0],
 
    "has_target":  False,

    "state":    "",
    "decision": "",
    "intent":   "",
    "stressLevel": "",
}
