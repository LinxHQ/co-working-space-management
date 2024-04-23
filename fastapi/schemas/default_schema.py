# File path: my_api/schemas/default_schema.py
from pydantic.generics import GenericModel
from typing import List, TypeVar, Generic


T = TypeVar('T')

class PaginatedResponse(GenericModel, Generic[T]):
    total_records: int
    total_pages: int
    records: List[T]
