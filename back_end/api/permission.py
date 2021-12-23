from rest_framework import permissions

class MoviePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action not in ['list', 'retrieve']:
            return request.user.is_authenticated and request.user.is_superuser
        else:
            return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if view.action not in ['list', 'retrieve']:
            return request.user.is_authenticated and request.user.is_superuser
        else:
            return request.user.is_authenticated
