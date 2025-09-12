from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView,TicketViewSet,BulkUploadTicketsView, UserViewSet, TagViewSet

router = DefaultRouter()
router.register("tickets", TicketViewSet, basename="ticket")
router.register("users", UserViewSet, basename="user")
router.register("tags", TagViewSet, basename="tag")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", TokenObtainPairView.as_view(), name="jwt_login"),  
    path("auth/refresh/", TokenRefreshView.as_view(), name="jwt_refresh"),
    path("auth/me/", MeView.as_view(), name="me"),   
    path("tickets/bulk-upload/", BulkUploadTicketsView.as_view(), name="bulk_upload"),
    path("", include(router.urls)),
]
