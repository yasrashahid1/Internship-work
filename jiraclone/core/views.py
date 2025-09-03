from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
from .serializers import RegisterSerializer, UserSerializer
from .models import Ticket
from .serializers import TicketSerializer



class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        user = ser.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)



class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)



class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
       
        queryset = Ticket.objects.all().order_by("-created_at")

       
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )

        return queryset


    @action(detail=False, methods=["post"], url_path="bulk_upload")
    def bulk_upload(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if file.name.endswith(".csv"):
                df = pd.read_csv(file)
            elif file.name.endswith(".xlsx"):
                df = pd.read_excel(file)
            else:
                return Response({"error": "Unsupported file format (use .csv or .xlsx)"}, 
                                status=status.HTTP_400_BAD_REQUEST) 
                                

            tickets = []
            for _, row in df.iterrows():
                ticket = Ticket.objects.create(
                    title=row.get("title", ""),
                    description=row.get("description", ""),
                    status=row.get("status", "todo"),
                    priority=row.get("priority", "medium"),
                    reporter=request.user, 
                )
                tickets.append(ticket)

            return Response({"created": len(tickets)}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


