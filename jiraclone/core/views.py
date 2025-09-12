from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import pandas as pd
from .serializers import RegisterSerializer, UserSerializer
from .models import Ticket, Comment, Tag
from .models import User
from .serializers import TicketSerializer, CommentSerializer, TagSerializer
import logging


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
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
       
        queryset = Ticket.objects.all().order_by("-created_at")

       
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )

        return queryset

    @action(detail=True, methods=["post"], url_path="assign")
    def assign_ticket(self, request, pk=None):
        ticket = self.get_object()
        user_id = request.data.get("assignee_id")
        if not user_id:
            return Response({"error": "assignee_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from .models import User
            user = User.objects.get(id=user_id)
            ticket.assignee = user
            ticket.save()
            return Response(TicketSerializer(ticket, context={"request": request}).data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=["post"], url_path="comment")
    def add_comment(self, request, pk=None):
        ticket = self.get_object()
        text = request.data.get("text", "").strip()
        if not text:
            return Response({"error": "Comment text is required"}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(ticket=ticket, user=request.user, text=text)
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


class BulkUploadTicketsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
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
                                status=status.HTTP_400_BAD_REQUEST,
                                ) 

                        
            df = df.dropna(how="all")                  
            df.columns = df.columns.str.strip()        

            tickets = []
            for _, row in df.iterrows():
                title = str(row.get("title", "")).strip()
                if not title:   
                    continue
                tickets.append(
                    Ticket(
                        title=title,
                        description=str(row.get("description", "")).strip(),
                        status=row.get("status", "todo"),
                        priority=row.get("priority", "medium"),
                        reporter=request.user,
                    )
                )        
            Ticket.objects.bulk_create(tickets)

            logger.info(f"📂 Bulk upload successful: {len(tickets)} tickets created")
            for t in tickets:
                logger.info(f"   • {t.title} | {t.status} | {t.priority}")
            
            serializer = TicketSerializer(tickets, many=True, context={"request": request})
            return Response ({"created": len(tickets), "tickets": serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by("username")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]



class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by("name")
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    


