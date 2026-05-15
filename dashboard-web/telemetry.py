from telemetry.models import Topic

BATTERY_VOLTAGE = Topic(
    id="robot.battery.voltage",
    type=float,
    default=0.0
)

ROBOT_STATE = Topic(
    id="adl.state",
    type=str,
    default="IDLE"
)

ROBOT_DECISION = Topic(
    id="adl.decision",
    type=str,
    default=""
)

HAS_TARGET = Topic(
    id="vision.hasTarget",
    type=bool,
    default=False
)

ALIGNED = Topic(
    id="vision.aligned",
    type=bool,
    default=False
)

SHOOTER_READY = Topic(
    id="mechanisms.shooterReady",
    type=bool,
    default=False
)

HAS_GAME_PIECE = Topic(
    id="mechanisms.hasGamePiece",
    type=bool,
    default=False
)