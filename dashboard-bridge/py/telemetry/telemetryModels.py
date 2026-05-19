class Topic:

    def __init__(
        self,
        id,
        table,
        key,
        type,
        default
    ):

        self.id = id

        self.table = table
        self.key = key

        self.type = type
        self.default = default