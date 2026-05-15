package frc.robot.shared;

public final class RobotTopics {

    public static final class ADL {
        public static final String STATE    = "/ADL/state";
        public static final String DECISION = "/ADL/decision";
        public static final String INTENT   = "/ADL/intent";
    }

    public static final class Vision {
        public static final String HAS_TARGET = "/Vision/HasTarget";
        public static final String ALIGNED    = "/Vision/Aligned";
        public static final String CONFIDENCE = "/Vision/Confidence";
    }

    public static final class Robot {
        public static final String BATTERY       = "/Robot/BatteryVoltage";
        public static final String SPEED_LIMITED = "/Robot/SpeedLimited";
        public static final String STRESS_SCORE  = "/Robot/stressScore";
        public static final String STRESS_LEVEL  = "/Robot/stressLevel";
    }

    public static final class Modes {
        public static final String ALIGN_LIME2 = "/Modes/AlignLime2";
    }
}