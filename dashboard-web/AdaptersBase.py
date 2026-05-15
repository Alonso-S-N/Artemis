from abc import ABC, abstractmethod

class TelemetryAdapter(ABC):

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def read(self, topic):
        pass

    @abstractmethod
    def write(self, topic, value):
        pass