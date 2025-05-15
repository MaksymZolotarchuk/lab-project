from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cinema.views import FilmViewSet, HallViewSet, ScheduleViewSet, UserViewSet, LoginView, CurrentUserView

router = DefaultRouter()
router.register(r'films', FilmViewSet)
router.register(r'halls', HallViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
]
