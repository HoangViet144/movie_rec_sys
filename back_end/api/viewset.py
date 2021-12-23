from rest_framework import viewsets, mixins

class CreateViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    pass
class GetPostViewSet(mixins.ListModelMixin,mixins.CreateModelMixin , viewsets.GenericViewSet):
    pass