from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView,TicketViewSet

router = DefaultRouter()
router.register("tickets", TicketViewSet, basename="ticket")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", TokenObtainPairView.as_view(), name="jwt_login"),  
    path("auth/refresh/", TokenRefreshView.as_view(), name="jwt_refresh"),
     path("auth/me/", MeView.as_view(), name="me"),

     
     path("", include(router.urls)),
]
