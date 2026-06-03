# ╔══════════════════════════════════════════════════════╗
# ║                  CONFIGURAÇÃO ADL                    ║
# ║     Esse é o ÚNICO arquivo que você precisa editar   ║
# ╚══════════════════════════════════════════════════════╝

# ─────────────────────────────────────────────
# REDE
# ─────────────────────────────────────────────

ROBOT_IP = "10.91.63.2"
WS_PORT   = 5901

# Intervalo entre leituras do NT (segundos)
POLL_INTERVAL = 0.1

# Tempo do "pulse" para botões (press/release)
PULSE_TIME = 0.2


# ─────────────────────────────────────────────
# TABELAS E KEYS DO NETWORKTABLES
#
# Formato:
#   "NomeTabela": ["key1", "key2", ...]
#
# Adicione, remova ou renomeie livremente.
# O restante do sistema lê daqui automaticamente.
# ─────────────────────────────────────────────

TABLES_AND_KEYS = {

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

    "Game": [
        "Endgame",
    ],

    "Drive": [
        "Moving",
    ],

    "Robot": [
        "BatteryVoltage",
        "SpeedLimited",
    ],

    "Shooter": [
        "CurrentRPM",
        "TargetRPM",
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


# ─────────────────────────────────────────────
# TIPOS PADRÃO POR KEY
#
# Para keys especiais que precisam de um tipo
# de entrada específico no NT na primeira vez.
#
# Tipos possíveis: "bool", "number", "string", "number_array"
# Se a key não estiver aqui → assume "number"
# ─────────────────────────────────────────────

KEY_DEFAULT_TYPES = {
    # arrays (ex: bounding boxes do limelight)
    "bbox": "number_array",
    "hw":   "number_array",

    # booleanos
    "has_target": "bool",

    # strings
    "state":       "string",
    "decision":    "string",
    "intent":      "string",
    "stressLevel": "string",
}
