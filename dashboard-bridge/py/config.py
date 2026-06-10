import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_CONFIG = os.path.join(ROOT, "..", "dashboard-web", "config.json")

_data = {}
try:
    with open(FRONTEND_CONFIG, "r", encoding="utf-8") as f:
        _data = json.load(f)
except Exception:
    _data = {}

ROBOT_IP = _data.get("ROBOT_IP", "10.91.63.2")
WS_PORT = _data.get("WS_PORT", 5901)
NT_TIMEOUT = _data.get("NT_TIMEOUT", 2)
POLL_INTERVAL = _data.get("POLL_INTERVAL", 0.1)
PULSE_TIME = _data.get("PULSE_TIME", 0.2)
TABLES = _data.get("TABLES", {})
DEFAULT_VALUES = _data.get("DEFAULT_VALUES", {})

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
