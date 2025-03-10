from rest_framework.parsers import BaseParser
from collections import defaultdict
from django.http import QueryDict
import json
from icecream import ic

from rest_framework.parsers import JSONParser
from urllib.parse import parse_qs

class FlattenedNestedParser(JSONParser):
    """Custom parser to convert bracket notation into nested dicts"""
    media_type = 'multipart/form-data'

    def parse(self, stream, media_type=None, parser_context=None):

        parsed_data = super().parse(stream, media_type, parser_context)
        ic(parsed_data)
        nested_data = defaultdict(dict)
        ic("Nested data",nested_data)
        for key, value in parsed_data.items():
            if "[" in key and "]" in key:
                keys = key.replace("]", "").split("[")
                temp = nested_data
                for k in keys[:-1]:
                    temp = temp.setdefault(k, {})
                temp[keys[-1]] = value[0] if isinstance(value, list) else value
            else:
                nested_data[key] = value[0] if isinstance(value, list) else value
        
        return nested_data