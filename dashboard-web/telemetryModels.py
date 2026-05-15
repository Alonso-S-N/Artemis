from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class Topic:
    id: str
    type: type
    default: Any