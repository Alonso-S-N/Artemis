from telemetry.telemetryModels import Topic

BATTERY_VOLTAGE = Topic(
    id="robot.battery.voltage",
    table="Robot",
    key="BatteryVoltage",
    type=float,
    default=0.0
)

ROBOT_STATE = Topic(
    id="adl.state",
    table="ADL",
    key="state",
    type=str,
    default="IDLE"
)

ROBOT_DECISION = Topic(
    id="adl.decision",
    table="ADL",
    key="decision",
    type=str,
    default=""
)

HAS_TARGET = Topic(
    id="vision.hasTarget",
    table="Vision",
    key="HasTarget",
    type=bool,
    default=False
)

ALIGNED = Topic(
    id="vision.aligned",
    table="Vision",
    key="Aligned",
    type=bool,
    default=False
)

SHOOTER_READY = Topic(
    id="mechanisms.shooterReady",
    table="Mechanisms",
    key="ShooterReady",
    type=bool,
    default=False
)

HAS_GAME_PIECE = Topic(
    id="mechanisms.hasGamePiece",
    table="Mechanisms",
    key="HasGamePiece",
    type=bool,
    default=False
)