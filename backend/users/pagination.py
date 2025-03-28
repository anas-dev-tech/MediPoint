from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Default page size
    page_size_query_param = 'page_size'  # Allows dynamic page size
    max_page_size = 100  # Optional: Prevents excessively large pages
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current': int(self.page.previous_page_number() + 1) if self.page.has_previous() else 1,
            'page_size': self.get_page_size(self.request),
            'previous': self.page.previous_page_number() if self.page.has_previous() else -1,
            'next': self.page.next_page_number() if self.page.has_next() else -1,
            'results': data
        })
