from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(_):
    return JsonResponse({"status":"ok","endpoints":{
        "register":"/api/auth/register/",
        "login":"/api/auth/login/",
        "refresh":"/api/auth/refresh/",
    }})

urlpatterns = [
    path("", home),     
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
]
